"use client";
import React, { Fragment, useState, useEffect } from "react";


function Support() {



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
                        <div className="row pt-3 m-1">
                            <div className="col-12 ">
                                <ul className="app-line-breadcrumbs mb-3">
                                    <li className>
                                        <a className="f-s-14 f-w-500" href="/support">
                                            <span>
                                                <i className="ph-duotone  ph-stack f-s-16" /> Support
                                            </span>
                                        </a>
                                    </li>
                                    <li className="active">
                                        <a className="f-s-14 f-w-500" href="#">Chat</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* Breadcrumb end */}
                        {/* Chat start */}
                        <div className="row position-relative chat-container-box">
                            <div className="col-lg-4 col-xxl-3  box-col-5">
                                <div className="chat-div">
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="d-flex align-items-center">
                                                <span className="chatdp h-45 w-45 d-flex-center b-r-50 position-relative bg-danger">
                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/9.png" />
                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                </span>
                                                <div className="flex-grow-1 ps-2">
                                                    <div className="fs-6"> Ninfa Monaldo</div>
                                                    <div className="text-muted f-s-12">Web Developer</div>
                                                </div>
                                                <div>
                                                    <div className="btn-group dropdown-icon-none">
                                                        <a aria-expanded="false" data-bs-auto-close="true" data-bs-placement="top" data-bs-toggle="dropdown" role="button">
                                                            <i className="ti ti-settings fs-5" />
                                                        </a>
                                                        <ul className="dropdown-menu" data-popper-placement="bottom-start">
                                                            <li><a className="dropdown-item" href="#"><i className="ti ti-brand-hipchat" /> <span className="f-s-13">Chat Settings</span></a>
                                                            </li>
                                                            <li><a className="dropdown-item" href="#"><i className="ti ti-phone-call" /> <span className="f-s-13">Contact Settings</span></a>
                                                            </li>
                                                            <li><a className="dropdown-item" href="#"><i className="ti ti-settings" /> <span className="f-s-13">Settings</span></a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="close-togglebtn">
                                                    <a className="ms-2 close-toggle" role="button"><i className="ti ti-align-justified fs-5" /></a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="chat-tab-wrapper">
                                                <ul className="tabs chat-tabs">
                                                    <li className="tab-link active" data-tab={1}><i className="ph-fill  ph-chat-circle-text f-s-18 me-2" />Chat
                                                    </li>
                                                    <li className="tab-link" data-tab={2}><i className="ph-fill  ph-wechat-logo f-s-18 me-2" />Updates
                                                    </li>
                                                    <li className="tab-link" data-tab={3}><i className="ph-fill  ph-phone-call f-s-18 me-2" />Contact
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="content-wrapper">
                                                {/* tab 1 */}
                                                <div className="tabs-content active" id="tab-1">
                                                    <div className="tab-wrapper">
                                                        <div className="mt-3">
                                                            <ul className="nav nav-tabs app-tabs-primary tab-light-primary chat-status-tab border-0 justify-content-between mb-0 pb-0" id="Basic" role="tablist">
                                                                <li className="nav-item" role="presentation">
                                                                    <button aria-controls="private-tab-pane" aria-selected="false" className="nav-link active" data-bs-target="#private-tab-pane" data-bs-toggle="tab" id="private-tab" role="tab" tabIndex={-1} type="button"><i className="ph-fill  ph-lock-key-open me-2" />Private
                                                                    </button>
                                                                </li>
                                                                <li className="nav-item" role="presentation">
                                                                    <button aria-controls="groups-tab-pane" aria-selected="false" className="nav-link" data-bs-target="#groups-tab-pane" data-bs-toggle="tab" id="groups-tab" role="tab" tabIndex={-1} type="button"><i className="ph-fill  ph-users-three me-2" />Group
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                            <div className="tab-content" id="BasicContent">
                                                                {/* Private Chat */}
                                                                <div aria-labelledby="private-tab" className="tab-pane fade show active" id="private-tab-pane" role="tabpanel" tabIndex={0}>
                                                                    <div className="chat-contact">
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <span className="h-45 w-45 d-flex-center b-r-50 position-relative bg-primary">
                                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/1.png" />
                                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-50">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Bette Hagenes</p>
                                                                                <p className="text-secondary mb-0 f-s-12 mb-0 chat-message">
                                                                                    <i className="ti ti-checks" /> Hi! Bette
                                                                                    How are you?
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">2:30AM</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <span className="h-45 w-45 d-flex-center b-r-50 position-relative bg-dark">
                                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/2.png" />
                                                                                    <span className="position-absolute top-0 end-0 p-1 bg-secondary border border-light rounded-circle" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-50">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Mark Walsh</p>
                                                                                <p className="text-secondary mb-0 f-s-12 mb-0 chat-message">
                                                                                    <i className="ti ti-checks" /> Hi! Work is
                                                                                    done
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">2:30AM</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <span className="h-45 w-45 d-flex-center b-r-50 position-relative bg-success">
                                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/3.png" />
                                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-50">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Jerry Ladies</p>
                                                                                <p className="text-secondary mb-0 f-s-12 mb-0 chat-message">
                                                                                    <i className="ti ti-checks" /> I'm waiting
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">2:30AM</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <span className="h-45 w-45 d-flex-center b-r-50 position-relative bg-danger">
                                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/4.png" />
                                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-50">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Jessica</p>
                                                                                <p className="text-secondary mb-0 f-s-12 mb-0 chat-message">
                                                                                    <i className="ti ti-checks" /> Awesome! 🤩
                                                                                    I like it
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">2:30AM</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <span className="h-45 w-45 d-flex-center b-r-50 position-relative bg-warning">
                                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/5.png" />
                                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-50">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Sue Flay</p>
                                                                                <p className="text-secondary mb-0 f-s-12 mb-0 chat-message">
                                                                                    <i className="ti ti-checks" /> oh, Really
                                                                                    !!
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">1:00PM</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <span className="h-45 w-45 d-flex-center b-r-50 position-relative bg-dark">
                                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/6.png" />
                                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-50">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Isla White</p>
                                                                                <p className="text-secondary mb-0 f-s-12 mb-0 chat-message">
                                                                                    <i className="ti ti-checks" /> Bye! see
                                                                                    you soon
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">12:33PM</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <span className="h-45 w-45 d-flex-center b-r-50 position-relative bg-secondary">
                                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/7.png" />
                                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-50">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Anita Break</p>
                                                                                <p className="text-secondary mb-0 f-s-12 mb-0 chat-message">
                                                                                    <i className="ti ti-checks" /> Bye!
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">1:52AM</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <span className="h-45 w-45 d-flex-center b-r-50 position-relative bg-primary">
                                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/8.png" />
                                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-50">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Lou Pole</p>
                                                                                <p className="text-secondary mb-0 f-s-12 mb-0 chat-message">
                                                                                    <i className="ti ti-checks" /> Heyy !
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">2 days</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <span className="h-45 w-45 d-flex-center b-r-50 position-relative bg-info">
                                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/9.png" />
                                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-50">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Noah Davis</p>
                                                                                <p className="text-secondary mb-0 f-s-12 mb-0 chat-message">
                                                                                    <i className="ti ti-checks" /> Have a
                                                                                    great day
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">8:00 PM</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <span className="h-45 w-45 d-flex-center b-r-50 position-relative bg-success">
                                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/10.png" />
                                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-50">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Pete Sakes</p>
                                                                                <p className="text-secondary mb-0 f-s-12 mb-0 chat-message">
                                                                                    <i className="ti ti-checks" /> Bye! see
                                                                                    you soon
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">12:30 PM</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <span className="h-45 w-45 d-flex-center b-r-50 position-relative bg-danger">
                                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/11.png" />
                                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-50">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Fleta Walsh</p>
                                                                                <p className="text-muted mb-0 text-success f-s-12 chat-message">
                                                                                    Typing....</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">Now</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* Group Chat */}
                                                                <div aria-labelledby="groups-tab" className="tab-pane fade" id="groups-tab-pane" role="tabpanel" tabIndex={0}>
                                                                    <div className="chat-contact chat-group-list">
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <ul className="avatar-group">
                                                                                    <li className="text-bg-warning h-45 w-45 d-flex-center b-r-50">
                                                                                        A
                                                                                    </li>
                                                                                    <li className="text-bg-secondary h-35 w-35 d-flex-center b-r-50" data-bs-title="2 More" data-bs-toggle="tooltip">
                                                                                        2+
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-75">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Office Group</p>
                                                                                <p className="text-secondary f-s-12 chat-message">
                                                                                    Hi! Bette How are you?</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">2:30AM</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <ul className="avatar-group">
                                                                                    <li className="h-45 w-45 d-flex-center overflow-hidden b-r-50 bg-primary">
                                                                                        <img alt="" className="img-fluid" src="../assets/images/avtar/16.png" />
                                                                                    </li>
                                                                                    <li className="text-bg-secondary h-35 w-35 d-flex-center b-r-50" data-bs-title="2 More" data-bs-toggle="tooltip">
                                                                                        4+
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-75">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Markting Group</p>
                                                                                <p className="text-secondary f-s-12 chat-message">
                                                                                    Hi! Work is done</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">7:24AM</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <ul className="avatar-group">
                                                                                    <li className="h-45 w-45 d-flex-center overflow-hidden b-r-50 bg-info">
                                                                                        <img alt="" className="img-fluid" src="../assets/images/avtar/15.png" />
                                                                                    </li>
                                                                                    <li className="text-bg-secondary h-35 w-35 d-flex-center b-r-50" data-bs-title="2 More" data-bs-toggle="tooltip">
                                                                                        10+
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-75">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Developer Group</p>
                                                                                <p className="text-secondary f-s-12 chat-message">
                                                                                    I'm waiting </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">2min</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <ul className="avatar-group">
                                                                                    <li className="text-bg-danger h-45 w-45 d-flex-center overflow-hidden b-r-50">
                                                                                        AD
                                                                                    </li>
                                                                                    <li className="text-bg-secondary h-35 w-35 d-flex-center b-r-50" data-bs-title="2 More" data-bs-toggle="tooltip">
                                                                                        2+
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-75">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Designer Group</p>
                                                                                <p className="text-secondary f-s-12 chat-message">
                                                                                    Awesome! 🤩 I like it </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">2day</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <ul className="avatar-group">
                                                                                    <li className="h-45 w-45 d-flex-center overflow-hidden b-r-50 bg-dark">
                                                                                        <img alt="" className="img-fluid" src="../assets/images/avtar/14.png" />
                                                                                    </li>
                                                                                    <li className="text-bg-secondary h-35 w-35 d-flex-center b-r-50" data-bs-title="2 More" data-bs-toggle="tooltip">
                                                                                        15+
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-75">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    Friend's Group</p>
                                                                                <p className="text-secondary f-s-12 chat-message">
                                                                                    Bye! see you soon </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">12:30PM</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-contactbox">
                                                                            <div className="position-absolute">
                                                                                <ul className="avatar-group">
                                                                                    <li className="text-bg-danger h-45 w-45 d-flex-center overflow-hidden b-r-50">
                                                                                        <img alt="" className="img-fluid" src="../assets/images/avtar/10.png" />
                                                                                    </li>
                                                                                    <li className="text-bg-secondary h-35 w-35 d-flex-center b-r-50" data-bs-title="2 More" data-bs-toggle="tooltip">
                                                                                        25+
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                            <div className="flex-grow-1 text-start mg-s-75">
                                                                                <p className="mb-0 f-w-500 text-dark txt-ellipsis-1">
                                                                                    client Group</p>
                                                                                <p className="text-muted text-success f-s-12 chat-message">
                                                                                    Typing...</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="f-s-12 chat-time">Now</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="float-end">
                                                                    <div className="btn-group dropup  dropdown-icon-none">
                                                                        <button aria-expanded="false" className="btn btn-primary icon-btn b-r-22 dropdown-toggle active" data-bs-auto-close="true" data-bs-toggle="dropdown" type="button">
                                                                            <i className="ti ti-plus" />
                                                                        </button>
                                                                        <ul className="dropdown-menu" data-popper-placement="bottom-start">
                                                                            <li><a className="dropdown-item" href="#"><i className="ti ti-brand-hipchat" /> <span className="f-s-13">New Chat</span></a>
                                                                            </li>
                                                                            <li><a className="dropdown-item" href="#"><i className="ti ti-phone-call" /> <span className="f-s-13">New Contact</span></a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* tab 2 */}
                                                <div className="tabs-content" id="tab-2">
                                                    <div className="chat-contact tabcontent">
                                                        <div className="updates-box">
                                                            <div className="b-2-success b-r-50 p-1">
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-primary">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/16.png" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 text-start ps-2">
                                                                <span>Bette Hagenes</span>
                                                                <p className="f-s-12 text-secondary mb-0">2:30AM</p>
                                                            </div>
                                                        </div>
                                                        <div className="updates-box">
                                                            <div className="b-2-secondary b-r-50 p-1">
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-info">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/6.png" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 text-start ps-2">
                                                                <span>Jessica</span>
                                                                <p className="f-s-12 text-secondary mb-0">2min</p>
                                                            </div>
                                                        </div>
                                                        <div className="updates-box">
                                                            <div className="b-2-secondary b-r-50 p-1">
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-dark">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/5.png" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 text-start ps-2">
                                                                <span>Jerry Ladies</span>
                                                                <p className="f-s-12 text-secondary mb-0">7:00AM</p>
                                                            </div>
                                                        </div>
                                                        <div className="updates-box">
                                                            <div className="b-2-success b-r-50 p-1">
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-warning">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/4.png" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 text-start ps-2">
                                                                <span>Emery McKenzie</span>
                                                                <p className="f-s-12 text-secondary mb-0">5:26PM</p>
                                                            </div>
                                                        </div>
                                                        <div className="updates-box">
                                                            <div className="b-2-success b-r-50 p-1">
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-primary">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/3.png" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 text-start ps-2">
                                                                <span>Mark Walsh</span>
                                                                <p className="f-s-12 text-secondary mb-0">1:26PM</p>
                                                            </div>
                                                        </div>
                                                        <div className="updates-box">
                                                            <div className="b-2-secondary b-r-50 p-1">
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-dark">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/2.png" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 text-start ps-2">
                                                                <span>Noah Davis</span>
                                                                <p className="f-s-12 text-secondary mb-0">6:22PM</p>
                                                            </div>
                                                        </div>
                                                        <div className="updates-box">
                                                            <div className="b-2-secondary b-r-50 p-1">
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-primary">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/1.png" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 text-start ps-2">
                                                                <span>
                                                                    Isla White</span>
                                                                <p className="f-s-12 text-secondary mb-0">6:10PM</p>
                                                            </div>
                                                        </div>
                                                        <div className="updates-box">
                                                            <div className="b-2-secondary b-r-50 p-1">
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-secondary">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/10.png" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 text-start ps-2">
                                                                <span>Fleta Walsh</span>
                                                                <p className="f-s-12 text-secondary mb-0">5:26PM</p>
                                                            </div>
                                                        </div>
                                                        <div className="updates-box">
                                                            <div className="b-2-secondary b-r-50 p-1">
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-secondary">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/11.png" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 text-start ps-2">
                                                                <span>Pete Sakes</span>
                                                                <p className="f-s-12 text-secondary mb-0">3:26PM</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="float-end">
                                                        <div className="btn-group dropdown-icon-none">
                                                            <button aria-expanded="false" className="btn btn-primary icon-btn b-r-22 dropdown-toggle active" data-bs-auto-close="true" data-bs-toggle="dropdown" type="button">
                                                                <i className="ti ti-plus" />
                                                            </button>
                                                            <ul className="dropdown-menu" data-popper-placement="bottom-start">
                                                                <li><a className="dropdown-item" href="#"><i className="ti ti-brand-hipchat" /> <span className="f-s-13">New Chat</span></a>
                                                                </li>
                                                                <li><a className="dropdown-item" href="#"><i className="ti ti-phone-call" /> <span className="f-s-13">New Contact</span></a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* tab 3 */}
                                                <div className="tabs-content" id="tab-3">
                                                    <div className="chat-contact tabcontent chat-contact-list">
                                                        <div className=" d-flex align-items-center py-3">
                                                            <div>
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-info">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/13.png" />
                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 ps-2">
                                                                <p className="contact-name text-dark mb-0 f-w-500">Bette
                                                                    Hagenes</p>
                                                                <p className="mb-0 text-secondary f-s-13">+978356479</p>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-success d-flex-center b-r-50">
                                                                    <i className="ti ti-phone-call" />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-primary d-flex-center b-r-50 ms-1">
                                                                    <i className="ti ti-video" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center py-3">
                                                            <div>
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-danger">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/12.png" />
                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 ps-2">
                                                                <p className="contact-name text-dark mb-0 f-w-500">Fleta
                                                                    Walsh</p>
                                                                <p className="mb-0 text-secondary f-s-13">+988456479</p>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-success d-flex-center b-r-50">
                                                                    <i className="ti ti-phone-call" />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-primary d-flex-center b-r-50 ms-1">
                                                                    <i className="ti ti-video" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center py-3">
                                                            <div>
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-warning">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/11.png" />
                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 ps-2">
                                                                <p className="contact-name text-dark mb-0 f-w-500">Lenora
                                                                    Bogisich</p>
                                                                <p className="mb-0 text-secondary f-s-13">+4583546479</p>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-success d-flex-center b-r-50">
                                                                    <i className="ti ti-phone-call" />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-primary d-flex-center b-r-50 ms-1">
                                                                    <i className="ti ti-video" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center py-3">
                                                            <div>
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-success">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/10.png" />
                                                                    <span className="position-absolute top-0 end-0 p-1 bg-secondary border border-light rounded-circle" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 ps-2">
                                                                <p className="contact-name text-dark mb-0 f-w-500">Emery
                                                                    McKenzie</p>
                                                                <p className="mb-0 text-secondary f-s-13">+378356479</p>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-success d-flex-center b-r-50">
                                                                    <i className="ti ti-phone-call" />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-primary d-flex-center b-r-50 ms-1">
                                                                    <i className="ti ti-video" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center py-3">
                                                            <div>
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-danger">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/8.png" />
                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 ps-2">
                                                                <p className="contact-name text-dark mb-0 f-w-500">Elmer</p>
                                                                <p className="mb-0 text-secondary f-s-13">+678356270</p>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-success d-flex-center b-r-50">
                                                                    <i className="ti ti-phone-call" />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-primary d-flex-center b-r-50 ms-1">
                                                                    <i className="ti ti-video" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center py-3">
                                                            <div>
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-success">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/9.png" />
                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 ps-2">
                                                                <p className="contact-name text-dark mb-0 f-w-500">Mark
                                                                    Walsh</p>
                                                                <p className="mb-0 text-secondary f-s-13">+780356479</p>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-success d-flex-center b-r-50">
                                                                    <i className="ti ti-phone-call" />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-primary d-flex-center b-r-50 ms-1">
                                                                    <i className="ti ti-video" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center py-3">
                                                            <div>
                                                                <span className="h-40 w-40 d-flex-center b-r-50 position-relative bg-warning">
                                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/7.png" />
                                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1 ps-2">
                                                                <p className="contact-name text-dark mb-0 f-w-500">Sue Flay</p>
                                                                <p className="mb-0 text-secondary f-s-13">+780356479</p>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-success d-flex-center b-r-50">
                                                                    <i className="ti ti-phone-call" />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="h-35 w-35 text-outline-primary d-flex-center b-r-50 ms-1">
                                                                    <i className="ti ti-video" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="float-end">
                                                        <div className="btn-group dropdown-icon-none">
                                                            <button aria-expanded="false" className="btn btn-primary icon-btn b-r-22 dropdown-toggle active" data-bs-auto-close="true" data-bs-toggle="dropdown" type="button">
                                                                <i className="ti ti-plus" />
                                                            </button>
                                                            <ul className="dropdown-menu" data-popper-placement="bottom-start">
                                                                <li><a className="dropdown-item" href="#"><i className="ti ti-brand-hipchat" /> <span className="f-s-13">New Chat</span></a>
                                                                </li>
                                                                <li><a className="dropdown-item" href="#"><i className="ti ti-phone-call" /> <span className="f-s-13">New Contact</span></a>
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
                            <div className="col-lg-8 col-xxl-9 box-col-7">
                                <div className="card chat-container-content-box">
                                    <div className="card-header">
                                        <div className="chat-header d-flex align-items-center">
                                            <div className="d-lg-none">
                                                <a className="me-3 toggle-btn" role="button"><i className="ti ti-align-justified" /></a>
                                            </div>
                                            <a href="profile.html">
                                                <span className="profileimg h-45 w-45 d-flex-center b-r-50 position-relative bg-light">
                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/14.png" />
                                                    <span className="position-absolute top-0 end-0 p-1 bg-success border border-light rounded-circle" />
                                                </span>
                                            </a>
                                            <div className="flex-grow-1 ps-2 pe-2">
                                                <div className="fs-6"> Jerry Ladies</div>
                                                <div className="text-muted f-s-12 text-success">Online</div>
                                            </div>
                                            <button className="btn btn-light-success h-45 w-45 icon-btn b-r-22 me-sm-2" data-bs-target="#exampleModal" data-bs-toggle="modal" type="button">
                                                <i className="ti ti-phone-call f-s-20" />
                                            </button>
                                            <div aria-hidden="true" className="modal fade" id="exampleModal" tabIndex={-1}>
                                                <div className="modal-dialog modal-dialog-centered">
                                                    <div className="modal-body p-0">
                                                        <div className="call">
                                                            <div className="call-div">
                                                                <img alt="" className="w-100 rounded" src="../assets/images/profile-app/32.jpg" />
                                                                <div className="call-caption">
                                                                    <h2 className="text-white">Jerry Ladies</h2>
                                                                    <div className="d-flex justify-content-center">
                                                                        <span className="bg-success h-40 w-40 d-flex-center b-r-50 animate__animated animate__1 animate__shakeY animate__infinite call-btn pointer-events-auto" data-bs-dismiss="modal">
                                                                            <i className="ti ti-phone-call " />
                                                                        </span>
                                                                        <span className="bg-danger h-40 w-40 d-flex-center b-r-50 ms-4 call-btn pointer-events-auto" data-bs-dismiss="modal">
                                                                            <i className="ti ti-phone" />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="btn btn-light-primary h-45 w-45 icon-btn b-r-22 me-sm-2" data-bs-target="#exampleModal1" data-bs-toggle="modal" type="button">
                                                <i className="ti ti-video f-s-20" />
                                            </button>
                                            <div aria-hidden="true" className="modal fade" id="exampleModal1" tabIndex={-1}>
                                                <div className="modal-dialog modal-dialog-centered">
                                                    <div className="modal-body p-0">
                                                        <div className="call">
                                                            <div className="call-div pointer-events-auto">
                                                                <img alt="" className="w-100 rounded" src="../assets/images/profile-app/25.jpg" />
                                                                <div className="call-caption">
                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                        <span className="bg-white h-35 w-35 d-flex-center b-r-50 ms-4">
                                                                            <i className="ti ti-microphone text-dark" />
                                                                        </span>
                                                                        <span className="bg-danger h-45 w-45 d-flex-center b-r-50 ms-4 animate__pulse animate__animated animate__infinite animate__faster call-btn pointer-events-auto" data-bs-dismiss="modal">
                                                                            <i className="ti ti-phone" />
                                                                        </span>
                                                                        <span className="bg-white h-35 w-35 d-flex-center b-r-50 ms-4">
                                                                            <i className="ti ti-phone-pause text-dark" />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="video-div">
                                                                <img alt="" className="w-100 rounded" src="../assets/images/profile-app/31.jpg" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <button aria-expanded="false" className="btn btn-light-secondary h-45 w-45 icon-btn b-r-22 me-sm-2" data-bs-auto-close="true" data-bs-toggle="dropdown">
                                                    <i className="ti ti-settings f-s-20" />
                                                </button>
                                                <ul className="dropdown-menu" data-popper-placement="bottom-start">
                                                    <li><a className="dropdown-item" href="#"><i className="ti ti-brand-hipchat" /> <span className="f-s-13">Chat Settings</span></a>
                                                    </li>
                                                    <li><a className="dropdown-item" href="#"><i className="ti ti-phone-call" />
                                                        <span className="f-s-13">Contact Settings</span></a>
                                                    </li>
                                                    <li><a className="dropdown-item" href="#"><i className="ti ti-settings" />
                                                        <span className="f-s-13">Settings</span></a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body chat-body">
                                        <div className="chat-container ">
                                            <div className="text-center">
                                                <span className="badge text-light-secondary">Today</span>
                                            </div>
                                            <div className="position-relative">
                                                <div className="chatdp h-45 w-45 b-r-50 position-absolute start-0 bg-light">
                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/14.png" />
                                                </div>
                                                <div className="chat-box">
                                                    <div>
                                                        <p className="chat-text">Hi! Ninfa Monaldo can we go over the project
                                                            details for the upcoming presentation?</p>
                                                        <p className="text-muted"><i className="ti ti-checks text-primary" />
                                                            2:00PM</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="position-relative">
                                                <div className="chat-box-right">
                                                    <div>
                                                        <p className="chat-text">Sure, Jerry.</p>
                                                        <p className="chat-text">I was just reviewing our notes.</p>
                                                        <p className="chat-text">What do you want to start with?</p>
                                                        <p className="text-muted"><i className="ti ti-checks text-primary" />
                                                            2:02PM</p>
                                                    </div>
                                                </div>
                                                <div className="chatdp h-45 w-45 b-r-50 position-absolute end-0 top-0 bg-danger">
                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/9.png" />
                                                </div>
                                            </div>
                                            <div className="position-relative">
                                                <div className="chatdp h-45 w-45 b-r-50 position-absolute start-0 bg-light">
                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/14.png" />
                                                </div>
                                                <div className="chat-box">
                                                    <div>
                                                        <p className="chat-text"> Let’s begin with the project timeline.</p>
                                                        <p className="chat-text"> Are we on track to meet the deadlines?</p>
                                                        <p className="text-muted"><i className="ti ti-checks text-primary" />
                                                            2:03PM</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="position-relative">
                                                <div className="chat-box-right">
                                                    <div>
                                                        <p className="chat-text">Yes, mostly.</p>
                                                        <p className="chat-text">We completed the initial research phase and the
                                                            design draft. We're currently in the development phase, which
                                                            should be done by the end of the week.</p>
                                                        <p className="text-muted"><i className="ti ti-checks text-primary" />
                                                            2:02PM</p>
                                                    </div>
                                                </div>
                                                <div className="chatdp h-45 w-45 b-r-50 position-absolute end-0 top-0 bg-danger">
                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/9.png" />
                                                </div>
                                            </div>
                                            <div className="position-relative">
                                                <span className="chatdp h-45 w-45 position-absolute start-0 b-r-50 bg-light">
                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/14.png" />
                                                </span>
                                                <div className="chat-box">
                                                    <div>
                                                        <p className="chat-text"> Great to hear! </p>
                                                        <p className="chat-text"> How about the testing phase? When do we plan
                                                            to start that?</p>
                                                        <p className="text-muted"><i className="ti ti-checks text-primary" />
                                                            2:06PM</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="position-relative">
                                                <div className="chat-box-right">
                                                    <div>
                                                        <p className="chat-text">We have it scheduled to start next Monday. That
                                                            gives us a full week to iron out any issues before the final
                                                            presentation.</p>
                                                        <p className="text-muted"><i className="ti ti-checks text-primary" />
                                                            2:08M</p>
                                                    </div>
                                                </div>
                                                <span className="chatdp h-45 w-45 b-r-50 position-absolute top-0 end-0 bg-danger">
                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/9.png" />
                                                </span>
                                            </div>
                                            <div className="position-relative">
                                                <span className="chatdp h-45 w-45 b-r-50 position-absolute start-0 bg-light">
                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/14.png" />
                                                </span>
                                                <div className="chat-box">
                                                    <div>
                                                        <p className="chat-text"> Perfect. Have we assigned specific tasks for
                                                            the testing phase?</p>
                                                        <p className="text-muted"><i className="ti ti-checks text-primary" />
                                                            2:10PM</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="position-relative">
                                                <div className="chat-box-right">
                                                    <div>
                                                        <p className="chat-text">Yes, I've assigned the initial testing to the
                                                            QA team. I've also scheduled a meeting with them to go over the
                                                            testing protocols.</p>
                                                        <p className="text-muted"><i className="ti ti-checks text-primary" />
                                                            2:08M</p>
                                                    </div>
                                                </div>
                                                <span className="chatdp h-45 w-45 b-r-50 position-absolute top-0 end-0 bg-danger">
                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/9.png" />
                                                </span>
                                            </div>
                                            <div className="position-relative">
                                                <span className="chatdp h-45 w-45 b-r-50 position-absolute start-0 bg-light">
                                                    <img alt="" className="img-fluid b-r-50" src="../assets/images/avtar/14.png" />
                                                </span>
                                                <div className="chat-box">
                                                    <div>
                                                        <p className="chat-text">Typing....</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="chat-footer d-flex">
                                            <div className="app-form flex-grow-1">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light-secondary ms-2 me-2 b-r-10 ">
                                                        <a className="emoji-btn d-flex-center" data-bs-original-title="Emoji" data-bs-placement="top" data-bs-toggle="tooltip" role="button">
                                                            <i className="ti ti-mood-smile f-s-18" />
                                                        </a>
                                                    </span>
                                                    <input aria-label="Recipient's username" className="form-control b-r-6" placeholder="Type a message" type="text" />
                                                    <button className="btn btn-sm btn-light-primary ms-2 me-2 b-r-4" type="button"><i className="ti ti-send" /> <span>Send</span></button>
                                                </div>
                                            </div>
                                            <div className="d-none d-sm-block">
                                                <a className="bg-light-secondary h-50 w-50 d-flex-center b-r-10 ms-1" data-bs-original-title="Microphone" data-bs-placement="top" data-bs-toggle="tooltip" role="button">
                                                    <i className="ti ti-microphone f-s-18" />
                                                </a>
                                            </div>
                                            <div className="d-none d-sm-block">
                                                <a className="bg-light-secondary h-50 w-50 d-flex-center b-r-10 ms-1" data-bs-original-title="Camera" data-bs-placement="top" data-bs-toggle="tooltip" role="button">
                                                    <i className="ti ti-camera-plus f-s-18" />
                                                </a>
                                            </div>
                                            <div className="d-none d-sm-block">
                                                <a className="bg-light-secondary h-50 w-50 d-flex-center b-r-10 ms-1" data-bs-original-title="Paperclip" data-bs-placement="top" data-bs-toggle="tooltip" role="button">
                                                    <i className="ti ti-paperclip f-s-18" />
                                                </a>
                                            </div>
                                            <div>
                                                <div className="btn-group dropdown-icon-none d-sm-none">
                                                    <a aria-expanded="false" className="h-35 w-35 d-flex-center ms-1" data-bs-auto-close="true" data-bs-toggle="dropdown" role="button">
                                                        <i className="ti ti-dots-vertical" />
                                                    </a>
                                                    <ul className="dropdown-menu" data-popper-placement="bottom-start">
                                                        <li><a className="dropdown-item" href="#"><i className="ti ti-microphone" /> <span className="f-s-13">Microphone</span></a>
                                                        </li>
                                                        <li><a className="dropdown-item" href="#"> <i className="ti ti-camera-plus" /> <span className="f-s-13">camera</span></a>
                                                        </li>
                                                        <li><a className="dropdown-item" href="#"><i className="ti ti-paperclip" /> <span className="f-s-13">paperclip</span></a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Chat end */}
                    </div>

                </main>
            </div>
        </Fragment>
    );
}
export default Support;
