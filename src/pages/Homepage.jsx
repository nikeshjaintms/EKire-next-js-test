"use client";
import React, { Fragment, useEffect, useState, useRef, useMemo } from "react";
// import Image from "next/image";
// import Slider from 'react-slick';
import Cookies from "js-cookie";
import Link from "next/link";
import TableControls from "@/components/datatable/TableControls";
import PaginationControls from "@/components/datatable/PaginationControls"


import $ from "jquery";
// import "datatables.net";

const Homepage = () => {


    // auto load
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
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


    // vertical slider
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        let scrollInterval;

        if (container) {
            const scrollStep = 1;
            const scrollDelay = 15;

            const startScrolling = () => {
                scrollInterval = setInterval(() => {
                    container.scrollTop += scrollStep;

                    if (container.scrollTop >= container.scrollHeight / 2) {
                        container.scrollTop = 0;
                    }
                }, scrollDelay);
            };

            startScrolling();

            const stopScrolling = () => clearInterval(scrollInterval);

            container.addEventListener("mouseenter", stopScrolling);
            container.addEventListener("mouseleave", startScrolling);

            return () => {
                stopScrolling();
                container.removeEventListener("mouseenter", stopScrolling);
                container.removeEventListener("mouseleave", startScrolling);
            };
        }
    }, []);
// pan header avagr kevu lagse
// included kari dejo no ned different component and hamna me ne Home.jsx banayu ema css nati aavti toh jo me kevi rite karyu che 
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const modalEl = document.getElementById('welcomeCard');
            const bootstrapModal = window.bootstrap?.Modal;
            const lastShown = localStorage.getItem('welcomeModalLastShown');

            const now = new Date().getTime();
            const hours5 = 5 * 60 * 60 * 1000; // 5 hours in ms

            if (!lastShown || now - parseInt(lastShown) > hours5) {
                if (modalEl && bootstrapModal) {
                    const modal = new bootstrapModal(modalEl);
                    modal.show();
                    localStorage.setItem('welcomeModalLastShown', now.toString());
                }
            }
        }
    }, []);

    // ---------------- Transactions ----------------
    const [transactions, setTransactions] = useState([]);
    const [txnSearch, setTxnSearch] = useState("");
    const [txnEntries, setTxnEntries] = useState(2);
    const [txnPage, setTxnPage] = useState(1);

    // ---------------- Support Tickets ----------------
    const [tickets, setTickets] = useState([]);
    const [ticketSearch, setTicketSearch] = useState("");
    const [ticketEntries, setTicketEntries] = useState(2);
    const [ticketPage, setTicketPage] = useState(1);

    // ---------------- Abuse Tickets ----------------
    const [abuseTickets, setAbuseTickets] = useState([]);
    const [abuseSearch, setAbuseSearch] = useState("");
    const [abuseEntries, setAbuseEntries] = useState(2);
    const [abusePage, setAbusePage] = useState(1);
    const [abuseSummary, setAbuseSummary] = useState({ open: 0, awaiting_user_response: 0, closed: 0, suspension_warning: "" });

    // ---------------- Suggestions ----------------
    const [suggestions, setSuggestions] = useState([]);
    const [suggestSearch, setSuggestSearch] = useState("");
    const [suggestEntries, setSuggestEntries] = useState(2);
    const [suggestPage, setSuggestPage] = useState(1);
    const [suggestTotal, setSuggestTotal] = useState(0);

    // ---------------- Stripe ----------------
    const [stripePayments, setStripePayments] = useState([]);
    const [stripeSearch, setStripeSearch] = useState("");
    const [stripeEntries, setStripeEntries] = useState(2);
    const [stripePage, setStripePage] = useState(1);
    const [stripeTotal, setStripeTotal] = useState(0);

    // ---------------- Logs ----------------
    const [logs, setLogs] = useState([]);
    const [logsSearch, setLogsSearch] = useState("");
    const [logsEntries, setLogsEntries] = useState(2);
    const [logsPage, setLogsPage] = useState(1);

    const [wallet, setWallet] = useState([]);
    const [servers, setServers] = useState([]);
    const [votescasted, setVotescasted] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [withdrawallog, setWithdrawallog] = useState([]); 
    const [projects, setProjects] = useState([]);
    const [affiliates, setAffiliates] = useState([]);
    const [affiliateslog, setAffiliateslog] = useState([]);
    const [affliatepaypalTotal, setAffliatespaypalTotal] = useState(0);
    const [showmsg , setShowmsg] = useState(false);

    // ---------------- Fetch Dashboard Data ----------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dashboard`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    },
                });
                const result = await res.json();
                if (res.ok && result?.data) {
                    setWallet(result.data.wallet || []);
                    setServers(result.data.servers || []);
                    setTransactions(result.data.transactions || []);
                    setTickets(result.data.support_tickets?.recent || []);
                    setVotescasted(result.data.votes_casted || []);
                    setProjects(result.data.projects || []);

                    const abuseData = result.data.abuse;
                    if (abuseData) {
                        setAbuseSummary({
                            open: abuseData.open,
                            awaiting_user_response: abuseData.awaiting_user_response,
                            closed: abuseData.closed,
                            suspension_warning: abuseData.suspension_warning,
                        });
                        setAbuseTickets(abuseData.last_active ? [abuseData.last_active] : []);
                    }

                    setSuggestTotal(result.data.suggestions?.total || 0);
                    setSuggestions(result.data.suggestions?.recent || []);

                    setStripeTotal(result.data.stripe?.total_payment || 0);
                    setStripePayments(result.data.stripe?.recent || []);

                    setLogs(result.data.logs?.recent || []);

                    const withdrawalData = result.data.withdrawals;
                    setWithdrawals(withdrawalData || []);

                    if (withdrawalData.recent.length > 0) {
                        setWithdrawallog(withdrawalData.recent);
                    }

                    const affiliateData = result.data.affiliate_data;

                    if((affiliateData.payout_status === null || affiliateData.payout_status === "") && affiliateData.admin_approval_status?.toLowerCase() === "approved" ){
                        setShowmsg(true);
                    }

                    setAffiliates(affiliateData || []);
                    if (affiliateData.paypal) {
                        setAffliatespaypalTotal(affiliateData.paypal.total_payment || 0);
                    }
                    if (affiliateData.paypal.recent.length > 0) {
                        setAffiliateslog(affiliateData.paypal.recent|| []);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);
    // ---------------- Filter & Pagination Helpers ----------------
    const getFilteredData = (data, search) =>
        data.filter(row =>
            Object.values(row).some(val =>
                String(val).toLowerCase().includes(search.toLowerCase())
            )
        );

    const getPaginatedData = (data, page, entries) => {
        const start = (page - 1) * entries;
        return data.slice(start, start + entries);
    };

    const filteredTransactions = useMemo(() => getFilteredData(transactions, txnSearch), [transactions, txnSearch]);
    const paginatedTransactions = useMemo(() => getPaginatedData(filteredTransactions, txnPage, txnEntries), [filteredTransactions, txnPage, txnEntries]);

    const filteredTickets = useMemo(() => getFilteredData(tickets, ticketSearch), [tickets, ticketSearch]);
    const paginatedTickets = useMemo(() => getPaginatedData(filteredTickets, ticketPage, ticketEntries), [filteredTickets, ticketPage, ticketEntries]);

    const filteredAbuse = useMemo(() => getFilteredData(abuseTickets, abuseSearch), [abuseTickets, abuseSearch]);
    const paginatedAbuse = useMemo(() => getPaginatedData(filteredAbuse, abusePage, abuseEntries), [filteredAbuse, abusePage, abuseEntries]);

    const filteredSuggestions = useMemo(() => getFilteredData(suggestions, suggestSearch), [suggestions, suggestSearch]);
    const paginatedSuggestions = useMemo(() => getPaginatedData(filteredSuggestions, suggestPage, suggestEntries), [filteredSuggestions, suggestPage, suggestEntries]);

    const filteredStripe = useMemo(() => getFilteredData(stripePayments, stripeSearch), [stripePayments, stripeSearch]);
    const paginatedStripe = useMemo(() => getPaginatedData(filteredStripe, stripePage, stripeEntries), [filteredStripe, stripePage, stripeEntries]);

    const filteredLogs = useMemo(() => getFilteredData(logs, logsSearch), [logs, logsSearch]);
    const paginatedLogs = useMemo(() => getPaginatedData(filteredLogs, logsPage, logsEntries), [filteredLogs, logsPage, logsEntries]);

    // ---------------- Badge Helpers ----------------
    const getTxnBadge = type => type === "spend" ? "badge bg-danger text-white" : type === "credit" ? "badge bg-success text-white" : "badge bg-secondary text-white";
    const getTicketBadge = status => status === "open" ? "badge bg-info text-white" : status === "closed" ? "badge bg-success text-white" : "badge bg-warning text-white";
    const getAbuseBadge = status => status === "open" ? "badge bg-info text-white" : status === "closed" ? "badge bg-success text-white" : "badge bg-warning text-white";

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);    

    return (
        <Fragment>

            {/* <Header /> */}
            {/* <div className="position-relative">
                {isLoading && (
                    <div
                        className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
                        style={{
                            background: '#f6f6f6',
                            zIndex: 1000,
                        }}
                    >
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )} */}

            {/* Always rendered page content */}
            <main >
                <div className="container-fluid mt-3">
                    {/* <h1>Page is Under Construction</h1> */}
                </div>


                <div className="container-fluid mt-3">
                    <div className="alert alert-light-border-primary alert-dismissible  d-flex align-items-center justify-content-between mt-3 cookies-alert" role="alert">
                        <p className="mb-0 d-flex align-items-center flex-row">
                            <iconify-icon icon="line-md:alert-circle-loop" className="f-s-20 me-2"></iconify-icon>
                            Add your payment details to enable automatic payments for invoices and service charges
                        </p>
                        <button aria-label="Close" className="btn-close text-white" data-bs-dismiss="alert" type="button" />
                    </div>
                    <div className="alert alert-primary alert-dismissible  d-flex align-items-center justify-content-between mt-3 cookies-alert" role="alert">
                        <p className="mb-0 d-flex align-items-center flex-row">
                            <img alt="image" className="w-20 h-20 me-2" src="../assets/images/icons/cookie-.png" />
                            We have Cookies! We use it to ensure you get the best experience on our website and service
                        </p>
                        <button aria-label="Close" className="btn-close text-white" data-bs-dismiss="alert" type="button" />
                    </div>
                    <div className="alert alert-light-border-danger alert-dismissible  d-flex align-items-center justify-content-between mt-3 cookies-alert" role="alert">
                        <p className="mb-0 d-flex align-items-center flex-row">
                            <iconify-icon icon="line-md:phone-add" className="f-s-20 me-2"></iconify-icon>
                            Add your payment details to enable automatic payments for invoices and service charges
                        </p>
                        <button aria-label="Close" className="btn-close text-white" data-bs-dismiss="alert" type="button" />
                    </div>
                    <div className="row">

                        <div className="col-lg-12 col-xxl-12">
                            <div className="row">

                                <div className="col-xxl-6 col-lg-6">
                                    <div className="card project-total-card">
                                        <div className="card-body">
                                            <div className="d-flex position-relative align-items-center gap-2">
                                                <span className="device-menu-img">
                                                    <i className="iconoir-card-wallet f-s-40 text-primary" />
                                                </span>
                                                <h5 className="text-dark txt-ellipsis-1">Wallet</h5>
                                                {/* <div className="clock-box">
                                                    <img alt="avtar" className="img-fluid" src="../assets/images/New/Animation.gif" />
                                                </div> */}
                                            </div>
                                            <ul className="d-flex align-items-center gap-2 tracker-history-list app-scroll mt-3">
                                                <li className="bg-info-300">
                                                    <div>
                                                        <h6 className="text-info-dark mb-0">Current Amount</h6>
                                                    </div>
                                                    <div className="text-info-dark f-w-600 ms-2"><b>{wallet.current_amount}</b></div>
                                                </li>
                                                <li className="bg-primary-300 mt-0">
                                                    <div>
                                                        <h6 className="text-primary-dark mb-0">Total Spend</h6>
                                                    </div>
                                                    <div className="text-primary-dark f-w-600 ms-2"><b>{wallet.total_spend}</b></div>
                                                </li>
                                                <li className="bg-primary-300 mt-0">
                                                    <div>
                                                        <h6 className="text-primary-dark mb-0">Locked Bonus</h6>
                                                    </div>
                                                    <div className="text-primary-dark f-w-600 ms-2"><b>{wallet.locked_bonus}</b></div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-lg-6">
                                    <div className="card bg-white">
                                        <div className="card-body">
                                            <div className="d-flex position-relative align-items-center gap-2">
                                                <h5 className="text-dark txt-ellipsis-1">Servers</h5>
                                                <div className="clock-box">
                                                    <img alt="avtar" className="img-fluid" src="../assets/images/New/Animation.gif" />
                                                </div>
                                            </div>
                                            <ul className="d-flex align-items-center gap-2 tracker-history-list app-scroll mt-4">
                                                <li className="bg-info-300">
                                                    <div>
                                                        <h6 className="text-info-dark mb-0">Total</h6>
                                                    </div>
                                                    <div className="text-info-dark f-w-600 ms-2"><b>{servers.total}</b></div>
                                                </li>
                                                <li className="bg-primary-300 mt-0">
                                                    <div>
                                                        <h6 className="text-primary-dark mb-0">Active</h6>
                                                    </div>
                                                    <div className="text-primary-dark f-w-600 ms-2"><b>{servers.active}</b></div>
                                                </li>
                                                <li className="bg-primary-300 mt-0">
                                                    <div>
                                                        <h6 className="text-primary-dark mb-0">Suspended</h6>
                                                    </div>
                                                    <div className="text-primary-dark f-w-600 ms-2"><b>{servers.suspended}</b></div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-lg-6">
                                    <div className="card core-teams-card">
                                        <div className="card-body">
                                            <div className="d-flex">
                                                <h5 className="text-dark f-w-600 txt-ellipsis-1">Projects</h5>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-end">
                                                <h2 className="text-warning-dark mb-0 ">{projects.total}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-6 col-lg-6">
                                    <div className="card bg-white">
                                        <div className="card-body">
                                            <div className="d-flex position-relative align-items-center gap-2">
                                                <h5 className="text-dark txt-ellipsis-1">Votes casted</h5>
                                            </div>
                                            <ul className="d-flex align-items-center gap-2 tracker-history-list app-scroll mt-4">
                                                <li className="bg-info-300">
                                                    <div>
                                                        <h6 className="text-info-dark mb-0">Total</h6>
                                                    </div>
                                                    <div className="text-info-dark f-w-600 ms-2"><b>{votescasted.total}</b></div>
                                                </li>
                                                <li className="bg-primary-300 mt-0">
                                                    <div>
                                                        <h6 className="text-primary-dark mb-0">Upvotes</h6>
                                                    </div>
                                                    <div className="text-primary-dark f-w-600 ms-2"><b>{votescasted.upvotes}</b></div>
                                                </li>
                                                <li className="bg-primary-300 mt-0">
                                                    <div>
                                                        <h6 className="text-primary-dark mb-0">Downvotes</h6>
                                                    </div>
                                                    <div className="text-primary-dark f-w-600 ms-2"><b>{votescasted.downvotes}</b></div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-md-12 col-xxl-8">
                            <div className="card">
                                <div className="card-body">
                                    <div className="fade-s app-arrow">
                                        <Slider {...settings}>
                                            <div className="item slide-slick image-overlay-wrapper">
                                                <img alt="image" className="img-fluid rounded" src="../assets/images/new/offer.png" />
                                                <div className="gradient-overlay" />
                                                <div className="text-overlay">
                                                    <span className="tag">Special Offer</span>
                                                    <h2 className="headline">🚀 Black Friday 2024 Promotion: Save Big on Cloud Servers! </h2>
                                                </div>
                                            </div>

                                            <div className="item slide-slick image-overlay-wrapper">
                                                <img alt="image" className="img-fluid rounded" src="../assets/images/new/promo.png" />
                                                <div className="gradient-overlay" />
                                                <div className="text-overlay">
                                                    <span className="tag">Promo Code </span>
                                                    <h2 className="headline">🎉 Don’t Miss Out – Apply Your Magic Code!</h2>
                                                </div>
                                            </div>

                                            <div className="item slide-slick image-overlay-wrapper">
                                                <img alt="image" className="img-fluid rounded" src="../assets/images/new/plan.png" />
                                                <div className="gradient-overlay" />
                                                <div className="text-overlay">
                                                    <span className="tag">Plans Link</span>
                                                    <h2 className="headline">💼 No Hidden Fees. Just Smart Choices.</h2>
                                                </div>
                                            </div>
                                        </Slider>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* <div className="col-md-12 col-xxl-4">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card ">
                                        <div className="card-body">
                                            <div className="project-expense" id="projectExpense" style={{ height: "26rem !important" }} /> 
                                            <div id="timeseries-chart"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        {/* ---------------- Transactions ---------------- */}
                        <div className="col-lg-7 col-xxl-6 order-1-md">
                            <div className="card p-l-r-30">
                                <div className="card-body p-0 pt-3 pb-3 ">
                            <div className="p-3"><h5>Transactions</h5></div>
                                    <div className="app-datatable-default overflow-auto">
                                        {/* <TableControls entries={txnEntries} setEntries={val => { setTxnEntries(val); setTxnPage(1); }} search={txnSearch} setSearch={val => { setTxnSearch(val); setTxnPage(1); }} /> */}
                                        <table className="datatable display app-data-table default-data-table">
                                            <thead>
                                                <tr><th>Sr No.</th><th>Amount</th><th>Type</th><th>Description</th><th>Date</th></tr>
                                            </thead>
                                            <tbody>
                                                {transactions.length > 0 ? transactions.map((txn, i) => (
                                                    <tr key={txn.id}>
                                                        <td>{(txnPage - 1) * txnEntries + i + 1}</td>
                                                        <td>{txn.amount}</td>
                                                        <td><span className={getTxnBadge(txn.type)}>{capitalize(txn.type)}</span></td>
                                                        <td>{txn.description}</td>
                                                        <td title={new Date(txn.created_at).toLocaleString()}>{new Date(txn.created_at).toLocaleDateString("en-GB")}</td>
                                                    </tr>
                                                )) : <tr><td colSpan={5} className="text-center py-3">No transactions</td></tr>}
                                            </tbody>
                                        </table>
                                        {/* <PaginationControls currentPage={txnPage} setCurrentPage={setTxnPage} entries={txnEntries} totalCount={filteredTransactions.length} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                          {/* ---------------- Suggestions ---------------- */}
                        <div className="col-lg-7 col-xxl-6 order-4-md">
                            <div className="card bg-white mb-3">
                                <div className="card-body">
                                     <div className="p-3"><h5>Suggestions</h5></div>
                                    <ul className="d-flex align-items-center gap-2 tracker-history-list app-scroll">
                                        <li className="bg-info-300"><div><h6 className="text-info-dark mb-0 me-4">Total</h6></div><div className="text-info-dark f-w-600 ms-2"><b>{suggestTotal}</b></div></li>
                                    </ul>
                                {/* </div>
                            </div>
                            <div className="card p-l-r-30">
                                <div className="card-body p-0 pt-3 pb-3"> */}
                                    <div className="app-datatable-default overflow-auto mt-3">
                                        {/* <TableControls entries={suggestEntries} setEntries={val => { setSuggestEntries(val); setSuggestPage(1); }} search={suggestSearch} setSearch={val => { setSuggestSearch(val); setSuggestPage(1); }} /> */}
                                        <table className="datatable display app-data-table default-data-table">
                                            <thead><tr><th>Id</th><th>Title</th><th>Status</th><th>Votes Count</th><th>Created At</th></tr></thead>
                                            <tbody>
                                                {suggestions.length > 0 ? suggestions.map((s, i) => (
                                                    <tr key={s.id}>
                                                        <td>{ i + 1}</td>
                                                        <td>{s.title}</td>
                                                        <td>{s.status === "pending" ? (
                                                            <span className="badge bg-warning text-dark">{capitalize(s.status.replace("_", " "))}</span>
                                                        ) : s.status === "approved" ? (
                                                            <span className="badge bg-success">{capitalize(s.status.replace("_", " "))}</span>
                                                        ) : s.status === "rejected" ? (
                                                            <span className="badge bg-danger">{capitalize(s.status.replace("_", " "))}</span>
                                                        ) : (
                                                            <span className="badge bg-secondary">{capitalize(s.status.replace("_", " "))}</span>
                                                        )}</td>
                                                        <td>{s.votes_count}</td>
                                                        <td>{new Date(s.created_at).toLocaleDateString("en-GB")}</td>
                                                    </tr>
                                                )) : <tr><td colSpan={5} className="text-center py-3">No suggestions</td></tr>}
                                            </tbody>
                                        </table>
                                        {/* <PaginationControls currentPage={suggestPage} setCurrentPage={setSuggestPage} entries={suggestEntries} totalCount={filteredSuggestions.length} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* ---------------- Support Tickets ---------------- */}
                        <div className="col-lg-7 col-xxl-6 order-2-md">
                            <div className="card bg-white mb-3">
                                <div className="card-body">
                                <div className="p-3"><h5>Support Tickets</h5></div>
                                    <ul className="d-flex align-items-center gap-2 tracker-history-list app-scroll">
                                        <li className="bg-info-300 mt-2"><div><h6 className="text-info-dark mb-0 me-4">Open</h6></div><div className="text-info-dark f-w-600 ms-2"><b>{tickets.filter(t => t.status === "open").length}</b></div></li>
                                        <li className="bg-success-300"><div><h6 className="text-success-dark mb-0 me-4">Closed</h6></div><div className="text-success-dark f-w-600 ms-2"><b>{tickets.filter(t => t.status === "closed").length}</b></div></li>
                                        <li className="bg-warning-300"><div><h6 className="text-warning-dark mb-0 me-4">Other</h6></div><div className="text-warning-dark f-w-600 ms-2"><b>{tickets.filter(t => !["open", "closed"].includes(t.status)).length}</b></div></li>
                                    </ul>
                                {/* </div>
                            </div>
                            <div className="card p-l-r-30">
                                <div className="card-body p-0 pt-3 pb-3"> */}
                                    <div className="app-datatable-default overflow-auto mt-4">
                                        {/* <TableControls entries={ticketEntries} setEntries={val => { setTicketEntries(val); setTicketPage(1); }} search={ticketSearch} setSearch={val => { setTicketSearch(val); setTicketPage(1); }} /> */}
                                        <table className="datatable display app-data-table default-data-table">
                                            <thead><tr><th>Sr No.</th><th>Subject</th><th>Status</th><th>Created At</th></tr></thead>
                                            <tbody>
                                                {tickets.length > 0 ? tickets.map((t, i) => (
                                                    <tr key={t.id}>
                                                        <td>{ i + 1}</td>
                                                        <td>{t.subject}</td>
                                                        <td><span className={getTicketBadge(t.status)}>{capitalize(t.status.replace("_", " "))}</span></td>
                                                        <td title={new Date(t.created_at).toLocaleString()}>{new Date(t.created_at).toLocaleDateString("en-GB")}</td>
                                                    </tr>
                                                )) : <tr><td colSpan={4} className="text-center py-3">No tickets</td></tr>}
                                            </tbody>
                                        </table>
                                        {/* <PaginationControls currentPage={ticketPage} setCurrentPage={setTicketPage} entries={ticketEntries} totalCount={filteredTickets.length} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ---------------- Abuse Tickets ---------------- */}
                        <div className="col-lg-7 col-xxl-6 order-3-md">
                            <div className="card bg-white mb-3">
                                <div className="card-body">
                            <div className="p-3"><h5>Abuse Tickets</h5></div>
                                    <ul className="d-flex align-items-center gap-2 tracker-history-list app-scroll">
                                        <li className="bg-info-300 mt-2"><div><h6 className="text-info-dark mb-0 me-4">Open :</h6></div><div className="text-info-dark f-w-600 ms-2"><b>{abuseSummary.open}</b></div></li>
                                        <li className="bg-warning-300"><div><h6 className="text-warning-dark mb-0 me-4">Awaiting user response :</h6></div><div className="text-warning-dark f-w-600 ms-2"><b>{abuseSummary.awaiting_user_response}</b></div></li>
                                        <li className="bg-success-300"><div><h6 className="text-success-dark mb-0 me-4">Closed :</h6></div><div className="text-success-dark f-w-600 ms-2"><b>{abuseSummary.closed}</b></div></li>
                                    </ul>
                                    {abuseSummary.suspension_warning && (
                                        <ul className="d-flex align-items-center gap-2 tracker-history-list app-scroll mt-3">
                                            <li className="bg-warning-300 mt-0">
                                                <div><h6 className="text-warning-dark mb-0 me-4">Suspension warning :</h6></div>
                                                <div className="text-warning-dark f-w-600 ms-2"><b>{abuseSummary.suspension_warning}</b></div>
                                            </li>
                                        </ul>
                                    )}
                                {/* </div>
                            </div>
                            <div className="card p-l-r-30">
                                <div className="card-body p-0 pt-3 pb-3"> */}
                                    <div className="app-datatable-default overflow-auto mt-4">
                                        {/* <TableControls entries={abuseEntries} setEntries={val => { setAbuseEntries(val); setAbusePage(1); }} search={abuseSearch} setSearch={val => { setAbuseSearch(val); setAbusePage(1); }} /> */}
                                        <table className="datatable display app-data-table default-data-table">
                                            <thead><tr><th>Sr No.</th><th>Subject</th><th>Status</th><th>Created At</th></tr></thead>
                                            <tbody>
                                                {abuseTickets.length > 0 ? abuseTickets.map((t, i) => (
                                                    <tr key={t.id}>
                                                        <td>{i + 1}</td>
                                                        <td>{t.subject}</td>
                                                        <td><span className={getAbuseBadge(t.status)}>{capitalize(t.status.replace("_", " "))}</span></td>
                                                        <td>{new Date(t.created_at).toLocaleDateString("en-GB")}</td>
                                                    </tr>
                                                )) : <tr><td colSpan={4} className="text-center py-3">No abuse tickets</td></tr>}
                                            </tbody>
                                        </table>
                                        {/* <PaginationControls currentPage={abusePage} setCurrentPage={setAbusePage} entries={abuseEntries} totalCount={filteredAbuse.length} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                      

                        {/* ---------------- Stripe ---------------- */}
                        <div className="col-lg-7 col-xxl-6 order-5-md">
                            <div className="card bg-white mb-3">
                                <div className="card-body">
                                    <ul className="d-flex align-items-center gap-2 tracker-history-list app-scroll">
                                    <div className="p-3"><h5>Stripe</h5></div>
                                        <li className="bg-info-300"><div className="float-end"><h6 className="text-info-dark mb-0 me-4">Total Payment</h6></div><div className="text-info-dark f-w-600 ms-2"><b>{stripeTotal}</b></div></li>
                                    </ul>
                                {/* </div>
                            </div>
                            <div className="card p-l-r-30">
                                <div className="card-body p-0 pt-3 pb-3"> */}
                                    <div className="app-datatable-default overflow-auto mt-3">
                                        {/* <TableControls entries={stripeEntries} setEntries={val => { setStripeEntries(val); setStripePage(1); }} search={stripeSearch} setSearch={val => { setStripeSearch(val); setStripePage(1); }} /> */}
                                        <table className="datatable display app-data-table default-data-table">
                                            <thead><tr><th>Id</th><th>Status</th><th>Amount</th><th>Created At</th></tr></thead>
                                            <tbody>
                                                {stripePayments.length > 0 ? stripePayments.map((s, i) => (
                                                    <tr key={s.id}>
                                                        <td>{i + 1}</td>
                                                        <td> {s.status === "unpaid" || s.status === "Unpaid" ? (
                                                            <span className="badge bg-warning text-dark">{capitalize(s.status.replace("_", " "))}</span>
                                                        ) : s.status === "paid" || s.status === 'Paid' ? (
                                                            <span className="badge bg-success">{capitalize(s.status.replace("_", " "))}</span>
                                                        ) : s.status === "refunded" || s.status === 'Refunded' ? (
                                                            <span className="badge bg-danger">{capitalize(s.status.replace("_", " "))}</span>
                                                        ) : (
                                                            <span className="badge bg-secondary">Unknown</span>
                                                        )}</td>
                                                        <td>{s.amount}</td>
                                                        <td>{new Date(s.created_at).toLocaleDateString("en-GB")}</td>
                                                    </tr>
                                                )) : <tr><td colSpan={4} className="text-center py-3">No payments</td></tr>}
                                            </tbody>
                                        </table>
                                        {/* <PaginationControls currentPage={stripePage} setCurrentPage={setStripePage} entries={stripeEntries} totalCount={filteredStripe.length} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>


                       

                        {/* ---------------- Logs ---------------- */}
                        <div className="col-lg-7 col-xxl-6 order-6-md">
                            <div className="card p-l-r-30">
                                <div className="card-body p-0 pt-3 pb-3">
                            <div className="p-3"><h5>Logs</h5></div>
                                    <div className="app-datatable-default overflow-auto">
                                        {/* <TableControls entries={logsEntries} setEntries={val => { setLogsEntries(val); setLogsPage(1); }} search={logsSearch} setSearch={val => { setLogsSearch(val); setLogsPage(1); }} /> */}
                                        <table className="datatable display app-data-table default-data-table">
                                            <thead><tr><th>Id</th><th>Activity</th>
                                            {/* <th>Method</th><th>URL</th><th>IP</th> */}
                                            <th>Created At</th></tr></thead>
                                            <tbody>
                                                {logs.length > 0 ? logs.map((l, i) => (
                                                    <tr key={l.id}>
                                                        <td>{i + 1}</td>
                                                        <td>{l.activity}</td>
                                                        {/* <td>{l.method}</td> */}
                                                        {/* <td>{l.url}</td> */}
                                                        {/* <td>{l.ip}</td> */}
                                                        <td>{new Date(l.created_at).toLocaleString()}</td>
                                                    </tr>
                                                )) : <tr><td colSpan={6} className="text-center py-3">No logs</td></tr>}
                                            </tbody>
                                        </table>
                                        {/* <PaginationControls currentPage={logsPage} setCurrentPage={setLogsPage} entries={logsEntries} totalCount={filteredLogs.length} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                         {/* ---------------- Withdrawals ---------------- */}
                        <div className="col-lg-12 col-xxl-12 order-5-md">
                            <div className="card bg-white mb-3">
                                <div className="card-body">
                                    <div className="p-3"><h5>Withdrawls</h5></div>
                                    <ul className="d-flex align-items-center gap-2 tracker-history-list app-scroll">
                                        <li className="bg-info-300 mt-2"><div><h6 className="text-info-dark mb-0 me-4">Total Request</h6></div><div className="text-info-dark f-w-600 ms-2"><b>{withdrawals.total_requests}</b></div></li>
                                        <li className="bg-success-300"><div><h6 className="text-info-dark mb-0 me-4">Approved</h6></div><div className="text-info-dark f-w-600 ms-2"><b>{withdrawals.approved}</b></div></li>
                                        <li className="bg-danger-300"><div><h6 className="text-info-dark mb-0 me-4">Rejected</h6></div><div className="text-info-dark f-w-600 ms-2"><b>{withdrawals.rejected}</b></div></li>
                                        <li className="bg-warning-300"><div><h6 className="text-info-dark mb-0 me-4">Pending</h6></div><div className="text-info-dark f-w-600 ms-2"><b>{withdrawals.pending}</b></div></li>
                                        <li className="bg-info-300"><div><h6 className="text-info-dark mb-0 me-4">Minimum Withdrawal Amount</h6></div><div className="text-info-dark f-w-600 ms-2"><b>{withdrawals.minimum_withdrawal_amount}</b></div></li>
                                    </ul>
                                {/* </div>
                            </div>
                            <div className="card p-l-r-30">
                                <div className="card-body p-0 pt-3 pb-3"> */}
                                    <div className="app-datatable-default overflow-auto mt-3">
                                        {/* <TableControls entries={stripeEntries} setEntries={val => { setStripeEntries(val); setStripePage(1); }} search={stripeSearch} setSearch={val => { setStripeSearch(val); setStripePage(1); }} /> */}
                                        <table className="datatable display app-data-table default-data-table">
                                            <thead><tr>
                                                <th>#</th>
                                                <th className="text-center">
                                                Created At
                                                </th>
                                                <th>Amount</th>
                                                <th>Method</th>
                                                <th>Status</th>
                                        </tr>
                                        </thead>
                                            <tbody>
                                                {withdrawallog.length > 0 ? withdrawallog.map((s, i) => (
                                                    <tr key={s.id}>
                                                        <td>{i + 1}</td>
                                                        <td>
                                                            {
                                                                new Date(s.created_at)
                                                                .toISOString()
                                                                .replace("T", " ")
                                                                .split(".")[0]
                                                            }
                                                        </td>     
                                                        <td>{s.amount}</td>
                                                        <td>{s.method}</td>
                                                        <td className="d-flex align-items-centre gap-3">
                                                        <span
                                                            className={`badge ${
                                                            s.status === "completed" ||
                                                            s.status === "approved"
                                                                ? "bg-success"
                                                                : s.status === "pending"
                                                                ? "bg-warning"
                                                                : "bg-danger"
                                                            } text-white`}
                                                        >
                                                            {s.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            s.status.slice(1)}
                                                        </span>
                                                        </td>
                                                    </tr>
                                                )) : <tr><td colSpan={5} className="text-center py-3">No Withdrawals available</td></tr>}
                                            </tbody>
                                        </table>
                                        {/* <PaginationControls currentPage={stripePage} setCurrentPage={setStripePage} entries={stripeEntries} totalCount={filteredStripe.length} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                          {/* ---------------- Affiliate Withdrawals ---------------- */}
                        <div className="col-lg-12 col-xxl-12 order-5-md">
                            <div className="card bg-white mb-3">
                                <div className="card-body">
                                    <div className="p-3"><h5>Affiliate</h5></div>
                                    <ul className="d-flex align-items-center gap-2 tracker-history-list app-scroll">
                                        <li className="bg-info-300 mt-2"><div><h6 className="text-info-dark mb-0 me-4">Approval Status</h6></div><div className="text-info-dark f-w-600 ms-2"><b>{affiliates.admin_approval_status
                                            ? affiliates.admin_approval_status.charAt(0).toUpperCase() + affiliates.admin_approval_status.slice(1).toLowerCase()
                                            : ""}</b></div></li>
                                        <li className="bg-success-300"><div><h6 className="text-info-dark mb-0 me-4">Referral code</h6></div><div className="text-info-dark f-w-600 ms-2"><b>{affiliates.referral_code}</b></div></li>
                                        <li className="bg-danger-300"><div><h6 className="text-info-dark mb-0 me-4">Affiliate Clicks</h6></div><div className="text-info-dark f-w-600 ms-2"><b>{affiliates.affiliate_clicks}</b></div></li>
                                        <li className="bg-info-300"><div><h6 className="text-info-dark mb-0 me-4">Total Payments</h6></div><div className="text-info-dark f-w-600 ms-2"><b>{affliatepaypalTotal}</b></div></li>
                                    </ul>
                                    {showmsg  &&(
                                        <ul className="d-flex align-items-center gap-2 tracker-history-list app-scroll mt-3">
                                            <li className="bg-warning-300 mt-0">
                                                <div><h6 className="text-warning-dark mb-0 me-4">Affiliate Warning : Please Add bank Details</h6></div>
                                                <div className="text-warning-dark f-w-600 ms-2"><b>{}</b></div>
                                            </li>
                                        </ul>
                                    )}
                                {/* </div>
                            </div>
                            <div className="card p-l-r-30">
                                <div className="card-body p-0 pt-3 pb-3"> */}
                                    <div className="app-datatable-default overflow-auto mt-3">
                                        {/* <TableControls entries={stripeEntries} setEntries={val => { setStripeEntries(val); setStripePage(1); }} search={stripeSearch} setSearch={val => { setStripeSearch(val); setStripePage(1); }} /> */}
                                        <table className="datatable display app-data-table default-data-table">
                                            <thead><tr>
                                                <th>#</th>
                                                <th>Amount</th>
                                                <th>Currency</th>
                                                <th>Status</th>
                                        </tr>
                                        </thead>
                                            <tbody>
                                                {affiliateslog.length > 0 ? affiliateslog.map((s, i) => (
                                                    <tr key={s.id}>
                                                        <td>{i + 1}</td>
                                                        <td>{s.amount}</td>
                                                        <td>{s.currency}</td>
                                                        <td className="d-flex align-items-centre gap-3">
                                                        <span
                                                            className={`badge ${
                                                            s.payment_status === "completed" ||
                                                            s.payment_status === "approved"
                                                                ? "bg-success"
                                                                : s.payment_status === "pending"
                                                                ? "bg-warning"
                                                                : "bg-danger"
                                                            } text-white`}
                                                        >
                                                            {s.payment_status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            s.payment_status.slice(1)}
                                                        </span>
                                                        </td>
                                                    </tr>
                                                )) : <tr><td colSpan={4} className="text-center py-3">No Affiliate available</td></tr>}
                                            </tbody>
                                        </table>
                                        {/* <PaginationControls currentPage={stripePage} setCurrentPage={setStripePage} entries={stripeEntries} totalCount={filteredStripe.length} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="col-md-6 col-xxl-3 ">
                            <div className="p-3">
                                <h5>Pending invoices & support tickets</h5>
                            </div>
                            <div className="card">
                                <div className="card-body position-relative">
                                    <ul className="tracker-history-list app-scroll mt-3">
                                        <li className="bg-info-300">
                                            <div>
                                                <h6 className="text-info-dark mb-0">support tickets</h6>
                                            </div>
                                            <div className="text-dark f-w-600 ms-2">
                                                0
                                            </div>
                                        </li>
                                        <li className="bg-primary-300">
                                            <div>
                                                <h6 className="text-primary-dark mb-0">Pending invoices</h6>
                                            </div>
                                            <div className="text-dark f-w-600 ms-2">
                                                0
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div> */}

                        {/* <div className="col-md-6 col-lg-5 col-xxl-3">
                            <div className="p-3">
                                <h5>News & Updates, Maintenance</h5>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="task-container slider" ref={containerRef} >
                                        <div className="scroll-wrapper">
                                            {[...Array(2)].map((_, i) => (
                                                <div key={i}>
                                                    <div className="card task-card bg-danger-300">
                                                        <div className="card-body">
                                                            <h6 className="text-danger-dark txt-ellipsis-1">Finalize Project Proposal</h6>
                                                            <ul className="avatar-group justify-content-start my-3">
                                                                <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-primary">
                                                                    <img alt="avtar" className="img-fluid" src="../assets/images/avtar/4.png" />
                                                                </li>
                                                                <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-success" data-bs-title="Lennon Briggs" data-bs-toggle="tooltip">
                                                                    <img alt="avtar" className="img-fluid" src="../assets/images/avtar/5.png" />
                                                                </li>
                                                                <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-danger" data-bs-title="Maya Horton" data-bs-toggle="tooltip">
                                                                    <img alt="avtar" className="img-fluid" src="../assets/images/avtar/6.png" />
                                                                </li>
                                                            </ul>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={25} className="progress w-100" role="progressbar">
                                                                    <div className="progress-bar bg-danger-dark progress-bar-striped progress-bar-animated" style={{ width: '68%' }} />
                                                                </div>
                                                                <span className="badge bg-white-300 text-danger-dark ms-2 ">+ 68%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card">
                                                        <div className="d-flex justify-content-between align-items-center rounded p-1 bg-primary-300">
                                                            <span className="bg-primary h-35 w-35 d-flex-center rounded">
                                                                <i className="iconoir-group f-s-18" />
                                                            </span>
                                                            <h6 className="mb-0 txt-ellipsis-1">Meeting</h6>
                                                            <div className="d-flex gap-2">
                                                                <span className="w-35 h-35 bg-white-300 text-info-dark rounded p-2 d-flex-center"><i className="iconoir-more-horiz f-s-18" />
                                                                </span>
                                                                <span className="w-35 h-35 bg-white-300 text-info-dark rounded p-2 d-flex-center"><i className="iconoir-copy f-s-18" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card task-card bg-warning-300">
                                                        <div className="card-body">
                                                            <h6 className="text-warning-dark txt-ellipsis-1">Design Homepage Layout</h6>
                                                            <ul className="avatar-group justify-content-start my-3">
                                                                <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-primary">
                                                                    <img alt="avtar" className="img-fluid" src="../assets/images/avtar/3.png" />
                                                                </li>
                                                                <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-info" data-bs-title="Sophia Turner" data-bs-toggle="tooltip">
                                                                    <img alt="avtar" className="img-fluid" src="../assets/images/avtar/7.png" />
                                                                </li>
                                                                <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-warning" data-bs-title="Lucas Green" data-bs-toggle="tooltip">
                                                                    <img alt="avtar" className="img-fluid" src="../assets/images/avtar/8.png" />
                                                                </li>
                                                            </ul>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={25} className="progress w-100" role="progressbar">
                                                                    <div className="progress-bar bg-warning-dark progress-bar-striped progress-bar-animated" style={{ width: '35%' }} />
                                                                </div>
                                                                <span className="badge bg-white-400 text-secondary-dark ms-2">+ 35%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card">
                                                        <div className="d-flex justify-content-between align-items-center rounded p-1 bg-info-300">
                                                            <span className="bg-info h-35 w-35 d-flex-center rounded">
                                                                <i className="iconoir-group f-s-18" />
                                                            </span>
                                                            <h6 className="mb-0 txt-ellipsis-1">Meeting</h6>
                                                            <div className="d-flex gap-2">
                                                                <span className="w-35 h-35 bg-white-300 text-info-dark rounded p-2 d-flex-center"><i className="iconoir-more-horiz f-s-18" />
                                                                </span>
                                                                <span className="w-35 h-35 bg-white-300 text-info-dark rounded p-2 d-flex-center"><i className="iconoir-copy f-s-18" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card">
                                                        <div className="d-flex justify-content-between align-items-center rounded p-1 bg-success-300">
                                                            <span className="bg-success h-35 w-35 d-flex-center rounded">
                                                                <i className="iconoir-group f-s-18" />
                                                            </span>
                                                            <h6 className="mb-0 txt-ellipsis-1">Meeting</h6>
                                                            <div className="d-flex gap-2">
                                                                <span className="w-35 h-35 bg-white-300 text-info-dark rounded p-2 d-flex-center"><i className="iconoir-more-horiz f-s-18" />
                                                                </span>
                                                                <span className="w-35 h-35 bg-white-300 text-info-dark rounded p-2 d-flex-center"><i className="iconoir-copy f-s-18" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card task-card bg-info-300">
                                                        <div className="card-body">
                                                            <h6 className="text-info-dark txt-ellipsis-1">Develop API Integration</h6>
                                                            <ul className="avatar-group justify-content-start my-3">
                                                                <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-info">
                                                                    <img alt="avatar" className="img-fluid" src="../assets/images/avtar/4.png" />
                                                                </li>
                                                                <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-info" data-bs-title="Michael Johnson" data-bs-toggle="tooltip">
                                                                    <img alt="avatar" className="img-fluid" src="../assets/images/avtar/6.png" />
                                                                </li>
                                                                <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-warning" data-bs-title="Emily Brown" data-bs-toggle="tooltip">
                                                                    <img alt="avatar" className="img-fluid" src="../assets/images/avtar/5.png" />
                                                                </li>
                                                            </ul>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={60} className="progress w-100" role="progressbar">
                                                                    <div className="progress-bar bg-info-dark progress-bar-striped progress-bar-animated" style={{ width: '60%' }} />
                                                                </div>
                                                                <span className="badge bg-white-400 text-secondary-dark ms-2">+ 60%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card task-card bg-success-300">
                                                        <div className="card-body">
                                                            <h6 className="text-success-dark txt-ellipsis-1">Test User Feedback</h6>
                                                            <ul className="avatar-group justify-content-start my-3">
                                                                <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-primary">
                                                                    <img alt="avatar" className="img-fluid" src="../assets/images/avtar/9.png" />
                                                                </li>
                                                                <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-info" data-bs-title="Alice Smith" data-bs-toggle="tooltip">
                                                                    <img alt="avatar" className="img-fluid" src="../assets/images/avtar/10.png" />
                                                                </li>
                                                                <li className="h-35 w-35 d-flex-center b-r-50 overflow-hidden bg-success" data-bs-title="John Doe" data-bs-toggle="tooltip">
                                                                    <img alt="avatar" className="img-fluid" src="../assets/images/avtar/11.png" />
                                                                </li>
                                                            </ul>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={80} className="progress w-100" role="progressbar">
                                                                    <div className="progress-bar bg-success-dark progress-bar-striped progress-bar-animated" style={{ width: '80%' }} />
                                                                </div>
                                                                <span className="badge bg-white-400 text-secondary-dark ms-2">+ 80%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>




                <div aria-hidden="true" aria-labelledby="ticketModalLabel" className="modal fade" id="ticketModal" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary">
                                <h1 className="modal-title fs-5 text-white" id="ticketModalLabel">Add Ticket</h1>
                                <button aria-label="Close" className="btn-close m-0" data-bs-dismiss="modal" type="button" />
                            </div>
                            <div className="modal-body">
                                <div className="ticket-form">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label">Title</label>
                                                <input className="form-control" id="titlename" placeholder="Title" type="text" />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label">Client</label>
                                                <input className="form-control" id="clientname" placeholder="client" type="text" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="priority">Priority</label>
                                                <select className="form-select" id="priority">
                                                    <option defaultValue>Select Priority</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Lower">Lower</option>
                                                    <option value="High">High</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="status">Status</label>
                                                <select className="form-select" id="status">
                                                    <option defaultValue>Select Status</option>
                                                    <option value="open">open</option>
                                                    <option value="inprogress">inprogress</option>
                                                    <option value="closed">closed</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Date</label>
                                                <input className="form-control" id="datename" name="trip-start" type="date" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Due Date</label>
                                                <input className="form-control" id="duename" type="date" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" data-bs-dismiss="modal" type="button">Close
                                </button>
                                <button className="btn btn-primary" id="ticketkey" type="button">Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* welcome modal  */}
                <div className="modal" data-bs-backdrop="static" id="welcomeCard" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content welcome-card">
                            <div className="modal-body p-0">
                                <div className="text-center position-relative welcome-card-content z-1 p-3">
                                    <div className="text-end position-relative z-1">
                                        <i
                                            className="ti ti-x fs-5 text-dark f-w-600"
                                            data-bs-dismiss="modal"
                                            role="button"
                                        />
                                    </div>
                                    <h2 className="f-w-700 text-primary-dark mb-0">
                                        <span>Welcome!</span>
                                        <img
                                            alt="gif"
                                            className="w-45 d-inline align-baseline"
                                            src="../assets/images/dashboard/ecommerce-dashboard/celebration.gif"
                                        />
                                    </h2>
                                    <div className="modal-img-box">
                                        <img
                                            alt="img"
                                            className="img-fluid"
                                            src="../assets/images/modals/welcome-1.png"
                                        />
                                    </div>
                                    <div className="modal-btn mb-4">
                                        <button
                                            className="btn btn-primary text-white btn-sm rounded"
                                            data-bs-dismiss="modal"
                                            type="button"
                                        >
                                            Get Started
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>





            {/* <Footer /> */}
        </Fragment>
    );
};

export default Homepage;
