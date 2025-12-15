"use client";
import { useParams } from "next/navigation";
import React, { Fragment, useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import ListTable from "../../MemberListTable";
import Cookies from "js-cookie";
import TableControls from "@/components/datatable/TableControls";
import PaginationControls from "@/components/datatable/PaginationControls";
import { Modal } from "bootstrap";
import Swal from 'sweetalert2';


function ViewPage() {
  const tableRef = useRef();
  const sshModalRef = useRef(null);
  const sshTableRef = useRef(null);
  const memberTableRef = useRef(null);
  const serverTableRef = useRef(null);


  const [formData, setFormData] = useState({ email: "", project_id: "" });
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [projects, setProjects] = useState([]);

  const [data, setData] = useState([]);
  const [members, setMembers] = useState([]);
  const [servers, setServers] = useState([]);
  const [attachmentserver, setAttachmentserver] = useState([]);
  const [solusUsers, setSolusUsers] = useState([]);
  const [sshKeys, setSshKeys] = useState([]);
  const [sshpublickey, setSshPublicKey] = useState([]);
  const [sshprivatekey, setSshPrivateKey] = useState([]);
  const [sshSuccess, setSshSuccess] = useState(null);
  const [sshError, setSshError] = useState({});

  // Get slug from URL
  const params = useParams();
  const id = params.slug;
  // auto load
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);
// project detail
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token && id) {
      console.log("Fetching ID:", id);
      // console.log("Token found:", token);
      const FetchProject = async () => {
        console.log(`Bearer ${token}`);
        setIsLoading(true);
        try {
          console.log(id);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/project/${id}`,
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

          if (
          result.success === false || 
          result.status === "error" || 
          !result.data
        ) {
          console.warn("API Error:", result.message || "Unknown error");

          // show fallback UI (toast or state)
          setProjects(null);
          setAttachmentserver([]);
          setFormData((prev) => ({ ...prev, project_id: "" }));

          setIsLoading(false);
          return;
        }
          setProjects(data.project);
          setAttachmentserver(data.servers);

          setFormData((prev) => ({
            ...prev,
            project_id: data.project?.id || "",
          }));
        } catch (error) {
          console.error("Error :", error);
          setIsLoading(false);
        }
      };
      FetchProject();
    }
  }, []);
// server list
    useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token && id) {
      console.log("Fetching ID:", id);
      // console.log("Token found:", token);
      const FetchProjectServers = async () => {
        console.log(`Bearer ${token}`);
        setIsLoading(true);
        try {
          console.log(id);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects/${id}/servers`,
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

         if (result.success === true || result.success === "true") {
          setServers(result.data.data);  // correct
        } else {
          setServers([]);
        }


        } catch (error) {
          console.error("Error :", error);
          setIsLoading(false);
        }
      };
      FetchProjectServers();
    }
  }, []);
// solous list of user
      useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token && id) {
      console.log("Fetching ID:", id);
      // console.log("Token found:", token);
      const FetchSolusUser = async () => {
        console.log(`Bearer ${token}`);
        setIsLoading(true);
        try {
          console.log(id);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus/users/${id}`,
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

         if (result.success === true || result.success === "true") {
          setSolusUsers(result.data);  // correct
        } else {
          setSolusUsers([]);
        }


        } catch (error) {
          console.error("Error :", error);
          setIsLoading(false);
        }
      };
      FetchSolusUser();
    }
  }, []);

// Fetch project members
    const FetchProjectMembers = async () => {
        const token = Cookies.get("accessToken");
        // console.log("Token found:", token);
        if (token && id) {
          console.log("Fetching ID:", id);
          console.log(`Bearer ${token}`);
          setIsLoading(true);
          try {
            console.log(id);
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects/${id}/members`,
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
            if(result.success == true || result.success == "true"){
              setMembers(data);
            }
          } catch (error) {
            console.error("Error :", error);
            setIsLoading(false);
          }
        };
      };

    useEffect(() => {  
    FetchProjectMembers();
  }, []);
// Fetch project SSH keys
   const FetchProjectSSH = async () => {
        const token = Cookies.get("accessToken");
        // console.log("Token found:", token);
        if (token && id) {
          console.log("Fetching ID:", id);
          console.log(`Bearer ${token}`);
          setIsLoading(true);
          try {
            console.log(id);
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects/${id}/ssh-keys`,
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
            if(result.success == true || result.success == "true"){
              setSshKeys(data.data);
            }
          } catch (error) {
            console.error("Error :", error);
            setIsLoading(false);
          }
        };
      };

    useEffect(() => {  
      FetchProjectSSH();
    }, []);
  // datatable for attachment server

  const [MemberSearch, setMemberSearch] = useState("");
  const [MemberEntries, setMemberEntries] = useState(10);
  const [MemberPage, setMemberPage] = useState(1);

  const filteredMembers = useMemo(() => {
    return members.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(MemberSearch.toLowerCase())
      )
    );
  }, [members, MemberSearch]);

  const paginatedMembers = useMemo(() => {
    const start = (MemberPage - 1) * MemberEntries;
    return filteredMembers.slice(start, start + MemberEntries);
  }, [filteredMembers, MemberPage, MemberEntries]);


const handleChange = (e) => {
  const { name, value } = e.target;
  console.log(name, value); // "email", "sajid@rackvolt.com"
  // if you're keeping form data in state:
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true); // Start loading
  setSuccess(null); // Clear previous success
  setError({}); // Clear previous errors

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects/${id}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify(formData),
      }
    );

    // Optional: Check for HTTP error response
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const result = await res.json();
    console.log(result);

    if (result.success === true || result.success === "true") {
      setSuccess(result.message);
      setFormData({ email: "", project_id: "" });

      try {
        await FetchProjectMembers();
        window.location.reload(); // Be careful: this will kill the React state
      } catch (innerErr) {
        console.error("Error refreshing members or reloading:", innerErr);
      }
    } else {
       setError({ general: [result.message] });


      try {
        await FetchProjectMembers();
        window.location.reload();
      } catch (innerErr) {
        console.error("Error refreshing members or reloading:", innerErr);
      }
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    setError({ general: ["Unexpected error occurred."] });
  } finally {
    setLoading(false); // Stop loading no matter what
  }
};


  // 
  const [sshFormData, setSshFormData] = useState({ name: "", body: "" });
  const [sshData, setSshData] = useState(null);

  const handleSshChange = (e) => {
    const { name, value } = e.target;
    setSshFormData((prev) => ({ ...prev, [name]: value }));
  };

  // generate SSH KEY
    const handleSSHKeyGeneration = async (e) => {
    e.preventDefault();
    setSshSuccess(null); // clear previous success
    setSshError({}); // clear previous errors

    const email = Cookies.get("email");
    console.log(email);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects/ssh-key/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify({ email: email}),
        }
      );

      const result = await res.json();
      console.log(result);

      if (res.ok && result.success == true || result.success == "true") {
        setSshSuccess(result.message);
        setSshFormData({ name: "", body: result.data.public_key || "" });
        setSshData(result.data);
      } else {
        setSshError(
          result.errors || {
            general: [result.message || "Something went wrong."],
          }
        );

      // FetchProjectMembers();
      // window.location.reload();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError({ general: ["Unexpected error occurred."] });
    }
  };

   const handleSubmitSsh = async (e) => {
    e.preventDefault();
    setSuccess(null); // clear previous success
    setError({}); // clear previous errors
    setIsLoading(true);

    const email = Cookies.get("email");
    console.log(email);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects/${id}/ssh-keys`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify(sshFormData),
        }
      );

      const result = await res.json();
      console.log(result);
      setIsLoading(false);

      if (res.ok && result.success == true || result.success == "true") {
        setSuccess(result.message);
        setSshFormData({ name: "", body: "" });
        window.location.reload();

      } else {
       setSshError(
          result.data || "Something went wrong."
        );
      
      await FetchProjectSSH();

      // // FetchProjectSSH();
      // // window.location.reload();
      }

    } catch (err) {
      console.error("Unexpected error:", err);
      setError({ general: ["Unexpected error occurred."] });
      setLoading(false);
    }
  };

  

  // user reomve 

  const confirmRemoveUser = (userEmail, solusMemberId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary ms-2",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Remove User?",
        text: `Are you sure you want to remove ${userEmail}? This can't be undone!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleRemoveUser(userEmail, solusMemberId, swalWithBootstrapButtons);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "User is still active :)",
            "error"
          );
        }
      });
  };
  const handleRemoveUser = async (userEmail, solusMemberId, swal) => {
    try {
      // Show loader
      swal.fire({
        title: "Removing...",
        text: `Please wait while we remove ${userEmail}`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects/${id}/members/${solusMemberId}/${userEmail}`,
        {
          method: "DELETE", // change to POST if your backend expects it
          headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
           },
        }
      );

      if (response.ok) {
        swal.fire("Removed!", `${userEmail} has been removed.`, "success");
        // ✅ Refresh user list here
        await FetchProjectMembers();
        window.location.reload(); // Be cautious with this
      } else {
        swal.fire("Error", "Failed to remove user.", "error");
      }
    } catch (error) {
      swal.fire("Error", "Something went wrong!", "error");
    }
  };

  // re invite user
    const confirmResendInvite = (userEmail, solusMemberId) => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-primary ms-2",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Resend Invite?",
          text: `Do you want to resend the invite to ${userEmail}?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, resend!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            handleResendInvite(userEmail, solusMemberId, swalWithBootstrapButtons);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
              "Cancelled",
              "Invite not resent :)",
              "error"
            );
          }
        });
    };

    const handleResendInvite = async (userEmail, solusMemberId, swal) => {
      try {
        // Show loader
        swal.fire({
          title: "Resending...",
          text: `Please wait while we resend the invite to ${userEmail}`,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects/${id}/members/${solusMemberId}/resend-invite`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
           },
          }
        );

        if (response.ok) {
          swal.fire("Sent!", `Invite resent to ${userEmail}.`, "success");
          // ✅ Optionally refresh list
        } else {
          swal.fire("Error", "Failed to resend invite.", "error");
        }
      } catch (error) {
        swal.fire("Error", "Something went wrong!", "error");
      }
    };

 // modal    
useEffect(() => {
  if (sshModalRef.current) {
    const modalEl = sshModalRef.current;

    const handleClose = () => {
      // reset form and sshData
      setSshData(null);
      setFormData({ name: "", public_key: "" });
      setSshSuccess(null);
      setSshError({});
    };

    modalEl.addEventListener("hidden.bs.modal", handleClose);

    return () => {
      modalEl.removeEventListener("hidden.bs.modal", handleClose);
    };
  }
}, []);

  
  // SERVERS 
  const [serverSearch, setServerSearch] = useState("");
  const [serverEntries, setServerEntries] = useState(10);
  const [serverPage, setServerPage] = useState(1);

  const filteredServers = useMemo(() => {
    return servers.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(serverSearch.toLowerCase())
      )
    );
  }, [servers, serverSearch]);

  const paginatedServers = useMemo(() => {
    const start = (serverPage - 1) * serverEntries;
    return filteredServers.slice(start, start + serverEntries);
  }, [filteredServers, serverPage, serverEntries]);


  // SSHKEY
const [sshSearch, setSshSearch] = useState("");
const [sshEntries, setSshEntries] = useState(10);
const [sshPage, setSshPage] = useState(1);

const filteredSshKeys = useMemo(() => {
  return sshKeys.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(sshSearch.toLowerCase())
    )
  );
}, [sshKeys, sshSearch]);

const paginatedSshKeys = useMemo(() => {
  const start = (sshPage - 1) * sshEntries;
  return filteredSshKeys.slice(start, start + sshEntries);
}, [filteredSshKeys, sshPage, sshEntries]);


// Reset success and error messages after a delay
  useEffect(() => {
    if (success || Object.keys(error).length > 0) {
        const timer = setTimeout(() => {
            setSuccess(null);
            setError({});

        }, 3000); // 3 seconds

        return () => clearTimeout(timer); // Cleanup
    }
}, [success, error]);

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// download sshkey
const downloadFile = (content, fileName, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

const handleCopy = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "SSH Key copied to clipboard.",
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  });
};

// When switching tabs
const handleTabChange = (tab) => {
  setActiveTab(tab ?? 1);
  localStorage.setItem("activeTab", tab ?? 1);
};

useEffect(() => {
  const savedTab = localStorage.getItem("activeTab");
  if (savedTab) {
    setActiveTab(Number(savedTab));
  }
}, []);


// short key 
const shortenKey = (key) => {
  if (!key) return "";
  if (key.length <= 10) return key;
  return `${key.slice(0, 7)}...${key.slice(-7)}`;
};

  return (
    <Fragment>
      <div className="position-relative">
        {/* Overlay loader */}
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
            {/* breadcrum */}
            <div className="row m-1">
              <div className="col-12">
                <h4 className="main-title">{projects.name || ""} </h4>
                <ul className="app-line-breadcrumbs mb-3">
                  <li>
                    <a className="f-s-14 f-w-500" href="/project">
                      <span>
                        <i className="ph-duotone  ph-table f-s-16" /> Projects
                      </span>
                    </a>
                  </li>
                  <li className="active">
                    <a className="f-s-14 f-w-500" href="#">
                      {projects.name || ""}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {/* breadcrum */}

            <div className="row">
              <div className="col-12">
                <div className="tab-wrapper mb-3">
                  <ul className="tabs">
                    <li
                      className={`tab-link ${activeTab === 1 ? "active" : ""}`}
                      // onClick={() => setActiveTab(1)}
                        onClick={() => handleTabChange(1)}

                    >
                      <i className="ph-bold ph-hard-drives f-s-18" /> Servers
                    </li>
                    <li
                      className={`tab-link ${activeTab === 2 ? "active" : ""}`}
                      // onClick={() => setActiveTab(2)}
                        onClick={() => handleTabChange(2)}

                      
                    >
                      <i className="ph-bold  ph-users f-s-18" /> Members
                    </li>
                    <li
                      className={`tab-link ${activeTab === 3 ? "active" : ""}`}
                      // onClick={() => setActiveTab(3)}
                      onClick={() => handleTabChange(3)}

                    >
                      {/* <i className="ph-bold  ph-users f-s-18" />  */}
                      <i class="ph-light  ph-key f-s-18"></i>
 
                      SSH Keys
                    </li>
                  </ul>
                </div>
                <div className="content-wrapper">
                  <div
                    className={`tabs-content ${
                      activeTab === 1 ? "active" : ""
                    }`}
                    id="tab-1"
                  >
                    <div className="card">
                      <div className="card-header border-btm d-flex align-items-center justify-content-between">
                        <h5>Project Servers</h5>
                      </div>
                      <div className="card-body">
                        {/* <div className="text-center">
                                                    <Image src="/assets/images/New/nodata.gif" width={500} height={500} alt="nodata" />
                                                </div> */}
                        <div className="app-datatable-default overflow-auto">
                           <TableControls
                              entries={serverEntries}
                              setEntries={(val) => {
                                setServerEntries(val);
                                setServerPage(1);
                              }}
                              search={serverSearch}
                              setSearch={(val) => {
                                setServerSearch(val);
                                setServerPage(1);
                              }}
                            />
                          <table
                            ref={tableRef}
                            className="datatable display app-data-table default-data-table"
                          >
                            <thead>
                              <tr>
                                <th width={10}>Sr no.</th>
                                <th>Server</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedServers.length > 0 ? (
                                paginatedServers.map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{item.name}</td>
                                      <td>
                                        <Link
                                          href={`/server/${item.ekire_server.id}`}
                                          className="btn btn-sm btn-primary"
                                        >
                                          View
                                        </Link>
                                      </td>
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td colSpan={3}>No data found</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          <PaginationControls
                              currentPage={serverPage}
                              setCurrentPage={setServerPage}
                              entries={serverEntries}
                              totalCount={filteredServers.length}
                            />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`tabs-content ${
                      activeTab === 2 ? "active" : ""
                    }`}
                    id="tab-2"
                  >
                    {/* <ListTable /> */}

                    <div className="card">
                      <div className="card-header border-btm d-flex align-items-center justify-content-between">
                        <h5>Project Members</h5>
                        <div className="text-end">
                          <button
                            className="btn btn-primary h-45 icon-btn m-2"
                            data-bs-target="#projectCard2"
                            data-bs-toggle="modal"
                          >
                            <i className="ph ph-circles-three-plus f-s-18" />{" "}
                            Invite Member
                          </button>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="app-datatable-default overflow-auto">
                           <TableControls
                            entries={MemberEntries}
                            setEntries={(val) => {
                              setMemberEntries(val);
                              setMemberPage(1);
                            }}
                            search={MemberSearch}
                            setSearch={(val) => {
                              setMemberSearch(val);
                              setMemberPage(1);
                            }}
                          />
                          <table
                            ref={tableRef}
                            className="datatable display app-data-table default-data-table"
                            // id="example1"
                          >
                            <thead>
                              <tr>
                                <th>Sr no.</th>
                                <th>Email Id</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedMembers.length > 0 ? (
                                paginatedMembers.map((member, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{member.email}</td>
                                    <td>
                                      {member.status === 'active' ? <span className="badge bg-success">{capitalize(member.status)}</span> : member.status === 'invited' ? <span className="badge bg-warning">{capitalize(member.status)}</span> : <span className="badge bg-danger">{capitalize(member.status)}</span>}
                                    </td>
                                    <td>
                                    {member.is_owner === false && member.status === "invited" ? (
                                      <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => confirmResendInvite(member.email, member.id)}
                                      >
                                        Resend Invite
                                      </button>
                                    ) : null}
                                      &nbsp;&nbsp;
                                      {member.is_owner === false  ? <button className="btn btn-danger btn-sm" onClick={() => confirmRemoveUser(member.email,member.id)}>Remove</button> : null}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={4}>No data found</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          <PaginationControls
                            currentPage={MemberPage}
                            setCurrentPage={setMemberPage}
                            entries={MemberEntries}
                            totalCount={filteredMembers.length}
                          />
                        </div>
                      </div>
                    </div>
                    </div>

                      <div
                    className={`tabs-content ${
                      activeTab === 3 ? "active" : ""
                    }`}
                    id="tab-3"
                  >

                     <div className="card">
                      <div className="card-header border-btm d-flex align-items-center justify-content-between">
                        <h5>SSH Keys</h5>
                        <div className="text-end">
                          <button
                            className="btn btn-primary h-45 icon-btn m-2"
                            data-bs-target="#projectCard3"
                            data-bs-toggle="modal"
                          >
                            <i className="ph ph-plus f-s-18" />{" "}
                            Add SSH Key
                          </button>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="app-datatable-default overflow-auto">
                           <TableControls
                            entries={sshEntries}
                            setEntries={(val) => {
                              setSshEntries(val);
                              setSshPage(1);
                            }}
                            search={sshSearch}
                            setSearch={(val) => {
                              setSshSearch(val);
                              setSshPage(1);
                            }}
                          />
                          <table
                            ref={tableRef}
                            className="datatable display app-data-table default-data-table"
                            // id="example2"
                          >
                            <thead>
                              <tr>
                                <th>Sr no.</th>
                                <th>SSH Name</th>
                                <th>Key</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedSshKeys.length > 0 ? (
                                paginatedSshKeys.map((key, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{key.name}</td>
                                    <td>{shortenKey(key.body)}</td>
                                    <td><button
                                      className="btn btn-outline-primary btn-sm me-2"
                                      onClick={() => handleCopy(key.body)}
                                    >
                                      <i className="ph ph-clipboard f-s-18" />{" "}
                                    </button></td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={4}>No data found</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          <PaginationControls
                            currentPage={sshPage}
                            setCurrentPage={setSshPage}
                            entries={sshEntries}
                            totalCount={filteredSshKeys.length}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* modal 1 */}

        {/* modal 2 */}
        <div
          aria-hidden="true"
          aria-labelledby="projectCardLabel"
          className="modal fade"
          id="projectCard2"
          tabIndex={-1}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center gap-2">
                  <h1 className="modal-title fs-5" id="projectCardLabel">
                    Add new Member to project{" "}
                  </h1>
                  <iconify-icon
                    icon="line-md:text-box-to-text-box-multiple-transition"
                    className="animated-box-multiple-transition f-s-22"
                  />
                </div>
                <button
                  aria-label="Close"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  type="button"
                />
              </div>
              <div className="modal-body">
                <form
                 onSubmit={handleSubmit} 
                 id="attachMemberForm">
                  {success && (
                    <div
                      className="alert alert-success p-0 text-success"
                      style={{ background: "none", border: "0" }}
                    >
                      {success}
                    </div>
                  )}
                  {error.general && (
                    <div
                      className="alert alert-danger p-0 text-danger"
                      style={{ background: "none", border: "0" }}
                    >
                      {error.general[0]}
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="email_id" className="form-label">
                      Email Id
                    </label>
                  <input name="email" className="form-control"  type="email" required  onChange={handleChange}/>
                    {error.email && (
                      <div className="text-danger small">{error.email[0]}</div>
                    )}
                  </div>
                  <input
                    type="hidden"
                    id="project_id"
                    name="project_id"
                    value={formData.project_id}
                    onChange={handleChange}
                  />

                  <button
                    className="btn btn-secondary me-2"
                    data-bs-dismiss="modal"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" 
                  disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Invite"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* modal 3 */}
        {/* Add SSH Key Modal */}
  <div
    ref={sshModalRef}
    className="modal fade"
    id="projectCard3"
    tabIndex={-1}
    aria-labelledby="addSshKeyLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="addSshKeyLabel">Add SSH Key</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form method="POST">
        <div className="modal-body">
          {/* Info row */}
          <div className="mb-3">
            <button onClick={handleSSHKeyGeneration} type="button" className="text-primary btn-link">+ Generate a new key pair</button>
            <p className="text-muted mb-0">
              This generates a keypair, auto-fills the public key below, and lets you download both files.
            </p>
          </div>

          {/* Success message */}
           {sshSuccess && (
            <div className="alert alert-success py-2">
              <p className="mb-0">
                <strong>Success!</strong> {sshSuccess}.
              </p>
            </div>
           )}
           {
            sshError && (
              <div className="text-danger small">{sshError.error}</div>
            )
           }

          {/* Keypair ready badge + download buttons */}
          {sshSuccess && (
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="badge bg-success">Key pair ready</span>
             <div>
           <button
            type="button"
            className="btn btn-outline-secondary btn-sm me-2"
            onClick={() =>
              downloadFile(
                sshData.private_key,
                `${sshData.file_name}.pem`,
                "application/x-pem-file"
              )
            }
          >
            { "Download Private (.pem)"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() =>
              downloadFile(
                sshData.public_key,
                `${sshData.file_name}.pub`,
                "application/x-pubkey"
              )
            }
          >
            { "Download Public (.pub)"}
          </button> 
        </div>
          </div>
           )}

          {/* Public SSH Key textarea */}
          <div className="mb-3">
            <label className="form-label">Public SSH Key</label>
            <textarea
              className="form-control"
              rows="4"
              name="body"
              value={sshFormData.body}
              onChange={handleSshChange}
              readOnly
            ></textarea>
            {sshError.body && (
              <div className="text-danger small">{sshError.body[0]}</div>
            )}
          </div>

          {/* Name input */}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" name="name" value={sshFormData.name} onChange={handleSshChange} placeholder="Enter key name" />
            {sshError.name && (
              <div className="text-danger small">{sshError.name[0]}</div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button type="submit" onClick={handleSubmitSsh} disabled={isLoading} className="btn btn-primary">
              {isLoading ? "Adding..." : "Add SSH Key"}
          </button>
        </div>
        </form>
      </div>
    </div>
  </div>

      </div>
    </Fragment>
  );
}

export default ViewPage;
