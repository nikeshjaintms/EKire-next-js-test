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
    const [title, setTitle] = useState('');
    const [activeTab, setActiveTab] = useState(1);
    const [description, setDescription] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [allSuggestions, setAllSuggestions] = useState([]);
    const [formData, setFormData] = useState({ title: "", description: "" });
    const [error, setError] = useState({});
    const [success, setSuccess] = useState("");
    const [votes, setVotes] = useState({});
    const [voteErrors, setVoteErrors] = useState({});




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // api for create suggetions
    const handleSuggestionSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setSuccess("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/suggestions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.status === 400 && data.errors) {
                setError(data.errors);
                return;
            }

            if (res.ok && data.success) {
                setSuccess(data.message);

                // Add to suggestion list
                setSuggestions((prev) => [...prev, data.data]);

                // Clear form
                setFormData({ title: "", description: "" });

                // Hide message and close modal after 3 seconds
                setTimeout(() => {
                    setSuccess("");
                    const modal = bootstrap.Modal.getInstance(document.getElementById("projectCard1"));
                    modal.hide();
                }, 3000);
            } else {
                alert(data.message || "Failed to submit suggestion.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong.");
        }
    };
    // api for create suggetions end

    // api for view suggestions
    useEffect(() => {
        const fetchCustomerSuggestions = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/suggestions/customer/view`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    },
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    setSuggestions(data.data);
                } else {
                    console.error("Failed to fetch suggestions:", data.message || data.error);
                }
            } catch (err) {
                console.error("Error fetching suggestions:", err);
            }
        };

        fetchCustomerSuggestions();
    }, []);

    // api for view suggestions end

    // API for voting on suggestions
    const handleVote = async (suggestionId, voteValue) => {
        // ✅ Check using votedSuggestions for accurate state
        const alreadyVoted = votedSuggestions.find(
            (sugg) => sugg.id === suggestionId && sugg.vote === voteValue
        );

        if (alreadyVoted) {
            setVoteErrors((prev) => ({
                ...prev,
                [suggestionId]: "You have already voted on this suggestion.",
            }));
            setTimeout(() => {
                setVoteErrors((prev) => ({
                    ...prev,
                    [suggestionId]: null,
                }));
            }, 3000);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/suggestions/${suggestionId}/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
                body: JSON.stringify({ vote: voteValue }),
            });

            const data = await res.json();
            console.log("Vote response:", data);

            if (!res.ok) {
                setVoteErrors((prev) => ({
                    ...prev,
                    [suggestionId]: data.message || "Something went wrong",
                }));
                setTimeout(() => {
                    setVoteErrors((prev) => ({
                        ...prev,
                        [suggestionId]: null,
                    }));
                }, 3000);
                return;
            }

            // ✅ Update suggestions state
            setAllSuggestions((prevSuggestions) =>
                prevSuggestions.map((sugg) => {
                    if (sugg.id !== suggestionId) return sugg;

                    let { upvotes, downvotes, votes_count } = sugg;
                    const prevVote = votes[suggestionId] || 0;

                    // Remove previous vote effect
                    if (prevVote === 1) {
                        upvotes--;
                        votes_count--;
                    } else if (prevVote === -1) {
                        downvotes--;
                        votes_count++;
                    }

                    // Apply new vote
                    if (voteValue === 1) {
                        upvotes++;
                        votes_count++;
                    } else if (voteValue === -1) {
                        downvotes++;
                        votes_count--;
                    }

                    return {
                        ...sugg,
                        upvotes,
                        downvotes,
                        votes_count,
                    };
                })
            );

            // ✅ Update votes state
            setVotes((prev) => ({
                ...prev,
                [suggestionId]: voteValue,
            }));

            // ✅ Clear vote error
            setVoteErrors((prev) => ({ ...prev, [suggestionId]: null }));

            // ✅ Update votedSuggestions (live)
            setVotedSuggestions((prev) => {
                const alreadyExists = prev.find((s) => s.id === suggestionId);

                if (alreadyExists) {
                    return prev.map((s) =>
                        s.id === suggestionId ? { ...s, vote: voteValue } : s
                    );
                }

                const fullSuggestion = allSuggestions.find((s) => s.id === suggestionId);
                if (fullSuggestion) {
                    return [
                        ...prev,
                        {
                            id: fullSuggestion.id,
                            title: fullSuggestion.title,
                            description: fullSuggestion.description,
                            status: fullSuggestion.status,
                            vote: voteValue,
                        },
                    ];
                }

                return prev;
            });

        } catch (err) {
            console.error("Vote error:", err);
            setVoteErrors((prev) => ({
                ...prev,
                [suggestionId]: "An unexpected error occurred.",
            }));
            setTimeout(() => {
                setVoteErrors((prev) => ({
                    ...prev,
                    [suggestionId]: null,
                }));
            }, 3000);
        }
    };
    // API for voting on suggestions end

    // CODE FOR SHOWING DATE 
    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };
    // CODE FOR SHOWING DATE END




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

    // api for users voted suggestions
    const [votedSuggestions, setVotedSuggestions] = useState([]);
    useEffect(() => {
        const fetchVotedSuggestions = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/voted-suggestions`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    },
                });

                const data = await res.json();
                if (res.ok && data.success) {
                    setVotedSuggestions(data.data);
                } else {
                    console.error("Failed to fetch voted suggestions", data);
                }
            } catch (err) {
                console.error("Error fetching voted suggestions", err);
            }
        };

        fetchVotedSuggestions();
    }, []);

    // api for delete vote from voted suggestions table
    useEffect(() => {
        const initialVotes = {};
        votedSuggestions.forEach((sugg) => {
            initialVotes[sugg.id] = sugg.vote;
        });
        setVotes(initialVotes);
    }, [votedSuggestions]);
    const handleDeleteVoteFromTable = async (suggestionId, voteValue) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/suggestions/${suggestionId}/vote`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
            });

            const data = await res.json();
            console.log("Vote removed from table:", data);

            if (!res.ok || !data.success) {
                Swal.fire("Error", data.message || "Failed to remove vote.", "error");
                return;
            }

            // ✅ Remove from votedSuggestions
            setVotedSuggestions(prev => prev.filter(s => s.id !== suggestionId));

            // ✅ Remove from votes state
            setVotes(prev => {
                const updated = { ...prev };
                delete updated[suggestionId];
                return updated;
            });

            // ✅ Update allSuggestions counts
            setAllSuggestions(prev =>
                prev.map(s => {
                    if (s.id !== suggestionId) return s;

                    let { upvotes, downvotes, votes_count } = s;

                    if (voteValue === 1) {
                        upvotes--;
                        votes_count--;
                    } else if (voteValue === -1) {
                        downvotes--;
                        votes_count++;
                    }

                    return {
                        ...s,
                        upvotes,
                        downvotes,
                        votes_count,
                    };
                })
            );

            Swal.fire("Removed", "Your vote has been removed.", "success");

        } catch (err) {
            console.error("Vote delete error:", err);
            Swal.fire("Error", "Something went wrong while removing vote.", "error");
        }
    };
    // api for delete vote from voted suggestions table end



    // auto load
    // const [isLoading, setIsLoading] = useState(true);
    // useEffect(() => {
    //     // Simulate loading
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 900);
    //     return () => clearTimeout(timer);
    // }, []);


    // const columns = [
    //     { key: "sr_no", label: "Sr No." },
    //     { key: "id", label: "ID" },
    //     { key: "title", label: "Title" },
    //     { key: "description", label: "Description" },
    //     { key: "status", label: "Status" },
    //     { key: "vote", label: "Vote" },
    // ];


    const data = suggestions;
    const votedData = votedSuggestions;
    const allData = allSuggestions;
    const [search, setSearch] = useState("");
    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // for your own suggestions datatable
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

    // for voted suggestions datatable
    const filteredVotedData = useMemo(() => {
        return votedData.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [votedData, search]);

    const paginatedVotedData = useMemo(() => {
        const start = (currentPage - 1) * entries;
        return filteredVotedData.slice(start, start + entries);
    }, [filteredVotedData, currentPage, entries]);

    // for all suggestions datatable

    const filteredAllData = useMemo(() => {
        let result = [...allData];

        // Filter by search
        result = result.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(search.toLowerCase())
            )
        );

        // Apply sort filter
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
                )} */}
                {/* <main className={`page-content ${isLoading ? 'pointer-events-none' : ''}`} style={{ opacity: isLoading ? 0.5 : 1 }}> */}
                <main>
                    <div className="container-fluid">
                        {/* Breadcrumb start */}
                        <div className="row m-1">
                            <div className="col-12 d-flex justify-content-between">
                                <h4 className="main-title">Suggestions</h4>
                                <div className="d-flex overflow-auto">
                                    <div className="text-end">
                                        <button
                                            className="btn btn-primary h-45 icon-btn m-2"
                                            data-bs-target="#projectCard1"
                                            data-bs-toggle="modal"
                                        >
                                            <i className="ti ti-plus f-s-18" /> Create Suggestions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Breadcrumb end */}


                        {/* <div className="row">
                            <div className="col-12">
                                <div className="content-wrapper" id="card-container">
                                    <div className="card p-l-r-30">
                                        <div className="card-body p-0">
                                            <div className="app-datatable-default overflow-auto">
                                                <table className="datatable display app-data-table default-data-table" id="example1">
                                                    <thead>
                                                        <tr>
                                                            <th width={10}>Sr No.</th>
                                                            <th>Title</th>
                                                            <th>Description</th>
                                                            <th>Votes Count</th>
                                                            <th>Vote</th>
                                                            <th>Date</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {suggestions.map((sugg, index) => (
                                                            <tr key={sugg.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{sugg.title}</td>
                                                                <td>{sugg.description}</td>
                                                                <td>{sugg.votes_count}</td>
                                                                <td className="d-flex flex-column gap-1 align-items-start">
                                                                    <div className="d-flex gap-3 align-items-center">
                                                                        <button
                                                                            className={`btn p-0 border-0 ${votes[sugg.id] === 1 ? 'text-warning' : 'text-muted'}`}
                                                                            onClick={() => handleVote(sugg.id, 1)}
                                                                            title="Upvote"
                                                                        >
                                                                            <i className="ph-bold f-s-21 ph-thumbs-up"></i>
                                                                        </button>

                                                                        <button
                                                                            className={`btn p-0 border-0 ${votes[sugg.id] === -1 ? 'text-danger' : 'text-muted'}`}
                                                                            onClick={() => handleVote(sugg.id, -1)}
                                                                            title="Downvote"
                                                                        >
                                                                            <i className="ph-bold f-s-21 ph-thumbs-down"></i>
                                                                        </button>
                                                                    </div>

                                                                    {voteErrors[sugg.id] && (
                                                                        <small className="text-danger ms-1">{voteErrors[sugg.id]}</small>
                                                                    )}
                                                                </td>
                                                                <td title={new Date(sugg.created_at).toLocaleString('en-GB', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    second: '2-digit',
                                                                })}
                                                                >
                                                                    {new Date(sugg.created_at).toLocaleDateString('en-GB', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: '2-digit',
                                                                    }).replace(/^(\d{1,2})/, '$1' + getDaySuffix(new Date(sugg.created_at).getDate()))}
                                                                </td>

                                                                <td>
                                                                    <span className={`badge ${sugg.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                                                                        {sugg.status.charAt(0).toUpperCase() + sugg.status.slice(1)}
                                                                    </span>
                                                                </td>
                                                                <td className="d-flex gap-2">
                                                                    <Link href={`/support/suggestion/${sugg.id}`}>
                                                                        <span className="badge text-white bg-info d-flex gap-2">
                                                                            <i className="ph-duotone ph-eye f-s-18" /> View
                                                                        </span>
                                                                    </Link>
                                                                    <button
                                                                        className="badge text-white bg-danger d-flex gap-2 border-0"
                                                                        onClick={() => handleVoteDelete(sugg.id)}
                                                                        title="Remove your vote"
                                                                    >
                                                                        <i className="ph-duotone ph-trash f-s-18" /> Delete
                                                                    </button>


                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                            </div>

                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div> */}
                        {/* Projects end */}

                        <div className="row">
                            <div className="col-12">
                                <div className="tab-wrapper mb-3">
                                    <ul className="tabs overflow-auto">
                                        <li
                                            className={`tab-link ${activeTab === 1 ? "active" : ""}`}
                                            onClick={() => setActiveTab(1)}
                                        >
                                            <i className="ph-bold  ph-align-right f-s-18" />
                                            All Suggestions
                                        </li>
                                        <li
                                            className={`tab-link ${activeTab === 2 ? "active" : ""}`}
                                            onClick={() => setActiveTab(2)}
                                        >
                                            <i className="ph-fill ph-list-bullets f-s-18" />{" "}
                                            Your Suggestions
                                        </li>
                                        <li
                                            className={`tab-link ${activeTab === 3 ? "active" : ""}`}
                                            onClick={() => setActiveTab(3)}
                                        >
                                            <i className="ph-fill ph-list-bullets f-s-18" />{" "}
                                            Your Voted Suggestion
                                        </li>
                                    </ul>
                                </div>

                                <div className="content-wrapper" id="card-container">
                                    <div
                                        className={`tabs-content ${activeTab === 1 ? "active" : ""
                                            }`}
                                        id="tab-1"
                                    >
                                        <div className="card p-l-r-30 pt-3 pb-3">
                                            <div className="card-body p-0">
                                                {/* <div className="app-datatable-default overflow-auto">
                                                    <div className="d-flex justify-content-start mt-3 mb-3 ms-3">
                                                        <select className="form-select w-auto f-s-15"
                                                            value={filter}
                                                            onChange={handleFilterChange}
                                                        >
                                                            <option value="all">All Suggestions</option>
                                                            <option value="new">Latest</option>
                                                            <option value="old">Old</option>
                                                        </select>
                                                    </div>

                                                    <table className="datatable display app-data-table default-data-table" id="example1">
                                                        <thead>
                                                            <tr>
                                                                <th width={10}>Sr No.</th>
                                                                <th>Customer</th>
                                                                <th>Description</th>
                                                                <th className="text-center" >Vote</th>
                                                                <th className="text-center" >Up Votes</th>
                                                                <th className="text-center" >Down Votes</th>
                                                                <th className="text-center" >Votes Count</th>
                                                                <th>Date</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {allSuggestions.map((sugg, index) => (
                                                                <tr key={sugg.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{sugg.customerName}</td>
                                                                    <td>{sugg.description}</td>
                                                                    <td className="d-flex gap-1 align-items-center justify-content-center">
                                                                        <div className="d-flex gap-3 align-items-center justify-content-center">
                                                                            <button
                                                                                className={`btn p-0 border-0 vote-button ${votes[sugg.id] === 1 ? 'text-info animate-bounce-once' : 'text-muted'}`}
                                                                                onClick={() => handleVote(sugg.id, 1)} // 👈 Use sugg.id
                                                                                title="Upvote"
                                                                            >
                                                                                <i className={`ph-${votes[sugg.id] === 1 ? 'fill' : 'light'} f-s-21 ph-thumbs-up`}></i>
                                                                            </button>

                                                                            <button
                                                                                className={`btn p-0 border-0 vote-button ${votes[sugg.id] === -1 ? 'text-danger animate-bounce-once' : 'text-muted'}`}
                                                                                onClick={() => handleVote(sugg.id, -1)} // 👈 Use sugg.id
                                                                                title="Downvote"
                                                                            >
                                                                                <i className={`ph-${votes[sugg.id] === -1 ? 'fill' : 'light'} f-s-21 ph-thumbs-down`}></i>
                                                                            </button>
                                                                            {voteErrors[sugg.id] && (
                                                                                <small className="text-danger ms-1">{voteErrors[sugg.id]}</small>
                                                                            )}
                                                                        </div>


                                                                    </td>
                                                                    <td className="text-center" >{sugg.upvotes}</td>
                                                                    <td className="text-center" >{sugg.downvotes}</td>
                                                                    <td className="text-center" >{sugg.votes_count}</td>
                                                                    <td title={new Date(sugg.created_at).toLocaleString('en-GB', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: '2-digit',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        second: '2-digit',
                                                                    })}
                                                                    >
                                                                        {new Date(sugg.created_at).toLocaleDateString('en-GB', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: '2-digit',
                                                                        }).replace(/^(\d{1,2})/, '$1' + getDaySuffix(new Date(sugg.created_at).getDate()))}
                                                                    </td>

                                                                    <td>
                                                                        <span className={`badge ${sugg.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
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
                                                                <th className="text-center">Vote</th>
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
                                                                        <td className="text-center">
                                                                            <div className="d-flex gap-3 align-items-center justify-content-center">
                                                                                <button
                                                                                    className={`btn p-0 border-0 vote-button ${votes[sugg.id] === 1 ? "text-info animate-bounce-once" : "text-muted"}`}
                                                                                    onClick={() => handleVote(sugg.id, 1)}
                                                                                    title="Upvote"
                                                                                >
                                                                                    <i className={`ph-${votes[sugg.id] === 1 ? "fill" : "light"} f-s-21 ph-thumbs-up`}></i>
                                                                                </button>

                                                                                <button
                                                                                    className={`btn p-0 border-0 vote-button ${votes[sugg.id] === -1 ? "text-danger animate-bounce-once" : "text-muted"}`}
                                                                                    onClick={() => handleVote(sugg.id, -1)}
                                                                                    title="Downvote"
                                                                                >
                                                                                    <i className={`ph-${votes[sugg.id] === -1 ? "fill" : "light"} f-s-21 ph-thumbs-down`}></i>
                                                                                </button>

                                                                                {voteErrors[sugg.id] && (
                                                                                    <small className="text-danger ms-1">{voteErrors[sugg.id]}</small>
                                                                                )}
                                                                            </div>
                                                                        </td>
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
                                                                            <span className={`badge ${sugg.status === "pending" ? "bg-warning" : sugg.status === "approved" ? "bg-success" : "bg-danger"}`}>
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

                                    <div
                                        className={`tabs-content ${activeTab === 2 ? "active" : ""
                                            }`}
                                        id="tab-2"
                                    >
                                        <div className="card p-l-r-30 pt-3 pb-3">
                                            <div className="card-body p-0">
                                                <div className="app-datatable-default overflow-auto position-relative">
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
                                                                <th width={10}>Sr No.</th>
                                                                <th>Title</th>
                                                                <th>Description</th>
                                                                <th>Votes Count</th>
                                                                <th>Date</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {paginatedData.length > 0 ? (
                                                                paginatedData.map((sugg, index) => (
                                                                    <tr key={sugg.id}>
                                                                        <td>{(currentPage - 1) * entries + index + 1}</td>
                                                                        <td>{sugg.title}</td>
                                                                        <td>{sugg.description}</td>
                                                                        <td>{sugg.votes_count}</td>
                                                                        <td
                                                                            title={new Date(sugg.created_at).toLocaleString('en-GB', {
                                                                                day: 'numeric',
                                                                                month: 'long',
                                                                                year: '2-digit',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                                second: '2-digit',
                                                                            })}
                                                                        >
                                                                            {new Date(sugg.created_at)
                                                                                .toLocaleDateString('en-GB', {
                                                                                    day: 'numeric',
                                                                                    month: 'long',
                                                                                    year: '2-digit',
                                                                                })
                                                                                .replace(
                                                                                    /^(\d{1,2})/,
                                                                                    '$1' + getDaySuffix(new Date(sugg.created_at).getDate())
                                                                                )}
                                                                        </td>
                                                                        <td>
                                                                            <span
                                                                                className={`badge ${sugg.status === "pending" ? "bg-warning" : sugg.status === "approved" ? "bg-success" : "bg-danger"}`}
                                                                            >
                                                                                {sugg.status.charAt(0).toUpperCase() + sugg.status.slice(1)}
                                                                            </span>
                                                                        </td>
                                                                        <td className="d-flex gap-2">
                                                                            <Link href={`/support/suggestion/${sugg.id}`}>
                                                                                <span className="badge text-white bg-info d-flex gap-2">
                                                                                    <i className="ph-duotone ph-eye f-s-18" /> View
                                                                                </span>
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={7} className="text-center py-3">
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
                                                        totalCount={filteredData.length}
                                                    />
                                                </div>
                                                {/* <div className="app-datatable-default overflow-auto">
                                                    <table className="datatable display app-data-table default-data-table" id="example">
                                                        <thead>
                                                            <tr>
                                                                <th width={10}>Sr No.</th>
                                                                <th>Title</th>
                                                                <th>Description</th>
                                                                <th>Votes Count</th>
                                                                <th>Date</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {suggestions.map((sugg, index) => (
                                                                <tr key={sugg.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{sugg.title}</td>
                                                                    <td>{sugg.description}</td>
                                                                    <td>{sugg.votes_count}</td>
                                                                    <td title={new Date(sugg.created_at).toLocaleString('en-GB', {
                                                                        day: 'numeric', month: 'long', year: '2-digit',
                                                                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                                                                    })}>
                                                                        {new Date(sugg.created_at).toLocaleDateString('en-GB', {
                                                                            day: 'numeric', month: 'long', year: '2-digit',
                                                                        }).replace(/^(\d{1,2})/, '$1' + getDaySuffix(new Date(sugg.created_at).getDate()))}
                                                                    </td>
                                                                    <td>
                                                                        <span className={`badge ${sugg.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                                                                            {sugg.status.charAt(0).toUpperCase() + sugg.status.slice(1)}
                                                                        </span>
                                                                    </td>
                                                                    <td className="d-flex gap-2">
                                                                        <Link href={`/support/suggestion/${sugg.id}`}>
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
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`tabs-content ${activeTab === 3 ? "active" : ""
                                            }`}
                                        id="tab-3"
                                    >
                                        <div className="card p-l-r-30 pt-3 pb-3">
                                            <div className="card-body p-0">
                                                {/* <div className="app-datatable-default overflow-auto">
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
                                                                <th>Sr No.</th>
                                                                <th>ID</th>
                                                                <th>Title</th>
                                                                <th>Description</th>
                                                                <th>Status</th>
                                                                <th>Vote</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {votedSuggestions.map((sugg, index) => {
                                                                const currentVote = votes[sugg.id]; 

                                                                return (
                                                                    <tr key={sugg.id}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{sugg.id}</td>
                                                                        <td>{sugg.title}</td>
                                                                        <td>{sugg.description}</td>
                                                                        <td>{sugg.status}</td>
                                                                        <td className="d-flex gap-3 align-items-center justify-content-center">

                                                                           
                                                                            <button
                                                                                className={`btn p-0 border-0 vote-button ${currentVote === 1 ? 'text-info' : 'text-muted'}`}
                                                                                title="Upvote"
                                                                                onClick={() =>
                                                                                    currentVote === 1
                                                                                        ? handleDeleteVoteFromTable(sugg.id)
                                                                                        : handleVote(sugg.id, 1)
                                                                                }
                                                                            >
                                                                                <i className={`ph-${currentVote === 1 ? 'fill' : 'light'} f-s-21 ph-thumbs-up`}></i>
                                                                            </button>

                                                                            
                                                                            <button
                                                                                className={`btn p-0 border-0 vote-button ${currentVote === -1 ? 'text-danger' : 'text-muted'}`}
                                                                                title="Downvote"
                                                                                onClick={() =>
                                                                                    currentVote === -1
                                                                                        ? handleDeleteVoteFromTable(sugg.id)
                                                                                        : handleVote(sugg.id, -1)
                                                                                }
                                                                            >
                                                                                <i className={`ph-${currentVote === -1 ? 'fill' : 'light'} f-s-21 ph-thumbs-down`}></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>


                                                    </table>
                                                    <PaginationControls
                                                        currentPage={currentPage}
                                                        setCurrentPage={setCurrentPage}
                                                        entries={entries}
                                                        totalCount={filteredData.length}
                                                    />

                                                </div>  */}
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
                                                                <th>Sr No.</th>
                                                                <th>ID</th>
                                                                <th>Title</th>
                                                                <th>Description</th>
                                                                <th>Status</th>
                                                                <th>Vote</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {paginatedVotedData.length > 0 ? (
                                                                paginatedVotedData.map((sugg, index) => {
                                                                    const currentVote = votes[sugg.id];

                                                                    return (
                                                                        <tr key={sugg.id}>
                                                                            <td className="text-start">{(currentPage - 1) * entries + index + 1}</td>
                                                                            <td>{sugg.id}</td>
                                                                            <td>{sugg.title}</td>
                                                                            <td>{sugg.description}</td>
                                                                            <td>
                                                                                <span
                                                                                    className={`badge ${
                                                                                        sugg.status === "approved"
                                                                                            ? "bg-success"
                                                                                            : sugg.status === "pending"
                                                                                            ? "bg-warning"
                                                                                            : "bg-danger"
                                                                                    }`}
                                                                                >
                                                                                    {sugg.status.charAt(0).toUpperCase() + sugg.status.slice(1)}
                                                                                </span>
                                                                            </td>
                                                                            <td className="d-flex gap-3 align-items-start justify-content-start">
                                                                                <button
                                                                                    className={`btn p-0 border-0 vote-button ${currentVote === 1 ? "text-info" : "text-muted"
                                                                                        }`}
                                                                                    title="Upvote"
                                                                                    onClick={() =>
                                                                                        currentVote === 1
                                                                                            ? handleDeleteVoteFromTable(sugg.id)
                                                                                            : handleVote(sugg.id, 1)
                                                                                    }
                                                                                >
                                                                                    <i
                                                                                        className={`ph-${currentVote === 1 ? "fill" : "light"
                                                                                            } f-s-21 ph-thumbs-up`}
                                                                                    ></i>
                                                                                </button>

                                                                                <button
                                                                                    className={`btn p-0 border-0 vote-button ${currentVote === -1 ? "text-danger" : "text-muted"
                                                                                        }`}
                                                                                    title="Downvote"
                                                                                    onClick={() =>
                                                                                        currentVote === -1
                                                                                            ? handleDeleteVoteFromTable(sugg.id)
                                                                                            : handleVote(sugg.id, -1)
                                                                                    }
                                                                                >
                                                                                    <i
                                                                                        className={`ph-${currentVote === -1 ? "fill" : "light"
                                                                                            } f-s-21 ph-thumbs-down`}
                                                                                    ></i>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={6} className="text-center py-3">
                                                                        No voted suggestions found
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
                        </div>




                    </div>

                    <div className="modal " id="projectCard1" aria-hidden="true">
                        <div className="modal-dialog ">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <div className="d-flex align-items-center gap-3">
                                        <h5 className="modal-title">Create Suggestion</h5>
                                        <iconify-icon icon="line-md:arrow-right-square" className="text-danger f-s-22"></iconify-icon>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    />
                                </div>

                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form onSubmit={handleSuggestionSubmit}>
                                                {success && <div className="alert alert-success">{success}</div>}

                                                <div className="mb-3">
                                                    <label htmlFor="title" className="form-label">Title</label>
                                                    <input
                                                        type="text"
                                                        id="title"
                                                        name="title"
                                                        className="form-control"
                                                        value={formData.title}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    {error.title && <div className="text-danger small">{error.title[0]}</div>}
                                                </div>

                                                <div className="mb-3">
                                                    <label htmlFor="description" className="form-label">Description</label>
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        className="form-control"
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    {error.description && <div className="text-danger small">{error.description[0]}</div>}
                                                </div>

                                                <button type="submit" className="btn btn-primary">Submit</button>
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
export default Suggestion;
