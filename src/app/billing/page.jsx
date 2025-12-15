"use client";
import Link from "next/link";
import React, { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
const assets = "/assets";

function Billing() {

    const [activeTab, setActiveTab] = useState(1);

    // FOR custom amount
    const [showInput, setShowInput] = useState(false);
    const [customAmount, setCustomAmount] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setCustomAmount(value);
            if (parseFloat(value) >= 10) {
                setError("");
            }
        }
    };
    const handleBlur = () => {
        const amount = parseFloat(customAmount);

        if (isNaN(amount) || amount < 10) {
            setError("Minimum amount is $10.00");
        } else {
            setCustomAmount(amount.toFixed(2));
            setError("");
        }
    };
    // FOR custom amount end

    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);


    // c-s-c
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");

    // Fetch countries
    useEffect(() => {
        axios
            .get("https://countriesnow.space/api/v0.1/countries/positions")
            .then((res) => {
                const countryNames = res.data.data.map((c) => c.name);
                setCountries(countryNames);
            });
    }, []);

    // Fetch states when country changes
    useEffect(() => {
        if (!selectedCountry) return;

        axios
            .post("https://countriesnow.space/api/v0.1/countries/states", {
                country: selectedCountry,
            })
            .then((res) => {
                const stateNames = res.data.data.states.map((s) => s.name);
                setStates(stateNames);
                setCities([]);
                setSelectedState("");
            });
    }, [selectedCountry]);

    // Fetch cities when state changes
    useEffect(() => {
        if (!selectedCountry || !selectedState) return;

        axios
            .post("https://countriesnow.space/api/v0.1/countries/state/cities", {
                country: selectedCountry,
                state: selectedState,
            })
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

    // to load datatable
    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //       const tables = $(".datatable").map(function () {
    //         return $(this).DataTable();
    //       });
      
    //       return () => {
    //         tables.each(function () {
    //           this.destroy();
    //         });
    //       };
    //     }
    // }, []);

    return (
        <Fragment>

            <div className="position-relative">
                {/* Overlay loader */}
                {isLoading && (
                    <div
                        className="d-flex justify-content-center align-items-center position-absolute start-0 w-100 h-100"
                        style={{
                            background: 'var(--bodybg-color)',
                            zIndex: 1000,
                        }}
                    >
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                <main className={`page-content ${isLoading ? 'pointer-events-none' : ''}`} style={{ opacity: isLoading ? 0.5 : 1 }}>
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
                                                <i className="ph-bold  ph-circle circle-bg-img" />
                                                <div className="d-flex align-items-center justify-content-between pt-4 pb-4">
                                                    <div className="h-50 w-50 d-flex-center b-r-15 " style={{ backgroundColor: "#fff" }}>
                                                        <i className="ph-bold  ph-ticket f-s-25 text-primary " />
                                                        {/* <Image alt="balance" src={`${assets}/images/New/balance.png`}  width={50} height={50} /> */}
                                                    </div>
                                                    <div className="d-flex flex-column justify-content-between align-items-center">
                                                        <h5 className="f-s-16">Balance</h5>
                                                        <h3 className="text-primary-dark mb-0">$0.00</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-12">
                                        <div className="card ticket-card bg-light-info">
                                            <div className="card-body">
                                                <i className="ph-bold  ph-circle circle-bg-img" />
                                                <div className="d-flex align-items-center justify-content-between pt-2 pb-2">
                                                    <div className="h-50 w-50 d-flex-center b-r-15 mb-3" style={{ backgroundColor: "#fff" }}>
                                                        <i className="ph-bold  ph-clock-countdown f-s-25 text-info" />
                                                    </div>

                                                    <div className="d-flex flex-column justify-content-between align-items-center">
                                                        <h5 className="f-s-16">Paid</h5>
                                                        <h3 className="text-info-dark">$0.00</h3>
                                                        <p>0 invoices</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-12">
                                        <div className="card ticket-card bg-light-success">
                                            <div className="card-body">
                                                <i className="ph-bold  ph-circle circle-bg-img" />
                                                <div className="d-flex align-items-center justify-content-between pt-2 pb-2">
                                                    <div className="h-50 w-50 d-flex-center b-r-15 mb-3" style={{ backgroundColor: "#fff" }}>
                                                        <i className="ph-bold  ph-file-cloud f-s-25 text-success" />
                                                    </div>

                                                    <div className="d-flex flex-column justify-content-between align-items-center">
                                                        <h5 className="f-s-16">Unpaid</h5>
                                                        <h3 className="text-success-dark">$0.00</h3>
                                                        <p>0 invoices</p>
                                                    </div>
                                                </div>
                                            </div>  
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-12">
                                        <div className="card ticket-card bg-light-warning">
                                            <div className="card-body">
                                                <i className="ph-bold  ph-circle circle-bg-img" />
                                                <div className="d-flex align-items-center justify-content-between pt-2 pb-2">
                                                    <div className="h-50 w-50 d-flex-center b-r-15 mb-3" style={{ backgroundColor: "#fff" }}>
                                                        <i className="ph-bold  ph-file-x f-s-25 text-warning" />
                                                    </div>

                                                    <div className="d-flex flex-column justify-content-between align-items-center">
                                                        <h5 className="f-s-16">Overdue</h5>
                                                        <h3 className="text-warning-dark">$0.00</h3>
                                                        <p>0 invoices</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">

                                <div className="tab-wrapper mb-3">
                                    <ul className="tabs overflow-auto">
                                        <li className={`tab-link ${activeTab === 1 ? "active" : ""}`} onClick={() => setActiveTab(1)}>
                                            <i className="ph-bold  ph-list-magnifying-glass f-s-18" /> Invoice
                                        </li>
                                        <li className={`tab-link ${activeTab === 2 ? "active" : ""}`} onClick={() => setActiveTab(2)}>
                                            <i className="ph-fill  ph-money f-s-18" /> Top Up
                                        </li>
                                        <li className={`tab-link ${activeTab === 3 ? "active" : ""}`} onClick={() => setActiveTab(3)}>
                                            <i className="ph ph-archive-tray f-s-18" /> Payment Details
                                        </li>
                                    </ul>
                                </div>

                                <div className="content-wrapper" id="card-container">
                                    <div className={`tabs-content ${activeTab === 1 ? "active" : ""}`} id="tab-1">
                                        <div className="card p-l-r-30">
                                            <div className="card-header">
                                                <ul className="nav nav-tabs app-tabs-primary order-tabs d-flex justify-content-start border-0 mb-0 pb-0" id="Outline" role="tablist">
                                                    <li className="nav-item" role="presentation">
                                                        <button aria-controls="connect-tab-pane" aria-selected="true" className="nav-link active d-flex align-items-center gap-1" data-bs-target="#connect-tab-pane" data-bs-toggle="tab" id="connect-tab" role="tab" type="button"> All
                                                        </button>
                                                    </li>
                                                    <li className="nav-item" role="presentation">
                                                        <button aria-controls="discover-tab-pane" aria-selected="false" className="nav-link d-flex align-items-center gap-1" data-bs-target="#discover-tab-pane" data-bs-toggle="tab" id="discover-tab" role="tab" tabIndex={-1} type="button">
                                                            Paid
                                                        </button>
                                                    </li>
                                                    <li className="nav-item" role="presentation">
                                                        <button aria-controls="order-tab-pane" aria-selected="false" className="nav-link d-flex align-items-center gap-1" data-bs-target="#order-tab-pane" data-bs-toggle="tab" id="order-tab" role="tab" tabIndex={-1} type="button">
                                                            Unpaid
                                                        </button>
                                                    </li>
                                                    <li className="nav-item" role="presentation">
                                                        <button aria-controls="order-tab-returns" aria-selected="false" className="nav-link d-flex align-items-center gap-1" data-bs-target="#order-tab-returns" data-bs-toggle="tab" id="order-tabs" role="tab" tabIndex={-1} type="button">
                                                            Overdue
                                                        </button>
                                                    </li>
                                                    <li className="nav-item" role="presentation">
                                                        <button aria-controls="order-tab-cancelled" aria-selected="false" className="nav-link d-flex align-items-center gap-1" data-bs-target="#order-tab-cancelled" data-bs-toggle="tab" id="ordertab" role="tab" tabIndex={-1} type="button">
                                                            Cancelled
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="card-body order-tab-content p-0">
                                                <div className="tab-content" id="OutlineContent">
                                                    <div aria-labelledby="connect-tab" className="tab-pane fade active show" id="connect-tab-pane" role="tabpanel" tabIndex={0}>
                                                        <div className="app-datatable-default overflow-auto position-relative">
                                                            <table className="datatable display app-data-table default-data-table" id="example2">
                                                                <thead>
                                                                    <tr>
                                                                        <th>ID</th>
                                                                        <th>Issued Date</th>
                                                                        <th>Due Date</th>
                                                                        <th>Amount</th>
                                                                        <th>Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody></tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    {/* tab-2 */}
                                                    <div aria-labelledby="discover-tab" className="tab-pane fade" id="discover-tab-pane" role="tabpanel" tabIndex={0}>
                                                        <div className="app-datatable-default overflow-auto position-relative">
                                                            <table className="datatable display app-data-table default-data-table" id="example0">
                                                                <thead>
                                                                    <tr>
                                                                        <th>ID</th>
                                                                        <th>Issued Date</th>
                                                                        <th>Due Date</th>
                                                                        <th>Amount</th>
                                                                        <th>Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody></tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    {/* tab-3 */}
                                                    <div aria-labelledby="order-tab" className="tab-pane fade" id="order-tab-pane" role="tabpanel" tabIndex={0}>
                                                        <div className="app-datatable-default overflow-auto position-relative">
                                                            <table className="datatable display app-data-table default-data-table" id="example01">
                                                                <thead>
                                                                    <tr>
                                                                        <th>ID</th>
                                                                        <th>Issued Date</th>
                                                                        <th>Due Date</th>
                                                                        <th>Amount</th>
                                                                        <th>Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody></tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    {/* tab-4 */}
                                                    <div aria-labelledby="order-tab" className="tab-pane fade" id="order-tab-returns" role="tabpanel" tabIndex={0}>
                                                        <div className="app-datatable-default overflow-auto position-relative">
                                                            <table className="datatable display app-data-table default-data-table" id="example02">
                                                                <thead>
                                                                    <tr>
                                                                        <th>ID</th>
                                                                        <th>Issued Date</th>
                                                                        <th>Due Date</th>
                                                                        <th>Amount</th>
                                                                        <th>Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody></tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    {/* tab-5 */}
                                                    <div aria-labelledby="order-tab" className="tab-pane fade" id="order-tab-cancelled" role="tabpanel" tabIndex={0}>
                                                        <div className="app-datatable-default overflow-auto position-relative">
                                                            <table className="datatable display app-data-table default-data-table" id="example03">
                                                                <thead>
                                                                    <tr>
                                                                        <th>ID</th>
                                                                        <th>Issued Date</th>
                                                                        <th>Due Date</th>
                                                                        <th>Amount</th>
                                                                        <th>Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody></tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`tabs-content ${activeTab === 2 ? "active" : ""}`} id="tab-2">
                                        <div className="row cart-table">
                                            <div className="col-xl-8 col-lg-12 col-md-12">
                                                <div className="card">
                                                    <div className="card-body p-0">
                                                        <div className="row">
                                                            <div className="col-lg-12">
                                                                <div className="card security-card-content">
                                                                    <div className="card-header">
                                                                        <h5>Payment Method</h5>
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <div className="row">
                                                                            <div className="col-lg-12 col-xxl-4">
                                                                                <ul className="active-device-session active-device-list" id="shareMenuLeft">
                                                                                    <li>
                                                                                        <div className="card share-menu-active">
                                                                                            <div className="card-body">
                                                                                                <div className="device-menu-item device-menu-item-new" draggable="false">
                                                                                                    <span className="device-menu-img device-menu-img-new h-60">
                                                                                                        <Image alt="Windows" className="img-fluid" src={`${assets}/images/new/cryptomus.png`}  width={200} height={100} />
                                                                                                    </span>
                                                                                                    <div className="device-menu-content device-menu-content-new" >
                                                                                                        <h6 className="mb-0 txt-ellipsis-1">Cryptomus</h6>
                                                                                                        <p className="mb-0 txt-ellipsis-1 text-secondary">Crypto payment with Cryptomus</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </li>      
                                                                                </ul> 
                                                                            </div> 
                                                                            <div className="col-lg-12 col-xxl-4"> 
                                                                                <ul className="active-device-session  active-device-list" id="shareMenuRight">
                                                                                    <li>
                                                                                        <div className="card">
                                                                                            <div className="card-body">
                                                                                                <div className="device-menu-item device-menu-item-new" draggable="false">
                                                                                                    <span className="device-menu-img device-menu-img-new h-60">
                                                                                                        <Image alt="Windows" className="img-fluid" src={`${assets}/images/new/paypal.png`} width={200} height={80} />
                                                                                                    </span>
                                                                                                    <div className="device-menu-content device-menu-content-new" >
                                                                                                        <h6 className="mb-0 txt-ellipsis-1">PayPal</h6>
                                                                                                        <p className="mb-0 txt-ellipsis-1 text-secondary">Secure checkout with PayPal</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                            <div className="col-lg-12 col-xxl-4">
                                                                                <ul className="active-device-session  active-device-list" id="shareMenuRight">
                                                                                    <li>
                                                                                        <div className="card">
                                                                                            <div className="card-body">
                                                                                                <div className="device-menu-item device-menu-item-new" draggable="false">
                                                                                                    <span className="device-menu-img device-menu-img-new h-60">
                                                                                                        <Image alt="Windows" className="img-fluid" src="/assets/images/new/Stripe_logo.png" width={200} height={60} />
                                                                                                    </span>
                                                                                                    <div className="device-menu-content device-menu-content-new" >
                                                                                                        <h6 className="mb-0 txt-ellipsis-1">Stripe</h6>
                                                                                                        <p className="mb-0 txt-ellipsis-1 text-secondary">Secure checkout with Stripe</p>
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

                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Amount</h5>
                                                    </div>
                                                    <div className="row card-body">
                                                        <div className="col-4 m-10-0">
                                                            <div className="card-body card-body-style">
                                                                <div className="text-center pt-2 pb-2">
                                                                    <h6 className="mb-0">$10.00</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 m-10-0">
                                                            <div className="card-body card-body-style">
                                                                <div className="text-center pt-2 pb-2">
                                                                    <h6 className="mb-0">$20.00</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 m-10-0">
                                                            <div className="card-body card-body-style">
                                                                <div className="text-center pt-2 pb-2">
                                                                    <h6 className="mb-0">$30.00</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 m-10-0">
                                                            <div className="card-body card-body-style">
                                                                <div className="text-center pt-2 pb-2">
                                                                    <h6 className="mb-0">$50.00</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 m-10-0">
                                                            <div className="card-body card-body-style">
                                                                <div className="text-center pt-2 pb-2">
                                                                    <h6 className="mb-0">$100.00</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 m-10-0">
                                                            <div className="card-body card-body-style">
                                                                <div className="text-center pt-2 pb-2">
                                                                    <h6 className="mb-0 cursor-pointer " onClick={() => setShowInput(true)}>
                                                                        Enter Custom amount
                                                                    </h6>
                                                                    {showInput && (
                                                                        <div className="mt-2">
                                                                            <input
                                                                                type="text"
                                                                                className={`form-control mx-auto ${error ? "is-invalid" : ""}`}
                                                                                placeholder="Enter amount (min $10.00)"
                                                                                value={customAmount}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            {error && <div className="invalid-feedback d-block">{error}</div>}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="col-xl-4 col-lg-12 col-md-12" >
                                                <div className="row">
                                                    <div className="col-12" id="summaryCard">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <h4>Recharge</h4>
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="table-responsive ps-3">
                                                                    <table className="table cart-side-table mb-0">
                                                                        <tbody>
                                                                            <tr className="total-price">
                                                                                <th> Total</th>
                                                                                <th className="text-end">
                                                                                    <span id="cart-sub">
                                                                                        $100.00
                                                                                    </span>
                                                                                </th>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <div className="alert alert-light-border-primary d-flex align-items-center justify-content-between" role="alert">
                                                                        <p className="mb-0 d-flex align-items-center">
                                                                            <iconify-icon icon="line-md:alert-circle-loop" className="f-s-25 me-2"></iconify-icon>
                                                                            Recharge is not refundable
                                                                        </p>
                                                                        <i className="ti ti-x" data-bs-dismiss="alert" />
                                                                    </div>
                                                                    <div className="cart-gift text-end mt-4">
                                                                        <button className="btn btn-primary rounded">Pay Now</button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                    <div className={`tabs-content ${activeTab === 3 ? "active" : ""}`} id="tab-3">
                                        <div className="row cart-table">
                                            <div className="col-xl-12 col-lg-12 col-md-12">
                                                <div className="card">
                                                    <div className="card-body p-0">
                                                        <div className="row">
                                                            <div className="col-lg-12">
                                                                <div className="card security-card-content">
                                                                    <div className="card-header d-flex justify-content-between">
                                                                        <h5>Payment Methods</h5>
                                                                        <div className="dropdown dropdown-light b-r-15">
                                                                            <button aria-expanded="false" className="btn btn-primary h-45 icon-btn mb-3 dropdown-toggle" data-bs-toggle="dropdown" type="button">
                                                                                <i className="ph ph-plus f-s-18" /> Add Payment Method
                                                                            </button>
                                                                            <ul className="dropdown-menu">
                                                                                <li>
                                                                                    <button className="dropdown-item d-flex align-items-center" type="button"><i className="ph-fill  ph-paypal-logo f-s-20 me-2" /> Paypal</button>
                                                                                </li>
                                                                                <li>
                                                                                    <button className="dropdown-item d-flex align-items-center" type="button"><i className="ph-fill  ph-credit-card f-s-20 me-2" /> Credit Card</button>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <div className="d-flex align-items-center justify-content-between">
                                                                            <div style={{ padding: "5px 15px" }}>
                                                                                <h6 className="text-secondary-dark mb-0">Manage your saved payment methods for seamless auto-renewals</h6>
                                                                                <div className="alert alert-light-border-primary d-flex align-items-center justify-content-between mt-3" role="alert">
                                                                                    <p className="mb-0 d-flex align-items-center">
                                                                                        <iconify-icon icon="line-md:alert-circle-loop" className="f-s-20 me-2"></iconify-icon>
                                                                                        Add your payment details to enable automatic payments for invoices and service charges
                                                                                    </p>
                                                                                    <i className="ti ti-x ms-3" data-bs-dismiss="alert" />
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card setting-profile-tab">
                                                    <div className="card-body">
                                                        <div className="profile-tab profile-container">
                                                            <form className="app-form">
                                                                <h5 className="mb-2 text-dark f-w-600">Billing Information</h5>
                                                                <div className="row">

                                                                    <div className="col-md-6">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">Team Name</label>
                                                                            <input className="form-control" placeholder="Person team" type="text" required />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">Company</label>
                                                                            <input className="form-control" placeholder="Eck" type="Company" required />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">Address</label>
                                                                            <textarea className="form-control" placeholder="1098 Asylum Avenu New Haven, CT 06510" defaultValue={""} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">Tax Number</label>
                                                                            <input className="form-control" placeholder="test" type="text" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6 mb-3">
                                                                        <label className="form-label" htmlFor="inputCountry">Country</label>
                                                                        <select id="inputCountry" className="form-select" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                                                                            <option value="">Choose Country</option>
                                                                            {countries.map((country) => (
                                                                                <option key={country}>{country}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>

                                                                    <div className="col-md-6 mb-3">
                                                                        <label className="form-label" htmlFor="inputState">State</label>
                                                                        <select id="inputState" className="form-select" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}
                                                                            disabled={!selectedCountry}>
                                                                            <option value="">Choose State</option>
                                                                            {states.map((state) => (
                                                                                <option key={state}>{state}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>

                                                                    <div className="col-md-6 mb-3">
                                                                        <label className="form-label" htmlFor="inputCity">City</label>
                                                                        <select id="inputCity" className="form-select" disabled={!selectedState}>
                                                                            <option value="">Choose City</option>
                                                                            {cities.map((city) => (
                                                                                <option key={city}>{city}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" htmlFor="inputZip">Zip/Pin Code</label>
                                                                            <input className="form-control" id="inputZip" placeholder="CT 06510" type="text" />
                                                                        </div>
                                                                    </div>


                                                                    <div className="col-12">
                                                                        <div className="text-end">
                                                                            <button className="btn text-dark border me-3" type="reset">Cancel</button>
                                                                            <button className="btn btn-primary" type="submit">Submit</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </form>
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
            </div>

        </Fragment>
    );
}
export default Billing;
