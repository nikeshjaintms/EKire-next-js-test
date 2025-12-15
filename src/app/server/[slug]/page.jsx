"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState, useEffect, useRef, useMemo } from "react";
import Cookies from "js-cookie";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { color } from "chart.js/helpers";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import TableControls from "@/components/datatable/TableControls";
import PaginationControls from "@/components/datatable/PaginationControls";
import Select from "react-select";

function Manage() {
    const params = useParams();
    const id = params.slug;
    const [activeTab, setActiveTab] = useState(1);
    const [activeInnerTab, setActiveInnerTab] = useState(8);
    const [selectedOS, setSelectedOS] = useState(null);
    const [os, setOs] = useState([]);
    const [app, setApp] = useState([]);
    const [selectedOSId, setSelectedOSId] = useState(null);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showResumeButton, setShowResumeButton] = useState(false);
    const [project, setProject] = useState([]);
    const [loadingKeys, setLoadingKeys] = useState(true);
    

    const handleOSClick = (osid) => {
        setSelectedOSId(osid);
    };

   
    const handleAppClick = (appid) => {
        setSelectedAppId(appid);
    };

    const handleCopy = (value) => {
        if (!value) return;
        navigator.clipboard.writeText(value).then(() => {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Copied!",
                text: `${value} copied to clipboard`,
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
        });
    };

    const [showReinstallCard, setShowReinstallCard] = useState(false);
    const [selectedVersionId, setSelectedVersionId] = useState(null);

    const [serverdetails, setServerDetails] = useState(null);
    const [vmps, setVmps] = useState(null);
    const [systemusage, setSystemUsage] = useState(null);
    const [hostname, setHostname] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState({});
    // const [snapshots, setSnapshots] = useState([]);
    // const serverId= id ;
    const [formData, setFormData] = useState({ snapshot_name: "", });
    const [snapshots, setSnapshots] = useState([]);
    // Top of your component:
    const [snapshotError, setSnapshotError] = useState({});
    const [snapshotSuccess, setSnapshotSuccess] = useState("");
    const [sshKeys, setSshKeys] = useState([]);
    
    const modalRef = useRef(null);

    const [reinstallPayload, setReinstallPayload] = useState({
        os_version_id: null,
        password:"",
        ssh_keys: [],
    });
    const [changehostnamePayload, setChangeHostnamePayload] = useState({
        hostname: "",
    });

    // Fetch Server Details and VMPS
    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token && id) {
            console.log("fetch token ", token);
            const FetchSshkey = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/get`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const result = await response.json();

                    const data = result.data.data;
                    setServerDetails(data.server);
                    setVmps(data.vms);
                    setSystemUsage(data);
                    setIsLoading(false);
                    setShowResumeButton(data.canUserResumesServer)
                    setProject(data.server.projects)
                    if(data.server.auto_backup == 1)
                        setAutoBackup(true);
                    else {
                        setAutoBackup(false);
                    }
                } catch (error) {
                    console.error("Error fetching Server:", error);
                    setIsLoading(false);
                }
            };

            FetchSshkey();
        }
    }, [id]);


    const [selectedSSHKeys, setSelectedSSHKeys] = useState([]);
      const [fetchError, setFetchError] = useState(false);
    

    const fetchSSHKeys = async (projectId) => {
      if (!projectId) return;
      console.log("Fetching SSH keys for project ID:", projectId);

      setLoadingKeys(true);
      setFetchError(false);
    
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects/${projectId}/ssh-keys`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        );
    
        const data = await res.json();
        console.log("SSH keys response:", data);
    
        // Adjust to correct structure
        if (res.ok && data.data && Array.isArray(data.data.data)) {
          setSshKeys(data.data.data);
          setSelectedSSHKeys([]);
        } else {
          setSshKeys([]);
          setSelectedSSHKeys([]);
          setFetchError(true);
        }
      } catch (err) {
        console.error("Error fetching SSH keys:", err);
        setSshKeys([]);
        setSelectedSSHKeys([]);
        setFetchError(true);
      }
    
      setLoadingKeys(false);
    };
    
 useEffect(() => {
  if (project && project.length > 0) {
    const projectId = project[0].id; // ✅ this gives 363
    console.log("Using project ID:", projectId);
    fetchSSHKeys(projectId);
  }
}, [project]);

   
    useEffect(() => {
        const toggleIcons = document.querySelectorAll(".toggle-password");

        toggleIcons.forEach((icon) => {
            const targetId = icon.getAttribute("data-target");
            const passwordInput = document.getElementById(targetId);

            if (!passwordInput) return;

            const toggleVisibility = () => {
                const isPassword = passwordInput.type === "password";

                passwordInput.type = isPassword ? "text" : "password";
                icon.classList.toggle("ph-eye");
                icon.classList.toggle("ph-eye-slash");
            };

            icon.addEventListener("click", toggleVisibility);

            // Cleanup on unmount
            return () => {
                icon.removeEventListener("click", toggleVisibility);
            };
        });
    }, []);

    // auto loadl
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 900);
        return () => clearTimeout(timer);
    }, []);

    // additional disk
    const [count, setCount] = useState(1);
    const [price, setPrice] = useState(5); // Default price for 1 GB

    const updatePrice = (value) => {
        if (value >= 1 && value <= 5) {
            setPrice(5);
        } else if (value >= 6 && value <= 10) {
            setPrice(10);
        } else if (value > 10 && value <= 50) {
            setPrice(20);
        } else {
            setPrice(30); // Adjust as needed
        }
    };

    const increment = () => {
        const newValue = count + 1;
        setCount(newValue);
        updatePrice(newValue);
    };

    const decrement = () => {
        if (count > 1) {
            const newValue = count - 1;
            setCount(newValue);
            updatePrice(newValue);
        }
    };
// Start Server
    const startServer = async (id) => {
        if (!id) return;

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-primary ms-2",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "Start Server?",
                text: "Are you sure you want to start this server?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, start it!",
                cancelButtonText: "Cancel",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Show loading modal
                        Swal.fire({
                            title: "Starting Server...",
                            text: "Please wait while the server is being started.",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            },
                        });

                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/start`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                                },
                            }
                        );

                        const result = await res.json();
                        console.log("Start Server Response:", result);

                        // ✅ Handle success
                        if (res.ok && result.data?.status === "success") {
                            Swal.fire(
                                "Started!",
                                "The server has been started successfully.",
                                "success"
                            );
                        }
                        // ❌ Handle API error (server suspended, etc.)
                        else {
                            // Try to extract meaningful message
                            let errorMessage = result?.data?.message || result?.message || "Failed to start the server.";

                            Swal.fire("Failed!", errorMessage, "error");
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        Swal.fire("Error!", "Something went wrong.", "error");
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Server start cancelled.",
                        "info"
                    );
                }
            });
    };


    // api for stop server
    const stopServer = async (id) => {
        if (!id) return;

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success ms-2",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "Stop Server?",
                text: "Are you sure you want to stop this server?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, stop it!",
                cancelButtonText: "Cancel",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Show loader modal
                        Swal.fire({
                            title: "Stopping Server...",
                            text: "Please wait while the server is being stopped.",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            },
                        });

                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/stop`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                                },
                            }
                        );

                        const result = await res.json();
                        console.log("Stop Server Response:", result);

                        if (res.ok && result.data.status === "success") {
                            Swal.fire(
                                "Stopped!",
                                "The server has been stopped successfully.",
                                "success"
                            );
                        } else {
                            Swal.fire(
                                "Failed!",
                                result.message || "Failed to stop the server.",
                                "error"
                            );
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        Swal.fire("Error!", "Something went wrong.", "error");
                    }
                } else {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Server stop cancelled.",
                        "info"
                    );
                }
            });
    };


    // api for restart server
    const restartServer = async (id) => {
        if (!id) return;

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-secondary ms-2",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "Restart Server?",
                text: "Are you sure you want to restart this server?",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Yes, restart it!",
                cancelButtonText: "Cancel",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Show loader while restarting
                        Swal.fire({
                            title: "Restarting Server...",
                            text: "Please wait while the server is restarting.",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            },
                        });

                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/restart`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                                },
                            }
                        );

                        const result = await res.json();
                        console.log("Restart Server Response:", result);

                        if (res.ok && result.data.status === "success") {
                            Swal.fire(
                                "Restarted!",
                                "The server has been restarted successfully.",
                                "success"
                            );
                        } else {
                            let errorMessage = result?.data?.message || result?.message || "Failed to start the server.";

                            Swal.fire("Failed!", errorMessage, "error");
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        Swal.fire("Error!", "Something went wrong.", "error");
                    }
                } else {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Server restart cancelled.",
                        "info"
                    );
                }
            });
    };


    // api os + app system
    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token) {
            // console.log("Token found:", token);
            const FetchProject = async () => {
                console.log(`Bearer ${token}`);
                setIsLoading(true);
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/operating-systems-applications`,
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
                    setOs(data.operating_systems);
                    setApp(data.applications);
                } catch (error) {
                    console.error("Error fetching cloud vps plan data:", error);
                    setIsLoading(false);
                }
            };
            FetchProject();
        }
    }, []);


  const createdDate = systemusage?.server?.billing?.created_at
  ? new Date(systemusage.server.billing.created_at)
  : null;

const expiryDate = systemusage?.server?.billing?.expiry_date
  ? new Date(systemusage.server.billing.expiry_date)
  : null;

let daysRemaining = 0;
let totalCycleDays = 0;
let daysConsumed = 0;
let percent = 0;

if (createdDate && expiryDate) {
  totalCycleDays = Math.ceil(
    (expiryDate - createdDate) / (1000 * 60 * 60 * 24)
  );
  daysRemaining = Math.max(
    0,
    Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24))
  );
  daysConsumed = totalCycleDays - daysRemaining;
  percent = Math.min(
    100,
    Math.round((daysConsumed / totalCycleDays) * 100)
  );
}

    // api for reinstall server

    

    const handleReinstallChange = (e) => {
        setReinstallPayload({
            ...reinstallPayload,
            [e.target.name]: e.target.value,
        });
    };

    const [ReinstallError, setReinstallError] = useState({});

  const reinstallServer = async (id, reinstallPayload) => {
    if (!id || !reinstallPayload?.os_version_id || !reinstallPayload.password || !reinstallPayload.ssh_keys) return;

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-secondary ms-2",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "Reinstall Server?",
                text: "This will wipe the existing data. Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, reinstall!",
                cancelButtonText: "Cancel",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Show loader while reinstalling
                        Swal.fire({
                            title: "Reinstalling Server...",
                            text: "Please wait while the server is being reinstalled.",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            },
                        });

                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/reinstall`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                                },
                                body: JSON.stringify(reinstallPayload),
                            }
                        );

                        const result = await res.json();
                        console.log("Reinstall Server Response:", result);

                        if (res.ok && result.data.status === "success") {
                            Swal.fire(
                                "Reinstalled!",
                                "The server has been reinstalled successfully.",
                                "success"
                            ).then(() => {
                                window.location.reload(); // Reload page after success
                            });
                        } else {
                            let errorMessage = result?.data?.message || result?.message || "Failed to start the server.";

                            Swal.fire("Failed!", errorMessage, "error");
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        Swal.fire(
                            "Error!",
                            "Something went wrong during reinstall.",
                            "error"
                        );
                    }
                } else {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Server reinstall cancelled.",
                        "info"
                    );
                }

            });

};
useEffect(() => {
  if (ReinstallError && Object.keys(ReinstallError).length > 0) {
    const timer = setTimeout(() => {
      setReinstallError({});
    }, 3000);

    return () => clearTimeout(timer); // cleanup on unmount
  }
}, [ReinstallError]);

    const handleHostnameChange = (e) => {
        setChangeHostnamePayload({
            ...changehostnamePayload,
            [e.target.name]: e.target.value,
        });
    };
    // api for hostname update
    const handleUpdateClick = async () => {
        if (!changehostnamePayload?.hostname) {
            Swal.fire("Missing Info", "Please enter a hostname.", "warning");
            return;
        }

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-primary ms-2",
                cancelButton: "btn btn-secondary",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "Update Hostname?",
                text: `Are you sure you want to update the hostname to "${changehostnamePayload?.hostname}"?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Show loader while updating
                        Swal.fire({
                            title: "Updating Hostname...",
                            text: "Please wait while the hostname is being updated.",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            },
                        });

                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/update`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                                },
                                body: JSON.stringify({
                                    hostname: changehostnamePayload?.hostname,
                                }),
                            }
                        );

                        const data = await res.json();
                        console.log("Update Response:", data);

                        if (res.ok && data?.data?.status === "success") {
                            Swal.fire(
                                "Updated!",
                                "The hostname was updated successfully.",
                                "success"
                            );
                            setChangeHostnamePayload({ hostname: "" }); // Reset field 
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000);
                        } else {
                            Swal.fire(
                                "Failed!",
                                data.message || "Failed to update hostname.",
                                "error"
                            );
                        }
                    } catch (error) {
                        console.error("Update Error:", error);
                        Swal.fire(
                            "Error",
                            "Something went wrong.",
                            "error"
                        );
                    }
                } else {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Update was cancelled.",
                        "info"
                    );
                }
            });
    };


    // // api for update password
    const handleChangePasswordClick = async () => {
        console.log("ID: ", id);
        if (!id) {
            Swal.fire("Missing Info", "Server ID is required.", "warning");
            return;
        }

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-primary ms-2",
                cancelButton: "btn btn-secondary",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "Change Server Password?",
                text: "Are you sure you want to send a new password to the current user?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Show loader while updating password
                        Swal.fire({
                            title: "Changing Password...",
                            text: "Please wait while the new password is being generated.",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            },
                        });

                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/password`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                                },
                                body: JSON.stringify({
                                    send_password_to_current_user: true,
                                }),
                            }
                        );

                        const data = await res.json();
                        // console.log("Change Password Response:", data);

                        if (res.ok && data?.data?.status === "success") {
                            Swal.fire(
                                "Updated!",
                                "Password has been sent to the admin.",
                                "success"
                            );
                        } else {
                            Swal.fire(
                                "Failed!",
                                data.message || "Failed to update password.",
                                "error"
                            );
                        }
                    } catch (error) {
                        console.error("Change Password Error:", error);
                        Swal.fire(
                            "Error",
                            "Something went wrong.",
                            "error"
                        );
                    }
                } else {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Password update was cancelled.",
                        "info"
                    );
                }
            });
    };






    useEffect(() => {
        if (id) fetchSnapshots(id);
    }, [id]);

    // api for list snapshots
    const fetchSnapshots = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/list-snapshots`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    },
                }
            );

            const data = await res.json();
            console.log("Snapshots:", data);

            if (res.ok && data?.data?.snapshots) {
                setSnapshots(data.data.snapshots);
                console.log("Fetched snapshots:", data.data.snapshots);
            } else {
                console.error(
                    "Failed to fetch snapshots:",
                    data?.data?.error || "Unknown error"
                );
            }
        } catch (err) {
            console.error("Error fetching snapshots:", err);
        }
    };



    // to close the modal on cross and reload the table
    useEffect(() => {
        const modalElement = modalRef.current;
        if (!modalElement) return;

        const bootstrap = require("bootstrap/dist/js/bootstrap.bundle.min.js");
        const modal =
            bootstrap.Modal.getInstance(modalElement) ||
            new bootstrap.Modal(modalElement);

        let autoCloseTimer = null;

        const handleModalClose = () => {
            fetchSnapshots(); // Refresh snapshots when modal closes
            setSnapshotSuccess("");
            setSnapshotError({});
            setFormData({ snapshot_name: "" });

            if (autoCloseTimer) {
                clearTimeout(autoCloseTimer);
                autoCloseTimer = null;
            }
        };

        const handleModalOpen = () => {
            // Clear messages and reset form immediately when modal opens
            setSnapshotSuccess("");
            setSnapshotError({});
            setFormData({ snapshot_name: "" });
        };

        modalElement.addEventListener("hidden.bs.modal", handleModalClose);
        modalElement.addEventListener("shown.bs.modal", handleModalOpen);

        return () => {
            modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
            modalElement.removeEventListener("shown.bs.modal", handleModalOpen);
            if (autoCloseTimer) clearTimeout(autoCloseTimer);
        };
    }, []);

    const handleSnapshotChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            snapshot_name: e.target.value,
        }));
    };



    // api for create snapshots
    const handleSubmitSnapshot = async (e) => {
        e.preventDefault(); // 👈 ADD THIS LINE
        setSnapshotSuccess("");
        setSnapshotError({});
        setIsSubmitting(true); // start loading
        console.log("Submitting snapshot:", formData.snapshot_name);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/create-snapshot`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    },
                    body: JSON.stringify({
                        snapshot_name: formData.snapshot_name,
                    }),
                }
            );

            const data = await res.json();
            console.log("Create Snapshot Response:", data);

            if (res.ok && data?.data?.status === "success") {
                setSnapshotSuccess(data.data.message || "Snapshot successfully created.");
                fetchSnapshots(); // refresh the list
                setIsSubmitting(false); // stop loading
                setFormData(prev => ({ ...prev, snapshot_name: "" })); // clear input
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                setSnapshotError({
                    name: [data?.data?.message || "Failed to create snapshot."],
                });
                setIsSubmitting(false); // stop loading
            }
        } catch (err) {
            console.error("Snapshot Error:", err);
            setSnapshotError({
                name: ["Something went wrong while creating snapshot."],
            });
        }
    };


    // Delete snapshot function
    const handleDeleteSnapshot = async (snapshotId) => {
        if (!snapshotId) {
            Swal.fire("Missing Info", "Snapshot ID is required.", "warning");
            return;
        }

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-danger ms-2",
                cancelButton: "btn btn-success ms-2",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "Delete Snapshot?",
                text: "Are you sure you want to delete this snapshot? This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    // Show loading spinner
                    Swal.fire({
                        title: "Deleting...",
                        text: "Please wait while we delete the snapshot.",
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    });

                    try {
                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/snapshots/${snapshotId}/delete`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                                },
                            }
                        );

                        let data;
                        try {
                            data = await res.json();
                        } catch (err) {
                            console.error("Failed to parse JSON:", err);
                            Swal.fire("Error", "Invalid server response.", "error");
                            return;
                        }

                        console.log("Delete Snapshot Response:", data);

                        if (res.ok && data?.data?.status === "success") {
                            Swal.fire("Deleted!", data?.data?.message || "The snapshot has been deleted.", "success").then(() => {
                                fetchSnapshots();
                                window.location.reload();
                            });
                        } else {
                            Swal.fire("Failed!", data?.message || "Failed to delete snapshot.", "error");
                        }
                    } catch (error) {
                        console.error("Delete Snapshot Error:", error);
                        Swal.fire("Error", "Something went wrong.", "error");
                    }
                } else {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Snapshot deletion was cancelled.",
                        "info"
                    );
                }
            });
    };


    // api for restore snapshot
    const handleRevertSnapshot = async (snapshotId) => {
        if (!snapshotId) {
            Swal.fire("Missing Info", "Snapshot ID is required.", "warning");
            return;
        }

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success ms-2",
                cancelButton: "btn btn-secondary",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "Revert Snapshot?",
                text: "Are you sure you want to revert to this snapshot?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, revert it!",
                cancelButtonText: "Cancel",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    // Show loading spinner
                    Swal.fire({
                        title: "Reverting...",
                        text: "Please wait while we revert the snapshot.",
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    });

                    try {
                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/snapshots/${snapshotId}/revert`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                                },
                            }
                        );

                        let data;
                        try {
                            data = await res.json();
                        } catch (err) {
                            console.error("Failed to parse JSON:", err);
                            Swal.fire("Error", "Invalid server response.", "error");
                            return;
                        }

                        console.log("Revert Snapshot Response:", data);

                        if (res.ok && data?.data?.status === "success") {
                            Swal.fire("Reverted!", data?.data?.message || "Snapshot reverted successfully.", "success").then(() => {
                                fetchSnapshots(); // refresh the list after revert
                            });
                        } else {
                            Swal.fire("Failed!", data?.message || "Failed to revert snapshot.", "error");
                        }
                    } catch (error) {
                        console.error("Revert Snapshot Error:", error);
                        Swal.fire("Error", "Something went wrong.", "error");
                    }
                } else {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Snapshot revert was cancelled.",
                        "info"
                    );
                }
            });
    };


    const [upgradeform, setUpgradeForm] = useState({
        vms_id: "",
        preserve_disk: false,
    });
    const handleUpgradeChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Compute correct field value
        const fieldValue = type === "checkbox" ? checked : value;

        setUpgradeForm((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));

        // Special handling only if changing a specific field
        if (name === "vms_id") {
            setSelectedPlanId(value);
        }
        if (name === "preserve_disk") {
            setPreserveDisk(checked);
        }
    };

    // api for plan upgrade
    // ✅ Required

    // const handleUpgradePlan = async () => {
    //     const confirm = await Swal.fire({
    //         title: "Are you sure?",
    //         text: "You are about to upgrade this server plan.",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: "Yes, upgrade it!",
    //         cancelButtonText: "Cancel",
    //         showLoaderOnConfirm: true, // 🔥 shows loader when confirmed
    //         allowOutsideClick: () => !Swal.isLoading(),
    //         preConfirm: async () => {
    //             try {
    //                 const res = await fetch(
    //                     `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/upgrade`,
    //                     {
    //                         method: "POST",
    //                         headers: {
    //                             "Content-Type": "application/json",
    //                             Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //                         },
    //                         body: JSON.stringify(upgradeform),
    //                     }
    //                 );

    //                 const data = await res.json();
    //                 console.log("Upgrade Plan Response:", data);

    //                 if (data?.data?.status === "success") {
    //                     return data?.data?.message || "Plan upgraded successfully.";
    //                 } else if (Array.isArray(data?.message)) {
    //                     throw new Error(data.message.join(", "));
    //                 } else {
    //                     throw new Error(data?.data?.message || data?.message || "Failed to upgrade plan.");
    //                 }
    //             } catch (err) {
    //                 throw new Error("Something went wrong while upgrading plan.");
    //             }
    //         }
    //     });

    //     if (confirm.isConfirmed) {
    //         await Swal.fire({
    //             icon: "success",
    //             title: "Success",
    //             text: confirm.value, // ✅ message from preConfirm
    //             timer: 3000,
    //             timerProgressBar: true,
    //         });
    //         window.location.reload();
    //     }
    // };

    const handleUpgradePlan = async () => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You are about to upgrade this server plan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, upgrade it!",
            cancelButtonText: "Cancel",
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: async () => {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/upgrade`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${Cookies.get("accessToken")}`,
                            },
                            body: JSON.stringify(upgradeform),
                        }
                    );

                    const data = await res.json();
                    console.log("Upgrade Plan Response:", data);

                    if (data?.data?.status === "success") {
                        return data?.data?.message || "Plan upgraded successfully.";
                    } else {
                        // ✅ show validation error inside modal
                        Swal.showValidationMessage(
                            data?.data?.message || data?.message || "Failed to upgrade plan."
                        );
                        return false;
                    }
                } catch (err) {
                    Swal.showValidationMessage("Something went wrong while upgrading plan.");
                    return false;
                }
            },
        });

        if (confirm.isConfirmed && confirm.value) {
            await Swal.fire({
                icon: "success",
                title: "Success",
                text: confirm.value,
                timer: 3000,
                timerProgressBar: true,
            });
            window.location.reload();
        }
    };



    // api for extend server
    const extendServer = async (serverId) => {
        if (!serverId) return;
        console.log("extend server called", serverId);

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-secondary ms-2",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "Extend Server?",
                text: "Enter the number of months (1–12) you want to extend.",
                icon: "question",
                input: "number",
                inputAttributes: {
                    min: 1,
                    max: 12,
                    step: 1,
                },
                inputValue: 1, // default value
                showCancelButton: true,
                confirmButtonText: "Yes, extend!",
                cancelButtonText: "Cancel",
                reverseButtons: true,
                preConfirm: (value) => {
                    if (!value || value < 1 || value > 12) {
                        Swal.showValidationMessage("Please enter a number between 1 and 12");
                        return false;
                    }
                    return value;
                },
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const months = result.value; // ✅ Get the input value
                        // 🔄 Show loading popup
                        Swal.fire({
                            title: "Extending...",
                            text: "Please wait while we extend your server.",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            },
                        });

                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${serverId}/extend`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                                },
                                body: JSON.stringify({ months: Number(months) }), // pass months

                            }
                        );

                        const resul = await res.json();
                        console.log("Extend Server Response:", resul);

                        Swal.close(); // ⬅️ Close loader before showing result

                        if (res.ok && resul.data?.status === "success") {
                            swalWithBootstrapButtons
                                .fire(
                                    "Extended!",
                                    "The server has been extended successfully.",
                                    "success"
                                )
                                .then(() => {
                                    window.location.reload(); // ✅ Reload only after user clicks OK
                                });
                        } else {
                            swalWithBootstrapButtons.fire(
                                "Failed!",
                                resul.data?.message || resul.message || "Failed to extend the server.",
                                "error"
                            );
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        Swal.close();
                        swalWithBootstrapButtons.fire(
                            "Error!",
                            "Something went wrong while extending the server.",
                            "error"
                        );
                    }
                } else {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Server extension cancelled.",
                        "info"
                    );
                }
            });
    };

// API for Resume Server
const resumeServer = async (serverId) => {
    if (!serverId) return;
    console.log("resume server called", serverId);

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-info ms-2",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });

    swalWithBootstrapButtons
        .fire({
            title: "Resume Server?",
            text: "Are you sure you want to resume this server?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, resume!",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // 🔄 Show loading popup
                    Swal.fire({
                        title: "Resuming...",
                        text: "Please wait while we resume your server.",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    });

                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${serverId}/resume`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${Cookies.get("accessToken")}`,
                            },
                        }
                    );

                    const resul = await res.json();
                    console.log("Resume Server Response:", resul);

                    Swal.close();

                    if (res.ok && resul.data?.status === "success") {
                        swalWithBootstrapButtons
                            .fire(
                                "Resumed!",
                                "The server has been resumed successfully.",
                                "success"
                            )
                            .then(() => {
                                window.location.reload();
                            });
                    } else {
                        swalWithBootstrapButtons.fire(
                            "Failed!",
                            resul.data?.message || resul.message || "Failed to resume the server.",
                            "error"
                        );
                    }
                } catch (error) {
                    console.error("Error:", error);
                    Swal.close();
                    swalWithBootstrapButtons.fire(
                        "Error!",
                        "Something went wrong while resuming the server.",
                        "error"
                    );
                }
            } else {
                swalWithBootstrapButtons.fire(
                    "Cancelled",
                    "Server resume cancelled.",
                    "info"
                );
            }
        });
};



    const [plans, setPlans] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [preserveDisk, setPreserveDisk] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [showUpgradeForm, setShowUpgradeForm] = useState(false);
    const formRef = useRef(null);

    console.log("Form Data:", formData);

    // api vms plans
    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token) {
            // console.log("Token found:", token);
            const FetchProject = async () => {
                console.log(`Bearer ${token}`);
                setIsLoading(true);
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/list-plans`,
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
                    setPlans(result.data.vms);
                } catch (error) {
                    console.error("Error fetching cloud vps plan data:", error);
                    setIsLoading(false);
                }
            };
            FetchProject();
        }
    }, []);

    const handleUpgradeClick = () => {
        setShowUpgradeForm(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 200);
    };



    const [backupSuccess, setBackupSuccess] = useState("");
    const [backupError, setBackupError] = useState("");
    // const modalRef = useRef(null);
    const openBackupModal = () => {
        const modal = new Modal(modalRef.current);
        modal.show();
    };

    const [autoBackup, setAutoBackup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


// api for creating backup
const handleCreateBackup = async () => {
    setBackupSuccess("");
    setBackupError("");


        const confirm = await Swal.fire({
            title: "Create Backup?",
            text: "Do you want to create a new server backup?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, create it!",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        // Show loading spinner
        Swal.fire({
            title: "Creating Backup...",
            text: "Please wait while we create the backup.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/create-backup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    },
                }
            );

            const data = await res.json();

            // ✅ Success Case
            if (res.ok && data?.data?.status === "success") {
                setBackupSuccess(data.message || "Backup created successfully.");
                setFormData((prev) => ({ ...prev, snapshot_name: "" }));

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: data.message || "Backup created successfully.",
                });

                setTimeout(() => {
                    const modal = Modal.getInstance(modalRef.current);
                    modal?.hide();

                    window.location.reload();
                }, 500);
            } else {
                // ✅ Error Case - extract clean message
                let errorMessage =
                    data?.data?.message ||
                    data?.message ||
                    "Failed to create backup.";

                // If backend wrapped JSON inside message, try to extract inner text
                try {
                    const inner = JSON.parse(
                        errorMessage.match(/\{[\s\S]*\}/)?.[0] || "{}"
                    );
                    if (inner.message) errorMessage = inner.message;
                } catch { }

                setBackupError(errorMessage);

                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: errorMessage,
                });
            }
        } catch (err) {
            console.error("Backup Error:", err);
            setBackupError("Something went wrong while creating the backup.");

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong while creating the backup.",
            });
        }
    };


    // api for creating backup end

    // api for listing backups
    const [backups, setBackups] = useState([]);
    useEffect(() => {
        const fetchBackups = async () => {
            console.log("Fetching backups for server ID:", id);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/list-backups`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();

                if (res.ok && data?.data?.status === 'success') {
                    if (Array.isArray(data.data.backups)) {
                        setBackups(data.data.backups);
                    } else {
                        setBackups([]); // no backups found
                    }
                } else {
                    console.error('Failed to fetch backups');
                }
            } catch (error) {
                console.error('Error fetching backups:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchBackups();
    }, [id]);
    // api for listing backups end


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

    const handleDeleteBackup = async (backupId) => {
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete backup ID ${backupId}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/backups/${backupId}/delete`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });

            const data = await res.json();

            if (res.ok && data?.data?.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: data.data.message,
                });
                setBackups(prev => prev.filter(b => b.id !== backupId));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: data?.data?.message || 'Failed to delete backup.',
                });
            }
        } catch (error) {
            console.error('Delete error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while deleting the backup.',
            });
        }
    };

    // api for update server backup
    const handleBackupUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setBackupSuccess('');
        setBackupError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/server/${id}/update-backup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
                body: JSON.stringify({ auto_backups: autoBackup }),
            });

            const data = await res.json();

            if (res.ok && data?.data?.status === 'success') {
                setBackupSuccess(data.data.message);
            } else {
                setBackupError(data?.data?.message || 'Something went wrong.');
            }

            // Wait 3 seconds then close modal
            setTimeout(() => {
                setBackupSuccess('');
                setBackupError('');
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.error('Backup update error:', error);
            setBackupError('An error occurred while updating the backup.');

            setTimeout(() => {
                const modalEl = document.getElementById('projectCard1');
                if (modalEl) {
                    const modal = new window.bootstrap.Modal(modalEl);
                    modal.hide();
                }
                setBackupError('');
            }, 3000);
        } finally {
            setIsSubmitting(false);
        }
    };



    const handleRestoreBackup = async (backupId) => {
        setBackupSuccess("");
        setBackupError("");

        const confirm = await Swal.fire({
            title: "Restore Backup?",
            text: "Do you want to restore the server backup?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, restore it!",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        // Show loading spinner
        Swal.fire({
            title: "Restoring Backup...",
            text: "Please wait while we restore the backup.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/backups/${backupId}/restore`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    },
                }
            );

            const data = await res.json();

            if (res.ok && data?.data?.status === "success") {
                setBackupSuccess(data.message || "Backup restored successfully.");
                setFormData((prev) => ({ ...prev, snapshot_name: "" }));

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: data.message || "Backup restored successfully.",
                });

                setTimeout(() => {
                    const modal = Modal.getInstance(modalRef.current);
                    modal?.hide();

                    window.location.reload(); // Reload the page to reflect changes
                }, 500);
            } else {
                setBackupError(data?.message || "Failed to restore backup.");

                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: data?.message || "Failed to restore backup.",
                });
            }
        } catch (err) {
            console.error("Backup Error:", err);
            setBackupError("Something went wrong while restoring the backup.");

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong while restoring the backup.",
            });
        }
    };


    // datatable for backups
    const data = backups || [];
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

    // datatable for snapshots
    const snapshotData = snapshots || [];
    const [snapshotSearch, setSnapshotSearch] = useState("");
    const [snapshotEntries, setSnapshotEntries] = useState(10);
    const [snapshotPage, setSnapshotPage] = useState(1);

    const filteredSnapshotData = useMemo(() => {
        return snapshotData.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(snapshotSearch.toLowerCase())
            )
        );
    }, [snapshotData, snapshotSearch]);

    const paginatedSnapshotData = useMemo(() => {
        const start = (snapshotPage - 1) * snapshotEntries;
        return filteredSnapshotData.slice(start, start + snapshotEntries);
    }, [filteredSnapshotData, snapshotPage, snapshotEntries]);



    // api for update server backup end

    // Handle tab change + save to localStorage
    const handleTabChange = (tab) => {
        setActiveTab(tab ?? 1);
        localStorage.setItem("activeTab", tab ?? 1);
    };

    // Restore tab on first load
    useEffect(() => {
        const savedTab = localStorage.getItem("activeTab");
        if (savedTab) {
            setActiveTab(Number(savedTab));
        }
    }, []);

    const [isChecked, setIsChecked] = useState(false);
    const [password, setPassword] = useState("");
    const [copied, setCopied] = useState(false);

    const handlePasswordCopy = () => {
        if (!password) return;
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const [showDropdown, setShowDropdown] = useState(false);

    


    return (
        <Fragment>
            <div className="position-relative">
                {/* Overlay loader */}
                {isLoading && (
                    <div
                        className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
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
                <main
                    className={`page-content  ${isLoading ? "pointer-events-none" : ""}`}
                    style={{ opacity: isLoading ? 0.5 : 1 }}
                >
                    <div className="container-fluid">
                        {/* Breadcrumb start */}
                        <div className="row m-1">
                            <div className="col-12">
                                <h4 className="main-title">
                                    Manage Server {serverdetails?.hostname}{" "}
                                </h4>
                                <ul className="app-line-breadcrumbs mb-3">
                                    <li className="active">
                                        <a className="f-s-14 f-w-500" href="#">
                                            Manage Server {serverdetails?.hostname}{"   "}
                                        </a>
                                        {serverdetails?.status === "active" && systemusage?.serverStatus === "started" && (
                                            <span className="badge badge-successbadge bg-success-subtle text-success text-uppercase">Running</span>
                                        )}
                                        {serverdetails?.status === "active" && systemusage?.serverStatus === "stopped" && (
                                            <span className="badge bg-success-subtle text-success text-uppercase">Stopped</span>
                                        )}

                                        {serverdetails?.status === "suspended" && (
                                            <span className="badge bg-success-subtle text-success text-uppercase">Suspended</span>
                                        )}
                                    </li>
                                </ul>
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
                                            // onClick={() => setActiveTab(1)}
                                            onClick={() => handleTabChange(1)}
                                        >
                                            <i className="ph-bold  ph-info f-s-18" /> Server Overview
                                        </li>
                                        <li
                                            className={`tab-link ${activeTab === 6 ? "active" : ""}`}
                                            // onClick={() => setActiveTab(6)}
                                            onClick={() => handleTabChange(6)}
                                        >
                                            <i className="ph-bold ph-corners-in f-s-18" /> Actions
                                        </li>
                                        <li
                                            className={`tab-link ${activeTab === 2 ? "active" : ""}`}
                                            // onClick={() => setActiveTab(2)}
                                            onClick={() => handleTabChange(2)}
                                        >
                                            <i className="ph-bold  ph-circles-three-plus f-s-18" />{" "}
                                            Server setting
                                        </li>
                                        <li
                                            className={`tab-link ${activeTab === 3 ? "active" : ""}`}
                                            // onClick={() => setActiveTab(3)}
                                            onClick={() => handleTabChange(3)}
                                        >
                                            <i className="ph-bold  ph-floppy-disk-back f-s-18" />{" "}
                                            Additional Disk
                                        </li>
                                        <li
                                            className={`tab-link ${activeTab === 4 ? "active" : ""}`}
                                            // onClick={() => setActiveTab(4)}
                                            onClick={() => handleTabChange(4)}
                                        >
                                            <i className="ph-fill  ph-database f-s-18" /> Backups
                                        </li>
                                        <li
                                            className={`tab-link ${activeTab === 5 ? "active" : ""}`}
                                            // onClick={() => setActiveTab(5)}
                                            onClick={() => handleTabChange(5)}
                                        >
                                            <i className="ph ph-bounding-box f-s-18" /> Snapshots
                                        </li>
                                        <li
                                            className={`tab-link ${activeTab === 7 ? "active" : ""}`}
                                            onClick={() => handleTabChange(7)}
                                        >
                                            <i className="ph ph-bounding-box f-s-18" /> Boot & Rescue
                                        </li>
                                    </ul>
                                </div>

                                <div className="content-wrapper" id="card-container">
                                    <div
                                        className={`tabs-content ${activeTab === 1 ? "active" : ""
                                            }`}
                                        id="tab-1"
                                    >
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Server Credentials</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="col-12">
                                                            <div className="app-form">
                                                                <div className="row">
                                                                    <div className="col-lg-12">
                                                                        <div className="input-group mb-3">
                                                                            <span className="input-group-text b-r-left text-bg-primary">
                                                                                IPv4
                                                                            </span>
                                                                            <input
                                                                                aria-label="Dollar amount (with dot and two decimal places)"
                                                                                className="form-control b-r-right"
                                                                                type="text"
                                                                                value={serverdetails?.ip}
                                                                                readOnly
                                                                            />
                                                                            <span className="input-group-text b-r-0 text-bg-primary"
                                                                                style={{ cursor: "pointer" }}
                                                                                onClick={() => handleCopy(serverdetails?.ip)}
                                                                            >
                                                                                <i className="ph-fill  ph-copy f-s-18"></i>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <div className="input-group mb-3">
                                                                            <span className="input-group-text b-r-left text-bg-primary">
                                                                                IPv6
                                                                            </span>
                                                                            <input
                                                                                aria-label="Dollar amount (with dot and two decimal places)"
                                                                                className="form-control b-r-right"
                                                                                type="text"
                                                                                value={serverdetails?.ipv6 || ""}
                                                                                readOnly
                                                                            />
                                                                            <span className="input-group-text b-r-0 text-bg-primary"
                                                                                style={{ cursor: "pointer" }}
                                                                                onClick={() => handleCopy(serverdetails?.ipv6)}>
                                                                                <i className="ph-fill  ph-copy f-s-18"></i>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <div className="input-group mb-3">
                                                                            <span className="input-group-text b-r-left text-bg-primary">
                                                                                Username
                                                                            </span>
                                                                            <input
                                                                                aria-label="Dollar amount (with dot and two decimal places)"
                                                                                className="form-control b-r-right"
                                                                                type="text"
                                                                                value={serverdetails?.username}
                                                                                readOnly
                                                                            />
                                                                            <span className="input-group-text b-r-0 text-bg-primary"
                                                                                style={{ cursor: "pointer" }}
                                                                                onClick={() => handleCopy(serverdetails?.username)}
                                                                            >
                                                                                <i className="ph-fill  ph-copy f-s-18"></i>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <div className="input-group mb-3">
                                                                            <span className="input-group-text b-r-left text-bg-primary">
                                                                                Password
                                                                            </span>
                                                                            <input
                                                                                id="password1"
                                                                                className="form-control b-r-right"
                                                                                type={showPassword ? "text" : "password"}
                                                                                aria-label="Password"
                                                                                style={{ borderRight: "0" }}
                                                                                value={serverdetails?.password}
                                                                                readOnly
                                                                            />
                                                                            <span className="input-group-text b-r-right"
                                                                                onClick={() => setShowPassword(!showPassword)}
                                                                            >
                                                                                <i
                                                                                    className="ph ph-eye-slash f-s-20 toggle-password"
                                                                                    data-target="password1"
                                                                                    style={{ cursor: "pointer" }}
                                                                                />
                                                                            </span>
                                                                            <span className="input-group-text b-r-0 text-bg-primary"
                                                                                style={{ cursor: "pointer" }}
                                                                                onClick={() => handleCopy(serverdetails?.password)}
                                                                            >
                                                                                <i className="ph-fill ph-copy f-s-18"></i>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Server Details</h5>
                                                    </div>
                                                    <div className="row card-body">
                                                        <div className="col-12 col-lg-6 m-10-0">
                                                            <div className="card-body card-body-style">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <h6 className="mb-0">{vmps?.cpu}vCPU</h6>
                                                                    <div className="dropdown bg-xl-light-primary h-40 w-40 d-flex-center b-r-15">
                                                                        <i className="ph-bold ph-command f-s-20 text-primary" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-lg-6 m-10-0">
                                                            <div className="card-body card-body-style">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <h6 className="mb-0">
                                                                        {systemusage?.diskPlan}
                                                                    </h6>
                                                                    <div className="dropdown bg-xl-light-success h-40 w-40 d-flex-center b-r-15">
                                                                        <i className="ph-bold ph-database f-s-20 text-success" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-lg-6 m-10-0">
                                                            <div className="card-body card-body-style">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <h6 className="mb-0">{vmps?.ram} GB</h6>
                                                                    <div className="dropdown bg-xl-light-secondary h-40 w-40 d-flex-center b-r-15">
                                                                        <i className="ph-bold ph-floppy-disk f-s-20 text-secondary" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-lg-6 m-10-0">
                                                            <div className="card-body card-body-style">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <h6 className="mb-0">
                                                                        {serverdetails?.location}{" "}
                                                                    </h6>
                                                                    <div className="dropdown bg-xl-light-danger h-40 w-40 d-flex-center b-r-15">
                                                                        <i className="ph-bold  ph-map-pin-line f-s-20 text-danger" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-lg-6 m-10-0">
                                                            <div className="card-body card-body-style">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <h6 className="mb-0">{serverdetails?.cpu}</h6>
                                                                    <div className="dropdown bg-xl-light-info h-40 w-40 d-flex-center b-r-15">
                                                                        <i className="ph-bold ph-cpu text-info f-s-20" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-lg-6 m-10-0">
                                                            <div className="card-body card-body-style">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <h6 className="mb-0">
                                                                        {serverdetails?.os_label}
                                                                    </h6>
                                                                    <div className="dropdown bg-xl-light-warning h-40 w-40 d-flex-center b-r-15">
                                                                        <i className="ph-bold  ph-windows-logo f-s-22 text-warning text-warning" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Statistics</h5>
                                                    </div>
                                                    <div className="row card-body">
                                                        <div className="col-12 col-xxl-3 col-lg-6 col-md-6 m-10-0" style={{cursor:"default"}}>
                                                            <div className="card orders-provided-card border-card" style={{cursor:"default"}}>
                                                                <div className="card-body" style={{cursor:"default"}}>
                                                                    <i className="ph-bold  ph-circle circle-bg-img" style={{cursor:"default"}}/>
                                                                    <div className="d-flex align-items-center justify-content-between" style={{cursor:"default"}}>
                                                                        <div style={{cursor:"default"}}>
                                                                            <p className="f-s-18 f-w-600 text-dark txt-ellipsis-1" style={{cursor:"default"}}>
                                                                                CPU Usage
                                                                            </p>
                                                                            <h2 className="text-secondary-dark mb-0" style={{cursor:"default"}}>
                                                                                {systemusage?.cpuUsage}%
                                                                            </h2>
                                                                        </div>
                                                                        <div className="bg-xl-light-danger  h-40 w-40 d-flex-center b-r-15" style={{cursor:"default"}}>
                                                                            <span className="ph-bold ph-cpu f-s-20 text-danger" style={{cursor:"default"}} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-xxl-3 col-lg-6 col-md-6 m-10-0" style={{cursor:"default"}}>
                                                            <div className="card bg-primary-300 product-sold-card" style={{cursor:"default"}}>
                                                                <div className="card-body"  style={{cursor:"default"}}>
                                                                    <div className="d-flex align-items-center justify-content-between"  style={{cursor:"default"}}>
                                                                        <div  style={{cursor:"default"}}>
                                                                            <p className="f-s-18 f-w-600 text-dark txt-ellipsis-1"  style={{cursor:"default"}}>
                                                                                {systemusage?.inBandwidth} of unmetered
                                                                                GiB
                                                                            </p>
                                                                            <h5
                                                                                className="text-secondary-dark"
                                                                                style={{
                                                                                    marginTop: "6%",
                                                                                    marginBottom: "6%",
                                                                                    cursor:"default"
                                                                                }}
                                                                            >
                                                                                Incoming Bandwith
                                                                            </h5>
                                                                        </div>
                                                                        <div className="bg-light-white h-40 w-40 d-flex-center b-r-15"  style={{cursor:"default"}}>
                                                                            <i className="ph-bold  ph-arrow-square-in f-s-20 text-secondary"  style={{cursor:"default"}} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-xxl-3 col-lg-6 col-md-6 m-10-0" style={{cursor:"default"}}>
                                                            <div className="card product-store-card border-card" style={{cursor:"default"}}>
                                                                <div className="card-body" style={{cursor:"default"}}>
                                                                    <i className="ph-bold  ph-circle circle-bg-img" style={{cursor:"default"}} />
                                                                    <div className="d-flex align-items-center justify-content-between" style={{cursor:"default"}}>
                                                                        <div style={{cursor:"default"}}>
                                                                            <p className="f-s-18 f-w-600 text-dark txt-ellipsis-1" style={{cursor:"default"}}>
                                                                                {systemusage?.outBandwidth} of unmetered
                                                                                GiB
                                                                            </p>
                                                                            <h5
                                                                                className="text-secondary-dark"
                                                                                style={{
                                                                                    marginTop: "6%",
                                                                                    marginBottom: "6%",
                                                                                    cursor:"default"

                                                                                }}
                                                                            >
                                                                                Outgoing Bandwith
                                                                            </h5>
                                                                        </div>
                                                                        <div className="bg-light-success h-40 w-40 d-flex-center b-r-15" style={{cursor:"default"}}>
                                                                            <i className="ph-bold  ph-arrow-square-out f-s-20 text-success" style={{cursor:"default"}}/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-xxl-3 col-lg-6 col-md-6 m-10-0" style={{cursor:"default"}}>
                                                            <div className="card project-total-card"  style={{cursor:"default"}}>
                                                                <div className="card-body"  style={{cursor:"default"}}>
                                                                    <div className="d-flex align-items-center justify-content-between"  style={{cursor:"default"}}>
                                                                        <div  style={{cursor:"default"}}>
                                                                            <p className="f-s-18 f-w-600 text-dark txt-ellipsis-1" style={{cursor:"default"}}>
                                                                                {systemusage?.usedDisk} of {vmps?.disk}{" "}
                                                                                GiB
                                                                            </p>
                                                                            <h5
                                                                                className="text-secondary-dark"
                                                                                style={{
                                                                                    marginTop: "6%",
                                                                                    marginBottom: "6%",
                                                                                    cursor:"default"
                                                                                }}
                                                                            >
                                                                                Disk Usage
                                                                            </h5>
                                                                        </div>
                                                                        <div className="bg-light-info h-40 w-40 d-flex-center b-r-15"  style={{cursor:"default"}}>
                                                                            <i className="ph-fill  ph-database f-s-20 text-info"  style={{cursor:"default"}} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Billing Information</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row d-flex align-items-center justify-content-between">
                                                            <div
                                                                className="col-lg-6"
                                                                style={{ padding: "5px 15px" }}
                                                            >
                                                                <p className="f-s-17 text-dark ">
                                                                    Your Current Size is {vmps?.cpu} vCPU -{" "}
                                                                    {vmps?.ram} GB Memory - {systemusage?.diskPlan} SSD
                                                                    Storage.
                                                                </p>
                                                                <button className="btn btn-primary" onClick={handleUpgradeClick}>
                                                                    <i className="ph-bold ph-arrow-up f-s-18" /> Upgrade
                                                                </button>



                                                                <h5 className="text-secondary-dark mb-0">
                                                                    Renews Automatically on {systemusage?.expiry_date}
                                                                </h5>
                                                                <p className="f-s-17 text-dark ">
                                                                    We will send you a notification upon
                                                                    subscription expiration
                                                                </p>
                                                                <h5 className="text-secondary-dark mb-0">
                                                                    $10 Per Month
                                                                </h5>
                                                            </div>
                                                            <div className="col-lg-6 b-r-15">
                                                                <div
                                                                    aria-valuemax={100}
                                                                    aria-valuemin={0}
                                                                    aria-valuenow={75}
                                                                    className="progress w-100 h-15 mb-2"
                                                                    role="progressbar"
                                                                >
                                                                    <div
                                                                        className="progress-bar bg-primary text-white"
                                                                        style={{ width: `${percent}%` }}
                                                                    >
                                                                        {" "}
                                                                        {percent}%
                                                                    </div>
                                                                </div>
                                                                {systemusage?.expiry_date && (
                                                                    <p className="f-s-14 text-dark">
                                                                        {daysRemaining} days remaining until your server needs a renew
                                                                    </p>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {showUpgradeForm && (
                                                    <div ref={formRef}>
                                                        <form method="POST">
                                                            <div className="row cart-table">
                                                                <div className="col-xl-12 col-lg-12 col-md-12">
                                                                    <div className="card">
                                                                        <div className="card-body">
                                                                            <h5 className="mb-2 mt-5">CPU Options</h5>

                                                                            <div className="row simple-pricing-container app-arrow">
                                                                                {errorMessage && (
                                                                                    <div className="alert alert-danger text-danger" style={{ background: "none", border: "0", padding: "0 14px" }} role="alert">
                                                                                        {errorMessage}
                                                                                    </div>
                                                                                )}

                                                                                {statusMessage && (
                                                                                    <div className="alert alert-success text-success" style={{ background: "none", border: "0", padding: "0 14px" }} role="alert">
                                                                                        {statusMessage}
                                                                                    </div>
                                                                                )}
                                                                                {plans.map((plan) => (
                                                                                    <div
                                                                                        key={plan.id}
                                                                                        className={`col-md-6 col-xl-4 p-3`}
                                                                                        onClick={() => {
                                                                                            setSelectedPlanId(plan.id);
                                                                                            setUpgradeForm((prev) => ({
                                                                                                ...prev,
                                                                                                vms_id: plan.id,
                                                                                            }));
                                                                                        }}
                                                                                        style={{ cursor: "pointer" }}
                                                                                    >
                                                                                        <div
                                                                                            className={`simple-pricing-card card ${selectedPlanId === plan.id
                                                                                                ? "border border-primary shadow-lg"
                                                                                                : ""
                                                                                                }`}
                                                                                        >
                                                                                            <input type="hidden" name="vms_id" />
                                                                                            <div className="card-body">
                                                                                                <div className="simple-price-body">
                                                                                                    <div
                                                                                                        className={`simple-price-value text-center b-r-5 d-block ${selectedPlanId === plan.id
                                                                                                            ? "bg-primary text-white"
                                                                                                            : "bg-light-dark"
                                                                                                            }`}
                                                                                                    >
                                                                                                        <span className="f-s-30 f-w-600 text-center">
                                                                                                            ${plan.price}/
                                                                                                        </span>
                                                                                                        <span className="f-s-12 f-w-600">
                                                                                                            per month
                                                                                                        </span>
                                                                                                        <p>${(plan.price / 720).toFixed(3)}/hour</p>
                                                                                                    </div>

                                                                                                    <div className="simple-price-content">
                                                                                                        <div className="d-flex">
                                                                                                            <span>
                                                                                                                <i
                                                                                                                    className={`ph-bold ph-check bg-primary p-1 b-r-100 f-s-12 ${selectedPlanId === plan.id
                                                                                                                        ? "bg-primary text-white"
                                                                                                                        : "bg-light-dark"
                                                                                                                        }`}
                                                                                                                />
                                                                                                            </span>
                                                                                                            <p className="ms-2 mb-0">
                                                                                                                {plan.ram} GB / {plan.cpu} CPU
                                                                                                            </p>
                                                                                                        </div>
                                                                                                        <div className="app-divider-v" />
                                                                                                        <div className="d-flex">
                                                                                                            <span>
                                                                                                                <i
                                                                                                                    className={`ph-bold ph-check bg-primary p-1 b-r-100 f-s-12 ${selectedPlanId === plan.id
                                                                                                                        ? "bg-primary text-white"
                                                                                                                        : "bg-light-dark"
                                                                                                                        }`}
                                                                                                                />
                                                                                                            </span>
                                                                                                            <p className="ms-2 mb-0">
                                                                                                                {plan.disk} GB NVMe SSDs
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>

                                                                            <div className="card-header pb-0">
                                                                                <h5>Preserve Disk Confirmation</h5>
                                                                            </div>
                                                                            <div className="card-body">
                                                                                <div className="row">
                                                                                    <div className="col-12">
                                                                                        <div className="form-check d-flex align-items-center gap-3">
                                                                                            <div>
                                                                                                <input
                                                                                                    className="form-check-input"
                                                                                                    id="preserveDiskCheck"
                                                                                                    type="checkbox"
                                                                                                    name="preserve_disk"
                                                                                                    checked={upgradeform.preserve_disk}
                                                                                                    onChange={handleUpgradeChange}
                                                                                                />
                                                                                            </div>
                                                                                            <div>
                                                                                                <label
                                                                                                    className="form-check-label f-s-18"
                                                                                                    htmlFor="preserveDiskCheck"
                                                                                                >
                                                                                                    Do you want to preserve your disk?
                                                                                                </label>
                                                                                                <p className="form-check-label-p">
                                                                                                    If selected, your existing disk data will be
                                                                                                    retained during the upgrade. If not, all
                                                                                                    current data on the disk will be removed.
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-primary mt-3"
                                                                                onClick={handleUpgradePlan}
                                                                            >
                                                                                Upgrade Plan
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`tabs-content ${activeTab === 6 ? "active" : ""
                                            }`}
                                        id="tab-6"
                                    >
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Action Buttons</h5>
                                                    </div>
                                                    <div className="card-body d-flex gap-3">
                                                        <button
                                                            className="btn btn-primary h-45 icon-btn mb-3"
                                                            onClick={() => startServer(serverdetails?.id)}
                                                        >
                                                            <i className="ph-fill ph-play f-s-18" />
                                                            Start Server
                                                        </button>
                                                        <button
                                                            className="btn btn-success h-45 icon-btn mb-3"
                                                            onClick={() => stopServer(serverdetails?.id)}
                                                        >
                                                            <i className="ph-fill ph-pause f-s-18" />
                                                            Stop Server
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary h-45 icon-btn mb-3"
                                                            onClick={() => restartServer(serverdetails?.id)}
                                                        >
                                                            <i className="ph-fill ph-rewind f-s-18" />
                                                            Restart Server
                                                        </button>

                                                        <button
                                                            className="btn btn-dark h-45 icon-btn mb-3"
                                                            onClick={() =>
                                                                setShowReinstallCard(!showReinstallCard)
                                                            }
                                                        >
                                                            <i className="ph-fill ph-arrow-line-down f-s-18" />{" "}
                                                            Reinstall Server
                                                        </button>

                                                        <button
                                                            className="btn btn-danger h-45 icon-btn mb-3"
                                                            onClick={() => extendServer(serverdetails?.id)}
                                                        >
                                                            Extend Server
                                                        </button>
                                                        {showResumeButton && (
                                                            <button
                                                                className="btn btn-info h-45 icon-btn mb-3"
                                                                onClick={() => resumeServer(serverdetails?.id)}
                                                            >
                                                                Resume Server
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {showReinstallCard && (
                                            <div className="card">
                                                <div className="row m-1">
                                                    <div className="col-12">
                                                        <h4 className="main-title">Reinstall Server</h4>
                                                    </div>
                                                </div>
                                                <div className="card-header">
                                                    <h5>Server Type</h5>
                                                </div>
                                                <div className="card-body p-0">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            {Object.entries(ReinstallError).map(([field, messages]) => (
                                                                <div className="col-12" key={field}>
                                                                    <div className="alert alert-danger mt-2" role="alert">
                                                                    {Array.isArray(messages) ? messages[0] : messages}
                                                                    </div>
                                                                </div>
                                                                ))}
                                                            <div className="tab-wrapper ms-3 me-3 mb-3">
                                                                <ul className="tabs overflow-auto">
                                                                    <li
                                                                        className={`tab-link ${activeInnerTab === 8 ? "active" : ""
                                                                            }`}
                                                                        onClick={() => setActiveInnerTab(8)}
                                                                    >
                                                                        <i className="ph-bold  ph-align-right f-s-18" />{" "}
                                                                        Operating System
                                                                    </li>
                                                                    <li
                                                                        className={`tab-link ${activeInnerTab === 9 ? "active" : ""
                                                                            }`}
                                                                        onClick={() => setActiveInnerTab(9)}
                                                                    >
                                                                        <i className="ph-fill ph-list-bullets f-s-18" />{" "}
                                                                        Application
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                            <div
                                                                className="content-wrapper"
                                                                id="card-container"
                                                            >
                                                                {activeInnerTab === 8 && (
                                                    <form method="post" onSubmit={reinstallServer}>

                                                                    <div
                                                                        className="tabs-content active"
                                                                        id="tab-8"
                                                                    >
                                                                       {/* Show OS Version error first */}
                                                                   
                                                                        <div className="card">
                                                                            <div className="card-body">
                                                                                <div className="row simple-pricing-container app-arrow">
                                                                                    {os?.map((o, index) => (
                                                                                        <div
                                                                                            className="col-md-6 col-xl-3 p-3"
                                                                                            key={o.id}
                                                                                        >
                                                                                            <div
                                                                                                className="simple-pricing-card card mb-0"
                                                                                                onClick={() =>
                                                                                                    handleOSClick(o.id)
                                                                                                }
                                                                                                style={{ cursor: "pointer" }}
                                                                                            >
                                                                                                <div className="card-body">
                                                                                                    <div className="simple-price-header text-center">
                                                                                                        <h5 className="mb-3">
                                                                                                            {o.name}
                                                                                                        </h5>
                                                                                                    </div>
                                                                                                    <div className="simple-price-body text-center">
                                                                                                        <Image
                                                                                                            alt={o.name}
                                                                                                            className="img-fluid"
                                                                                                            src={o.icon}
                                                                                                            width={45}
                                                                                                            height={45}
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            {selectedOSId === o.id && (
                                                                                                <form
                                                                                                    className="app-form row g-3 needs-validation mt-0"
                                                                                                    noValidate
                                                                                                >
                                                                                                    <div className={o.name}>
                                                                                                        <select
                                                                                                            className="form-select"
                                                                                                            id={`${o.name}-version`}
                                                                                                            required
                                                                                                            onChange={(e) =>
                                                                                                                setSelectedVersionId(
                                                                                                                    e.target.value
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            <option value="">
                                                                                                                Select Version
                                                                                                            </option>
                                                                                                            {o.versions?.map(
                                                                                                                (version) => (
                                                                                                                    <option
                                                                                                                        value={version.id}
                                                                                                                        key={version.id}
                                                                                                                    >
                                                                                                                        {version.name}
                                                                                                                    </option>
                                                                                                                )
                                                                                                            )}
                                                                                                        </select>
                                                                                                        <div className="invalid-feedback">
                                                                                                            Please select a valid
                                                                                                            version.
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </form>
                                                                                            )}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                                <div className="row">
                                                                                    <div className="col-6">
                                                                                        <label className="form-label" htmlFor="password">Password</label>
                                                                                        <input type="password" 
                                                                                        className="form-control" 
                                                                                        name="password" 
                                                                                        placeholder="Enter Password"
                                                                                        value={reinstallPayload.password}
                                                                                        onChange={(e) =>
                                                                                            setReinstallPayload(prev => ({ ...prev, password: e.target.value }))
                                                                                        } />
                                                                                    </div>

                                                                                     <div className="col-6">
                                                                                        <label className="form-label" htmlFor="password">SSHKeys</label>
                                                                                         <Select
                                                                                            isMulti
                                                                                            options={sshKeys.map(key => ({ value: key.id, label: key.name }))}
                                                                                            value={reinstallPayload.ssh_keys.map(id =>
                                                                                                sshKeys.find(k => k.id === id)
                                                                                            )}
                                                                                            onChange={selectedOptions => 
                                                                                                setSelectedSSHKeys(prev => ({
                                                                                                    ...prev,
                                                                                                    ssh_keys: selectedOptions ? selectedOptions.map(opt => opt.value) : []
                                                                                                }))
                                                                                            }
                                                                                            placeholder="Select SSH Keys..."
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <br />
                                                                                
                                                                                <button
                                                                                    className="btn btn-primary"
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        reinstallServer(serverdetails?.id, {
                                                                                            os_version_id: selectedVersionId,
                                                                                            password: reinstallPayload.password,
                                                                                            ssh_keys: reinstallPayload.ssh_keys,
                                                                                            
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    Reinstall
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                                )}

                                                                {activeInnerTab === 9 && (
                                                    <form method="post" onSubmit={reinstallServer}>

                                                                    <div
                                                                        className="tabs-content active"
                                                                        id="tab-9"
                                                                    >
                                                                        <div className="card">
                                                                            <div className="card-body">
                                                                                <div className="row simple-pricing-container app-arrow">
                                                                                    {app?.map((apps, index) => (
                                                                                        <div
                                                                                            className="col-md-6 col-xl-3 p-3"
                                                                                            key={apps.id}
                                                                                        >
                                                                                            <div
                                                                                                className="simple-pricing-card card mb-0"
                                                                                                onClick={() =>
                                                                                                    handleAppClick(apps.id)
                                                                                                }
                                                                                                style={{ cursor: "pointer" }}
                                                                                            >
                                                                                                <div className="card-body">
                                                                                                    <div className="simple-price-header text-center">
                                                                                                        <h5 className="mb-3">
                                                                                                            {apps.name}
                                                                                                        </h5>
                                                                                                    </div>
                                                                                                    <div className="simple-price-body text-center">
                                                                                                        <Image
                                                                                                            alt={apps.name}
                                                                                                            className="img-fluid"
                                                                                                            src={apps.icon}
                                                                                                            width={45}
                                                                                                            height={45}
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            {selectedAppId === apps.id && (
                                                                                                <form
                                                                                                    className="app-form row g-3 needs-validation mt-0"
                                                                                                    noValidate
                                                                                                >
                                                                                                    <div className={apps.name}>
                                                                                                        <select
                                                                                                            name=""
                                                                                                            className="form-select"
                                                                                                            id={`${apps.name}-version`}
                                                                                                            required
                                                                                                            onChange={(e) =>
                                                                                                                setSelectedVersionId(
                                                                                                                    e.target.value
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            <option value="">
                                                                                                                Select Version
                                                                                                            </option>
                                                                                                            {apps.versions?.map(
                                                                                                                (version) => (
                                                                                                                    <option
                                                                                                                        value={version.id}
                                                                                                                        key={version.id}
                                                                                                                    >
                                                                                                                        {version.name}
                                                                                                                    </option>
                                                                                                                )
                                                                                                            )}
                                                                                                        </select>
                                                                                                        <div className="invalid-feedback">
                                                                                                            Please select a valid
                                                                                                            version.
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </form>
                                                                                            )}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                                <div className="row">
                                                                                    <div className="col-6">
                                                                                        <label className="form-label" htmlFor="password">Password</label>
                                                                                        <input type="password" 
                                                                                        className="form-control" 
                                                                                        name="password" 
                                                                                        placeholder="Enter Password"
                                                                                        value={reinstallPayload.password}
                                                                                        onChange={(e) =>
                                                                                            setReinstallPayload(prev => ({ ...prev, password: e.target.value }))
                                                                                        } />
                                                                                    </div>

                                                                                     <div className="col-6">
                                                                                        <label className="form-label" htmlFor="password">SSHKeys</label>
                                                                                         <Select
                                                                                            isMulti
                                                                                            options={sshKeys.map(key => ({ value: key.id, label: key.name }))}
                                                                                            value={reinstallPayload.ssh_keys.map(id =>
                                                                                                sshKeys.find(k => k.id === id)
                                                                                            )}
                                                                                            onChange={selectedOptions => 
                                                                                             {
                                                                                                setSelectedSSHKeys(selectedOptions);
                                                                                                setReinstallPayload((prev) => ({
                                                                                                    ...prev, 
                                                                                                    ssh_keys: selectedOptions
                                                                                                    ? selectedOptions.map(
                                                                                                        (option) => option.value
                                                                                                        )
                                                                                                    : [], // Use correct key name
                                                                                                }))


                                                                                             }
                                                                                                
                                                                                            }
                                                                                            placeholder="Select SSH Keys..."
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <br />
                                                                                <button
                                                                                    className="btn btn-primary"
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        reinstallServer(serverdetails?.id, {
                                                                                            os_version_id: selectedVersionId,
                                                                                            password: reinstallPayload.password,
                                                                                            ssh_keys: reinstallPayload.ssh_keys,
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    Reinstall
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                                )}
                                                            </div>
                                                        </div>
                                                       
                                                    </div>
                                                </div>
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h5>Operating System Password</h5>
                                                    </div>

                                                    <div className="card-body">
                                                        <form className="app-form row g-3">
                                                            <div className="col-lg-3 col-12">
                                                                <div className="form-check d-flex mb-3">
                                                                    <input
                                                                        className="form-check-input"
                                                                        id="flexCheck"
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={(e) => {
                                                                            setIsChecked(e.target.checked);
                                                                            if (!e.target.checked) setPassword("");
                                                                        }}
                                                                    />
                                                                    <label
                                                                        className="form-check-label ms-2"
                                                                        htmlFor="flexCheck"
                                                                        style={{ fontSize: "16px" }}
                                                                    >
                                                                        Reset Password
                                                                    </label>
                                                                </div>

                                                                <div className="position-relative">
                                                                    <input
                                                                        id="hostnameInput"
                                                                        type="text"
                                                                        className="form-control pe-5"
                                                                        placeholder="Reset Password"
                                                                        required
                                                                        disabled={!isChecked}
                                                                        value={password}
                                                                        onChange={(e) => setPassword(e.target.value)}
                                                                    />

                                                                    {/* Copy Icon */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={handlePasswordCopy}
                                                                        className="btn p-0 border-0 position-absolute end-0 top-50 translate-middle-y me-2"
                                                                        style={{ color: copied ? "green" : "#6c757d", fontSize: "20px", cursor: "pointer" }}
                                                                        disabled={!password || !isChecked}
                                                                        title="Copy password"
                                                                    >
                                                                        {copied ? (
                                                                            <i className="ph-fill ph-copy"></i>
                                                                        ) : (
                                                                            <i className="ph ph-copy"></i>
                                                                        )}
                                                                    </button>
                                                                </div>

                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header">
                                                        <h5>SSH Keys</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="d-flex flex-wrap gap-2">

                                                            <span className="key-box"> nik test 2</span>
                                                            <span className="key-box"> nik nik</span>
                                                            {/* <span className="key-box public-key"><i className="ph-bold  ph-key"></i> Add public SSH key</span>
                                                            <div className="">
                                                                <select
                                                                    name="billingCycle"
                                                                    className="form-select "
                                                                    required
                                                                >
                                                                    <option value="">Add public SSH key</option>
                                                                    <option value="hourlyBilling">
                                                                        nik test 2
                                                                    </option>
                                                                    <option value="monthlyBilling">
                                                                        nik nik
                                                                    </option>
                                                                </select>
                                                                <div className="invalid-feedback">
                                                                    Please select a valid version.
                                                                </div>
                                                            </div> */}
                                                            <div className="d-flex gap-2">

                                                                {/* Clickable span */}
                                                                <span
                                                                    className="key-box public-key d-inline-flex align-items-center gap-1 cursor-pointer"
                                                                    onClick={() => setShowDropdown(!showDropdown)}
                                                                >
                                                                    <i className="ph-bold ph-key"></i> Add public SSH key
                                                                </span>

                                                                {/* Dropdown appears on click */}
                                                                {showDropdown && (
                                                                    <select className="form-select" style={{ width: "250px" }}>
                                                                        <option value="">Select SSH key...</option>
                                                                        <option value="1">nik test 2</option>
                                                                        <option value="2">nik nik</option>
                                                                        <option value="3">server key</option>
                                                                    </select>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        )}
                                    </div>

                                    <div
                                        className={`tabs-content ${activeTab === 2 ? "active" : ""
                                            }`}
                                        id="tab-2"
                                    >
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Change Server Settings</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <form
                                                            className="app-form row g-3"
                                                            style={{ padding: "5px 15px" }}
                                                            onSubmit={(e) => e.preventDefault()}
                                                        >
                                                            <div className="col-md-4">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="hostnameInput"
                                                                >
                                                                    Update Hostname
                                                                </label>
                                                                <input
                                                                    id="hostnameInput"
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="New Hostname"
                                                                    name="hotname"
                                                                    required
                                                                    value={changehostnamePayload.hostname}
                                                                    onChange={(e) =>
                                                                        setChangeHostnamePayload({
                                                                            ...changehostnamePayload,
                                                                            hostname: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary h-45 icon-btn mb-3 mt-4"
                                                                    onClick={handleUpdateClick}
                                                                >
                                                                    Update
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>

                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Change Server Password</h5>
                                                    </div>

                                                    <div className="card-body">
                                                        <form
                                                            className="app-form rounded-control row g-3"
                                                            style={{ padding: "5px 15px" }}
                                                            onSubmit={(e) => e.preventDefault()} // Prevent default form submit
                                                        >
                                                            <div className="col-md-4">
                                                                <label htmlFor="" className="form-label">
                                                                    Change Server Password
                                                                </label>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary h-45 icon-btn mb-3 mt-3"
                                                                    onClick={handleChangePasswordClick}
                                                                >
                                                                    Update
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>

                                                    {/* <div className="card-body" >
                                                        <form className="app-form rounded-control  row g-3" style={{ padding: "5px 15px" }}>
                                                            <div className="col-md-4">
                                                                <label className="form-label" htmlFor="validationDefaultUsername">Change RDNS</label>
                                                                <input aria-describedby="inputGroupPrepend2" className="form-control" id="validationDefaultUsername" placeholder="New RDNS" required type="text" />
                                                            </div>
                                                        </form>
                                                    </div> */}
                                                </div>
                                            </div>

                                            {/* <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div style={{ padding: "5px 15px" }}>
                                                                <h5 className="text-secondary-dark mb-0">Enable Automatic Backups
                                                                    <span className="badge text-warning-dark bg-warning-400 badge-notification ms-2"> $5</span>
                                                                    <span className="badge text-danger-dark bg-xl-light-danger badge-notification ms-2"> Disabled</span>
                                                                </h5>
                                                                <p className="f-s-17 text-dark ">Enable daily backups to set free of any stress and be at peace of mind.</p>
                                                            </div>
                                                            <div className=" b-r-15">
                                                                <button className="btn btn-primary h-45 icon-btn mb-3" >
                                                                    <i className="ph-bold  ph-arrow-down f-s-18" />  Save Changes
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>

                                    <div
                                        className={`tabs-content ${activeTab === 3 ? "active" : ""
                                            }`}
                                        id="tab-3"
                                    >
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Additional Disk</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="">
                                                            {/* <div className="modal-header">
                                                                <h5 className="modal-title">Create Volume</h5>
                                                            </div> */}
                                                            <div className="modal-body">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="text-center align-self-center">
                                                                        <img
                                                                            alt=""
                                                                            className="img-fluid b-r-10"
                                                                            src="../assets/images/new/cloud.png"
                                                                        />
                                                                    </div>
                                                                    <div className="ps-4">
                                                                        <div className="d-flex align-items-center gap-3">
                                                                            <div className="simplespin d-flex align-items-center gap-2">
                                                                                <a
                                                                                    className="circle-btn decrement"
                                                                                    role="button"
                                                                                    onClick={decrement}
                                                                                >
                                                                                    -
                                                                                </a>
                                                                                <input
                                                                                    className="app-small-touchspin count f-s-19"
                                                                                    type="text"
                                                                                    value={count}
                                                                                    readOnly
                                                                                />
                                                                                <a
                                                                                    className="circle-btn increment"
                                                                                    role="button"
                                                                                    onClick={increment}
                                                                                >
                                                                                    +
                                                                                </a>
                                                                            </div>
                                                                            <p className="f-s-18 m-0">GB</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="f-s-18 text-primary fw-bold m-0">
                                                                                {" "}
                                                                                ${price} /mo
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <form className="app-form mt-3">
                                                                <div className="mb-3">
                                                                    <div className="input-group">
                                                                        <input
                                                                            aria-describedby="inputGroupPrepend2"
                                                                            className="form-control"
                                                                            id="validationDefaultUsername"
                                                                            placeholder="Volume Name"
                                                                            required=""
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <div className="input-group">
                                                                        <input
                                                                            aria-describedby="inputGroupPrepend2"
                                                                            className="form-control"
                                                                            id="validationDefaultUsername"
                                                                            placeholder="Add Location"
                                                                            required=""
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </form>
                                                            <div className="modal-footer">
                                                                <button
                                                                    className="btn btn-light-primary"
                                                                    type="button"
                                                                >
                                                                    Save changes
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`tabs-content ${activeTab === 4 ? "active" : ""
                                            }`}
                                        id="tab-4"
                                    >
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Backup</h5>
                                                    </div>
                                                    <div className="card-body d-flex gap-3">

                                                        <button className="btn btn-primary h-45 icon-btn mb-3" onClick={handleCreateBackup} >
                                                            <i className="ph-bold ph-plus f-s-18" /> Create Backup
                                                        </button>
                                                        <button
                                                            className="btn btn-success h-45 icon-btn mb-3"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#projectCard1"
                                                        >
                                                            <i className="ph ph-arrow-fat-lines-up f-s-18" />{" "}
                                                            Update Backup
                                                        </button>



                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card p-l-r-30 pt-3 pb-3">
                                                <div className="card-body p-0">
                                                    {/* <div className="app-datatable-default overflow-auto">
                                                        <table className="datatable display app-data-table default-data-table" id="example">
                                                            <thead>
                                                                <tr>
                                                                    <th width={10}>Sr no.</th>
                                                                    <th>Id</th>
                                                                    <th>Creation Method</th>
                                                                    <th>Status</th>
                                                                    <th>Size</th>
                                                                    <th>Created At</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {backups.map((backup, index) => (
                                                                    <tr key={backup.id}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{backup.id}</td>
                                                                        <td>{backup.creation_method}</td>
                                                                        <td>
                                                                            <span className={`badge ${backup.status === 'created' ? 'bg-success' : 'bg-secondary'}`}>
                                                                                {backup.status}
                                                                            </span>
                                                                        </td>
                                                                        <td>{(backup.size / (1024 ** 3)).toFixed(2)} GB</td>
                                                                        <td title={new Date(backup.created_at).toLocaleString('en-GB', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: '2-digit',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                            second: '2-digit',
                                                                        })}
                                                                        >
                                                                            {new Date(backup.created_at).toLocaleDateString('en-GB', {
                                                                                day: 'numeric',
                                                                                month: 'long',
                                                                                year: '2-digit',
                                                                            }).replace(/^(\d{1,2})/, '$1' + getDaySuffix(new Date(backup.created_at).getDate()))}
                                                                        </td>
                                                                        <td className="d-flex gap-3">
                                                                            <button className="badge text-white bg-success border-0 d-flex gap-2 align-items-center">
                                                                                Restore
                                                                            </button>
                                                                            <button
                                                                                className="badge text-white bg-danger border-0 d-flex gap-2 align-items-center"
                                                                                onClick={() => handleDeleteBackup(backup.id)}
                                                                            >
                                                                                <i className="ph ph-trash f-s-18" /> Delete
                                                                            </button>

                                                                        </td>
                                                                    </tr>
                                                                ))
                                                                }
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
                                                                    <th className="text-center">Sr No.</th>
                                                                    <th>Id</th>
                                                                    <th>Creation Method</th>
                                                                    <th>Status</th>
                                                                    <th>Size</th>
                                                                    <th>Created At</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {paginatedData.length > 0 ? (
                                                                    paginatedData.map((backup, index) => (
                                                                        <tr key={backup.id}>
                                                                            <td>{(currentPage - 1) * entries + index + 1}</td>
                                                                            <td>{backup.id}</td>
                                                                            <td>{backup.creation_method}</td>
                                                                            <td>
                                                                                <span className={`badge ${backup.status === 'created' ? 'bg-success' : 'bg-secondary'}`}>
                                                                                    {backup.status}
                                                                                </span>
                                                                            </td>
                                                                            <td>{(backup.size / (1024 ** 3)).toFixed(2)} GB</td>
                                                                            <td
                                                                                title={new Date(backup.created_at).toLocaleString('en-GB', {
                                                                                    day: 'numeric',
                                                                                    month: 'long',
                                                                                    year: '2-digit',
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit',
                                                                                    second: '2-digit',
                                                                                })}
                                                                            >
                                                                                {new Date(backup.created_at)
                                                                                    .toLocaleDateString('en-GB', {
                                                                                        day: 'numeric',
                                                                                        month: 'long',
                                                                                        year: '2-digit',
                                                                                    })
                                                                                    .replace(
                                                                                        /^(\d{1,2})/,
                                                                                        '$1' + getDaySuffix(new Date(backup.created_at).getDate())
                                                                                    )}
                                                                            </td>
                                                                            <td className="d-flex gap-2">
                                                                                <button className="badge text-white bg-success border-0 d-flex gap-2 align-items-center"
                                                                                    onClick={() => handleRestoreBackup(backup.id)}
                                                                                >
                                                                                    Restore
                                                                                </button>
                                                                                <button
                                                                                    className="badge text-white bg-danger border-0 d-flex gap-2 align-items-center"
                                                                                    onClick={() => handleDeleteBackup(backup.id)}
                                                                                >
                                                                                    <i className="ph ph-trash f-s-18" />
                                                                                    Delete
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan={7} className="text-center py-3">
                                                                            No backups found
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

                                    <div
                                        className={`tabs-content ${activeTab === 5 ? "active" : ""
                                            }`}
                                        id="tab-5"
                                    >
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Snapshots</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <button
                                                            className="btn btn-primary h-45 icon-btn m-2"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#projectCard2"
                                                        >
                                                            <i className="ph-bold ph-plus f-s-18" /> Create
                                                            Snapshots
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="card p-l-r-30 pt-3 pb-3">
                                                    <div className="card-body p-0">
                                                        {/* <div className="app-datatable-default overflow-auto">
                                                            <table
                                                                className="datatable display app-data-table default-data-table"
                                                                id="example1"
                                                            >
                                                                <thead>
                                                                    <tr>
                                                                        <th width={10}>Sr no.</th>
                                                                        <th>Snapshot Name</th>
                                                                        <th>Size</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {snapshots.length > 0 &&
                                                                        snapshots.map((snapshot, index) => (
                                                                            <tr key={snapshot.id || index}>
                                                                                <td>{index + 1}</td>
                                                                                <td>{snapshot?.name}</td>
                                                                                <td>{snapshot?.size} GB</td>
                                                                                <td className="d-flex gap-3">
                                                                                    <button
                                                                                        className="badge text-white bg-success border-0 d-flex gap-2 align-items-center"
                                                                                        onClick={() =>
                                                                                            handleRevertSnapshot(snapshot.id)
                                                                                        }
                                                                                    >
                                                                                        Revert
                                                                                    </button>

                                                                                    <button
                                                                                        className="badge text-white bg-danger border-0 d-flex gap-2 align-items-center"
                                                                                        onClick={() =>
                                                                                            handleDeleteSnapshot(snapshot.id)
                                                                                        }
                                                                                    >
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
                                                                entries={snapshotEntries}
                                                                setEntries={(val) => {
                                                                    setSnapshotEntries(val);
                                                                    setSnapshotPage(1);
                                                                }}
                                                                search={snapshotSearch}
                                                                setSearch={(val) => {
                                                                    setSnapshotSearch(val);
                                                                    setSnapshotPage(1);
                                                                }}
                                                            />

                                                            <table
                                                                className="datatable display app-data-table default-data-table"
                                                                id="snapshot-table"
                                                            >
                                                                <thead>
                                                                    <tr>
                                                                        <th className="text-center">Sr no.</th>
                                                                        <th>Snapshot Name</th>
                                                                        <th>Size</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {paginatedSnapshotData.length > 0 ? (
                                                                        paginatedSnapshotData.map((snapshot, index) => (
                                                                            <tr key={snapshot.id || index}>
                                                                                <td>{(snapshotPage - 1) * snapshotEntries + index + 1}</td>
                                                                                <td>{snapshot?.name}</td>
                                                                                <td>{snapshot?.size} GB</td>
                                                                                <td className="d-flex gap-3">
                                                                                    <button
                                                                                        className="badge text-white bg-success border-0 d-flex gap-2 align-items-center"
                                                                                        onClick={() => handleRevertSnapshot(snapshot.id)}
                                                                                    >
                                                                                        Revert
                                                                                    </button>

                                                                                    <button
                                                                                        className="badge text-white bg-danger border-0 d-flex gap-2 align-items-center"
                                                                                        onClick={() => handleDeleteSnapshot(snapshot.id)}
                                                                                    >
                                                                                        <i className="ph ph-trash f-s-18" />
                                                                                        Delete
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan={4} className="text-center py-3">
                                                                                No snapshots found
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>

                                                            <PaginationControls
                                                                currentPage={snapshotPage}
                                                                setCurrentPage={setSnapshotPage}
                                                                entries={snapshotEntries}
                                                                totalCount={filteredSnapshotData.length}
                                                            />
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`tabs-content ${activeTab === 7 ? "active" : ""
                                            }`}
                                        id="tab-7"
                                    >
                                        <div className="row boot">
                                            <div className="col-lg-12">

                                                <div className="card security-card-content">
                                                    <div className="card-header">
                                                        <h5>Boot & Rescue</h5>
                                                    </div>

                                                    <div className="card-body">
                                                        <p>Here you can choose different boot options. Booting from the rescue ISO helps you fix kernel mismatches and corrupted file systems.</p>
                                                        <div className="boot-option active">
                                                            <img src="../assets/images/new/local-disk.png" alt="" />
                                                            <span>Boot from Disk</span>
                                                        </div>

                                                        <div className="boot-option">
                                                            <img src="../assets/images/new/disk.png" alt="" />
                                                            <span>Boot from Rescue ISO</span>
                                                        </div>

                                                        <div className="boot-option">
                                                            <img src="../assets/images/new/disk.png" alt="" />
                                                            <span>Boot from ISO Image</span>
                                                        </div>

                                                        <p className="note">By default, a server is booted from its disk. If your server was booted from the rescue ISO and you want to boot the server from the disk again, do the following:</p>
                                                        <p>1. Shut down or reboot your server. To shut down the server, click the Stop button above or use the command line.</p>

                                                        <p> 2. Power on your server. To do so, click the Start button above or boot the server from its disk.</p>

                                                        <button class="btn btn-primary h-45 w-95 mt-5 icon-btn ">Apply</button>
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

                    {/* Project Modal */}
                    <div
                        className="modal fade"
                        id="projectCard2"
                        aria-hidden="true"
                        ref={modalRef}
                    >
                        <div className="modal-dialog ">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <div className="d-flex align-items-center gap-3">
                                        <h5 className="modal-title">Create Snapshot </h5>
                                        <iconify-icon
                                            icon="line-md:document-add"
                                            className="text-success f-s-22"
                                        ></iconify-icon>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    />
                                </div>

                                <form onSubmit={handleSubmitSnapshot} method="POST">
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="snapshot_name" className="form-label">
                                                Snapshot Name
                                            </label>
                                            <input
                                                type="text"
                                                id="snapshot_name"
                                                name="snapshot_name"
                                                className="form-control"
                                                value={formData.snapshot_name}
                                                onChange={handleSnapshotChange} // 👈 Use the new one
                                                required
                                            />
                                            {snapshotSuccess && (
                                                <div className="alert alert-success">
                                                    {snapshotSuccess}
                                                </div>
                                            )}
                                            {snapshotError.name && (
                                                <div className="text-danger small">
                                                    {snapshotError.name[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                            {isSubmitting ? "Creating..." : "Create Snapshot"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="modal" id="projectCard1" ref={modalRef} tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <div className="d-flex align-items-center gap-3">
                                        <h5 className="modal-title">Update Backup</h5>
                                        <iconify-icon icon="line-md:document-add" className="text-success f-s-22" />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    />
                                </div>

                                <form onSubmit={handleBackupUpdate}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <div className="form-check gap-3">
                                                <div className="card-body main-switch main-switch-color">
                                                    <div className="swich-size my-3">
                                                        <input
                                                            className="toggle"
                                                            id="check-003"
                                                            type="checkbox"
                                                            checked={autoBackup}
                                                            onChange={(e) => setAutoBackup(e.target.checked)}
                                                        />
                                                        <label htmlFor="check-003">
                                                            Enable automated backup plan
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="form-check-label-p">
                                                        for enabling auto backup - you wil be charged
                                                        <strong className="f-s-19 text-primary">$5/month</strong>{" "}
                                                    </p>
                                                </div>
                                            </div>

                                            {backupSuccess && (
                                                <div className="alert alert-success mt-2">{backupSuccess}</div>
                                            )}

                                            {backupError && (
                                                <div className="text-danger small mt-2">{backupError}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Updating..." : "Update"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </Fragment>
    );
}
export default Manage;
