// ForgotPwd.jsx
"use client";
import React, { Fragment, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";


function ForgotPwd() {
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [forgotpwd, setForgotpwd] = useState({
    token: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const router = useRouter();

  useEffect(() => {
        const loadValidation = async () => {
    const $ = (await import("jquery")).default;
    await import("jquery-validation");

    if (!isVisible) {
      $("#forgotForm").validate({
        rules: {
          email: {
            required: true,
            email: true,
          },
        },
        messages: {
          email: {
            required: "Please enter your email.",
            email: "Please enter a valid email address.",
          },
        },
        errorElement: "div",
        errorClass: "text-white d-block",
        highlight: function (element) {
          $(element).addClass("is-invalid");
        },
        unhighlight: function (element) {
          $(element).removeClass("is-invalid");
        },
      });
    } else {
      $("#resetForm").validate({
        rules: {
          password: {
            required: true,
            minlength: 6,
          },
          password_confirmation: {
            required: true,
            equalTo: "#password",
          },
        },
        messages: {
          password: {
            required: "Please enter a password.",
            minlength: "Password must be at least 6 characters.",
          },
          password_confirmation: {
            required: "Please confirm your password.",
            equalTo: "Passwords do not match.",
          },
        },
        errorElement: "div",
        errorClass: "text-white d-block",
        highlight: function (element) {
          $(element).addClass("is-invalid");
        },
        unhighlight: function (element) {
          $(element).removeClass("is-invalid");
        },
      });
    }
}}, [isVisible]);

  useEffect(() => {
    if (token && email) {
      setIsVisible(true);
      setForgotpwd((prev) => ({
        ...prev,
        token,
        email,
      }));
    }
  }, [token, email]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/forget-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSuccess("Password reset link sent to your email.");
        setFormData({ email: "" });
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (forgotpwd.password !== forgotpwd.password_confirmation) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/reset-password`,
        {
          token: forgotpwd.token,
          email: forgotpwd.email,
          password: forgotpwd.password,
          password_confirmation: forgotpwd.password_confirmation,
        }
      );

      const data = result.data;
      if (data.success == true) {
        setSuccess(data.message || "Password reset successfully.");
        setError("");
        setForgotpwd({
          token: "",
          email: "",
          password: "",
          password_confirmation: "",
        });

        setTimeout(() => {
          router.push("/login"); // Replace with your actual login route
        }, 1500);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("❌ Failed to reset password.");
    }
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <Fragment>
      <div className="sign-in-bg">
        <video autoPlay muted loop className="sign-in-video-bg">
          <source src="/assets/images/video/two.mp4" type="video/mp4" />
        </video>
        <div className="sign-in-overlay"></div>
        <div className="app-wrapper d-block position-relative z-index-1">
          <div className="main-container">
            <div className="container">
              <div className="row sign-in-content-bg">
                <div className="col-lg-6 image-contentbox d-none d-lg-block">
                  <div className="form-container ">
                    <div className="signup-content mt-4">
                      <span>
                        <img
                          alt=""
                          className="img-fluid "
                          src="../assets/images/logo/1.png"
                        />
                      </span>
                    </div>
                    <div className="signup-bg-img p-5">
                      <img
                        alt=""
                        className="img-fluid"
                        src="/assets/images/New/forgotpwd.svg"
                        width={436}
                        height={536}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 form-contentbox">
                  <div className="form-container">
                    <div className="row">
                      <div className="col-12">
                        <div className="mb-5 text-center text-lg-start">
                          <h2 className="text-white f-w-600">
                            {isVisible ? "Reset Password" : "Send Reset Link"}
                          </h2>
                          <p>
                            {isVisible
                              ? "Create a new password and sign in to admin"
                              : "Enter your email to receive a password reset link"}
                          </p>
                        </div>
                      </div>
                      {!isVisible && (
                        <>
                          <form
                            id="forgotForm"
                            className="app-form rounded-control"
                          >
                            <div className="col-12">
                              <div className="mb-3">
                                <label className="form-label" htmlFor="email">
                                  Email
                                </label>
                                <input
                                  className="form-control"
                                  name="email"
                                  id="email"
                                  placeholder="Enter Your Email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      email: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              {error && (
                                <div className="alert alert-danger">
                                  {error}
                                </div>
                              )}
                              {success && (
                                <div className="alert alert-success">
                                  {success}
                                </div>
                              )}
                            </div>
                            <div className="col-12">
                              <div className="mb-3">
                                <button
                                  className="btn btn-light-primary w-100 text-white"
                                  onClick={(e) => {
                                    if ($("#forgotForm").valid())
                                      handleForgotPassword(e);
                                  }}
                                  type="button"
                                >
                                  Send Reset Link
                                </button>
                              </div>
                            </div>
                          </form>
                        </>
                      )}
                      {isVisible && (
                        <>
                          <form
                            id="resetForm"
                            className="app-form rounded-control"
                          >
                            {success && (
                              <div className="col-12">
                                <div className="alert alert-success">
                                  {success}
                                </div>
                              </div>
                            )}
                            <div className="col-12">
                              <div className="mb-3">
                                <label
                                  className="form-label"
                                  htmlFor="password"
                                >
                                  New Password
                                </label>
                                <input
                                  className="form-control"
                                  name="password"
                                  id="password"
                                  placeholder="Enter New Password"
                                  type="password"
                                  value={forgotpwd.password}
                                  onChange={(e) =>
                                    setForgotpwd({
                                      ...forgotpwd,
                                      password: e.target.value,
                                    })
                                  }
                                />
                                {error && (
                                  <div className="alert alert-danger mt-2">
                                    {error.password || "Password is required."}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="mb-3">
                                <label
                                  className="form-label"
                                  htmlFor="password_confirmation"
                                >
                                  Confirm Password
                                </label>
                                <input
                                  className="form-control"
                                  name="password_confirmation"
                                  id="password_confirmation"
                                  placeholder="Enter Your Password"
                                  type="password"
                                  value={forgotpwd.password_confirmation}
                                  onChange={(e) =>
                                    setForgotpwd({
                                      ...forgotpwd,
                                      password_confirmation: e.target.value,
                                    })
                                  }
                                />
                                {error && (
                                  <div className="alert alert-danger mt-2">
                                    {error.password_confirmation ||
                                      "Password confirmation is required."}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="mb-3">
                                <button
                                  className="btn btn-light-primary w-100 text-white"
                                  onClick={(e) => {
                                    if ($("#resetForm").valid())
                                      handleResetPassword(e);
                                  }}
                                  type="button"
                                >
                                  Reset Password
                                </button>
                              </div>
                            </div>
                          </form>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ForgotPwd;
