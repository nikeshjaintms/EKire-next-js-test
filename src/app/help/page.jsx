"use client";
import Link from "next/link";
import React, { Fragment, useState, useEffect } from "react";


function Project() {

    const [activeTab, setActiveTab] = useState(1);
    const [helpSections, setHelpSections] = useState([]);

    useEffect(() => {
        const fetchHelpSections = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/help-section`);
                const data = await res.json();
                setHelpSections(data); // Assuming it's directly an array
            } catch (err) {
                console.error('Failed to fetch help sections', err);
            }
        };

        fetchHelpSections();
    }, []);


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
                        className="d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100"
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
                                <h4 className="main-title">FAQ</h4>
                                {/* <ul className="app-line-breadcrumbs mb-3">
                                <li className>
                                    <a className="f-s-14 f-w-500" href="#">
                                        <span>
                                            <i className="ph-duotone  ph-stack f-s-16" /> Apps
                                        </span>
                                    </a>
                                </li>
                                <li className="active">
                                    <a className="f-s-14 f-w-500" href="#">FAQ</a>
                                </li>
                            </ul> */}
                            </div>
                        </div>
                        {/* Breadcrumb end */}

                        {/* Help start */}
                        <div className="faq-header">
                            <img alt="" src="../assets/images/logo/3.png" />
                            <h2 className="text-dark f-w-700">How Can We Help ?</h2>
                            <div className="app-form search-div">
                                <div className="input-group b-r-search">
                                    <span className="input-group-text bg-primary border-0 ">
                                        <i className="ti ti-search f-s-18" /></span>
                                    <input className="form-control" placeholder="Search..." type="text" />
                                </div>
                            </div>
                        </div>
                        <div className="row ">
                            <div className="card">
                                <div className="card-header">
                                    <h5>See your question below</h5>
                                </div>
                                <div className="card-body vertical-tab row">
                                    <div className="col-xl-3 col-md-5">
                                        <ul className="nav nav-tabs app-tabs-secondary flex-column" id="v-bg" role="tablist">
                                            {helpSections.map((section, index) => (
                                                <li className="nav-item" role="presentation" key={section.id}>
                                                    <button
                                                        className={`nav-link w-100 justify-content-start ${index === 0 ? 'active' : ''}`}
                                                        id={`v-${section.name.toLowerCase()}-tab`}
                                                        data-bs-toggle="tab"
                                                        data-bs-target={`#v-${section.name.toLowerCase()}-pane`}
                                                        type="button"
                                                        role="tab"
                                                        aria-selected={index === 0}
                                                    >
                                                        <i className={`${section.icon} pe-1 ps-1 pb-1 f-s-22`} /> 
                                                        {section.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="tab-content col-xl-9 col-md-7" id="v-bgContent">
                                        {helpSections.map((section, index) => (
                                            <div
                                                key={section.id}
                                                className={`tab-pane fade ${index === 0 ? 'show active' : ''}`}
                                                id={`v-${section.name.toLowerCase()}-pane`}
                                                role="tabpanel"
                                                aria-labelledby={`v-${section.name.toLowerCase()}-tab`}
                                                tabIndex={0}
                                            >
                                                <div className="accordion app-accordion accordion-light-secondary" id={`accordion-${section.id}`}>
                                                    {section.questions.length === 0 ? (
                                                        <p className="text-muted">No FAQs added in this category.</p>
                                                    ) : (
                                                        section.questions.map((q, idx) => (
                                                            <div className="accordion-item" key={q.id}>
                                                                <h2 className="accordion-header">
                                                                    <button
                                                                        className={`accordion-button ${idx !== 0 ? 'collapsed' : ''}`}
                                                                        type="button"
                                                                        data-bs-toggle="collapse"
                                                                        data-bs-target={`#flush-${section.id}-${q.id}`}
                                                                        aria-expanded={idx === 0}
                                                                        aria-controls={`flush-${section.id}-${q.id}`}
                                                                    >
                                                                        {q.question}
                                                                    </button>
                                                                </h2>
                                                                <div
                                                                    id={`flush-${section.id}-${q.id}`}
                                                                    className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`}
                                                                    data-bs-parent={`#accordion-${section.id}`}
                                                                >
                                                                    <div className="accordion-body">{q.answer}</div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* Frequently Asked Questions end */}
                    </div>
                </main>
            </div>
        </Fragment>
    );
}
export default Project;
