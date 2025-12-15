"use client";
import Link from "next/link";
import React, { Fragment, useState, useEffect, Suspense } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import FinanceSearchHandler from "./FinanceSearchHandler";

function Finance() {
  const [wallet, setWallet] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({ amount: "" });
  const [paymentMethod, setPaymentMethod] = useState("stripe"); // default to stripe
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadValidation = async () => {
      const $ = (await import("jquery")).default;
      await import("jquery-validation");

      const modal = document.getElementById("projectCard1");
      if (modal) {
        modal.addEventListener("shown.bs.modal", () => {
          $("#topupForm").validate({
            rules: {
              amount: { required: true, number: true, min: 10 },
            },
            messages: {
              amount: {
                required: "Please enter an amount",
                number: "Only numbers are allowed",
                min: "Amount must be greater than $10",
              },
            },
            errorPlacement: function (error, element) {
              if (element.attr("name") === "amount") {
                $("#amountError").removeClass("d-none").text(error.text());
              } else {
                error.insertAfter(element);
              }
            },
            highlight: function (element) {
              $(element).addClass("is-invalid");
              if ($(element).attr("name") === "amount") {
                $("#amountError").removeClass("d-none");
              }
            },
            unhighlight: function (element) {
              $(element).removeClass("is-invalid");
              if ($(element).attr("name") === "amount") {
                $("#amountError").addClass("d-none");
              }
            },
          });
        });
      }

      const redeemModal = document.getElementById("projectCard2");
      if (redeemModal) {
        redeemModal.addEventListener("shown.bs.modal", () => {
          $("#redeemForm").validate({
            rules: { giftCode: { required: true, minlength: 5 } },
            messages: {
              giftCode: {
                required: "Please enter your gift code.",
                minlength: "Gift code must be at least 5 characters.",
              },
            },
            errorElement: "div",
            errorClass: "text-danger mt-1",
            highlight: function (element) {
              $(element).addClass("is-invalid");
            },
            unhighlight: function (element) {
              $(element).removeClass("is-invalid");
            },
          });
        });
      }
    };
    loadValidation();
  }, []);

  // fetch wallet
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      const Wallet = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wallet-balance`,
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
          setWallet(data.balance);
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
        } finally {
          setIsLoading(false);
        }
      };
      Wallet();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, amount: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
     setError("");
  setSuccess("");
    if (paymentMethod !== "stripe") {
      setError("Please select a payment method.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/stripe-create-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify({ amount: formData.amount }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setSuccess("Redirecting to Stripe...");
        if (result.redirect_url) {
          window.location.href = result.redirect_url;
        }
      } else {
        const errorMsg = result?.message || "Payment failed.";

        Swal.fire("Failed!", errorMsg, "error").then(() => {
          if (
            typeof errorMsg === "string" &&
            errorMsg.toLowerCase().includes("no billing address")
          ) {
            window.location.href = "/account";
          }
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!$("#redeemForm").valid()) return;

    const code = $("#giftCode").val()?.trim();
    if (!code) {
      setError("Gift code is required.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/redeem-gift-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify({ code }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setSuccess("Gift code redeemed successfully!");
        $("#redeemForm")[0].reset();
      } else {
        setError(result.message || "Failed to redeem code.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Fragment>
      {/* Suspense for search param handler */}
      <Suspense fallback={null}>
        <FinanceSearchHandler />
      </Suspense>

      <div className="position-relative">
        {isLoading && (
          <div
            className="d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100"
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
            {/* Breadcrumb */}
            <div className="row m-1">
              <div className="col-12 ">
                <h4 className="main-title">Balance</h4>
              </div>
            </div>

            {/* Wallet UI */}
            <div className="row">
              <div className="col-12">
                <div className="content-wrapper" id="card-container">
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="card security-card-content">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-lg-12 col-xxl-6">
                                  <ul
                                    className="active-device-session active-device-list"
                                    id="shareMenuLeft"
                                  >
                                    <li>
                                      <div className="card share-menu-active">
                                        <div className="card-body merge-title gap-5">
                                          <div className="device-menu-item">
                                            <span className="device-menu-img">
                                              <i className="iconoir-card-wallet f-s-40 text-primary" />
                                            </span>
                                            <div className="device-menu-content">
                                              <h1 className="mb-0 txt-ellipsis-1">
                                                ${wallet}
                                              </h1>
                                              <h6 className="mb-0 txt-ellipsis-1 text-white">
                                                Available Balance
                                              </h6>
                                            </div>
                                          </div>
                                          <div>
                                            <div className="text-end">
                                              <button
                                                className="btn text-dark-11 h-45 icon-btn m-2"
                                                data-bs-target="#projectCard1"
                                                data-bs-toggle="modal"
                                              >
                                                <i className="ti ti-plus f-s-18" /> Top Up
                                              </button>
                                            </div>
                                            <div className="text-end">
                                              <button
                                                className="btn btn-primary h-45 icon-btn m-2"
                                                data-bs-target="#projectCard2"
                                                data-bs-toggle="modal"
                                              >
                                                <i className="iconoir-gift f-s-18" /> Redeem Gift Code
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
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
              </div>
            </div>
          </div>
        </main>

        {/* Modal 1 - Top Up */}
        <div className="modal fade" id="projectCard1" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">Top Up Balance</h1>
                <button
                  aria-label="Close"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  type="button"
                />
              </div>
              <form
                className="app-form"
                id="topupForm"
                onSubmit={handlePayment}
                method="post"
              >
                <div className="modal-body">
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        name="amount"
                        type="number"
                        className="form-control"
                        placeholder="0"
                        required
                        value={formData.amount}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-text">Minimum amount is $10.00</div>
                    <div className="text-danger d-none" id="amountError">
                      Please enter a valid amount.
                    </div>
                  </div>

                  <div className="form-selectgroup">
                    <div className="select-item">
                      <label className="form-check-label ms-5" htmlFor="inlineRadio1">
                        <span className="d-flex align-items-center">
                          <img alt="" className="w-30 h-30" src="../assets/images/checkbox-radio/logo1.png" />
                          <span className="ms-2">Stripe</span>
                        </span>
                      </label>
                      <input
                        className="form-check-input"
                        id="inlineRadio1"
                        name="inlineRadioOptions"
                        type="radio"
                        value="stripe"

                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                    </div>
                  </div>

                  {error && <p className="text-danger mt-2">{error}</p>}
                  {success && <p className="text-success mt-2">{success}</p>}
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" data-bs-dismiss="modal" type="button">
                    Cancel
                  </button>
                  <button className="btn btn-primary" type="submit" form="topupForm">
                    Make Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Modal 2 - Redeem Gift Code */}
        <div className="modal fade" id="projectCard2" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">Redeem Gift Code</h1>
                <button
                  aria-label="Close"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  type="button"
                />
              </div>
              <div className="modal-body">
                <form className="app-form" id="redeemForm" onSubmit={handleRedeem}>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="iconoir-gift f-s-18" />
                      </span>
                      <input
                        className="form-control"
                        id="giftCode"
                        placeholder="Enter Gift Code"
                        required
                        type="text"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal" type="button">
                  Cancel
                </button>
                <button className="btn btn-primary" id="addCard" type="submit" form="redeemForm">
                  Redeem
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Finance;
