"use client";
import Link from "next/link";
import React, { Fragment, useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import axios from "axios";
// import $ from "jquery";
// import "jquery-validation";
import TableControls from "@/components/datatable/TableControls";
import PaginationControls from "@/components/datatable/PaginationControls";
import Cookies from "js-cookie";
const assets = "/assets";

function Affiliate() {
  const [activeTab, setActiveTab] = useState(1);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [countreferral, setCountReferal] = useState(0);
  const [visitor, setVisitor] = useState(0);
  const [link, setLink] = useState("");
  const [copyText, setCopyText] = useState("Copy");
  const [withdrawallist, setWithdrawalList] = useState([]);
  const [bounstotal, setBounsTotal] = useState(0);
  const [bounsapproved, setBounsApproved] = useState(0);
  const [bounsrejected, setBounsRejected] = useState(0);
  const [commissionpending, setCommissionPending] = useState(0);
  const [commissionapproved, setCommissionApproved] = useState(0);
  const [commissionrejected, setCommissionRejected] = useState(0);
  const [terms, setTerms] = useState([]);
  const [bonusStatus, setBonusStatus] = useState([]);
  const [accountdetails, setAccountDetails] = useState([]);
  const [accountshow, setAccountShow] = useState(false);
  const [showdashboard, setShowDashboard] = useState(false);
  const inputRef = useRef(null);

  const [SupportData, setSupportData] = useState({
          credentials: 'N/A',
          subject: 'Request to Join Affiliate Program',
          description: 'I would like to join the affiliate program.',
      });
  
  const [supporterrors, supportErrors] = useState({
      credentials: '',
      subject: '',
      description: '',
  });

  const [accountFormData, setAccountFormData] = useState({
    country: "",
    account_number: "",
    account_type: "",
    paypal_email: "",
    swift_code: "",
    ifsc_code: "",
    iban_number: "",
    document_types: [],
    document_files: [],
    document_values: [],
  });
  const [errorAccount, setErrorAccount] = useState({});
  useEffect(() => { 
    const loadValidation = async () => {
    const $ = (await import("jquery")).default;
    await import("jquery-validation");
  const modal = document.getElementById("projectCard2");
  if (!modal) return;

  modal.addEventListener("shown.bs.modal", () => {
    $("#withdrawalForm").validate({
      rules: {
        amount: {
          required: true,
          number: true,
          min: terms?.withdraw_threshold_amount || 10,
        },
      },
      messages: {
        amount: {
          required: "Amount is required.",
          number: "Please enter a valid number.",
          min: `Minimum withdrawal amount is $${terms?.withdraw_threshold_amount || 10}.`,
        },
      },
      errorPlacement: function (error, element) {
        $("#errorMessage")
          .removeClass("d-none")
          .text(error.text());
      },
      success: function () {
        $("#errorMessage").addClass("d-none");
      },
    });
  });
}}, [terms]);


  
  const handleAccountChange = (e) => {
    setAccountFormData({ ...accountFormData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setAccountFormData({
      ...accountFormData,
      [e.target.name]: Array.from(e.target.files),
    });
  };
  // Affiliate Dashboard Data Fetching
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      // console.log("Token found:", token);
      const FetchProject = async () => {
        console.log(`Bearer ${token}`);
        setIsLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/affiliate/dashboard`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Send the token
              },
            }
          );

          const result = await response.json();
          const data = result;
          if (data.affiliate_status === "approved") {
            console.log(data);
            setCountReferal(data.signups);
            setVisitor(data.clicks.total);
            setLink(data.referral_link);
            setBounsTotal(data.bouns_total);
          
          setBounsApproved(data.bouns_approved);
          setBounsRejected(data.bouns_rejected);
          setCommissionPending(data.commission_pending);
          setCommissionApproved(data.commission_approved);
          setCommissionRejected(data.commission_rejected);
          setTerms(data.config);
           setShowDashboard(true);
            
          }
          else{
            setError(data.message || "Affiliate program is currently disabled for your account.");
            setShowDashboard(false);
          }
        } catch (error) {
          console.error("Error fetching cloud vps plan data:", error);
          setIsLoading(false);
        }
      };

      FetchProject();
    }
  }, []);
  // Fetch withdrawal list
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      // console.log("Token found:", token);
      const FetchProject = async () => {
        console.log(`Bearer ${token}`);
        setIsLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/withdrawals`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Send the token
              },
            }
          );
          const result = await response.json();
          const data = result;
          setWithdrawalList(data?.data);
        } catch (error) {
          console.error("Error fetching cloud vps plan data:", error);
          setIsLoading(false);
        }
      };

      FetchProject();
    }
  }, []);
  // Fetch bonus status
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      // console.log("Token found:", token);
      const FetchBonusStatus = async () => {
        console.log(`Bearer ${token}`);
        setIsLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/bonus-status`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Send the token
              },
            }
          );
          const result = await response.json();
          const data = result;
          console.log("Bonus Status Data:", data);
          setBonusStatus(data?.data);
        } catch (error) {
          console.error("Error fetching cloud vps plan data:", error);
          setIsLoading(false);
        }
      };

      FetchBonusStatus();
    }
  }, []);

  // Fetch account details
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      // console.log("Token found:", token);
      const FetchAccountDetails = async () => {
        console.log(`Bearer ${token}`);
        setIsLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/affiliate-payout`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Send the token
              },
            }
          );
          const result = await response.json();
          const data = result;
          console.log("Affiliate Data:", data);
          setAccountDetails(data?.data);
          setAccountShow(true);
          setAccountFormData({
            country: data?.data?.country || "",
            account_number: data?.data?.account_number || "",
            account_type: data?.data?.account_type || "",
            paypal_email: data?.data?.paypal_email || "",
            swift_code: data?.data?.swift_code || "",
            ifsc_code: data?.data?.ifsc_code || "",
            iban_number: data?.data?.iban_number || "",
            document_types: data?.data?.documents.map((doc, index) => doc.type) || [],
            document_values: data?.data?.documents.map((doc, index) => doc.value) || [],

          });
        } catch (error) {
          console.error("Error fetching cloud vps plan data:", error);
          setIsLoading(false);
        }
      };

      FetchAccountDetails();
    }
  }, []);

  const [formData, setFormData] = useState({ amount: "" });

  console.log("accountDetails ", accountdetails);
  // Handle withdrawal request
  const handleWithdrawl = async () => {

     if (!$("#withdrawalForm").valid()) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/withdrawals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`, // if required
          },
          body: JSON.stringify({ amount: formData.amount }),
        }
      );

      const result = await res.json();
      console.log("API Result:", result);
      if (res.ok && result.success == true) {
        setSuccess("Withdrawal request successful.");
        setError("");
        setFormData({ amount: "" }); // Reset the form
      } else {
        setError(result.error || "Failed to make withdrawal request.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleAccount = async () => {
    // Validation Start
    const { document_types, document_files, document_values } = accountFormData;

    console.log("document_types", document_types);
    console.log("document_files", document_files);
    console.log("document_values", document_values);
    
    if(!accountshow)
{
    if (
  !(Array.isArray(document_types) && document_types.length) ||
  !(Array.isArray(document_files) && document_files.length) ||
  document_types.length !== document_files.length
) {
  setError("Each document type must have a corresponding document file.");
  return;
}
  }

    // Validation End
    const formData = new FormData();

    // Append simple fields
    formData.append("country", accountFormData.country);
    formData.append("account_number", accountFormData.account_number);
    formData.append("account_type", accountFormData.account_type);
    formData.append("paypal_email", accountFormData.paypal_email);
    formData.append("swift_code", accountFormData.swift_code);
    formData.append("ifsc_code", accountFormData.ifsc_code);
    formData.append("iban_number", accountFormData.iban_number);

    // Append document_types as array
    accountFormData.document_types.forEach((type, i) => {
      formData.append(`document_types[${i}]`, type);
    });

    // Append document_values if needed
    accountFormData.document_values.forEach((val, i) => {
      formData.append(`document_values[${i}]`, val);
    });

    // Append files
    accountFormData.document_files.forEach((file) => {
      formData.append("document_files[]", file);
    });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/affiliate-payout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: formData,
        }
      );

      const result = await res.json();
      console.log("API Result:", result);
      if (res.ok && result.status == "success") {
        setSuccess(
          result.message || "Bank and document details submitted successfully"
        );
        setAccountFormData([
          { country: "" },
          { account_number: "" },
          { account_type: "" },
          { paypal_email: "" },
          { swift_code: "" },
          { ifsc_code: "" },
          { iban_number: "" },
          { document_types: [] },
          { document_files: [] },
          { document_values: [] },
        ]);

        setTimeout(() => {
        // window.location.reload();
      }, 3000);
      } else {
        setErrorAccount(result.errors);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    }
  };


  const handleSupportSubmit = async (e) => {
      e.preventDefault();

      try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/support/tickets`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${Cookies.get('accessToken')}`,
              },
              body: JSON.stringify(SupportData),
          });

          const data = await res.json();

          if (res.ok) {
              await Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: data.message || 'Support ticket created successfully.',
                  confirmButtonColor: '#3085d6',
              });
              router.push('/support');
          } else {
              Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: data.message || 'Something went wrong',
              });
          }
      } catch (err) {
          console.error('Ticket Creation Error:', err);
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Something went wrong while creating the ticket.',
          });
      }
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timer;
    if (error || success) {
      timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [error, success]);

  const handleChange = (e) => {
    setFormData({ ...formData, amount: e.target.value });
  };

  // FOR custom amount end

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  // c-s-c
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  // c-s-c

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

  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      navigator.clipboard
        .writeText(inputRef.current.value)
        .then(() => {
          setCopyText("Copied!");
          setTimeout(() => setCopyText("Copy"), 3000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  const [withdrawalSearch, setWithdrawalSearch] = useState("");
  const [withdrawalEntries, setWithdrawalEntries] = useState(10);
  const [withdrawalPage, setWithdrawalPage] = useState(1);

  const filteredWithdrawals = useMemo(() => {
    return withdrawallist.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(withdrawalSearch.toLowerCase())
      )
    );
  }, [withdrawallist, withdrawalSearch]);

  const paginatedWithdrawals = useMemo(() => {
    const start = (withdrawalPage - 1) * withdrawalEntries;
    return filteredWithdrawals.slice(start, start + withdrawalEntries);
  }, [filteredWithdrawals, withdrawalPage, withdrawalEntries]);

  return (
    <>
      {showdashboard ? (
    <Fragment>
      <div className="position-relative">
        {/* Overlay loader */}
        {isLoading && (
          <div
            className="d-flex justify-content-center align-items-center position-absolute start-0 w-100 h-100"
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
          className={`page-content ${isLoading ? "pointer-events-none" : ""}`}
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          <div className="container-fluid">
            {/* Breadcrumb start */}
            <div className="row m-1">
              <div className="col-12 ">
                <h4 className="main-title">Orders</h4>
              </div>
            </div>
            {/* Breadcrumb end */}

            <div className="row ticket-app">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-3 col-md-6 col-12">
                    <div className="card ticket-card bg-light-primary">
                      <div className="card-body">
                        {/* <i className="ph-bold  ph-circle circle-bg-img" /> */}
                        <div className="d-flex align-items-center justify-content-between pt-2 pb-2">
                          <div
                            className="h-70 w-70 d-flex-center b-r-15 "
                            style={{
                              backgroundColor: "#ffffff69",
                              backdropFilter: "blur(10px)",
                              boxShadow: "2px 2px 7px #b3a4ff99",
                            }}
                          >
                            {/* <i className="ph-bold  ph-ticket f-s-25 text-primary " /> */}
                            <Image
                              alt="referral"
                              src={`${assets}/images/new/refre.png`}
                              width={50}
                              height={50}
                            />
                          </div>
                          <div className="d-flex flex-column justify-content-between align-items-center">
                            <h5 className="f-s-16">Total Referrals</h5>
                            <h3 className="text-primary-dark">
                              {countreferral}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-12">
                    <div className="card ticket-card bg-light-info">
                      <div className="card-body">
                        {/* <i className="ph-bold  ph-circle circle-bg-img" /> */}
                        <div className="d-flex align-items-center justify-content-between pt-2 pb-2">
                          <div
                            className="h-70 w-70 d-flex-center b-r-15 "
                            style={{
                              backgroundColor: "#ffffff69",
                              backdropFilter: "blur(10px)",
                              boxShadow: "2px 2px 7px #668cff7a",
                            }}
                          >
                            {/* <i className="ph-bold  ph-clock-countdown f-s-25 text-info" /> */}

                            <Image
                              alt="referral"
                              src={`${assets}/images/new/current.png`}
                              width={50}
                              height={50}
                            />
                          </div>

                          <div className="d-flex flex-column justify-content-between align-items-center">
                            <h5 className="f-s-16">Current Earnings</h5>
                            <h3 className="text-info-dark">$0.00</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-12">
                    <div className="card ticket-card bg-light-success">
                      <div className="card-body">
                        {/* <i className="ph-bold  ph-circle circle-bg-img" /> */}
                        <div className="d-flex align-items-center justify-content-between pt-2 pb-2">
                          <div
                            className="h-70 w-70 d-flex-center b-r-15 mb-3"
                            style={{
                              backgroundColor: "#ffffff69",
                              backdropFilter: "blur(10px)",
                              boxShadow: "2px 2px 7px #007a294d",
                            }}
                          >
                            {/* <i className="ph-bold  ph-file-cloud f-s-25 text-success" /> */}
                            <Image
                              alt="referral"
                              src={`${assets}/images/new/earned.png`}
                              width={50}
                              height={50}
                            />
                          </div>

                          <div className="d-flex flex-column justify-content-between align-items-center">
                            <h5 className="f-s-16">Total Earned To Date</h5>
                            <h3 className="text-success-dark">$0.00</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-12">
                    <div className="card ticket-card bg-light-warning">
                      <div className="card-body">
                        {/* <i className="ph-bold  ph-circle circle-bg-img" /> */}
                        <div className="d-flex align-items-center justify-content-between pt-2 pb-2">
                          <div
                            className="h-70 w-70 d-flex-center b-r-15 mb-3"
                            style={{
                              backgroundColor: "#ffffff69",
                              backdropFilter: "blur(10px)",
                              boxShadow: "2px 2px 7px #9b9f006b",
                            }}
                          >
                            {/* <i className="ph-bold  ph-file-x f-s-25 text-warning" /> */}
                            <Image
                              alt="referral"
                              src={`${assets}/images/new/visitors.png`}
                              width={50}
                              height={50}
                            />
                          </div>

                          <div className="d-flex flex-column justify-content-between align-items-center">
                            <h5 className="f-s-16">Total Unique Visitors</h5>
                            <h3 className="text-warning-dark">{visitor}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="card ticket-card bg-light-success">
                      <div className="card-body">
                        {/* <i className="ph-bold  ph-circle circle-bg-img" /> */}
                        <div className="d-flex align-items-center justify-content-between pt-2 pb-2">
                          <div
                            className="h-70 w-70 d-flex-center b-r-15 mb-3"
                            style={{
                              backgroundColor: "#ffffff69",
                              backdropFilter: "blur(10px)",
                              boxShadow: "2px 2px 7px #007a294d",
                            }}
                          >
                            {/* <i className="ph-bold  ph-file-cloud f-s-25 text-success" /> */}
                            <Image
                              alt="referral"
                              src={`${assets}/images/new/earned.png`}
                              width={50}
                              height={50}
                            />
                          </div>

                          <div className="d-flex flex-column justify-content-between align-items-center">
                            <h5 className="f-s-16">Bonus total</h5>
                            <h3 className="text-success-dark">
                              ${bounstotal || "0"}
                            </h3>
                          </div>
                          <div className="d-flex flex-column justify-content-between align-items-center">
                            <h5 className="f-s-16">Bonus Unlocked</h5>
                            <h3 className="text-success-dark">
                              ${bounsapproved || "0"}
                            </h3>
                          </div>
                          <div className="d-flex flex-column justify-content-between align-items-center">
                            <h5 className="f-s-16">Bonus Pending</h5>
                            <h3 className="text-success-dark">
                              ${bounsrejected || "0"}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="card ticket-card bg-light-success">
                      <div className="card-body">
                        {/* <i className="ph-bold  ph-circle circle-bg-img" /> */}
                        <div className="d-flex align-items-center justify-content-between pt-2 pb-2">
                          <div
                            className="h-70 w-70 d-flex-center b-r-15 mb-3"
                            style={{
                              backgroundColor: "#ffffff69",
                              backdropFilter: "blur(10px)",
                              boxShadow: "2px 2px 7px #007a294d",
                            }}
                          >
                            {/* <i className="ph-bold  ph-file-cloud f-s-25 text-success" /> */}
                            <Image
                              alt="referral"
                              src={`${assets}/images/new/earned.png`}
                              width={50}
                              height={50}
                            />
                          </div>

                          <div className="d-flex flex-column justify-content-between align-items-center">
                            <h5 className="f-s-16">Commission Pending</h5>
                            <h3 className="text-success-dark">
                              ${commissionpending || "0"}
                            </h3>
                          </div>
                          <div className="d-flex flex-column justify-content-between align-items-center">
                            <h5 className="f-s-16">Commission Approved</h5>
                            <h3 className="text-success-dark">
                              ${commissionapproved || "0"}
                            </h3>
                          </div>
                          <div className="d-flex flex-column justify-content-between align-items-center">
                            <h5 className="f-s-16">Commission Rejected</h5>
                            <h3 className="text-success-dark">
                              ${commissionrejected || "0"}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row ticket-app mt-5">
              <div className="col-lg-5">
                <div className="refrell-wrapper">
                  <img
                    className="refrell-icon"
                    alt="invite"
                    src="assets/images/new/refer.png"
                  />
                  <h5 className="css-n3ox0y">
                    Refer friends and earn rewards!
                  </h5>
                  <div className="MuiBox-root css-n3ox0y"></div>
                  <div className="MuiBox-root css-18ddm1">
                    Share your referral code with friends. When they spend on
                    Onidel Cloud, both your friends and you earn rewards!
                    <a
                      className="MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineHover css-1eq413j"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://docs.onidel.com/account/affiliate-program"
                    >
                      How it works?
                    </a>
                  </div>

                  <div className="MuiInputBase-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-adornedEnd Mui-readOnly MuiInputBase-readOnly css-ckbyr5">
                    <input
                      id="input-email"
                      placeholder="Email"
                      readOnly
                      ref={inputRef}
                      className="MuiInputBase-input MuiInputBase-inputAdornedEnd Mui-readOnly MuiInputBase-readOnly css-1svj4fz"
                      type="text"
                      value={link}
                    />
                    <button
                      className="css-52q5mj"
                      tabIndex={0}
                      type="button"
                      onClick={handleCopy}
                    >
                      {copyText}
                      <span className="MuiTouchRipple-root css-w0pj6f" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <ul
                  className="active-device-session active-device-list"
                  id="shareMenuLeft"
                >
                  <li>
                    <div className="card share-menu-active">
                      <div className="widraw-card">
                        <div className="device-menu-item " draggable="false">
                          <span className="device-menu-img">
                            <i className="iconoir-card-wallet f-s-40 text-primary" />
                          </span>
                          <div className="device-menu-content">
                            <h4 className="css-n3ox0y">
                              Get Withdrawal requests
                            </h4>
                          </div>
                        </div>
                        <div className="d-flex widraw-btn">
                          <div className="text-end">
                            <button
                              className="btn btn-primary h-45 icon-btn m-2"
                              data-bs-target="#projectCard2"
                              data-bs-toggle="modal"
                            >
                              <i className="iconoir-gift f-s-18" /> Get
                              Withdrawal
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-lg-3">
                <ul
                  className="active-device-session active-device-list"
                  id="shareMenuLeft"
                >
                  <li>
                    <div className="card share-menu-active">
                      <div className="widraw-card">
                        <div className="device-menu-item " draggable="false">
                          <span className="device-menu-img">
                            <i className="iconoir-card-wallet f-s-40 text-primary" />
                          </span>
                          <div className="device-menu-content">
                            <h4 className="css-n3ox0y">Bonus</h4>
                          </div>
                        </div>
                        <div className="d-flex widraw-btn">
                          <div className="text-end">
                            {bonusStatus?.success == true ? (
                              <table>
                                <tr>
                                  <th>Locked Bonus</th>
                                  <td>0</td>
                                </tr>
                                <tr>
                                  <th>Status</th>
                                  <td>Locked</td>
                                </tr>
                                <tr>
                                  <th>Unlock Threshold</th>
                                  <td>100.00</td>
                                </tr>
                                <tr>
                                  <th>Spending So Far</th>
                                  <td>0</td>
                                </tr>
                                <tr>
                                  <th>Progress Percent</th>
                                  <td>0</td>
                                </tr>
                              </table>
                            ) : (
                              <p>
                                {bonusStatus?.message ||
                                  "No bonus information available"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12">
                <div className="tab-wrapper mb-3">
                  <ul className="tabs overflow-auto">
                    <li
                      className={`tab-link ${activeTab === 1 ? "active" : ""}`}
                      onClick={() => setActiveTab(1)}
                    >
                      <i className="ph-bold  ph-list-magnifying-glass f-s-18" />{" "}
                      Activities{" "}
                      <span
                        className="badge text-light-info"
                        style={{ padding: "3px 8px" }}
                      >
                        0
                      </span>
                    </li>
                    {/* <li
                      className={`tab-link ${activeTab === 2 ? "active" : ""}`}
                      onClick={() => setActiveTab(2)}
                    >
                      <i className="ph-fill  ph-money f-s-18" /> Payouts{" "}
                      <span
                        className="badge text-light-primary"
                        style={{ padding: "3px 8px" }}
                      >
                        0
                      </span>
                    </li> */}
                  </ul>
                </div>

                <div className="content-wrapper" id="card-container">
                  <div
                    className={`tabs-content ${
                      activeTab === 1 ? "active" : ""
                    }`}
                    id="tab-1"
                  >
                    <div className="card p-l-r-30">
                      <div className="card-body order-tab-content p-0">
                        <div className="tab-content" id="OutlineContent">
                          <div className="card">
                            <div className="card-body order-tab-content p-0">
                              <div
                                aria-labelledby="connect-tab"
                                className="tab-pane fade active show"
                                id="connect-tab-pane"
                                role="tabpanel"
                                tabIndex={0}
                              >
                                {withdrawallist.some(
                                  (item) => item.status === "approved"
                                ) && (
                                  <span
                                    className="d-flex align-items-centre justify-content-end gap-3 m"
                                    style={{
                                      marginTop: "20px",
                                      marginBottom: "20px",
                                    }}
                                  >
                                    <button
                                      className="btn btn-primary icon-btn p-2"
                                      data-bs-target="#projectCard3"
                                      data-bs-toggle="modal"
                                    >
                                      {accountshow
                                        ? "Edit Details"
                                        : "Add Details"}
                                    </button>
                                  </span>
                                )}

                                <div className="app-datatable-default overflow-auto position-relative">
                                  <TableControls
                                    entries={withdrawalEntries}
                                    setEntries={(val) => {
                                      setWithdrawalEntries(val);
                                      setWithdrawalPage(1);
                                    }}
                                    search={withdrawalSearch}
                                    setSearch={(val) => {
                                      setWithdrawalSearch(val);
                                      setWithdrawalPage(1);
                                    }}
                                  />
                                  <table
                                    className="datatable display app-data-table default-data-table"
                                    id="activity-table"
                                  >
                                    <thead>
                                      <tr>
                                        <th className="text-center">#</th>
                                        <th className="text-center">
                                          Created At
                                        </th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {withdrawallist.length > 0 ? (
                                        withdrawallist.map((item, index) => (
                                          <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                              {
                                                new Date(item.created_at)
                                                  .toISOString()
                                                  .replace("T", " ")
                                                  .split(".")[0]
                                              }
                                            </td>
                                            <td>{item.amount}</td>
                                            <td>{item.method}</td>
                                            <td className="d-flex align-items-centre gap-3">
                                              <span
                                                className={`badge ${
                                                  item.status === "completed" ||
                                                  item.status === "approved"
                                                    ? "bg-success"
                                                    : item.status === "pending"
                                                    ? "bg-warning"
                                                    : "bg-danger"
                                                } text-white`}
                                              >
                                                {item.status
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  item.status.slice(1)}
                                              </span>
                                            </td>
                                          </tr>
                                        ))
                                      ) : (
                                        <tr>
                                          <td
                                            colSpan={4}
                                            className="text-center py-3"
                                          >
                                            No Withdrawl Request found
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>

                                  <PaginationControls
                                    currentPage={withdrawalPage}
                                    setCurrentPage={setWithdrawalPage}
                                    entries={withdrawalEntries}
                                    totalCount={filteredWithdrawals.length}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card p-l-r-30">
                    <div className="card-body order-tab-content p-0"></div>
                    <div className="card">
                      <div className="card-body order-tab-content p-0">
                        <div
                          aria-labelledby="connect-tab"
                          className="tab-pane fade active show"
                          id="connect-tab-pane"
                          role="tabpanel"
                          tabIndex={0}
                        >
                          <div className="app-datatable-default overflow-auto position-relative">
                            <ul>
                              <li>Sign up bonus is ${terms.signup_bonus}</li>
                              <li>
                                Spend Threshold Amount $
                                {terms.spend_threshold_amount}
                              </li>
                              <li>
                                Commission rate is {terms.commission_rate}%
                              </li>
                              <li>
                                Commission delay days is{" "}
                                {terms.commission_delay_days}
                              </li>
                              <li>
                                Bonus expiration days is{" "}
                                {terms.bonus_expiration_days} days
                              </li>
                              <li>
                                Withdraw threshold amount is $
                                {terms.withdraw_threshold_amount}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* modal 1 */}
        <div
          aria-hidden="true"
          aria-labelledby="projectCardLabel"
          className="modal fade"
          id="projectCard2"
          tabIndex={-1}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center gap-2">
                  <h1 className="modal-title fs-5" id="projectCardLabel">
                    Withdrawls
                  </h1>
                  {/* <iconify-icon icon="line-md:document-add" className="f-s-22" style={{ color: "#198754" }} /> */}
                </div>
                <button
                  aria-label="Close"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  type="button"
                />
              </div>
              <div className="modal-body">
                <form className="app-form" id="withdrawalForm" onSubmit={handleWithdrawl}>
                  <div className="mb-3">
                    <div className="input-group">
                      <span
                        className="input-group-text"
                        id="inputGroupPrepend2"
                      >
                        $
                      </span>
                      <input
                        aria-describedby="inputGroupPrepend2"
                        className="form-control"
                        id="validationDefaultUsername"
                        placeholder="Enter Amount"
                        required=""
                        type="text"
                        value={formData.amount}
                        onChange={handleChange}
                      />
                    </div>
                      <div className="text-danger d-none" id="errorMessage">
                        Please enter a valid amount
                      </div>
                    <div className="input-group">
                      {error && <div className="text-danger mt-2">{error}</div>}
                      {success && (
                        <div className="text-success mt-2">{success}</div>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      id="addCard"
                      type="button"
                      form="withdrawalForm"
                    >
                      Make Withdrawls
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* modal 2 */}
        {/* modal 2 */}
        {/* modal 2 */}
        <div
          aria-hidden="true"
          aria-labelledby="projectCardLabel"
          className="modal fade"
          id="projectCard3"
          tabIndex={-1}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="projectCardLabel">
                  {accountshow ? "Edit Details" : "Add Details"}
                </h1>
                <button
                  aria-label="Close"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  type="button"
                />
              </div>
              <div className="modal-body">
                <form
                  className="app-form"
                  method="post"
                  encType="multipart/form-data"
                >
                  {success && (
                    <div className="alert alert-success" role="alert">
                      {success}
                    </div>
                  )}
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  {/* Country */}
                  <div className="mb-3">
                    <select
                      name="country"
                      className="form-select"
                      value={accountFormData.country}
                      onChange={handleAccountChange}
                    >
                      <option value="">Choose Country</option>
                      {countries.map((country) => (
                        <option key={country.name} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {errorAccount && (
                      <div className="text-danger mt-2">
                        {errorAccount.country}
                      </div>
                    )}
                  </div>

                  {/* Account Number */}
                  <div className="mb-3">
                    <input
                      className="form-control"
                      placeholder="Account Number"
                      name="account_number"
                      type="number"
                      value={accountFormData.account_number}
                      onChange={handleAccountChange}
                      required
                    />
                    {errorAccount && (
                      <div className="text-danger mt-2">
                        {errorAccount.account_number}
                      </div>
                    )}
                  </div>

                  {/* Account Type */}
                  <div className="mb-3">
                    <select
                      className="form-control"
                      name="account_type"
                      value={accountFormData.account_type}
                      onChange={handleAccountChange}
                      required
                    >
                      <option value="">Select Account Type</option>
                      <option value={"checking"}>Checking</option>
                      <option value={"savings"}>Savings</option>
                      <option value={"current"}>Current</option>
                    </select>
                    {errorAccount && (
                      <div className="text-danger mt-2">
                        {errorAccount.account_type}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <input
                      className="form-control"
                      placeholder="Paypal Email"
                      name="paypal_email"
                      type="email"
                      value={accountFormData.paypal_email}
                      onChange={handleAccountChange}
                      required
                    />
                    {errorAccount && (
                      <div className="text-danger mt-2">
                        {errorAccount.paypal_email}
                      </div>
                    )}
                  </div>

                  {/* IFSC Code */}
                  <div className="mb-3">
                    <input
                      className="form-control"
                      placeholder="IFSC Code"
                      name="ifsc_code"
                      type="text"
                      value={accountFormData.ifsc_code}
                      onChange={handleAccountChange}
                      required
                    />
                    {errorAccount && (
                      <div className="text-danger mt-2">
                        {errorAccount.ifsc_code}
                      </div>
                    )}
                  </div>

                  {/* Swift Code */}
                  <div className="mb-3">
                    <input
                      className="form-control"
                      placeholder="Swift Code"
                      name="swift_code"
                      type="text"
                      value={accountFormData.swift_code}
                      onChange={handleAccountChange}
                    />
                    {errorAccount && (
                      <div className="text-danger mt-2">
                        {errorAccount.swift_code}
                      </div>
                    )}
                  </div>

                  {/* IBAN Number */}
                  <div className="mb-3">
                    <input
                      className="form-control"
                      placeholder="IBAN Number"
                      name="iban_number"
                      type="text"
                      value={accountFormData.iban_number}
                      onChange={handleAccountChange}
                      required
                    />
                    {errorAccount && (
                      <div className="text-danger mt-2">
                        {errorAccount.iban_number}
                      </div>
                    )}
                  </div>

                  {/* Document Type */}
                  <div className="mb-3">
                    <input
                      className="form-control"
                      placeholder="Document Type"
                      name="document_types"
                      type="text"
                      value={accountFormData.document_types.join(", ")} // ✅ Convert array to string
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          document_types: e.target.value
                            .split(",")
                            .map((d) => d.trim()), // ✅ Convert back to array
                        })
                      }
                      required
                    />

                    {errorAccount && (
                      <div className="text-danger mt-2">
                        {errorAccount.document_types}
                      </div>
                    )}
                  </div>

                  {/* Document Files (File input can't have value binding) */}
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="document_files"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      required={!accountshow}
                    />
                    {errorAccount && (
                      <div className="text-danger mt-2">
                        {errorAccount.document_files}
                      </div>
                    )}

                    {accountshow &&
                      accountdetails?.documents?.length > 0 && (
                        <div className="mt-2">
                          <label className="form-label">
                            Uploaded Documents
                          </label>
                          {accountdetails.documents.map((doc, index) => (
                            <div key={index}>
                              <strong>{doc.type}</strong>:{" "}
                              <a
                                href={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/${doc.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View File
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Document Values */}
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="document_values"
                      placeholder="Document Values (comma separated if multiple values)"
                      type="text"
                      value={accountFormData.document_values}
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          document_values: e.target.value
                            .split(",")
                            .map((d) => d.trim()),
                        })
                      }
                      required
                    />
                    {errorAccount && (
                      <div className="text-danger mt-2">
                        {errorAccount.document_values}
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleAccount}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
      ):(
      <div className="text-center py-5">
        <h4 className="text-danger">{error ? error : "Affiliate program is currently disabled for your account."}</h4>
        <p>For Activation Contact Support</p>
            <button 
              type="button" 
              className="btn btn-primary" 
              data-bs-toggle="modal" 
              data-bs-target="#ticketModal"
            >
              Request For Affiliate Program
            </button>
      </div>

      )}
      <div className="modal fade" id="ticketModal" tabIndex={-1}>
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      
      {/* Modal Header */}
      <div className="modal-header">
        <h1 className="modal-title fs-5">Create Support Ticket</h1>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>

      {/* Ticket Form */}
      <form
        className="row g-3 app-form rounded-control"
        id="form-validation"
        onSubmit={handleSupportSubmit}
      >
        <div className="modal-body">
          <div className="row">
          <div className="col-md-6">
            <label className="form-label" htmlFor="credentials">Credentials</label>
            <input
              className={`form-control ${supporterrors.credentials ? 'is-invalid' : ''}`}
              id="credentials"
              name="credentials"
              type="text"
              placeholder="Enter Server Details (IP, Password)"
              value={SupportData.credentials}
              onChange={(e) => setSupportData({ ...SupportData, credentials: e.target.value })}
              readOnly
            />
            {supporterrors.credentials && <span className="text-danger">{supporterrors.credentials}</span>}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="subject">Subject</label>
            <input
              className={`form-control ${supporterrors.subject ? 'is-invalid' : ''}`}
              id="subject"
              name="subject"
              type="text"
              placeholder="Enter Your Subject"
              value={SupportData.subject}
              onChange={(e) => setSupportData({ ...SupportData, subject: e.target.value })}
              readOnly
            />
            {supporterrors.subject && <span className="text-danger">{supporterrors.subject}</span>}
          </div>
         

          <div className="col-md-12">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              className={`form-control ${supporterrors.description ? 'is-invalid' : ''}`}
              id="description"
              placeholder="Describe Your Issue"
              value={SupportData.description}
              onChange={(e) => setSupportData({ ...SupportData, description: e.target.value })}
            />
            {supporterrors.description && <span className="text-danger">{supporterrors.description}</span>}
          </div>
           </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            form="form-validation"
          >
            Submit Ticket
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
    </>
    
  );    
}
export default Affiliate;
