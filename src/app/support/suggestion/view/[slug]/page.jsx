'use client';
import React, { useEffect, useState, Fragment } from 'react';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';

function ViewPage() {
    const { slug } = useParams();
    const id = slug
    const [suggestion, setSuggestion] = useState(null);

    useEffect(() => {
        const fetchSuggestion = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/suggestions/${id}/view`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                });

                const data = await res.json();
                if (res.ok && data.success) {
                    setSuggestion(data.data);
                } else {
                    console.error('Error fetching suggestion:', data.message || data.error);
                }
            } catch (err) {
                console.error('Error:', err);
            }
        };

        if (id) fetchSuggestion();
    }, [id]);







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
                <main className={`page-content  ${isLoading ? 'pointer-events-none' : ''}`} style={{ opacity: isLoading ? 0.5 : 1 }}>
                    <div className="container-fluid">

                        {/* breadcrum */}
                        <div className="row m-1">
                            <div className="col-12">
                                <h4 className="main-title">suggestion  {id} </h4>
                                <ul className="app-line-breadcrumbs mb-3">
                                    <li>
                                        <a className="f-s-14 f-w-500" href="/support/suggestion">
                                            <span>
                                                <i className="ph-duotone  ph-table f-s-16" /> view suggestion
                                            </span>
                                        </a>
                                    </li>
                                    <li className="active">
                                        <a className="f-s-14 f-w-500" href="#">suggestion {id}</a>
                                    </li>
                                </ul>

                            </div>
                        </div>
                        {/* breadcrum */}

                        {/* Projects start */}
                        <div className="row">
                            <div className="col-12">

                                <div className="content-wrapper" id="card-container">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="card security-card-content">


                                                <div className="card-header">
                                                    <h5>Suggestion Details</h5>
                                                </div>
                                                <div className="row card-body">
                                                    {/* <div className="col-12 col-lg-6 m-10-0">
                                                        <div className="card-body card-body-style">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <h6 className="mb-0 text-primary">Customer ID</h6>
                                                                <h6 className="mb-0">{suggestion?.id}</h6>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                    {suggestion && (
                                                        <div className="col-12 col-lg-6 m-10-0">
                                                            <div className="card-body card-body-style">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <h6 className="mb-0 text-primary">Name</h6>
                                                                    <h6 className="mb-0">
                                                                        {suggestion.customer
                                                                            ? `${suggestion.customer.firstName || ''} ${suggestion.customer.lastName || ''}`
                                                                            : 'N/A'}
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="col-12 col-lg-6 m-10-0">
                                                        <div className="card-body card-body-style">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <h6 className="mb-0 text-success">Title</h6>
                                                                <h6 className="mb-0">{suggestion?.title}</h6>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-lg-6 m-10-0">
                                                        <div className="card-body card-body-style">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <h6 className="mb-0 text-secondary">Description</h6>
                                                                <h6 className="mb-0">{suggestion?.description}</h6>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-lg-6 m-10-0">
                                                        <div className="card-body card-body-style">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <h6 className="mb-0 text-danger">Status</h6>
                                                                <h6 className="mb-0">{suggestion?.status}</h6>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-lg-6 m-10-0">
                                                        <div className="card-body card-body-style">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <h6 className="mb-0 text-info">Votes Count</h6>
                                                                <h6 className="mb-0">{suggestion?.votes_count}</h6>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-lg-6 m-10-0">
                                                        <div className="card-body card-body-style">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <h6 className="mb-0 text-success">Up Votes</h6>
                                                                <h6 className="mb-0">{suggestion?.upvotes}</h6>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-lg-6 m-10-0">
                                                        <div className="card-body card-body-style">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <h6 className="mb-0 text-warning">Down Votes</h6>
                                                                <h6 className="mb-0">{suggestion?.downvotes}</h6>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-lg-6 m-10-0">
                                                        <div className="card-body card-body-style">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <h6 className="mb-0 text-info">Created At</h6>
                                                                <h6 className="mb-0">{new Date(suggestion?.created_at).toLocaleString()}</h6>
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
                        {/* Projects end */}


                    </div>

                </main>
            </div>
        </Fragment>
    );
}
export default ViewPage;
