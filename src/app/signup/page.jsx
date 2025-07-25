"use client";
import { Calendar, MapPin, Users, Mail, Lock, User, Phone } from "lucide-react";
import { useState } from "react";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    dateOfBirth: "",
    agreeToTerms: false,
    marketingEmails: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log("Signup data:", formData);
      alert("Account created successfully! Welcome to our platform.");
      // Redirect to dashboard or login page
      // window.location.href = "/dashboard";
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-green-50 min-h-screen py-20 px-4 overflow-hidden">
      {/* Background Image - Reduced size */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('/green.png')",
          backgroundSize: "50%",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Join Our
                <span className="text-emerald-500 block">
                  Wellness Community
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Create your account to book appointments with certified
                physiotherapists, track your recovery progress, and access
                personalized treatment plans tailored just for you.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-500" />
                <span className="text-gray-700 font-medium">
                  Easy Appointment Booking
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-700 font-medium">
                  Find Local Therapists
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-700" />
                <span className="text-gray-700 font-medium">
                  Personalized Care Plans
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                Why Join Us?
              </h3>
              <ul className="space-y-2 text-emerald-700">
                <li>• Access to certified physiotherapists nationwide</li>
                <li>• Secure booking and payment system</li>
                <li>• Track your treatment progress</li>
                <li>• Receive personalized exercise recommendations</li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border">
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Create Your Account
                  </h3>
                  <p className="text-gray-600">
                    Start your wellness journey today
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 p-3 border ${errors.firstName ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                        placeholder="Enter first name"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 p-3 border ${errors.lastName ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                        placeholder="Enter last name"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 p-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 p-3 border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 p-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                        placeholder="Create password"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-10 p-3 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                        placeholder="Confirm password"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full p-3 border ${errors.location ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                    >
                      <option value="">Choose your location</option>
                      <option value="Dublin">Dublin</option>
                      <option value="Cork">Cork</option>
                      <option value="Galway">Galway</option>
                      <option value="Limerick">Limerick</option>
                      <option value="Waterford">Waterford</option>
                      <option value="Kilkenny">Kilkenny</option>
                      <option value="Drogheda">Drogheda</option>
                      <option value="Dundalk">Dundalk</option>
                      <option value="Bray">Bray</option>
                      <option value="Navan">Navan</option>
                      <option value="Ennis">Ennis</option>
                      <option value="Tralee">Tralee</option>
                      <option value="Carlow">Carlow</option>
                      <option value="Naas">Naas</option>
                      <option value="Athlone">Athlone</option>
                    </select>
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`w-full p-3 border ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      max={
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 13),
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm text-gray-700"
                    >
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-emerald-600 hover:text-emerald-700 underline"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-emerald-600 hover:text-emerald-700 underline"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-sm">
                      {errors.agreeToTerms}
                    </p>
                  )}

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="marketingEmails"
                      name="marketingEmails"
                      checked={formData.marketingEmails}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="marketingEmails"
                      className="text-sm text-gray-700"
                    >
                      I would like to receive wellness tips and promotional
                      offers via email
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#7ce3b1] to-[#6dd4a2] hover:from-[#6dd4a2] hover:to-[#5eb893] text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Create Account
                </button>

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Sign in here
                  </a>
                </div>
              </form>
            </div>

            {/* Decorative elements matching the Hero component */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-200 rounded-full opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-100 rounded-full opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
