"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import TableControls from "@/components/datatable/TableControls";
import PaginationControls from "@/components/datatable/PaginationControls";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";


function Account() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
        taxId: "",
        country_id: "",
        state_id: "",
        referral_code: "",
        referred_by: "",
        referred_customers: [],
        city_id: "",
        zip: "",
        address: "",
    });
    const [changePassword, setChangePassword] = useState({
        password: "",
        new_password: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [error, setError] = useState([]);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profileLocation, setProfileLocation] = useState(null);
    useEffect(() => {
 const loadValidation = async () => {
    const $ = (await import("jquery")).default;
    await import("jquery-validation");
    $("#profileForm").validate({
        rules: {
            firstName: { required: true },
            lastName: { required: true },
            email: { required: true, email: true },
            telephone: { required: true, digits: true },
            taxation_id: { required: true },
            country_id: { required: true },
            state_id: { required: true },
            city_id: { required: true },
            zipcode: { required: true },
            address: { required: true },
        },
        messages: {
            firstName: "Please enter your first name",
            lastName: "Please enter your last name",
            email: {
                required: "Please enter your email",
                email: "Enter a valid email address",
            },
            telephone: {
                required: "Please enter your phone number",
                digits: "Only numbers allowed",
            },
            taxation_id: "Please enter your tax ID",
            country_id: "Please select a country",
            state_id: "Please select a state",
            city_id: "Please select a city",
            zipcode: "Please enter your zipcode",
            address: "Please enter your full address",
        },
        errorElement: "span",
        errorClass: "text-danger",
        highlight: function (element) {
            $(element).addClass("is-invalid");
        },
        unhighlight: function (element) {
            $(element).removeClass("is-invalid");
        },
        errorPlacement: function (error, element) {
            if (element.parent(".input-group").length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        },
    });

    // Password Form Validation
    $("#passwordForm").validate({
        rules: {
            password: { required: true },
            new_password: {
                required: true,
                minlength: 6,
            },
            confirm_password: {
                required: true,
                equalTo: "#new_password",
            },
        },
        messages: {
            password: "Please enter your current password",
            new_password: {
                required: "Please enter a new password",
                minlength: "Minimum 6 characters",
            },
            confirm_password: {
                required: "Please confirm your new password",
                equalTo: "Passwords do not match",
            },
        },
        errorElement: "span",
        errorClass: "text-danger",
        highlight: function (element) {
            $(element).addClass("is-invalid");
        },
        unhighlight: function (element) {
            $(element).removeClass("is-invalid");
        },
        errorPlacement: function (error, element) {
            if (element.parent(".input-group").length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        },
    });
}
}, []);
            const searchParams = useSearchParams();
            const router = useRouter();
        
        useEffect(() => {
          const addressNotification = searchParams.get("notify");

          if (!addressNotification) return; // Exit early if no address notification in URL

          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
    
          if (addressNotification === "add_address") {
            Toast.fire({
              icon: "warning",
              title: "Please add billing address!",
            });
            router.replace("/account"); // Clean the URL
          }
        }, [searchParams]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token) {
            const UpdateProfile = async () => {
                setLoading(true);
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/profile`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const result = await response.json();
                    const data = result.data;

                    setFormData({
                        firstName: data.first_name || "",
                        lastName: data.last_name || "",
                        email: data.email || "",
                        telephone: data.telephone || "",
                        taxation_id: data.taxation_id || "",
                        country_id: data.country_id || "",
                        state_id: data.state_id || "",
                        city_id: data.city_id || "",
                        zipcode: data.zipcode || "",
                        address: data.address || "",
                        referral_code: data.referral_code || "",
                        referred_by: data.referred_by || "",
                        referred_customers: data.referred_customers || [],
                    });

                    // ✅ set referrals separately for your datatable
                    setReferrals(data.referred_customers || []);

                    setSelectedCountry(data.country_id || "");
                    setSelectedState(data.state_id || "");
                    setSelectedCity(data.city_id || "");
                } catch (error) {
                    console.error("Error fetching cloud vps plan data:", error);
                } finally {
                    setLoading(false);
                }
            };

            UpdateProfile();
        }
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.city_id = selectedCity;
        formData.country_id = selectedCountry;
        formData.state_id = selectedState;

        // Example POST request (Uncomment if you have a backend to send this to)
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/profile`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("accessToken")}`, // Send the token
                },
                body: JSON.stringify(formData),
            }
        );

        const result = await res.json();

        if (res.ok && result.success) {
            Cookies.set("user", JSON.stringify(result.data.user), { expires: 7 });

            setSuccess(result.message);

        } else {
            setError(result.errors);
            console.log(error);
        }
        console.log(result);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setChangePassword((prev) => ({ ...prev, [name]: value }));
    };

    // 定义一个异步函数，用于处理密码更改
    const HandleChangePassword = async (e) => {
        e.preventDefault();

        if (changePassword.new_password !== confirmPassword) {
            setMessage("New passwords do not match.");
            return;
        }

        // Example POST request (Uncomment if you have a backend to send this to)
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/change-password`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("accessToken")}`, // Send the token
                },
                body: JSON.stringify(changePassword),
            }
        );

        const result = await res.json();

        if (res.ok && result.success) {
            setSuccess(result.message);

            window.location.href = "/";
        } else {
            setError(result.errors);
            console.log(error);
        }
        console.log(result);
    };
   useEffect(() => {
    const togglePassword = (inputId, iconClass) => {
        const input = document.getElementById(inputId);
        const icon = document.querySelector(iconClass);

        if (input && icon) {
            const handleClick = () => {
                const isPassword = input.type === "password";
                input.type = isPassword ? "text" : "password";

                // Swap icon class properly
                icon.classList.remove(isPassword ? "ph-eye-slash" : "ph-eye");
                icon.classList.add(isPassword ? "ph-eye" : "ph-eye-slash");
            };

            icon.addEventListener("click", handleClick);

            // Cleanup
            return () => icon.removeEventListener("click", handleClick);
        }
    };

    const cleanups = [
        togglePassword("password", ".eyes-icon"),
        togglePassword("new_password", ".eyes-icon1"),
        togglePassword("confirm_password", ".eyes-icon2"),
    ];

    return () => cleanups.forEach((cleanup) => cleanup && cleanup());
}, []);

    // c-s-c
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // Fetch countries
    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/countries`)
            .then((res) => {
                setCountries(res.data.data);
            });
    }, []);

    // Fetch states when country changes
    useEffect(() => {
        if (!selectedCountry) return;

        axios
            .get(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/countries/${selectedCountry}/states`
            )
            .then((res) => {
                setStates(res.data.data);
                setCities([]);
                // setSelectedState("");
            });
    }, [selectedCountry]);

    // Fetch cities when state changes
    useEffect(() => {
        if (!selectedCountry || !selectedState) return;

        axios
            .get(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/states/${selectedState}/cities`
            )
            .then((res) => {
                setCities(res.data.data);
            });
    }, [selectedState]);

    // auto load
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 900);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage('');
            setSuccess('');
            setError('');
        }, 5000); // 5000 ms = 5 seconds

        return () => clearTimeout(timer); // cleanup on re-render
    }, [message, success, error]);



    const [referrals, setReferrals] = useState([]);
    const [search, setSearch] = useState("");
    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = useMemo(() => {
        return referrals.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [referrals, search]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * entries;
        return filteredData.slice(start, start + entries);
    }, [filteredData, currentPage, entries]);


    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(formData.referral_code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    };



    return (
        <Fragment>
            <div className="position-relative">
                {/* Overlay loader */}
                {isLoading && (
                    <div
                        className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
                        style={{
                            background: "var(--bodybg-color)",
                            zIndex: 1000,
                        }}
                    >
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                <main
                    className={`page-content  ${isLoading ? "pointer-events-none" : ""}`}
                    style={{ opacity: isLoading ? 0.5 : 1 }}
                >
                    <div className="container-fluid">
                        {/* Breadcrumb start */}
                        <div className="row m-1">
                            <div className="col-12 ">
                                <h4 className="main-title">Accounts</h4>
                            </div>
                        </div>
                        {/* Breadcrumb end */}

                        {/* setting-app start */}
                        <div className="row">
                            <div className="col-lg-4 col-xxl-3">
                                <div className="card">
                                    <div className="card-header">
                                        <h5>Settings</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="vertical-tab setting-tab">
                                            <ul
                                                className="nav nav-tabs tab-light-primary "
                                                id="v-bg"
                                                role="tablist"
                                            >
                                                <li className="nav-item" role="presentation">
                                                    <button
                                                        aria-controls="profile-tab-pane"
                                                        aria-selected="true"
                                                        className="nav-link active"
                                                        data-bs-target="#profile-tab-pane"
                                                        data-bs-toggle="tab"
                                                        id="profile-tab"
                                                        role="tab"
                                                        type="button"
                                                    >
                                                        <i className="ph-bold  ph-user-circle-gear pe-2" />
                                                        Profile
                                                    </button>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <button
                                                        aria-controls="security-tab-pane"
                                                        aria-selected="false"
                                                        className="nav-link"
                                                        data-bs-target="#security-tab-pane"
                                                        data-bs-toggle="tab"
                                                        id="security-tab"
                                                        role="tab"
                                                        type="button"
                                                    >
                                                        <i className="ph-bold  ph-shield-check pe-2" />
                                                        Security
                                                    </button>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <button
                                                        aria-controls="referral-tab-pane"
                                                        aria-selected="false"
                                                        className="nav-link"
                                                        data-bs-target="#referral-tab-pane"
                                                        data-bs-toggle="tab"
                                                        id="referral-tab"
                                                        role="tab"
                                                        type="button"
                                                    >
                                                        <i className="ph-bold  ph-link-simple pe-2" />
                                                        Referral
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="col-lg-8 col-xxl-9">
                                <div className="tab-content">
                                    <div
                                        aria-labelledby="profile-tab"
                                        className="tab-pane fade active show"
                                        id="profile-tab-pane"
                                        role="tabpanel"
                                        tabIndex={0}
                                    >
                                        <div className="card security-card-content">
                                            <div className="card-body">
                                                <div className="account-security">
                                                    <div className="row align-items-center">
                                                        <div className="col-sm-8">
                                                            <h5 className="text-primary f-w-600">
                                                                Profile Setup
                                                            </h5>
                                                            <p className="account-discription text-dark f-s-16 mt-2 mb-0">
                                                                your account is valuable to hackers. to make
                                                                2-step verification very secure, use your
                                                                phone's built-in security key
                                                            </p>
                                                        </div>
                                                        <div className="col-sm-4 account-security-img">
                                                            <img
                                                                alt=""
                                                                className="w-150"
                                                                src="../assets/images/setting-app/account.png"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card setting-profile-tab">
                                            <div className="card-body">
                                                <div className="profile-tab profile-container">
                                                    <form className="app-form" onSubmit={handleSubmit} id="profileForm" >
                                                        {success && (
                                                            <div className="alert alert-success">
                                                                {success}
                                                            </div>
                                                        )}
                                                        <h5 className="mb-2 text-dark f-w-600">
                                                            User Info
                                                        </h5>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">
                                                                        First Name
                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        value={formData.firstName || ""}
                                                                        onChange={handleInputChange}
                                                                        name="firstName"
                                                                        placeholder="Maria C. Eck"
                                                                        type="text"
                                                                        required
                                                                    />
                                                                    {error.firstName && (
                                                                        <span className="alert alert-danger">
                                                                            {error.firstName}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">
                                                                        Last Name
                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        placeholder="Eck"
                                                                        value={formData.lastName || ""}
                                                                        name="lastName"
                                                                        onChange={handleInputChange}
                                                                        type="text"
                                                                        required
                                                                    />
                                                                    {error.lastName && (
                                                                        <span className="alert alert-danger">
                                                                            {error.lastName}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">
                                                                        Email address
                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        placeholder="MariaCEck@teleworm.us"
                                                                        name="email"
                                                                        value={formData.email || ""}
                                                                        onChange={handleInputChange}
                                                                        type="email"
                                                                        required
                                                                    />
                                                                    {error.email && (
                                                                        <span className="alert alert-danger">
                                                                            {error.email}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Phone no</label>
                                                                    <input
                                                                        className="form-control"
                                                                        placeholder="8899665522"
                                                                        name="telephone"
                                                                        value={formData.telephone || ""}
                                                                        onChange={handleInputChange}
                                                                        type="tel"
                                                                    />
                                                                    {error.telephone && (
                                                                        <span className="alert alert-danger">
                                                                            {error.telephone}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">
                                                                        Taxation Id
                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        placeholder="test"
                                                                        name="taxation_id"
                                                                        value={formData.taxation_id || ""}
                                                                        onChange={handleInputChange}
                                                                        type="text"
                                                                    />
                                                                    {error.taxation_id && (
                                                                        <span className="alert alert-danger">
                                                                            {error.taxation_id}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="app-divider-v dotted" />
                                                            </div>
                                                            <h5 className="mb-2 text-dark f-w-600">
                                                                Billing Address
                                                            </h5>

                                                            <div className="col-md-6 mb-3">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="inputCountry"
                                                                >
                                                                    Country
                                                                </label>
                                                                <select
                                                                    id="inputCountry"
                                                                    name="country_id"
                                                                    className="form-select"
                                                                    value={selectedCountry || ""}
                                                                    onChange={(e) =>
                                                                        setSelectedCountry(e.target.value)
                                                                    }
                                                                >
                                                                    <option value="">Choose Country</option>
                                                                    {countries.map((country) => (
                                                                        <option key={country.id} value={country.id}>
                                                                            {country.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {error.country && (
                                                                    <div className="alert alert-danger">
                                                                        {error.country}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="col-md-6 mb-3">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="inputState"
                                                                >
                                                                    State
                                                                </label>
                                                                <select
                                                                    id="inputState"
                                                                    name="state_id"
                                                                    className="form-select"
                                                                    value={selectedState || ""}
                                                                    onChange={(e) =>
                                                                        setSelectedState(e.target.value)
                                                                    }
                                                                    disabled={!selectedCountry}
                                                                >
                                                                    <option value="">Choose State</option>
                                                                    {states.map((state) => (
                                                                        <option key={state.id} value={state.id}>
                                                                            {state.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {error.state && (
                                                                    <div className="alert alert-danger">
                                                                        {error.state}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="col-md-6 mb-3">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="inputCity"
                                                                >
                                                                    City
                                                                </label>
                                                                <select
                                                                    id="inputCity"
                                                                    name="city_id"
                                                                    className="form-select"
                                                                    value={selectedCity || ""}
                                                                    onChange={(e) =>
                                                                        setSelectedCity(e.target.value)
                                                                    }
                                                                    disabled={!selectedState}
                                                                >
                                                                    <option value="">Choose City</option>
                                                                    {cities.map((city) => (
                                                                        <option key={city.id} value={city.id}>
                                                                            {city.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {error.city && (
                                                                    <div className="alert alert-danger">
                                                                        {error.city}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label
                                                                        className="form-label"
                                                                        htmlFor="inputZip"
                                                                    >
                                                                        Zip/Pin Code
                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        id="inputZip"
                                                                        name="zipcode"
                                                                        value={formData.zipcode || ""}
                                                                        onChange={handleInputChange}
                                                                        placeholder="CT 06510"
                                                                        type="text"
                                                                    />
                                                                    {error.zipcode && (
                                                                        <div className="alert alert-danger">
                                                                            {error.zipcode}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="mb-3">
                                                                    <label className="form-label">
                                                                        Full Address
                                                                    </label>
                                                                    <textarea
                                                                        className="form-control"
                                                                        name="address"
                                                                        placeholder="1098 Asylum Avenu New Haven, CT 06510"
                                                                        defaultValue={formData.address || ""}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    {error.address && (
                                                                        <div className="alert alert-danger">
                                                                            {error.address}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="col-12">
                                                                <div className="text-end">
                                                                    <button
                                                                        className="btn text-dark border me-3"
                                                                        type="reset"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        type="submit"
                                                                    >
                                                                        Submit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        aria-labelledby="security-tab"
                                        className="tab-pane fade"
                                        id="security-tab-pane"
                                        role="tabpanel"
                                        tabIndex={0}
                                    >
                                        <div className="card security-card-content">
                                            <div className="card-body">
                                                <div className="account-security">
                                                    <div className="row align-items-center">
                                                        <div className="col-sm-8">
                                                            <h5 className="text-primary f-w-600">
                                                                Account Security
                                                            </h5>
                                                            <p className="account-discription text-secondary f-s-16 mt-2 mb-0">
                                                                your account is valuable to hackers. to make
                                                                2-step verification very secure, use your
                                                                phone's built-in security key
                                                            </p>
                                                        </div>
                                                        <div className="col-sm-4 account-security-img">
                                                            <img
                                                                alt=""
                                                                className="w-150"
                                                                src="../assets/images/setting-app/password.png"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card security-card-content">
                                            <div className="card-body">
                                                <div className="app-form">
                                                    <form onSubmit={HandleChangePassword} id="passwordForm">
                                                        {message && (
                                                            <span className="alert alert-danger">
                                                                {message}
                                                            </span>
                                                        )}
                                                        {success && (
                                                            <div className="alert alert-success">
                                                                {success}
                                                            </div>
                                                        )}
                                                        <div className="row">
                                                            <div className="col-sm-12">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="password"
                                                                >
                                                                    Current Password
                                                                </label>
                                                                <div className="input-group input-group-password mb-3">
                                                                    <span className="input-group-text b-r-left">
                                                                        <i className="ph-bold ph-lock f-s-20" />
                                                                    </span>
                                                                    <input
                                                                        className="form-control"
                                                                        id="password"
                                                                        placeholder="********"
                                                                        name="password"
                                                                        type="password"
                                                                        value={changePassword.password}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <span className="input-group-text b-r-right">
                                                                        <i
                                                                            className="ph ph-eye-slash f-s-20 eyes-icon"
                                                                            id="showPassword"
                                                                        />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {error.password && (
                                                                <div className="alert alert-danger">
                                                                    {error.password}
                                                                </div>
                                                            )}

                                                            <div className="col-sm-12">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="password1"
                                                                >
                                                                    New Password
                                                                </label>
                                                                <div className="input-group input-group-password mb-3">
                                                                    <span className="input-group-text b-r-left">
                                                                        <i className="ph-bold ph-lock f-s-20" />
                                                                    </span>
                                                                    <input
                                                                        className="form-control"
                                                                        id="new_password"
                                                                        placeholder="********"
                                                                        name="new_password"
                                                                        type="password"
                                                                        value={changePassword.new_password}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <span className="input-group-text b-r-right">
                                                                        <i
                                                                            className="ph ph-eye-slash f-s-20 eyes-icon1"
                                                                            id="showPassword1"
                                                                        />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {error.new_password && (
                                                                <div className="alert alert-danger">
                                                                    {error.new_password}
                                                                </div>
                                                            )}

                                                            <div className="col-sm-12">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="password2"
                                                                >
                                                                    Confirm Password
                                                                </label>
                                                                <div className="input-group input-group-password mb-3">
                                                                    <span className="input-group-text b-r-left">
                                                                        <i className="ph-bold ph-lock f-s-20" />
                                                                    </span>
                                                                    <input
                                                                        className="form-control"
                                                                        id="confirm_password"
                                                                        placeholder="********"
                                                                        name="confirm_password"
                                                                        type="password"
                                                                        value={confirmPassword}
                                                                        onChange={(e) =>
                                                                            setConfirmPassword(e.target.value)
                                                                        }
                                                                    />
                                                                    <span className="input-group-text b-r-right">
                                                                        <i
                                                                            className="ph ph-eye-slash f-s-20 eyes-icon2"
                                                                            id="showPassword2"
                                                                        />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {error.confirm_password && (
                                                                <div className="alert alert-danger">
                                                                    {error.confirm_password}
                                                                </div>
                                                            )}

                                                            <div className="col-12">
                                                                <div className="text-end">
                                                                    <button
                                                                        className="btn text-dark border me-3"
                                                                        type="reset"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        type="submit"
                                                                    >
                                                                        Submit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        aria-labelledby="referral-tab"
                                        className="tab-pane fade active show"
                                        id="referral-tab-pane"
                                        role="tabpanel"
                                        tabIndex={0}
                                    >
                                        <div className="card security-card-content">
                                            <div className="card-body">
                                                <div className="account-security">
                                                    <div className="row align-items-center">
                                                        <div className="col-sm-8">
                                                            <h5 className="text-primary f-w-600">
                                                                Referral
                                                            </h5>
                                                            <p className="account-discription text-dark f-s-16 mt-2 mb-0">
                                                                your account is valuable to hackers. to make
                                                                2-step verification very secure, use your
                                                                phone's built-in security key
                                                            </p>
                                                        </div>
                                                        <div className="col-sm-4 account-security-img">
                                                            <img
                                                                alt=""
                                                                className="w-150"
                                                                src="../assets/images/new/referr.png"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card setting-profile-tab">
                                            <div className="card-body">
                                                <div className="profile-tab profile-container">
                                                    <form className="app-form" onSubmit={handleSubmit}>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">
                                                                        Referral Code
                                                                    </label>
                                                                    <div className="refrell-wrappeR">
                                                                        <div
                                                                            className="form-control d-flex align-items-center"
                                                                            style={{ padding: ".6rem .75rem" }}
                                                                        >
                                                                            <input
                                                                                className="form-control border-0 p-0"
                                                                                value={formData.referral_code}
                                                                                name="referral_code"
                                                                                type="text"
                                                                                readOnly
                                                                                required
                                                                            />
                                                                            <button
                                                                                className="bg-primary text-white css-52q5mj"
                                                                                type="button"
                                                                                onClick={handleCopy}
                                                                            >
                                                                                {copied ? "Copied!" : "Copy"}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">
                                                                        Referred By
                                                                    </label>
                                                                    <div className="refrell-wrappeR">
                                                                        <div className="form-control d-flex align-items-center">
                                                                            <input className="form-control border-0 p-0"
                                                                                value={formData.referred_by}
                                                                                name="referred_by"
                                                                                type="text"
                                                                                required />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="card security-card-content">
                                            <div className="card-body">
                                                <div className="account-security">
                                                    <div className="row align-items-center">
                                                        <div className="col-sm-8">
                                                            <h5 className="text-primary f-w-600 mb-4">
                                                                Referred Customers
                                                            </h5>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="app-datatable-default overflow-auto position-relative">
                                                                <TableControls
                                                                    entries={entries}
                                                                    setEntries={(val) => {
                                                                        setEntries(val);
                                                                        setCurrentPage(1);
                                                                    }}
                                                                    search={search}
                                                                    setSearch={(val) => {
                                                                        setSearch(val);
                                                                        setCurrentPage(1);
                                                                    }}
                                                                />

                                                                <table className="datatable display app-data-table default-data-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th width={10}>Sr No.</th>
                                                                            <th>First Name</th>
                                                                            <th>Last Name</th>
                                                                            <th>Email</th>
                                                                            <th>Created At</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {paginatedData.length > 0 ? (
                                                                            paginatedData.map((referred_customers, index) => (
                                                                                <tr key={index}>
                                                                                    <td className="text-start">{(currentPage - 1) * entries + index + 1}</td>
                                                                                    <td>{referred_customers.first_name}</td>
                                                                                    <td>{referred_customers.last_name}</td>
                                                                                    <td>{referred_customers.email}</td>
                                                                                    <td>
                                                                                        {new Date(referred_customers.created_at).toLocaleDateString("en-GB", {
                                                                                            day: "numeric",
                                                                                            month: "long",
                                                                                            year: "2-digit",
                                                                                        }).replace(
                                                                                            /^(\d{1,2})/,
                                                                                            "$1" + getDaySuffix(new Date(referred_customers.created_at).getDate())
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan={5} className="text-center py-3">
                                                                                    No referred customers found
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>

                                                                <PaginationControls
                                                                    currentPage={currentPage}
                                                                    setCurrentPage={setCurrentPage}
                                                                    entries={entries}
                                                                    totalCount={filteredData.length}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*setting app end */}
                    </div>
                </main>
            </div>
        </Fragment>
    );
}
export default Account;
