"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other", "PreferNotToSay"]).optional(),
  roleId: z.number().int().positive().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Helper function to create JWT token
function createToken(userId, email, roleId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return jwt.sign({ userId, email, roleId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// Helper function to set auth cookie
async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

// Get default patient role ID
async function getDefaultPatientRoleId() {
  let role = await prisma.userRole.findUnique({
    where: { name: "patient" },
  });

  if (!role) {
    // Create default patient role if it doesn't exist
    role = await prisma.userRole.create({
      data: {
        name: "patient",
        description: "Default patient role",
      },
    });
  }

  return role.id;
}

// SIGNUP ACTION
export async function signup(formData) {
  try {
    // Extract and validate form data
    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone") || undefined,
      dateOfBirth: formData.get("dateOfBirth") || undefined,
      gender: formData.get("gender") || undefined,
      roleId: formData.get("roleId")
        ? parseInt(formData.get("roleId"))
        : undefined,
    };

    const validatedData = signupSchema.parse(rawData);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists with this email",
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Get default role if not provided
    const roleId = validatedData.roleId || (await getDefaultPatientRoleId());

    // Parse date of birth if provided
    const dateOfBirth = validatedData.dateOfBirth
      ? new Date(validatedData.dateOfBirth)
      : undefined;

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone || null,
        dateOfBirth,
        gender: validatedData.gender,
        roleId,
      },
      include: {
        role: true,
      },
    });

    // Create and set auth token
    const token = createToken(user.id, user.email, user.roleId);
    await setAuthCookie(token);

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }

    console.error("Signup error:", error);
    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

// LOGIN ACTION
export async function login(formData) {
  try {
    // Extract and validate form data
    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedData = loginSchema.parse(rawData);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        role: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        message: "Account has been deactivated. Please contact support.",
      };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Create and set auth token
    const token = createToken(user.id, user.email, user.roleId);
    await setAuthCookie(token);

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }

    console.error("Login error:", error);
    return {
      success: false,
      message: "Login failed. Please try again.",
    };
  }
}

// LOGOUT ACTION
export async function logout() {
  try {
    const cookieStore = await cookies();

    // Remove the auth cookie
    cookieStore.delete("auth-token");

    // Redirect to login page
    redirect("/login");
  } catch (error) {
    console.error("Logout error:", error);
    // Still redirect even if there's an error
    redirect("/login");
  }
}

// Helper function to get current user from token
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token || !process.env.JWT_SECRET) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        role: true,
      },
    });

    return user?.isActive ? user : null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

// Helper function to require authentication
export async function requireAuth() {
  console.log("here");
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

// Helper function to check if user has specific role
export async function checkUserRole(allowedRoles) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(user.role.name)) {
    throw new Error("Unauthorized: Insufficient permissions");
  }

  return user;
}
