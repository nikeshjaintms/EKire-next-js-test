"use client";
import Link from "next/link";
import React, { Fragment, useState, useEffect, useMemo, useRef } from "react";
// import 'datatables.net-dt/css/jquery.dataTables.css';
// import 'datatables.net';
import TableControls from "@/components/datatable/TableControls";
import PaginationControls from "@/components/datatable/PaginationControls";

import Cookies from "js-cookie";



function Transactions() {

    const [activeTab, setActiveTab] = useState(1);
    const [Transactions, setTransactions] = useState([]);
    const [Count, setCount] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [address, setAddress] = useState(null);


  const passbookRef = useRef(); // 🔹 hidden div reference

    // auto load
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token) {
            // console.log("Token found:", token);
            const Records = async () => {
                console.log(`Bearer ${token}`);
                setIsLoading(true);
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/transactions`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`, // Send the token
                            },
                        }
                    );

                    const result = await response.json();
                    const data = result.data;
                    console.log(data);
                    setTransactions(data.transactions);
                    setCount(data.transactions_count);
                    setCustomer(data.customer); // 🔹 Save customer
                    setAddress(data.address);     // ✅ save address




                    setIsLoading(false);
                    console.log("formData", formData);


                } catch (error) {
                    console.error("Error fetching cloud vps plan data:", error);


                    setIsLoading(false);
                }
            };

            Records();

        }
    }, []);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 900);
        return () => clearTimeout(timer);
    }, []);

    // datatable for transaction
    const [transactionSearch, setTransactionSearch] = useState("");
    const [transactionEntries, setTransactionEntries] = useState(10);
    const [transactionPage, setTransactionPage] = useState(1);

    const filteredTransactions = useMemo(() => {
        return Transactions.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(transactionSearch.toLowerCase())
            )
        );
    }, [Transactions, transactionSearch]);

    const paginatedTransactions = useMemo(() => {
        const start = (transactionPage - 1) * transactionEntries;
        return filteredTransactions.slice(start, start + transactionEntries);
    }, [filteredTransactions, transactionPage, transactionEntries]);
    // datatable for transaction end

    // datatable for usage
    const [usageSearch, setUsageSearch] = useState("");
    const [usageEntries, setUsageEntries] = useState(10);
    const [usagePage, setUsagePage] = useState(1);

    const usageData = [
        {
            id: 1,
            name: "My New Project50",
            created_at: "Feb 22nd, 2024",
            members_count: 1,
            servers_count: 0,
        },
        {
            id: 2,
            name: "Dr. Burnice Larson",
            created_at: "Feb 22nd, 2024",
            members_count: 5,
            servers_count: 0,
        },
    ];
    const filteredUsage = useMemo(() => {
        return usageData.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(usageSearch.toLowerCase())
            )
        );
    }, [usageData, usageSearch]);

    const paginatedUsage = useMemo(() => {
        const start = (usagePage - 1) * usageEntries;
        return filteredUsage.slice(start, start + usageEntries);
    }, [filteredUsage, usagePage, usageEntries]);

    const handlePrint = async (transaction) => {
          if (typeof window === "undefined") return; // Only run in browser

  const html2pdf = (await import("html2pdf.js")).default;

    const fullName = customer ? `${customer.firstName} ${customer.lastName}` : "—";
    const addr = address
        ? `${address.address}, ${address.city}, ${address.state}, ${address.country} - ${address.zipcode}`
        : "—";

    const content = `
        <!doctype html>
        <html lang="en">
        <head>
        <meta charset="utf-8">
        <title>Ekire Transaction receipt</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"/>
        <style>
            .txt-center { text-align: center; }
            .border- { border-top: 1px solid #000 !important; }
            .padding { padding: 15px; }
            .mar-bot { margin-bottom: 15px; }
            .admit-card { border: 2px solid #000; margin: 20px 0; }
            .table-bordered td, .table-bordered th, .table thead th { border: 1px solid #dee2e6 !important; }
            .text-end { text-align: end; }
        </style>
        </head>
        <body>
        <section>
            <div class="container">
            <div class="admit-card">
                <div class="BoxA border- padding mar-bot">
                <div class="row justify-content-between align-items-center">
                    <div class="col-sm-2 txt-center">
                    <img src="/assets/ekire-icon.png" width="100px;" />
                    </div>
                    <div class="col-sm-5 text-end">
                    <h5><a href="mailto:info@ekire.net" class="text-dark">info@ekire.net</a></h5>
                    <h5><a href="https://ekire.net/" class="text-dark">ekire.net</a></h5>
                    </div>
                </div>
                </div>

                <div class="BoxC border- padding">
                <div class="row text-center">
                    <div class="col-sm-12"><h5>Transaction Receipt</h5></div>
                </div>
                </div>

                <div class="BoxD border- padding">
                <table class="table table-bordered">
                    <tbody>
                    <tr><td><b>Customer Name :</b></td><td>${fullName}</td></tr>
                    <tr><td><b>Email :</b></td><td>${customer?.email || "—"}</td></tr>
                    <tr><td><b>Address :</b></td><td>${addr}</td></tr>
                    <tr><td><b>Transaction ID :</b></td><td>${transaction.id || "—"}</td></tr>
                    <tr><td><b>Description :</b></td><td>${transaction.description || "—"}</td></tr>
                    <tr><td><b>Amount :</b></td><td>$${transaction.amount || "0.00"}</td></tr>
                    <tr><td><b>Type :</b></td><td>${transaction.type || "—"}</td></tr>
                    <tr><td><b>Status :</b></td><td>${transaction.status || "Completed"}</td></tr>
                    <tr><td><b>Reference ID :</b></td><td>${transaction.reference_id || "—"}</td></tr>
                    <tr><td><b>Remark :</b></td><td>${transaction.remark || "—"}</td></tr>
                    </tbody>
                </table>
                </div>

                <div class="BoxE border- padding mar-bot">
                <p><i>Report generated on: ${new Date().toLocaleString()}</i></p>
                 For any queries regarding this transaction, contact 
                    <a href="mailto:info@ekire.net" class="text-dark"><b>support@ekire.net</b></a>
                </div>
            </div>
            </div>
        </section>
        </body>
        </html>`;

    const opt = {
        margin: 0.5,
        filename: `transaction-${transaction.id || Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(content).save();
    };
/**
     * New function to download all transactions as a Passbook/Bank Statement PDF
     */
    const handleDownloadPassbook = async () => {
          if (typeof window === "undefined") return; // Only run in browser

      const html2pdf = (await import("html2pdf.js")).default;

        const fullName = customer ? `${customer.firstName} ${customer.lastName}` : "—";
        const addr = address
            ? `${address.address}, ${address.city}, ${address.state}, ${address.country} - ${address.zipcode}`
            : "—";

        // Generate the table rows for all transactions
        const transactionRows = Transactions.map((transaction, index) => {
            const date = new Date(transaction.created_at).toLocaleString();
            return `
                <tr>
                    <td class="text-center">${index + 1}</td>
                    <td>${date}</td>
                    <td>${transaction.description || "—"}</td>
                    <td class="text-center">$${transaction.amount || "0.00"}</td>
                    <td class="text-center">${transaction.type || "—"}</td>
                    <td class="text-center">${transaction.status || "Completed"}</td>
                </tr>
            `;
        }).join('');

        const content = `
            <!doctype html>
            <html lang="en">
            <head>
            <meta charset="utf-8">
            <title>Ekire Transaction Passbook</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"/>
            <style>
                .txt-center { text-align: center; }
                .border- { border-top: 1px solid #000 !important; }
                .padding { padding: 15px; }
                .mar-bot { margin-bottom: 15px; }
                .admit-card { border: 2px solid #000; margin: 20px 0; }
                .table-bordered td, .table-bordered th, .table thead th { border: 1px solid #dee2e6 !important; }
                .text-end { text-align: end; }
                .text-bold { font-weight: bold; }
                .page-break { page-break-after: always; }
                 .table-striped tbody tr {
                    page-break-inside: avoid !important;
                }

            </style>
            </head>
            <body>
            <section>
                <div class="container">
                <div class="admit-card">
                    <div class="BoxA border- padding mar-bot">
                    <div class="row justify-content-between align-items-center">
                        <div class="col-sm-2 txt-center">
                        <img src="/assets/ekire-icon.png" width="100px;" />
                        </div>
                        <div class="col-sm-5 text-end">
                        <h5><a href="mailto:info@ekire.net" class="text-dark">info@ekire.net</a></h5>
                        <h5><a href="https://ekire.net/" class="text-dark">ekire.net</a></h5>
                        </div>
                    </div>
                    </div>

                    <div class="BoxC border- padding ">
                    <div class="row text-center">
                        <div class="col-sm-12"><h5>Customer Transaction Statement</h5></div>
                    </div>
                    </div>

                    <div class="BoxD border- padding">
                    <table class="table table-bordered">
                        <tbody>
                        <tr><td><b class="text-bold">Customer Name :</b></td><td>${fullName}</td></tr>
                        <tr><td><b class="text-bold">Email :</b></td><td>${customer?.email || "—"}</td></tr>
                        <tr><td><b class="text-bold">Address :</b></td><td>${addr}</td></tr>
                        <tr><td><b class="text-bold">Statement Date :</b></td><td>${new Date().toLocaleDateString()}</td></tr>
                        </tbody>
                    </table>
                    </div>

                    <div class="BoxD border- padding page-break">
                    <h6 class="text-center text-bold">Transaction History</h6>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Sr no.</th>
                                <th>Date & Time</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${transactionRows.length > 0 ? transactionRows : `<tr><td colspan="6" class="text-center py-3">No transactions found</td></tr>`}
                        </tbody>
                    </table>
                    </div>

                    <div class="BoxE border- padding mar-bot">
                    <p><i>Report generated on: ${new Date().toLocaleString()}</i></p>
                     For any queries regarding this statement, contact 
                        <a href="mailto:info@ekire.net" class="text-dark"><b>support@ekire.net</b></a>
                    </div>
                </div>
                </div>
            </section>
            </body>
            </html>`;

        const opt = {
            margin: 0.5,
            filename: `passbook-${customer?.firstName || 'all'}-${Date.now()}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 1 },
            jsPDF: { unit: "in", format:  [10, 10.5], orientation: "landscape" },
            
        };

        html2pdf().set(opt).from(content).save();
    };
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
                        {/* Breadcrumb start */}
                        <div className="row m-1">
                            <div className="col-12 ">
                                <h4 className="main-title">Transactions</h4>
                            </div>
                        </div>
                        {/* Breadcrumb end */}

                        {/* Projects start */}
                        <div className="row">
                            <div className="col-12">

                                <div className="tab-wrapper mb-3">
                                    <ul className="tabs overflow-auto">
                                        <li
                                            className={`tab-link ${activeTab === 1 ? "active" : ""}`}
                                            onClick={() => setActiveTab(1)}
                                        >
                                            <i className="ph-bold  ph-align-right f-s-18" /> Financial Log
                                        </li>
                                        {/* <li
                                            className={`tab-link ${activeTab === 2 ? "active" : ""}`}
                                            onClick={() => setActiveTab(2)}
                                        >
                                            <i className="ph-fill ph-list-bullets f-s-18" /> Usage Log
                                        </li>
                                        <li className="ms-auto d-flex">

                                        </li> */}

                                    </ul>
                                </div>

                                <div className="content-wrapper" id="card-container">
                                    <div className={`tabs-content ${activeTab === 1 ? "active" : ""}`} id="tab-1">
                                        <div className="card p-l-r-30" >
                                            <div className="card-body p-0" style={{ marginTop: "20px", marginBottom: "20px" }}>
                                                <div className="app-datatable-default overflow-auto">
                                                     <button className="btn btn-primary float-end "  
                                                        onClick={handleDownloadPassbook}
                                                     >
                                                        Download PDF
                                                    </button>
                                                    <br />
                                                    <br />
                                                    <br />
                                                    {/* Reusable controls */}
                                                    <TableControls
                                                        entries={transactionEntries}
                                                        setEntries={(val) => {
                                                            setTransactionEntries(val);
                                                            setTransactionPage(1);
                                                        }}
                                                        search={transactionSearch}
                                                        setSearch={(val) => {
                                                            setTransactionSearch(val);
                                                            setTransactionPage(1);
                                                        }}
                                                    />
                                                    

                                                    <table className="datatable display app-data-table default-data-table" id="transaction-table">
                                                        <thead>
                                                            <tr>
                                                                <th width={10} className="text-center">Sr no.</th>
                                                                {/* <th width={10}>Customer Id</th> */}
                                                                <th>Description</th>
                                                                <th className="text-center">Amount</th>
                                                                <th className="text-center">Transaction Time</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {paginatedTransactions.length > 0 ? (
                                                                paginatedTransactions.map((transaction, index) => (
                                                                    <tr key={index}>
                                                                        <td>{(transactionPage - 1) * transactionEntries + index + 1}</td>
                                                                        {/* <td>{transaction.customer_id}</td> */}
                                                                        <td>{transaction.description}</td>
                                                                        <td className="text-center">{transaction.amount}</td>
                                                                        <td className="text-center">{new Date(transaction.created_at).toLocaleDateString()}
                                                                            {" "}
                                                                            {new Date(transaction.created_at).toLocaleTimeString()}
                                                                        </td>
                                                                        <td className="d-flex">
                                                                           <button onClick={() => handlePrint(transaction)} className="badge bg-success text-white d-flex gap-2">
                                                                                    <i className="ph-duotone ph-download f-s-18" />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={5} className="text-center py-3">
                                                                        No transactions found
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>

                                                    <PaginationControls
                                                        currentPage={transactionPage}
                                                        setCurrentPage={setTransactionPage}
                                                        entries={transactionEntries}
                                                        totalCount={filteredTransactions.length}
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className={`tabs-content ${activeTab === 2 ? "active" : ""}`} id="tab-2">
                                        <div className="card p-l-r-30">
                                            <div className="card-body p-0">
                                                <div className="app-datatable-default overflow-auto">
                                                    <TableControls
                                                        entries={usageEntries}
                                                        setEntries={(val) => {
                                                            setUsageEntries(val);
                                                            setUsagePage(1);
                                                        }}
                                                        search={usageSearch}
                                                        setSearch={(val) => {
                                                            setUsageSearch(val);
                                                            setUsagePage(1);
                                                        }}
                                                    />

                                                    <table className="datatable display app-data-table default-data-table" id="usage-table">
                                                        <thead>
                                                            <tr>
                                                                <th width={10} className="text-center">Sr no.</th>
                                                                <th>Name</th>
                                                                <th>Created At</th>
                                                                <th>Members Count</th>
                                                                <th>Servers Count</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {paginatedUsage.length > 0 ? (
                                                                paginatedUsage.map((row, index) => (
                                                                    <tr key={row.id}>
                                                                        <td>{(usagePage - 1) * usageEntries + index + 1}</td>
                                                                        <td>{row.name}</td>
                                                                        <td>{row.created_at}</td>
                                                                        <td>{row.members_count}</td>
                                                                        <td>{row.servers_count}</td>
                                                                        <td className="d-flex">
                                                                            <span className="badge bg-success text-white d-flex gap-2">
                                                                                <i className="ph-duotone ph-eye f-s-18" /> View
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={6} className="text-center py-3">
                                                                        No usage data found
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>

                                                    <PaginationControls
                                                        currentPage={usagePage}
                                                        setCurrentPage={setUsagePage}
                                                        entries={usageEntries}
                                                        totalCount={filteredUsage.length}
                                                    />
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
                {/* modal 1 */}
                <div aria-hidden="true" aria-labelledby="projectCardLabel" className="modal fade" id="projectCard1" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="d-flex align-items-center gap-2">
                                    <h1 className="modal-title fs-5" id="projectCardLabel">Top Up Balance </h1>
                                </div>

                                <button aria-label="Close" className="btn-close" data-bs-dismiss="modal" type="button" />
                            </div>
                            <div className="modal-body">
                                <form className="app-form">
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text" id="inputGroupPrepend2">$</span>
                                            <input aria-describedby="inputGroupPrepend2" className="form-control" id="validationDefaultUsername" placeholder="0" required="" type="number" />
                                        </div>
                                    </div>
                                </form>
                                <div className="form-selectgroup">
                                    <div className="select-item">
                                        <label className="form-check-label ms-5" htmlFor="inlineRadio1">
                                            <span className="d-flex align-items-center">
                                                <img alt="" className="w-30 h-30" src="../assets/images/checkbox-radio/logo1.png" />
                                                <span className="ms-2">
                                                    <span className="fs-6 ">Stripe</span>
                                                </span>
                                            </span>
                                        </label>
                                        <input className="form-check-input" id="inlineRadio1" name="inlineRadioOptions" type="radio" defaultValue="option1" />
                                    </div>
                                    <div className="select-item ">
                                        <input className="form-check-input" id="inlineRadio2" name="inlineRadioOptions" type="radio" defaultValue="option2" />
                                        <label className="form-check-label ms-5" htmlFor="inlineRadio2">
                                            <span className="d-flex align-items-center">
                                                <img alt="" className="w-30 h-30" src="../assets/images/New/wallet.png" />
                                                <span className="ms-2">
                                                    <span className="fs-6">Crypto</span>
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                    <div className="select-item" >
                                        <input className="form-check-input" id="inlineRadio3" name="inlineRadioOptions" type="radio" defaultValue="option3" />
                                        <label className="form-check-label ms-5" htmlFor="inlineRadio3">
                                            <span className="d-flex align-items-center">
                                                <img alt="" className="w-30 h-30" src="../assets/images/checkbox-radio/logo3.png" />
                                                <span className="ms-2">
                                                    <span className="fs-6">Paypal</span>
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" data-bs-dismiss="modal" type="button">Cancel</button>
                                <button className="btn btn-primary" id="addCard" type="button">Make Payment</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* modal 2 */}
                <div aria-hidden="true" aria-labelledby="projectCardLabel" className="modal fade" id="projectCard2" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="d-flex align-items-center gap-2">
                                    <h1 className="modal-title fs-5" id="projectCardLabel">Redeem Gift Code</h1>
                                    {/* <iconify-icon icon="line-md:document-add" className="f-s-22" style={{ color: "#198754" }} /> */}
                                </div>
                                <button aria-label="Close" className="btn-close" data-bs-dismiss="modal" type="button" />
                            </div>
                            <div className="modal-body">
                                <form className="app-form">
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text" id="inputGroupPrepend2"><i className="iconoir-gift f-s-18" /></span>
                                            <input aria-describedby="inputGroupPrepend2" className="form-control" id="validationDefaultUsername" placeholder="Enter Gift Code" required="" type="text" />
                                        </div>
                                    </div>
                                </form>
                                <div className="form-selectgroup">
                                    <div className="select-item">
                                        <label className="form-check-label ms-5" htmlFor="inlineRadio1">
                                            <span className="d-flex align-items-center">
                                                <img alt="" className="w-30 h-30" src="../assets/images/New/stripe.png" />
                                                <span className="ms-2">
                                                    <span className="fs-6 ">Stripe</span>
                                                </span>
                                            </span>
                                        </label>
                                        <input className="form-check-input" id="inlineRadio1" name="inlineRadioOptions" type="radio" defaultValue="option1" />
                                    </div>
                                    <div className="select-item ">
                                        <input className="form-check-input" id="inlineRadio2" name="inlineRadioOptions" type="radio" defaultValue="option2" />
                                        <label className="form-check-label ms-5" htmlFor="inlineRadio2">
                                            <span className="d-flex align-items-center">
                                                <img alt="" className="w-30 h-30" src="../assets/images/New/wallet.png" />
                                                <span className="ms-2">
                                                    <span className="fs-6">Crypto</span>
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                    <div className="select-item" >
                                        <input className="form-check-input" id="inlineRadio3" name="inlineRadioOptions" type="radio" defaultValue="option3" />
                                        <label className="form-check-label ms-5" htmlFor="inlineRadio3">
                                            <span className="d-flex align-items-center">
                                                <img alt="" className="w-30 h-30" src="../assets/images/checkbox-radio/logo3.png" />
                                                <span className="ms-2">
                                                    <span className="fs-6">Paypal</span>
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" data-bs-dismiss="modal" type="button">Cancel</button>
                                <button className="btn btn-primary" id="addCard" type="button">Make Payment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
export default Transactions;
