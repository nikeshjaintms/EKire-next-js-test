'use client';
import React, { useEffect, useState, Fragment } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';

function ViewPage() {
    const { slug } = useParams();
    const router = useRouter();
    const params = useParams();
    const [replies, setReplies] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]); // array of message strings
    const [statusOptions, setStatusOptions] = useState([]);
   
const [messageError, setMessageError] = useState('');

    // const [status, setStatus] = useState('');





    const supportId = params.slug; // 👈 get route param from the URL

    const [ticket, setTicket] = useState(null);
    console.log('Support ID:', supportId);
    useEffect(() => {
        if (supportId) {
            fetchTicketDetails();
        }
    }, [supportId]);

    const fetchTicketDetails = async () => {
        console.log('Fetching ticket details for ID:', supportId);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/support/tickets/${supportId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });

            const data = await res.json();
            console.log('Ticket details fetched:', data);
            console.log('Replies details fetched:', replies);
            console.log(data?.data.replies ?? []);

            setTicket(data?.data);
            setReplies(data?.data.replies); // adapt based on your success structure

        } catch (error) {
            console.error('Failed to fetch ticket:', error);
        }
    };
    useEffect(() => {
        if (supportId) {
            fetchReplies();
        }
    }, [supportId]);

    // api for change status 
    // const [ticket, setTicket] = useState(null);
    const [status, setStatus] = useState(ticket?.status || 'open'); // preselect
    const handleStatusUpdate = async (e) => {
        e.preventDefault();

        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to update the ticket status?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it',
            cancelButtonText: 'No, cancel',
        });

        if (!confirm.isConfirmed) return;

        // Prevent updating to same status
        if (ticket?.status === status) {
            Swal.fire({
                icon: 'info',
                title: 'No Change',
                text: `This ticket is already marked as "${status}".`,
            });
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/support/tickets/${ticket.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
                body: JSON.stringify({ status }),
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data.message || 'Status updated successfully.',
                });

                // Update status in UI
                setTicket((prev) => ({ ...prev, status }));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Failed to update status.',
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

    // api for change status end

    // api for reply on single support ticket
    const fetchReplies = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/support/tickets/${supportId}/reply`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                    body: JSON.stringify({ reply: '' }),
                }
            );

            const data = await res.json();

            if (res.ok && data?.data?.replies?.length) {
                const allReplies = data.data.replies;

                // ✅ Separate replies
                const adminOnly = allReplies.filter((r) => r.sender_type === 'Admin');
                const customerOnly = allReplies.filter((r) => r.sender_type === 'Customer');

                setAdminReplies(adminOnly);
                setMessages(customerOnly.map((r) => r.message));
            }
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };
    const handleSend = async () => {
        const trimmed = messageInput.trim();
        if (!trimmed) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/support/tickets/${supportId}/reply`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                    body: JSON.stringify({ reply: trimmed }),
                }
            );

            const data = await res.json();

            if (res.ok && data.reply) {
                setMessages((prev) => [...prev, data.reply.message]); // ✅ Add the new message
                setMessageInput(''); // ✅ Clear input
            } else {
                alert(data.message || 'Failed to send reply.');
            }
        } catch (error) {
            console.error('Send message error:', error);
            alert('Something went wrong.');
        }
    };
    // api end of reply on single support ticket

    // api for customer-statuses
    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/support/tickets/customer-statuses`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                });

                const data = await res.json();
                if (res.ok && data.data) {
                    setStatusOptions(data.data);
                    setStatus(data.data[0]?.status || ''); // set default
                }
            } catch (err) {
                console.error('Error fetching statuses:', err);
            }
        };

        fetchStatuses();
    }, []);
    // api for customer-statuses end




    // const realFileRef = useRef(null);
    // const customTextRef = useRef(null);
    // const [fileName, setFileName] = useState("");
    // const [showClear, setShowClear] = useState(false);

    // const handleFileClick = () => {
    //     realFileRef.current?.click();
    // };

    // const handleFileChange = () => {
    //     const input = realFileRef.current;
    //     if (input?.files?.length > 0) {
    //         const file = input.files[0];
    //         setFileName(file.name);
    //         setShowClear(true);
    //     } else {
    //         setFileName("");
    //         setShowClear(false);
    //     }
    // };

    // const handleClear = () => {
    //     if (realFileRef.current) {
    //         realFileRef.current.value = "";
    //     }
    //     setFileName("");
    //     setShowClear(false);
    // };

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
                                <h4 className="main-title">Ticket {slug} </h4>
                                <ul className="app-line-breadcrumbs mb-3">
                                    <li>
                                        <a className="f-s-14 f-w-500" href="/support">
                                            <span>
                                                <i className="ph-duotone  ph-table f-s-16" /> Support
                                            </span>
                                        </a>
                                    </li>
                                    <li className="active">
                                        <a className="f-s-14 f-w-500" href="#">Ticket {slug}</a>
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
                                                    <h5>Ticket Details</h5>
                                                </div>
                                                <div className="row card-body">
                                                    {ticket && (
                                                        <>
                                                            <div className="col-12 col-lg-6 m-10-0">
                                                                <div className="card-body card-body-style">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <div className="dropdown bg-xl-light-primary h-40 w-40 d-flex-center b-r-15">
                                                                                <i className="ph-bold ph-command f-s-20 text-primary" />
                                                                            </div>
                                                                            <h6 className="mb-0">Customer ID</h6>
                                                                        </div>
                                                                        <h6 className="mb-0">{ticket.customer_id}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-lg-6 m-10-0">
                                                                <div className="card-body card-body-style">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <div className="dropdown bg-xl-light-success h-40 w-40 d-flex-center b-r-15">
                                                                                <i className="ph-bold ph-database f-s-20 text-success" />
                                                                            </div>
                                                                            <h6 className="mb-0">Subject</h6>
                                                                        </div>
                                                                        <h6 className="mb-0">{ticket.subject}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-lg-6 m-10-0">
                                                                <div className="card-body card-body-style">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <div className="dropdown bg-xl-light-secondary h-40 w-40 d-flex-center b-r-15">
                                                                                <i className="ph-bold ph-floppy-disk f-s-20 text-secondary" />
                                                                            </div>
                                                                            <h6 className="mb-0">Description</h6>
                                                                        </div>
                                                                        <h6 className="mb-0">{ticket.description}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-lg-6 m-10-0">
                                                                <div className="card-body card-body-style">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <div className="dropdown bg-xl-light-danger h-40 w-40 d-flex-center b-r-15">
                                                                                <i className="ph-bold ph-map-pin-line f-s-20 text-danger" />
                                                                            </div>
                                                                            <h6 className="mb-0">Status</h6>
                                                                        </div>
                                                                        <h6 className="mb-0">{ticket.status}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-lg-6 m-10-0">
                                                                <div className="card-body card-body-style">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <div className="dropdown bg-xl-light-info h-40 w-40 d-flex-center b-r-15">
                                                                                <i className="ph-bold ph-cpu text-info f-s-20" />
                                                                            </div>
                                                                            <h6 className="mb-0">Created at</h6>
                                                                        </div>
                                                                        <h6 className="mb-0">{new Date(ticket.created_at).toLocaleString()}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-lg-6 m-10-0">
                                                                <div className="card-body card-body-style">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <div className="dropdown bg-xl-light-warning h-40 w-40 d-flex-center b-r-15">
                                                                                <i className="ph-bold ph-windows-logo f-s-22 text-warning" />
                                                                            </div>
                                                                            <h6 className="mb-0">Updated at</h6>
                                                                        </div>
                                                                        <h6 className="mb-0">{new Date(ticket.updated_at).toLocaleString()}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {ticket.status !== 'closed' && (
                                                            <div className="col-12 col-lg-6 m-10-0">
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
                                                                                        {option.status.charAt(0).toUpperCase() + option.status.slice(1)}
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


                                                            </div>
                                                            )}

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
                                                                            {reply.admin_name || 'Ekire'}
                                                                            <span className="badge bg-light-info text-info p-1 f-s-12 ms-2">Ekire Staff</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            You
                                                                            <span className="badge bg-light-primary text-primary p-1 f-s-12 ms-2">Your Message</span>
                                                                        </>
                                                                    )}
                                                                </h6>

                                                                <p className="text-dark mb-1">{reply?.message}</p>
                                                            </div>
                                                            <div className="ms-5">
                                                                <p>{new Date(reply.created_at).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}



                                            {/* <div className="ticket-comment-box mb-3">
                                                <div className="d-flex justify-content-between position-relative flex-wrap">
                                                    <div className="flex-grow-1 ps-2 pe-2">
                                                        <h6 className="mb-3">Sandhya</h6>
                                                        <p className="text-dark mb-1">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur, voluptatibus.</p>
                                                        <span>IP Address: 2405:201:3040:7803:b43a:7fa0:fb7a:34df</span>
                                                    </div>
                                                    <div className="ms-5">
                                                        <p>Feb 9, 2022 10:31 AM</p>
                                                    </div>
                                                </div>
                                            </div> */}


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

                                                    {/* <div className="card-footer pb-0">
                                                        <div className="chat-footer d-flex">
                                                            <div className="app-form flex-grow-1">
                                                                <div className="input-group">
                                                                    <textarea
                                                                        className="form-control b-r-6"
                                                                        placeholder="Type a message"
                                                                        value={messageInput}
                                                                        onChange={(e) => setMessageInput(e.target.value)}
                                                                    />
                                                                    <button
                                                                        className="btn btn-sm btn-light-primary ms-2 me-2 b-r-4"
                                                                        type="button"
                                                                        onClick={handleSend}
                                                                    >
                                                                        <i className="ti ti-send" /> <span>Send</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                    <div className="card-footer pb-0">
    <div className="chat-footer d-flex">
        <div className="app-form flex-grow-1">
            <div className="input-group">
                <textarea
                    className={`form-control b-r-6 ${messageError ? 'is-invalid' : ''}`}
                    placeholder="Type a message"
                    value={messageInput}
                    onChange={(e) => {
                        setMessageInput(e.target.value);
                        if (e.target.value.trim()) setMessageError('');
                    }}
                />
                <button
                    className="btn btn-sm btn-light-primary ms-2 me-2 b-r-4"
                    type="button"
                    onClick={() => {
                        if (!messageInput.trim()) {
                            setMessageError('Message is required.');
                            return;
                        }

                        setMessageError('');
                        handleSend(); // ✅ Your existing logic
                    }}
                >
                    <i className="ti ti-send" /> <span>Send</span>
                </button>
            </div>
            {messageError && <div className="text-danger mt-1">{messageError}</div>}
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
