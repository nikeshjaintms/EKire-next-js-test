'use client';
import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';

function ViewPage() {
    const { slug } = useParams();
    const router = useRouter();
    const params = useParams();
    const [replies, setReplies] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([])
    const abuseId = params.slug;

    const [ticket, setTicket] = useState(null);
    console.log('Abuse ID:', abuseId);


    // api for view single abuse ticket
    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/abuse/tickets/${abuseId}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                });

                const data = await res.json();
                if (res.ok && data.success) {
                    setTicket(data.data);
                    setReplies(data.data.replies || []);
                    setStatus(data.data.status);
                } else {
                    console.error('Error:', data.error || 'Unknown error');
                    if (data.error === 'Unauthorized') {
                        alert('Session expired or unauthorized. Redirecting to login.');
                        router.push('/login'); // Update route as needed
                    }
                }
            } catch (error) {
                console.error('Failed to fetch ticket:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTicketDetails();
    }, [abuseId]);
    // api for view single abuse ticket end



    // api for reply on abuse ticket
    const handleSend = async () => {
        if (!messageInput.trim()) {
            alert("Please enter a reply before sending.");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/abuse/tickets/${abuseId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
                body: JSON.stringify({
                    reply: messageInput.trim()
                }),
            });

            const data = await res.json();

            if (res.status === 400 && data.errors?.reply) {
                alert(data.errors.reply[0]);
                return;
            }

            if (!res.ok || data.success === false) {
                alert(data.message || "Something went wrong.");
                return;
            }

            // Add reply to reply list
            const newReply = data.reply;
            setReplies((prev) => [...prev, newReply]);
            setMessageInput("");

            // Optional: show message confirmation
            alert("Reply sent successfully!");

        } catch (err) {
            console.error("Reply send failed:", err);
            alert("Failed to send reply. Please try again.");
        }
    };
    // api for reply on abuse ticket end

    // to check if alert should be shown
    const shouldShowReplyAlert = useMemo(() => {
        if (ticket?.status !== 'awaiting_user_response') return false;

        // Check if any reply is from the user (Customer)
        const userHasReplied = replies?.some(
            (reply) => reply.sender_type === 'App\\Models\\Customer'
        );

        return !userHasReplied;
    }, [ticket?.status, replies]);
    // for timer
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        if (!ticket?.created_at || !shouldShowReplyAlert) return;

        const endTime = new Date(ticket.created_at).getTime() + 24 * 60 * 60 * 1000;

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff <= 0) {
                setTimeLeft('00:00:00');
                clearInterval(interval);
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setTimeLeft(
                    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                );
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [ticket?.created_at, shouldShowReplyAlert]);

    // for timer end


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
                                <h4 className="main-title">Abuse Ticket {slug} </h4>
                                <ul className="app-line-breadcrumbs mb-3">
                                    <li>
                                        <a className="f-s-14 f-w-500" href="/support/abuse">
                                            <span>
                                                <i className="ph-duotone  ph-table f-s-16" /> view abuse ticket
                                            </span>
                                        </a>
                                    </li>
                                    <li className="active">
                                        <a className="f-s-14 f-w-500" href="#">Abuse Ticket {slug}</a>
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
                                                {shouldShowReplyAlert && (
                                                    <div className="alert alert-light-border-danger alert-dismissible d-flex align-items-center justify-content-between mt-3 cookies-alert" role="alert">
                                                        <p className="mb-0 d-flex align-items-center flex-row gap-2">
                                                            <iconify-icon icon="line-md:alert" className="f-s-20 me-2"></iconify-icon>
                                                            If you don’t respond within 24 hrs, your account will be suspended
                                                            <span className="badge bg-danger text-white ms-3">{timeLeft}</span>
                                                        </p>
                                                    </div>
                                                )}


                                                <div className="card-header">
                                                    <h5>Ticket Details</h5>
                                                </div>
                                                <div className="row card-body">
                                                    {ticket && (
                                                        <>
                                                            <div className="col-12 col-lg-6 m-10-0">
                                                                <div className="card-body card-body-style">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            {/* <div className="dropdown bg-xl-light-primary h-40 w-40 d-flex-center b-r-15">
                                                                                <img src="/assets/images/icons/id.png" alt="" width={25} />
                                                                            </div> */}
                                                                            <h6 className="mb-0 text-primary">Customer ID</h6>
                                                                        </div>
                                                                        <h6 className="mb-0">{ticket.customer_id}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-lg-6 m-10-0">
                                                                <div className="card-body card-body-style">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            {/* <div className="dropdown bg-xl-light-success h-40 w-40 d-flex-center b-r-15">
                                                                                <img src="/assets/images/icons/subject.png" alt="" width="20px" />
                                                                            </div> */}
                                                                            <h6 className="mb-0 text-success">Subject</h6>
                                                                        </div>
                                                                        <h6 className="mb-0">{ticket.subject}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-lg-6 m-10-0">
                                                                <div className="card-body card-body-style">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            {/* <div className="dropdown bg-xl-light-secondary h-40 w-40 d-flex-center b-r-15">
                                                                                <img src="/assets/images/icons/left.png" alt="" width="18px" />
                                                                            </div> */}
                                                                            <h6 className="mb-0 text-secondary">Description</h6>
                                                                        </div>
                                                                        <h6 className="mb-0">{ticket.description}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-lg-6 m-10-0">
                                                                <div className="card-body card-body-style">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            {/* <div className="dropdown bg-xl-light-danger h-40 w-40 d-flex-center b-r-15">
                                                                                <i className="ph-bold ph-map-pin-line f-s-20 text-danger" />
                                                                            </div> */}
                                                                            <h6 className="mb-0 text-danger">Status</h6>
                                                                        </div>
                                                                        <h6 className="mb-0">{ticket.status.replaceAll('_', ' ')}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-lg-6 m-10-0">
                                                                <div className="card-body card-body-style">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            {/* <div className="dropdown bg-xl-light-info h-40 w-40 d-flex-center b-r-15">
                                                                                <i className="ph-bold ph-cpu text-info f-s-20" />
                                                                            </div> */}
                                                                            <h6 className="mb-0 text-info">Created at</h6>
                                                                        </div>
                                                                        <h6 className="mb-0">{new Date(ticket.created_at).toLocaleString()}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-lg-6 m-10-0">
                                                                <div className="card-body card-body-style">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            {/* <div className="dropdown bg-xl-light-warning h-40 w-40 d-flex-center b-r-15">
                                                                                <i className="ph-bold ph-windows-logo f-s-22 text-warning" />
                                                                            </div> */}
                                                                            <h6 className="mb-0 text-warning" >Updated at</h6>
                                                                        </div>
                                                                        <h6 className="mb-0">{new Date(ticket.updated_at).toLocaleString()}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* <div className="col-12 col-lg-6 m-10-0">
                                                                <form className="app-form mt-4" onSubmit={handleStatusUpdate}>
                                                                    <div className="row">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" htmlFor="status">Change Status</label>
                                                                            <select
                                                                                className="form-select"
                                                                                id="status"
                                                                                value={status}
                                                                                onChange={(e) => setStatus(e.target.value)}
                                                                            >
                                                                                {statusOptions.map((option) => (
                                                                                    <option key={option.id} value={option.status}>
                                                                                        {option.status.replaceAll('_', ' ')}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </div>

                                                                        <div className="text-end">
                                                                            <button className="btn btn-primary" type="submit">
                                                                                Update
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div> */}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {/* <form className="row g-3 app-form rounded-control" id="form-validation">
                                                <div className="col-lg-6 col-md-12">
                                                    <label className="form-label" htmlFor="validationDefault01">Subject</label>
                                                    <input className="form-control" id="validationDefault01" type="text" placeholder="Enter Subject" required />
                                                </div>
                                                <div className="col-lg-6 col-md-12">
                                                    <label className="form-label" htmlFor="Support">
                                                        Support Department
                                                    </label>
                                                    <select className="form-select" id="Support" required>
                                                        <option>General Support</option>
                                                        <option>Technical</option>
                                                        <option>Billing</option>
                                                    </select>
                                                    <div className="invalid-feedback">Please select a valid version.</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <label className="form-label" htmlFor="address">Content</label>
                                                    <textarea className="form-control" id="address" placeholder="Your Message....." type="text" />
                                                    <div className="mt-1">
                                                        <span className="text-danger" id="addressError" />
                                                    </div>
                                                </div>


                                                <div className="col-12 d-flex flex-column gap-2">
                                                    <div className="app-form">
                                                        <input hidden id="real-file" type="file" ref={realFileRef} onChange={handleFileChange} />
                                                        <div className="d-flex align-items-start flex-column-reverse gap-3">

                                                            <div className="d-flex gap-4 align-items-center">
                                                                <span className="custom-text" id="custom-text" ref={customTextRef}>
                                                                    {fileName}
                                                                </span>
                                                                {showClear && (
                                                                    <a id="clear-button" onClick={handleClear}>
                                                                        <i className="ph-bold ph-trash"></i>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <button
                                                            className="flex-shrink-0 border-0 bg-none text-primary"
                                                            id="custom-button"
                                                            type="button"
                                                            onClick={handleFileClick}
                                                        >
                                                            <i className="iconoir-attachment f-s-30"></i>
                                                        </button>
                                                        <button className="btn btn-primary b-r-22" type="submit">
                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>

                                            </form> */}
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="card-header">
                                            <h5>Ticket Reply</h5>
                                        </div>
                                        <div className="card-body">

                                            {replies.length === 0 ? (
                                                <p>No replies yet.</p>
                                            ) : (
                                                replies.map((reply, index) => (
                                                    <div key={index} className="ticket-comment-box mb-3">
                                                        <div className="d-flex justify-content-between position-relative flex-wrap">
                                                            <div className="flex-grow-1 ps-2 pe-2">
                                                                <h6 className="mb-3">
                                                                    {reply.sender_type === 'App\\Models\\Admin' ? (
                                                                        <>
                                                                            {reply.admin_name || 'Admin'}
                                                                            <span className="badge bg-light-info text-info p-1 f-s-12 ms-2">Admin</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            You
                                                                            <span className="badge bg-light-primary text-primary p-1 f-s-12 ms-2">Your Message</span>
                                                                        </>
                                                                    )}
                                                                </h6>
                                                                <p className="text-dark mb-1">{reply.message}</p>
                                                            </div>
                                                            <div className="ms-5">
                                                                <p>{new Date(reply.created_at).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}



                                        </div>
                                        <div className="card-footer">
                                            <div className="ticket-comment-box col-lg-12 col-xxl-12 box-col-12 p-0">
                                                <div className="card-header">
                                                    <h5>Add a Reply</h5>
                                                </div>
                                                <div className="card chat-container-content-box ms-0">
                                                    <div className="card-body chat-body">
                                                        <div className="chat-container">
                                                            {messages.map((msg, index) => (
                                                                <div key={index} className="position-relative mb-2">
                                                                    <div className="chat-box ms-0 ps-0">
                                                                        <p className="chat-text">{msg}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                    </div>

                                                    <div className="card-footer pb-0">
                                                        <div className="chat-footer d-flex">
                                                            <div className="app-form flex-grow-1">
                                                                {ticket?.status !== 'awaiting_user_response' && ticket?.status !== 'closed' && (
                                                                    <p className="text-danger mt-2 mb-2">
                                                                        You can only reply when the ticket is awaiting your response or has been closed.
                                                                    </p>
                                                                )}
                                                                <div className="input-group">
                                                                    <input
                                                                        className="form-control b-r-6"
                                                                        placeholder="Type a message"
                                                                        value={messageInput}
                                                                        onChange={(e) => setMessageInput(e.target.value)}
                                                                        disabled={ticket?.status !== 'awaiting_user_response' && ticket?.status !== 'closed'}
                                                                    />
                                                                    <button
                                                                        className="btn btn-sm btn-light-primary ms-2 me-2 b-r-4"
                                                                        type="button"
                                                                        onClick={handleSend}
                                                                        disabled={ticket?.status !== 'awaiting_user_response' && ticket?.status !== 'closed'}
                                                                    >
                                                                        <i className="ti ti-send" /> <span>Send</span>
                                                                    </button>
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
                        </div>
                        {/* Projects end */}


                    </div>

                </main>
            </div>
        </Fragment>
    );
}
export default ViewPage;
