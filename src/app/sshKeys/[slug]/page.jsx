"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import React, { Fragment, useState, useEffect } from "react";
import Cookies from "js-cookie";

function ViewPage() {
    const [formData, setFormData] = useState({
        name: "",
        key: "",
    });

    const [sshKeys, setSshKeys] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const params = useParams();
    const id = params.slug;

    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token && id) {
            console.log('fetch token ', token);
            const FetchSshkey = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/sshkeys/${id}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const result = await response.json();
                    const data = result.data.sshkey;
                    setSshKeys(data.sshkeys);
                    setFormData({ name: data.name, key: data.key });
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching SSH key:", error);
                    setIsLoading(false);
                }
            };

            FetchSshkey();
        }
    }, [id]);

    const handleSShKey = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/sshkey/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const result = await res.json();

            if (res.ok && result.success) {
                setSuccess(result.message);
                setFormData({ name: "", key: "" });
                window.location.reload(); // Or refetch data instead of reload
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error("Error submitting SSH key:", err);
            setError("An error occurred while submitting the form.");
        }
    };
    

    return (
        <Fragment>
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

                <main>
                    <div className="container-fluid">
                        <div className="row m-1">
                            <div className="col-12">
                                <h4 className="main-title">Edit SSH Key</h4>
                                <ul className="app-line-breadcrumbs mb-3">
                                    <li>
                                        <Link className="f-s-14 f-w-500" href="/sshKeys">
                                            <span>
                                                <i className="ph-duotone ph-table f-s-16" /> My SSH Keys
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="active">
                                        <span className="f-s-14 f-w-500">Edit SSH Key</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <div className="content-wrapper" id="card-container">
                                    <div className="card">
                                        <div className="card-body">
                                            <form
                                                className="row g-3 app-form rounded-control"
                                                id="form-validation"
                                                onSubmit={handleSShKey}
                                            >
                                                <div className="col-md-12">
                                                    <label className="form-label" htmlFor="userName">Name</label>
                                                    <input
                                                        className="form-control"
                                                        id="userName"
                                                        name="name"
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, name: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-12">
                                                    <label className="form-label" htmlFor="address">SSH Key</label>
                                                    <textarea
                                                        className="form-control"
                                                        id="address"
                                                        name="key"
                                                        placeholder="Enter SSH Key Value"
                                                        value={formData.key}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, key: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                {success && (
                                                    <div className="alert alert-success">{success}</div>
                                                )}
                                                {error && (
                                                    <div className="alert alert-danger">{error}</div>
                                                )}

                                                <div className="col-12 d-flex gap-2">
                                                    <Link className="btn btn-empty b-r-22" href="/sshKeys">
                                                        Cancel
                                                    </Link>
                                                    <button
                                                        className="btn btn-primary b-r-22"
                                                        type="submit"
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
                    </div>
                </main>
            </div>
        </Fragment>
    );
}

export default ViewPage;

