"use client";
import React, { Fragment, useState, useEffect } from "react";

function Create() {
    // auto load
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 900);
        return () => clearTimeout(timer);
    }, []);


    return (
        <Fragment>
            <div className="position-relative">
                {/* Overlay loader */}
                {isLoading && (
                    <div
                        className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
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
                <main className={`page-content  ${isLoading ? 'pointer-events-none' : ''}`} style={{ opacity: isLoading ? 0.5 : 1 }}>
                    <div className="container-fluid">
                        {/* Breadcrumb start */}
                        <div className="row m-1">
                            <div className="col-12 d-flex justify-content-between">
                                <h4 className="main-title">Design your own dashbaord  </h4>

                            </div>
                            <p>Select what you would like to keep in your dashboard </p>
                        </div>
                        {/* Breadcrumb end */}

                        {/* Projects start */}
                        <div className="row cart-table">
                            <div className="col-xl-12 col-lg-12 col-md-12">
                                <div className="card">
                                    <div className="card-body p-0">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Add Name </h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="form-selectgroup">
                                                            <div className="row">
                                                                <div className="col-lg-12 col-sm-6 col-xxl-4">
                                                                    <form className="app-form">
                                                                        <div className="mb-3">
                                                                            <div className="input-group">
                                                                                <input aria-describedby="inputGroupPrepend2" className="form-control" id="validationDefaultUsername" placeholder="Enter Name" required="" type="text" />
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
                                <div className="card">
                                    <div className="card-body p-0">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Activity</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="form-selectgroup">
                                                            <div className="row">
                                                                <div className="col-md-4 col-sm-6 col-xxl-4">
                                                                    <div className="select-item d-flex gap-2">
                                                                        <input className="form-check-input" id="inlineCheckbox1" type="checkbox" defaultValue="option1" />
                                                                        <label className="form-check-label" htmlFor="inlineCheckbox1">
                                                                            <span className="d-flex align-items-center">
                                                                                <span className="ms-2">
                                                                                    <span className="fs-6">Active Servers</span>
                                                                                </span>
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4 col-sm-6 col-xxl-4">
                                                                    <div className="select-item d-flex gap-2">
                                                                        <input className="form-check-input" id="inlineCheckbox2" type="checkbox" defaultValue="option2" />
                                                                        <label className="form-check-label" htmlFor="inlineCheckbox2">
                                                                            <span className="d-flex align-items-center">
                                                                                <span className="ms-2">
                                                                                    <span className="fs-6">Available Balance</span>
                                                                                </span>
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4 col-sm-6 col-xxl-4">
                                                                    <div className="select-item d-flex gap-2">
                                                                        <input className="form-check-input" id="inlineCheckbox3" type="checkbox" defaultValue="option3" />
                                                                        <label className="form-check-label" htmlFor="inlineCheckbox3">
                                                                            <span className="d-flex align-items-center">
                                                                                <span className="ms-2">
                                                                                    <span className="fs-6">Available Balance</span>
                                                                                </span>
                                                                            </span>
                                                                        </label>
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

                                <div className="card">
                                    <div className="card-body p-0">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Chart</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="form-selectgroup">
                                                            <div className="row">
                                                                <div className="col-md-4 col-sm-6 col-xxl-4">
                                                                    <div className="select-item d-flex gap-2">
                                                                        <input className="form-check-input" id="inlineCheckbox7" type="checkbox" defaultValue="option7" />
                                                                        <label className="form-check-label" htmlFor="inlineCheckbox7">
                                                                            <span className="d-flex align-items-center">
                                                                                <span className="ms-2">
                                                                                    <span className="fs-6">Charts</span>
                                                                                </span>
                                                                            </span>
                                                                        </label>
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

                                <div className="card">
                                    <div className="card-body p-0">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>All link</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="form-selectgroup">
                                                            <div className="row">
                                                                <div className="col-md-4 col-sm-6 col-xxl-4">
                                                                    <div className="select-item d-flex gap-2">
                                                                        <input className="form-check-input" id="inlineCheckbox4" type="checkbox" defaultValue="option4" />
                                                                        <label className="form-check-label" htmlFor="inlineCheckbox4">
                                                                            <span className="d-flex align-items-center">
                                                                                <span className="ms-2">
                                                                                    <span className="fs-6">Promo Codes</span>
                                                                                </span>
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4 col-sm-6 col-xxl-4">
                                                                    <div className="select-item d-flex gap-2">
                                                                        <input className="form-check-input" id="inlineCheckbox5" type="checkbox" defaultValue="option5" />
                                                                        <label className="form-check-label" htmlFor="inlineCheckbox5">
                                                                            <span className="d-flex align-items-center">
                                                                                <span className="ms-2">
                                                                                    <span className="fs-6">Plans Link</span>
                                                                                </span>
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4 col-sm-6 col-xxl-4">
                                                                    <div className="select-item d-flex gap-2">
                                                                        <input className="form-check-input" id="inlineCheckbox6" type="checkbox" defaultValue="option6" />
                                                                        <label className="form-check-label" htmlFor="inlineCheckbox6">
                                                                            <span className="d-flex align-items-center">
                                                                                <span className="ms-2">
                                                                                    <span className="fs-6">Flash Offers</span>
                                                                                </span>
                                                                            </span>
                                                                        </label>
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

                                <div className="card">
                                    <div className="card-body p-0">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Your Active services</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="form-selectgroup">
                                                            <div className="row">
                                                                <div className="col-md-4 col-sm-6 col-xxl-4">
                                                                    <div className="select-item d-flex gap-2">
                                                                        <input className="form-check-input" id="inlineCheckbox8" type="checkbox" defaultValue="option8" />
                                                                        <label className="form-check-label" htmlFor="inlineCheckbox8">
                                                                            <span className="d-flex align-items-center">
                                                                                <span className="ms-2">
                                                                                    <span className="fs-6">Active services</span>
                                                                                </span>
                                                                            </span>
                                                                        </label>
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

                                <div className="card">
                                    <div className="card-body p-0">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Your Pending invoices & support tickets</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="form-selectgroup">
                                                            <div className="row">
                                                                <div className="col-lg-12 col-xxl-4">
                                                                    <div className="select-item d-flex gap-2">
                                                                        <input className="form-check-input" id="inlineCheckbox9" type="checkbox" defaultValue="option9" />
                                                                        <label className="form-check-label" htmlFor="inlineCheckbox9">
                                                                            <span className="d-flex align-items-center">
                                                                                <span className="ms-2">
                                                                                    <span className="fs-6">Pending invoices & support tickets</span>
                                                                                </span>
                                                                            </span>
                                                                        </label>
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

                                <div className="card">
                                    <div className="card-body p-0">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>News & Updates, Maintenance</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="form-selectgroup">
                                                            <div className="row">
                                                                <div className="col-lg-12 col-xxl-4">
                                                                    <div className="select-item d-flex gap-2">
                                                                        <input className="form-check-input" id="inlineCheckbox10" type="checkbox" defaultValue="option10" />
                                                                        <label className="form-check-label" htmlFor="inlineCheckbox10">
                                                                            <span className="d-flex align-items-center">
                                                                                <span className="ms-2">
                                                                                    <span className="fs-6">News & Updates, Maintenance</span>
                                                                                </span>
                                                                            </span>
                                                                        </label>
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

                                <div className="col-12">
                                    <div className="text-start">
                                        <button className="btn btn-primary" type="submit">Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Projects end */}


                    </div>
                </main>
            </div>
        </Fragment>
    );
}
export default Create;
