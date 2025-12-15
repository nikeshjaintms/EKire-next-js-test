"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { Fragment, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function Create() {
    const router = useRouter();

    const [servers, setServers] = useState([]);

    const [formData, setFormData] = useState({
        credentials: '',
        server_id: '',
        subject: '',
        description: '',
    });

    const [errors, setErrors] = useState({
        credentials: '',
        subject: '',
        description: '',
    });

    const validateForm = () => {
        const newErrors = {};

        if (!formData.credentials.trim()) {
            newErrors.credentials = "Credentials are required.";
        }
        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required.";
        }
        if (!formData.description.trim()) {
            newErrors.description = "Description is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

     useEffect(() => {
            const token = Cookies.get("accessToken");
            if (token) {
                // console.log("Token found:", token);
                const FetchServer = async () => {
                    console.log(`Bearer ${token}`);
                    setIsLoading(true);
                    try {
                        const response = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/customer/server/list`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`, // Send the token
                                },
                            }
                        );
    
                        const result = await response.json();
                        const data = result.data;
                        console.log(data);
                        setServers(data.servers);
                    } catch (error) {
                        console.error("Error fetching cloud vps plan data:", error);
                        setIsLoading(false);
                    }
                };
    
                FetchServer();
            }
        }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/support/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
                body: JSON.stringify(formData),
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

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 900);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Fragment>
            <div className="position-relative">
                {isLoading && (
                    <div className="d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100" style={{ background: 'var(--bodybg-color)', zIndex: 1000 }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                <main className={`page-content ${isLoading ? 'pointer-events-none' : ''}`} style={{ opacity: isLoading ? 0.5 : 1 }}>
                    <div className="container-fluid">
                        <div className="row m-1">
                            <div className="col-12">
                                <h4 className="main-title">Create Support Ticket </h4>
                                <ul className="app-line-breadcrumbs mb-3">
                                    <li>
                                        <a className="f-s-14 f-w-500" href="/support">
                                            <i className="ph-duotone ph-table f-s-16" /> Support
                                        </a>
                                    </li>
                                    <li className="active">
                                        <span className="f-s-14 f-w-500">Create Support Ticket</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <div className="content-wrapper" id="card-container">
                                    <div className="card">
                                        <div className="card-body">
                                            <form className="row g-3 app-form rounded-control" id="form-validation" onSubmit={handleSubmit}>
                                                <div className="col-md-12">
                                                    <label className="form-label" htmlFor="subject">Subject</label>
                                                    <input
                                                        className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                                                        id="subject"
                                                        name="subject"
                                                        type="text"
                                                         autoComplete="off"
                                                        placeholder="Enter Your Subject"
                                                        value={formData.subject}
                                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    />
                                                    {errors.subject && <span className="text-danger">{errors.subject}</span>}
                                                </div>

                                                <div className="col-md-12">
                                                    <label className="form-label" htmlFor="description">Description</label>
                                                    <textarea
                                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                        id="description"
                                                        placeholder="Describe Your Issue"
                                                        value={formData.description}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    />
                                                    {errors.description && <span className="text-danger">{errors.description}</span>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label" htmlFor="credentials">Servers</label>
                                                    <select className="form-select form-control" 
                                                      value={formData.serverId || ""}   // bind to formData
                                                    onChange={(e) => setFormData({ ...formData, serverId: e.target.value })}
                                                    name="server_id">
                                                        <option value="">Select a server</option>
                                                        {servers.map((server) => (
                                                            <option key={server.id} value={server.id}>
                                                                {server.hostname}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.serverId && <span className="text-danger">{errors.serverId}</span>}
                                                </div>
                                                {formData.serverId && (
                                                    <div className="col-md-6">
                                                    <label className="form-label" htmlFor="credentials">Credentials</label>
                                                    <input
                                                        className={`form-control ${errors.credentials ? 'is-invalid' : ''}`}
                                                        id="credentials"
                                                        name="credentials"
                                                        type="password"
                                                        autoComplete="nw-pass"
                                                        placeholder="Enter Server Details (IP, Password)"
                                                        value={formData.credentials}
                                                        onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                                                        
                                                    />
                                                    {errors.credentials && <span className="text-danger">{errors.credentials}</span>}
                                                </div>
                                                )}
                                                

                                                <div className="col-12 d-flex gap-2">
                                                    <Link className="btn btn-empty b-r-22" href="/support">Cancel</Link>
                                                    <button className="btn btn-primary b-r-22" type="submit">Submit</button>
                                                </div>
                                            </form>
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

export default Create;
