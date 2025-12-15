"use client";

import { useRouter } from "next/navigation";
import React, { Fragment, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import TableControls from "@/components/datatable/TableControls";
import PaginationControls from "@/components/datatable/PaginationControls";


function Server() {
    const [servers, setServers] = useState([]);
    const [serverId, setserverId] = useState(null);


    const router = useRouter();

    const handleRowClick = (slug) => {
        router.push(`/server/${slug}`);
    };

    const handleCreateClick = () => {
        router.push('/server/create');
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

    // api for delete server with popup
    const confirmDelete = (serverId) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-primary ms-2',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: 'Delete server?',
            text: "Are you sure you want to delete this server? This can't be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(serverId, swalWithBootstrapButtons);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire(
                    'Cancelled',
                    'Your Server is safe :)',
                    'error'
                );
            }
        });
    };

    const handleDelete = async (serverId, swalInstance) => {
        if (!serverId) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${serverId}/destroy`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('accessToken')}`
                    }
                }
            );

            const result = await res.json();

            if (res.ok && result?.data?.status === 'success') {
                swalInstance.fire(
                    'Deleted!',
                    'Your server has been deleted.',
                    'success'
                ).then(() => {
                    window.location.reload();
                });
            } else {
                swalInstance.fire(
                    'Failed!',
                    result.message || 'Something went wrong.',
                    'error'
                );
            }

            console.log(result);
        } catch (err) {
            swalInstance.fire(
                'Error!',
                'An error occurred while deleting the server.',
                'error'
            );
            console.error(err);
        }
    };
    // api for delete project with popup end

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
    //         const tables = $(".datatable").map(function () {
    //             return $(this).DataTable();
    //         });

    //         return () => {
    //             tables.each(function () {
    //                 this.destroy();
    //             });
    //         };
    //     }
    // }, []);

    // datatable for servers
    const data = servers || [];
    const [search, setSearch] = useState("");
    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = useMemo(() => {
        return data.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [data, search]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * entries;
        return filteredData.slice(start, start + entries);
    }, [filteredData, currentPage, entries]);


    return (
        <Fragment>

            <div className="position-relative">
                {/* Overlay loader */}
                {/* {isLoading && (
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

                <main className={`page-content  ${isLoading ? 'pointer-events-none' : ''}`} style={{ opacity: isLoading ? 0.5 : 1 }}> */}
                <main>
                    <div className="container-fluid">
                        {/* Breadcrumb start */}
                        <div className="row m-1">
                            <div className="col-12 merge-title p-0">
                                <div>
                                    <h4 className="main-title">Servers</h4>
                                </div>
                                {/* <div className="text-end">
                                    <button className="btn btn-primary h-45 icon-btn m-2" onClick={handleCreateClick} >
                                        <i className="iconoir-open-new-window f-s-18" />  Create New Server
                                    </button>
                                </div> */}
                            </div>
                        </div>
                        {/* Breadcrumb end */}

                        {/* Projects start */}
                        <div className="row">
                            <div className="col-12">

                                <div className="content-wrapper" id="card-container">
                                    <div className="card p-l-r-30 pt-3 pb-3">
                                        <div className="card-body p-0">
                                            {/* <div className="app-datatable-default overflow-auto">
                                                <table className="datatable display app-data-table default-data-table" id="example">
                                                    <thead>
                                                        <tr>
                                                            <th width={10}>Sr no.</th>
                                                            <th>server name</th>
                                                            <th>status</th>
                                                            <th>ip address</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(servers) && servers.map((server, index) => (
                                                            <tr  >
                                                                <td>{index + 1}</td>
                                                                <td>{server.hostname}</td>
                                                                <td>
                                                                    {server.status == "active" ? (
                                                                        <span className="badge bg-success-subtle text-success text-uppercase">{server.status}</span>)
                                                                        : (
                                                                            <span className="badge bg-danger-subtle text-danger text-uppercase">{server.status}</span>
                                                                        )}
                                                                </td>
                                                                <td>{server.ip}</td>
                                                                <td className="d-flex gap-2">
                                                                    <button role="button"  onClick={() => handleRowClick(server.id)} className="badge text-white bg-success border-0 d-flex gap-2 align-items-center">
                                                                        <i className="ph ph-eye f-s-18" />
                                                                        View
                                                                    </button>

                                                                    <button onClick={() => confirmDelete(server?.id)} className="badge text-white bg-danger border-0 d-flex gap-2 align-items-center">
                                                                        <i className="ph ph-trash f-s-18" />
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div> */}
                                            <div className="app-datatable-default overflow-auto">
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

                                                <table className="datatable display app-data-table default-data-table" >
                                                    <thead>
                                                        <tr>
                                                            <th className="text-center">Sr No.</th>
                                                            <th>Server Name</th>
                                                            <th>Status</th>
                                                            <th>IP Address</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {paginatedData.length > 0 ? (
                                                            paginatedData.map((server, index) => (
                                                                <tr key={server.id}>
                                                                    <td>{(currentPage - 1) * entries + index + 1}</td>
                                                                    <td>{server.hostname}</td>
                                                                    <td>
                                                                        {server.status === "active" ? (
                                                                            <span className="badge bg-success-subtle text-success text-uppercase">
                                                                                {server.status}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="badge bg-danger-subtle text-danger text-uppercase">
                                                                                {server.status}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td>{server.ip}</td>
                                                                    <td className="d-flex gap-2">
                                                                        <button
                                                                            role="button"
                                                                            onClick={() => handleRowClick(server.id)}
                                                                            className="badge text-white bg-success border-0 d-flex gap-2 align-items-center"
                                                                        >
                                                                            <i className="ph ph-eye f-s-18" />
                                                                            View
                                                                        </button>

                                                                        <button
                                                                            onClick={() => confirmDelete(server?.id)}
                                                                            className="badge text-white bg-danger border-0 d-flex gap-2 align-items-center"
                                                                        >
                                                                            <i className="ph ph-trash f-s-18" />
                                                                            Delete
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={5} className="text-center py-3">
                                                                    No servers found
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
                        {/* Projects end */}


                    </div>

                </main>
                {/* modal 1 */}
                <div aria-hidden="true" aria-labelledby="projectCardLabel" className="modal fade" id="projectCard1" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="d-flex align-items-center gap-2">
                                    <h1 className="modal-title fs-5" id="projectCardLabel">Add SSH Key </h1>
                                    <iconify-icon icon="line-md:plus-circle" className="animeted-plus-circle f-s-22" />
                                </div>

                                <button aria-label="Close" className="btn-close" data-bs-dismiss="modal" type="button" />
                            </div>
                            <div className="modal-body">
                                <form className="app-form rounded-control  row g-3">
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="validationDefault01">Name</label>
                                        <input className="form-control" id="validationDefault01" type="text" placeholder="Enter SSH Key Name" required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="validationDefault02">SSH Key</label>
                                        <textarea className="form-control" id="validationDefault02" type="text" placeholder="Enter SSH Key Value" required />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" data-bs-dismiss="modal" type="button">Cancel</button>
                                <button className="btn btn-primary" id="addCard" type="button">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
export default Server;
