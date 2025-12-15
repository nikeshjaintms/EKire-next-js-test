"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useState, useEffect, useMemo } from "react";
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import TableControls from "@/components/datatable/TableControls";
import PaginationControls from "@/components/datatable/PaginationControls";

function Support() {

    const Support = 1;
    console.log(Support);

    const [activeTab, setActiveTab] = useState(1);
    const [tickets, setTickets] = useState([]);


    const router = useRouter();

    const handleCreateClick = () => {
        router.push('/support/create_ticket');
    };


    // view list suppost tickets 
    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        console.log('Fetching tickets...');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/support/tickets`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });

            const data = await res.json();
            console.log('Tickets fetched:', data);

            setTickets(data?.data || []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    // resolve tickts
    const handleResolve = async (ticketId) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to mark this ticket as resolved?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, resolve it',
            cancelButtonText: 'No, keep it open',
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/support/tickets/${ticketId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
                body: JSON.stringify({ status: 'resolved' }),
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Ticket Resolved',
                    text: data.message || 'The ticket was successfully marked as resolved.',
                }).then(() => {
                    fetchTickets(); // ✅ Refresh ticket list
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Failed to resolve ticket.',
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong.',
            });
        }
    };


    // api for view abuse tickets
    const [abuseTickets, setAbuseTickets] = useState([]);

    useEffect(() => {
        const fetchAbuseTickets = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/abuse/tickets`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                });

                const data = await res.json();

                if (res.ok && data.success && Array.isArray(data.data)) {
                    setAbuseTickets(data.data);
                } else {
                    console.error("API response invalid:", data);
                }
            } catch (error) {
                console.error("Failed to fetch abuse tickets:", error);
            }
        };

        fetchAbuseTickets();
    }, []);


    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };



    // auto load
    // const [isLoading, setIsLoading] = useState(true);
    // useEffect(() => {
    //     // Simulate loading
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 900);
    //     return () => clearTimeout(timer);
    // }, []);

    // datatable for support tickets
    const data = tickets || [];
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

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'open':
            return 'badge bg-primary text-white';
        case 'in_progress':
            return 'badge bg-warning text-dark';
        case 'on_hold':
            return 'badge bg-secondary text-white';
        case 'pending':
            return 'badge bg-info text-white';
        case 'resolved':
            return 'badge bg-success text-white';
        case 'closed':
            return 'badge bg-dark text-white';
        default:
            return 'badge bg-light text-dark';
    }
};

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
                <main className={`page-content ${isLoading ? 'pointer-events-none' : ''}`} style={{ opacity: isLoading ? 0.5 : 1 }}> */}
                <main>
                    <div className="container-fluid">
                        {/* Breadcrumb start */}
                        <div className="row m-1">
                            <div className="col-12 d-flex justify-content-between">
                                <h4 className="main-title">Support</h4>
                                <div className="text-end">
                                    <button className="btn btn-primary h-45 icon-btn m-2" onClick={handleCreateClick} >
                                        <i className="iconoir-open-new-window f-s-18" />  Create Support Ticket
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Breadcrumb end */}


                        <div className="row">
                            <div className="col-12">

                                {/* <div className="tab-wrapper mb-3">
                                    <ul className="tabs overflow-auto">
                                        <li className={`tab-link ${activeTab === 1 ? "active" : ""}`} onClick={() => setActiveTab(1)}>
                                            <i className="ph-bold  ph-align-right f-s-18" /> My Support Ticket
                                        </li>
                                        <li className={`tab-link ${activeTab === 2 ? "active" : ""}`} onClick={() => setActiveTab(2)}>
                                            <i className="ph-bold  ph-align-right f-s-18" /> View Abuse Ticket
                                        </li>
                                    </ul>
                                </div> */}

                                <div className="content-wrapper" id="card-container">
                                    {/* <div className={`tabs-content ${activeTab === 1 ? "active" : ""}`} id="tab-1">
                                        <div className="card p-l-r-30">
                                            <div className="card-body p-0">
                                                <div className="app-datatable-default overflow-auto">
                                                    <table className="datatable display app-data-table default-data-table" id="example">
                                                        <thead>
                                                            <tr>
                                                                <th width={10}>Sr no.</th>
                                                                <th>Description</th>
                                                                <th>Subject</th>
                                                                <th>Date</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tickets.map((ticket, index) => (
                                                                <tr key={ticket.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{ticket.description}</td>
                                                                    <td>{ticket.subject}</td>
                                                                    <td>{ticket.created_at}</td>
                                                                    <td>{ticket.status}</td>
                                                                    <td className="d-flex gap-2">
                                                                        <Link href={`/support/${ticket.id}`}>
                                                                            <span className="badge text-white bg-info d-flex gap-2">
                                                                                <i className="ph-duotone ph-eye f-s-18" /> View
                                                                            </span>
                                                                        </Link>


                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="card p-l-r-30 pt-3 pb-3">
                                        <div className="card-body p-0">
                                            {/* <div className="app-datatable-default overflow-auto">
                                                    <table className="datatable display app-data-table default-data-table" id="example">
                                                        <thead>
                                                            <tr>
                                                                <th width={10}>Sr no.</th>
                                                                <th>Description</th>
                                                                <th>Subject</th>
                                                                <th>Date</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tickets.map((ticket, index) => (
                                                                <tr key={ticket.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{ticket.description}</td>
                                                                    <td>{ticket.subject}</td>
                                                                    <td title={new Date(ticket.created_at).toLocaleString('en-GB', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: '2-digit',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        second: '2-digit',
                                                                        })}
                                                                        >
                                                                        {new Date(ticket.created_at).toLocaleDateString('en-GB', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: '2-digit',
                                                                        }).replace(/^(\d{1,2})/, '$1' + getDaySuffix(new Date(ticket.created_at).getDate()))}
                                                                    </td>
                                                                    <td>{ticket.status}</td>
                                                                    <td className="d-flex gap-2">
                                                                        <Link href={`/support/${ticket.id}`}>
                                                                            <span className="badge text-white bg-info d-flex gap-2">
                                                                                <i className="ph-duotone ph-eye f-s-18" /> View
                                                                            </span>
                                                                        </Link>
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

                                                <table className="datatable display app-data-table default-data-table">
                                                    <thead>
                                                        <tr>
                                                            <th width={10}>Sr No.</th>
                                                            <th>Description</th>
                                                            <th>Subject</th>
                                                            <th>Date</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paginatedData.length > 0 ? (
                                                            paginatedData.map((ticket, index) => (
                                                                <tr key={ticket.id}>
                                                                    <td>{(currentPage - 1) * entries + index + 1}</td>
                                                                    <td>{ticket.description}</td>
                                                                    <td>{ticket.subject}</td>
                                                                    <td
                                                                        title={new Date(ticket.created_at).toLocaleString("en-GB", {
                                                                            day: "numeric",
                                                                            month: "long",
                                                                            year: "2-digit",
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                            second: "2-digit",
                                                                        })}
                                                                    >
                                                                        {new Date(ticket.created_at)
                                                                            .toLocaleDateString("en-GB", {
                                                                                day: "numeric",
                                                                                month: "long",
                                                                                year: "2-digit",
                                                                            })
                                                                            .replace(
                                                                                /^(\d{1,2})/,
                                                                                "$1" + getDaySuffix(new Date(ticket.created_at).getDate())
                                                                            )}
                                                                    </td>
                                                                   <td>
                                                                        <span className={getStatusBadgeClass(ticket.status)}>
                                                                            {ticket.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex gap-2 justify-content-start">
                                                                            <Link href={`/support/${ticket.id}`}>
                                                                                <span className="badge text-white bg-info d-flex gap-2">
                                                                                    <i className="ph-duotone ph-eye f-s-18" /> View
                                                                                </span>
                                                                            </Link>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={6} className="text-center py-3">
                                                                    No support tickets found
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

                                    {/* <div className={`tabs-content ${activeTab === 2 ? "active" : ""}`} id="tab-2">
                                        <div className="card p-l-r-30">
                                            <div className="card-body p-0">
                                                <div className="app-datatable-default overflow-auto">
                                                    <table className="datatable display app-data-table default-data-table" id="example1">
                                                        <thead>
                                                            <tr>
                                                                <th width={10}>Sr No.</th>
                                                                <th>Subject</th>
                                                                <th>Description</th>
                                                                <th>Date</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {abuseTickets && abuseTickets.length > 0 && abuseTickets.map((ticket, index) => (
                                                                <tr key={ticket.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{ticket.subject}</td>
                                                                    <td>{ticket.description}</td>
                                                                    <td>{new Date(ticket.created_at).toLocaleString()}</td>
                                                                    <td>{ticket.status.replaceAll('_', ' ')}</td>
                                                                    <td className="d-flex gap-2">
                                                                        <Link href={`/abuse/${ticket.id}`}>
                                                                            <span className="badge text-white bg-info d-flex gap-2">
                                                                                <i className="ph-duotone ph-eye f-s-18" /> View
                                                                            </span>
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>

                                                    </table>
                                                </div>

                                            </div>
                                        </div>
                                    </div> */}
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
export default Support;
