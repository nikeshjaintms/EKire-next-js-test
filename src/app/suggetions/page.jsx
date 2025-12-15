"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useState, useEffect, useMemo } from "react";
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import TableControls from "@/components/datatable/TableControls";
import PaginationControls from "@/components/datatable/PaginationControls";


function Suggestion() {

    const Suggestion = 1;
    console.log(Suggestion);
    const router = useRouter();
    // api for view abuse tickets
    const [allSuggestions, setAllSuggestions] = useState([]);

    //  api for to view all suggetions
    useEffect(() => {
        const fetchAllSuggestions = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/suggestions`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    },
                });

                const data = await res.json();
                if (res.ok && data.success) {
                    const flatSuggestions = data.data.flatMap(group => {
                        const customerName = group.customer
                            ? `${group.customer.firstName || ""} ${group.customer.lastName || ""}`.trim()
                            : "Unknown";

                        return group.suggestions.map(sugg => ({
                            ...sugg,
                            customerName,
                        }));
                    });

                    setAllSuggestions(flatSuggestions);
                } else {
                    console.error("Failed to fetch all suggestions:", data.message || data.error);
                }
            } catch (err) {
                console.error("Error fetching all suggestions:", err);
            }
        };

        fetchAllSuggestions();
    }, []);

    // api for to view all suggetions with filetr end
    const [filter, setFilter] = useState("all");
    const handleFilterChange = (e) => {
        const selected = e.target.value;
        setFilter(selected);

        if (selected === "new" || selected === "old") {
            fetchFilteredSuggestions(selected); // pass filter type
        } else {
            fetchAllSuggestions(); // your existing fetch for all
        }
    };
    const fetchFilteredSuggestions = async (sort) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/suggestions?sort=${sort}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
            });
            const data = await res.json();

            if (res.ok && data.success) {
                const flattened = data.data.flatMap(group =>
                    group.suggestions.map(suggestion => ({
                        ...suggestion,
                        customerName: `${group.customer.firstName} ${group.customer.lastName}`,
                    }))
                );
                setAllSuggestions(flattened);
            } else {
                console.error("Failed to fetch filtered suggestions:", data.message);
            }
        } catch (err) {
            console.error("Error fetching filtered suggestions:", err);
        }
    };
    // api for to view all suggetions with filetr end

    // CODE FOR PAGINATION AND SEARCH START datatable 
    const allData = allSuggestions;

    const [search, setSearch] = useState("");
    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredAllData = useMemo(() => {
        let result = allData.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(search.toLowerCase())
            )
        );

        if (filter === "new") {
            result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (filter === "old") {
            result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }

        return result;
    }, [allData, search, filter]);

    const paginatedAllData = useMemo(() => {
        const start = (currentPage - 1) * entries;
        return filteredAllData.slice(start, start + entries);
    }, [filteredAllData, currentPage, entries]);

    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };







    return (
        <Fragment>
            <div className="position-relative">
                <main>
                    <div className="container-fluid">
                        {/* Breadcrumb start */}
                        <div className="row m-1">
                            <div className="col-12 d-flex justify-content-between">
                                <h4 className="main-title">Suggestions</h4>
                            </div>
                        </div>
                        {/* Breadcrumb end */}

                        <div className="row">
                            <div className="col-12">
                                <div className="content-wrapper" id="card-container">
                                    <div className="card p-l-r-30 pt-3 pb-3">
                                        <div className="card-body p-0">
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
                                                <div className="d-flex justify-content-start mt-3 mb-3 ">
                                                    <select
                                                        className="form-select w-auto f-s-15"
                                                        value={filter}
                                                        onChange={handleFilterChange}
                                                    >
                                                        <option value="all">All Suggestions</option>
                                                        <option value="new">Latest</option>
                                                        <option value="old">Old</option>
                                                    </select>
                                                </div>

                                                <table className="datatable display app-data-table default-data-table" >
                                                    <thead>
                                                        <tr>
                                                            <th width={10}>Sr No.</th>
                                                            <th>Customer</th>
                                                            <th>Description</th>
                                                            <th className="text-center">Up Votes</th>
                                                            <th className="text-center">Down Votes</th>
                                                            <th className="text-center">Votes Count</th>
                                                            <th>Date</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {paginatedAllData.length > 0 ? (
                                                            paginatedAllData.map((sugg, index) => (
                                                                <tr key={sugg.id}>
                                                                    <td>{(currentPage - 1) * entries + index + 1}</td>
                                                                    <td>{sugg.customerName}</td>
                                                                    <td>{sugg.description}</td>
                                                                    <td className="text-center">{sugg.upvotes}</td>
                                                                    <td className="text-center">{sugg.downvotes}</td>
                                                                    <td className="text-center">{sugg.votes_count}</td>

                                                                    <td
                                                                        title={new Date(sugg.created_at).toLocaleString("en-GB", {
                                                                            day: "numeric",
                                                                            month: "long",
                                                                            year: "2-digit",
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                            second: "2-digit",
                                                                        })}
                                                                    >
                                                                        {new Date(sugg.created_at)
                                                                            .toLocaleDateString("en-GB", {
                                                                                day: "numeric",
                                                                                month: "long",
                                                                                year: "2-digit",
                                                                            })
                                                                            .replace(/^(\d{1,2})/, "$1" + getDaySuffix(new Date(sugg.created_at).getDate()))}
                                                                    </td>

                                                                    <td>
                                                                        <span className={`badge ${sugg.status === "pending" ? "bg-warning" : "bg-success"}`}>
                                                                            {sugg.status.charAt(0).toUpperCase() + sugg.status.slice(1)}
                                                                        </span>
                                                                    </td>

                                                                    <td className="d-flex gap-2">
                                                                        <Link href={`/support/suggestion/view/${sugg.id}`}>
                                                                            <span className="badge text-white bg-info d-flex gap-2">
                                                                                <i className="ph-duotone ph-eye f-s-18" /> View
                                                                            </span>
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={10} className="text-center py-3">
                                                                    No suggestions found
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>

                                                <PaginationControls
                                                    currentPage={currentPage}
                                                    setCurrentPage={setCurrentPage}
                                                    entries={entries}
                                                    totalCount={filteredAllData.length}
                                                />
                                            </div>
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
export default Suggestion;
