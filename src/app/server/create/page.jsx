"use client";
// import { useParams } from "next/navigation";
import Link from "next/link";
import React, { Fragment, useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Select from "react-select";
import { useRouter } from "next/navigation"; // or "next/router" if you’re using pages router

function Create() {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedOS, setSelectedOS] = useState(null);
  const [authMethod, setAuthMethod] = useState("ssh");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const summaryRef = useRef(null);
  const [os, setOs] = useState([]);
  const [app, setApp] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [hostServers, setHostServers] = useState([]);
  const [selectedServerId, setSelectedServerId] = useState(null);
  const [sshKeys, setSshKeys] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showdeploybutton, setShowDeployButton] = useState(false);

  const router = useRouter();

  const [formData, setFormData] = useState({
    vms_id: "",
    processor: "",
    location: "",
    os_version_id: "",
    hostname: "",
    auto_backups: false,
    bandwidth: "unlimited",
    billingCycle: "",
    ssh_Keys: [],
  });

  useEffect(() => {
  if (
    formData.os_version_id !== '' &&
    formData.billingCycle !== '' &&
    formData.processor !== '' &&
    formData.vms_id !== '' &&
    formData.location !== ''
  ) {
    setShowDeployButton(true);
  } else {
    setShowDeployButton(false);
  }
}, [formData]);
  const handleProjectChange = (selectedOption) => {
    setSelectedProjectId(selectedOption ? selectedOption.value : null);
  };

  const projectid = selectedProjectId ?? "";

  console.log("Selected Project ID:", projectid);

  const handleChange = (e) => {
    console.log(selectedServerId);
    setSelectedServerId(server.id);
    setFormData({
      ...formData,
      processor: server.processor,
      location: server.location,
      [e.target.name]: e.target.value,
    });
  };

  console.log("Form Data:", formData);
  // api os system
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

  // api vms plans
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      console.log("Token found:", token);
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

  // host server api
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      const fetchHostServers = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/host-servers`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const result = await response.json();
          setHostServers(result.data.host_servers); // store array of servers
        } catch (error) {
          console.error("Error fetching host servers:", error);
        }
      };
      fetchHostServers();
    }
  }, []);

  // Project fetched
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      // console.log("Token found:", token);
      const FetchProject = async () => {
       
        console.log(`Bearer ${token}`);
        setIsLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects`,
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
          setProjects(data.data);
        } catch (error) {
          console.error("Error fetching cloud vps plan data:", error);
          setIsLoading(false);
        }
      };

      FetchProject();
    }
  }, []);

  const [selectedOSId, setSelectedOSId] = useState(null);
  const [selectedAppId, setSelectedAppId] = useState(null);

  const handleOSClick = (id) => {
    setSelectedOSId(id);
  };
  const handleAppClick = (id) => {
    setSelectedAppId(id);
  };

  useEffect(() => {
    const handleScroll = () => {
      const summary = summaryRef.current;
      if (!summary) return;

      if (window.innerWidth >= 1199) {
        // Get current width before fixing
        const summaryWidth = summary.parentElement.offsetWidth;
        summary.style.position = "fixed";
        summary.style.top = "100px";
        summary.style.zIndex = "999";
        summary.style.width = `${summaryWidth}px`;
      } else {
        // Reset on mobile view
        summary.style.position = "static";
        summary.style.top = "";
        summary.style.zIndex = "";
        summary.style.width = "";
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Run on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // auto load
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  // modal for disk
  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      const modal = new bootstrap.Modal(
        document.getElementById("projectCard1")
      );
      modal.show();
    }
  };

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

  const [calculatedPrice, setCalculatedPrice] = useState(null);


  const handleCalculatePrice = async () => {

  try {
    const response = await fetch(
      `https://staging.ekire.net/api/solus-projects/${projectid}/servers/calculate-price`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`, // use token from cookies
        },
        body: JSON.stringify({
          vms_id: formData.vms_id,
          auto_backups: formData.auto_backups,
          billingCycle: formData.billingCycle,
        }),
      }
    );

  const result = await response.json();
    if (response.ok && result.status === "success") {
      setCalculatedPrice(result.data); // just save it in state
    } else {
      Swal.fire("Error", result.message || "Failed to calculate price", "error");
    }
  } catch (error) {
    console.error("Price calculation error:", error);
    Swal.fire("Error", "Something went wrong while calculating price.", "error");
  }
};


  const handleDeployServer = async () => {

      const projectName = projects.find(p => p.id === parseInt(selectedProjectId))?.name || 'Not selected';
      console.log("Selected Project Name:", projectName);
      const planName = plans.find(p => p.id === selectedPlanId) || "Not selected";
      console.log("Selected Plan Name:", planName);
      const osName = os.find(o => o.id === selectedOSId)?.name || "Not selected";
      console.log("Selected OS Name:", osName);


    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-secondary ms-2",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Deploy Server?",
        text: "Are you sure you want to deploy this server with this configuration?",
        html: `
          <ul>
            <li><strong>Project:</strong> ${projectName}</li>
            <li><strong>OS:</strong> ${osName}</li>
            <li><strong>Plan:</strong> ${planName.cpu} Cpu ${planName.ram} Ram ${planName.disk} Disk </li>
            <li><strong>Price:</strong> ${planName.price} USD</li>
          </ul>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, deploy it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deploying...",
            text: "Please wait while your server is being deployed.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects/${projectid}/servers`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
                body: JSON.stringify(formData),
              }
            );

            const result = await response.json();
            console.log("Deploy result:", result);

           if (response.ok && result?.status === "success") {
              Swal.fire(
                "Deployed!",
                result?.message || "Server deployed successfully.",
                "success"
              );

                const serverId = result.data?.serverId; // ✅ get from API response


              setTimeout(() => {
                router.push(`/server/${serverId}`); // ✅ redirect with ID
              }, 2000);
            } else {
             const message = result?.message || "Server deployment failed.";
            const errorDetail = result?.data?.error || "";
             Swal.fire(
              "Failed!",
              `${message}${errorDetail ? "<br><pre>" + errorDetail + "</pre>" : ""}`,
              "error"
            ).then(() => {
                if (typeof message === "string" && message.includes("Insufficient balance")) {
                  window.location.href = "/finance?payment=add-balance";
                }
              });
            }
          } catch (error) {
            console.error("Deploy error:", error);
            Swal.fire(
              "Error!",
              "Something went wrong during deployment.",
              "error"
            );
          }
        } else {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Server deployment cancelled.",
            "info"
          );
        }
      });
  };

  // api for list sshy keys with multiselect
  const [selectedSSHKeys, setSelectedSSHKeys] = useState([]);

const fetchSSHKeys = async () => {
  if (!projectid) return;

  setLoadingKeys(true);
  setFetchError(false);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects/${projectid}/ssh-keys`,
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
  fetchSSHKeys();
}, [projectid]);

  // api for list sshy keys with multiselect end

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
          className={`page-content ${isLoading ? "pointer-events-none" : ""}`}
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          <div className="container-fluid">
            {/* Breadcrumb start */}
            <div className="row m-1">
              <div className="col-12">
                <h4 className="main-title">Create New Server </h4>
                <ul className="app-line-breadcrumbs mb-3">
                  <li>
                    <a className="f-s-14 f-w-500" href="/server">
                      <span>
                        <i className="ph-duotone  ph-table f-s-16" /> Server
                      </span>
                    </a>
                  </li>
                  <li className="active">
                    <a className="f-s-14 f-w-500" href="#">
                      Create New Server
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {/* Breadcrumb end */}

            {/* Projects start */}
            <form method="POST" id="createServerForm">
              <div className="row cart-table">
                <div className="col-xl-8 col-lg-12 col-md-12">
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="card security-card-content">
                            <div className="card-header">
                              <h5>Region</h5>
                            </div>

                            <div className="card-body">
                              <div className="row">
                                {hostServers.map((server) => (
                                  <div
                                    className="col-xxl-4 col-12"
                                    key={server.id}
                                  >
                                    <ul
                                      className="active-device-session active-device-list"
                                      id="shareMenuLeft"
                                    >
                                      <li>
                                        <div
                                          className={`card cursor-pointer transition-all duration-300 ${
                                            selectedServerId === server.id
                                              ? "border-selected"
                                              : "border-unselected"
                                          }`}
                                          onClick={() => {
                                            setSelectedServerId(server.id);
                                            setFormData((prevData) => ({
                                              ...prevData,
                                              location: server.location,
                                              processor: server.processor,
                                            }));
                                          }}
                                        >
                                          <div className="card-body">
                                            <div
                                              className="device-menu-item"
                                              draggable="false"
                                            >
                                              <span className="device-menu-img">
                                                <img
                                                  src={server.image_url}
                                                  alt={server.country}
                                                  width={32}
                                                  height={20}
                                                  className={`transition-all duration-300 ${
                                                    selectedServerId ===
                                                    server.id
                                                      ? "grayscale-0"
                                                      : "grayscale"
                                                  }`}
                                                  style={{
                                                    objectFit: "cover",
                                                    borderRadius: "4px",
                                                  }}
                                                />
                                              </span>
                                              <div className="device-menu-content">
                                                <h6 className="mb-0 txt-ellipsis-1">
                                                  {server.location}
                                                </h6>
                                                <p className="mb-0 txt-ellipsis-1 text-secondary">
                                                  Processor : {server.processor}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h5>OS/Application</h5>
                    </div>
                    <div className="card-body p-0">
                      <div className="row">
                        <div className="col-12">
                          <div className="tab-wrapper ms-3 me-3 mb-3">
                            <ul className="tabs overflow-auto">
                              <li
                                className={`tab-link ${
                                  activeTab === 1 ? "active" : ""
                                }`}
                                onClick={() => setActiveTab(1)}
                              >
                                <i className="ph-bold  ph-align-right f-s-18" />{" "}
                                Operating System
                              </li>
                              <li
                                className={`tab-link ${
                                  activeTab === 2 ? "active" : ""
                                }`}
                                onClick={() => setActiveTab(2)}
                              >
                                <i className="ph-fill ph-list-bullets f-s-18" />{" "}
                                Application
                              </li>
                            </ul>
                          </div>

                          <div className="content-wrapper" id="card-container">
                            <div
                              className={`tabs-content ${
                                activeTab === 1 ? "active" : ""
                              }`}
                              id="tab-1"
                            >
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
                                          onClick={() => handleOSClick(o.id)}
                                          style={{ cursor: "pointer" }}
                                        >
                                          <div className="card-body">
                                            <div className="simple-price-header text-center">
                                              <h5 className="mb-3">{o.name}</h5>
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
                                          <div
                                            className="app-form row g-3 needs-validation mt-0"
                                            noValidate
                                          >
                                            <div className={o.name}>
                                              <select
                                                name="os_version_id"
                                                className="form-select"
                                                id={`${o.name}-version`}
                                                required
                                                onChange={(e) =>
                                                  setFormData((prev) => ({
                                                    ...prev,
                                                    os_version_id:
                                                      e.target.value,
                                                  }))
                                                }
                                              >
                                                <option value="">
                                                  Select Version
                                                </option>
                                                {o.versions?.map((version) => (
                                                  <option
                                                    value={version.id}
                                                    key={version.id}
                                                  >
                                                    {version.name}
                                                  </option>
                                                ))}
                                              </select>
                                              <div className="invalid-feedback">
                                                Please select a valid version.
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
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
                                          <div
                                            className="app-form row g-3 needs-validation mt-0"
                                            noValidate
                                          >
                                            <div className={apps.name}>
                                              <select
                                                name="os_version_id"
                                                className="form-select"
                                                id={`${apps.name}-version`}
                                                required
                                                onChange={(e) =>
                                                  setFormData((prev) => ({
                                                    ...prev,
                                                    os_version_id:
                                                      e.target.value,
                                                  }))
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
                                                Please select a valid version.
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-body p-0">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="card security-card-content">
                            <div className="card-header">
                              <h5>Size</h5>
                            </div>
                            <div className="card card-inside">
                              {/* <div className="card-header code-header tabs-disabled">
                                <h5 className="p-0">CPU Type</h5>
                              </div> */}
                              <div className="card-body border-btm">
                                <ul
                                  className="nav nav-tabs tab-outline-primary row border-0 tabs-disabled"
                                  id="Outline"
                                  role="tablist"
                                >
                                  {/* <div className="col-lg-2 col-md-2 col-12 merge-tab">
                                    <div className="col-12">
                                      <p className="text-center title-cpu">
                                        Shared CPU
                                      </p>
                                    </div>
                                    <div className="col-12">
                                      <li
                                        className="nav-item text-center d-flex justify-content-center w-100"
                                        role="presentation"
                                      >
                                        <button
                                          className="nav-link w-100"
                                          id="basic-tab"
                                          data-bs-toggle="tab"
                                          data-bs-target="#basic-tab-pane"
                                          type="button"
                                          role="tab"
                                          aria-controls="basic-tab-pane"
                                          aria-selected="true"
                                        >
                                          Basic
                                        </button>
                                      </li>
                                    </div>
                                  </div>

                                  <div className="col-lg-9 col-md-9 col-12 merge-tab">
                                    <div className="col-12">
                                      <p className="text-center title-cpu">
                                        Dedicated CPU
                                      </p>
                                    </div>
                                    <div className="col-12 d-flex flex-wrap justify-content-between my-cpu-tab">
                                      <li
                                        className="nav-item"
                                        role="presentation"
                                      >
                                        <button
                                          className="nav-link w-100"
                                          id="general-tab"
                                          data-bs-toggle="tab"
                                          data-bs-target="#general-tab-pane"
                                          type="button"
                                          role="tab"
                                          aria-controls="general-tab-pane"
                                          aria-selected="false"
                                        >
                                          General Purpose
                                        </button>
                                      </li>
                                      <li
                                        className="nav-item"
                                        role="presentation"
                                      >
                                        <button
                                          className="nav-link w-100"
                                          id="cpu-tab"
                                          data-bs-toggle="tab"
                                          data-bs-target="#cpu-tab-pane"
                                          type="button"
                                          role="tab"
                                          aria-controls="cpu-tab-pane"
                                          aria-selected="false"
                                        >
                                          CPU-Optimized
                                        </button>
                                      </li>
                                      <li
                                        className="nav-item"
                                        role="presentation"
                                      >
                                        <button
                                          className="nav-link w-100"
                                          id="memory-tab"
                                          data-bs-toggle="tab"
                                          data-bs-target="#memory-tab-pane"
                                          type="button"
                                          role="tab"
                                          aria-controls="memory-tab-pane"
                                          aria-selected="false"
                                        >
                                          Memory-Optimized
                                        </button>
                                      </li>
                                      <li
                                        className="nav-item"
                                        role="presentation"
                                      >
                                        <button
                                          className="nav-link w-100"
                                          id="storage-tab"
                                          data-bs-toggle="tab"
                                          data-bs-target="#storage-tab-pane"
                                          type="button"
                                          role="tab"
                                          aria-controls="storage-tab-pane"
                                          aria-selected="false"
                                        >
                                          Storage-Optimized
                                        </button>
                                      </li>
                                    </div>
                                  </div> */}
                                </ul>

                                <div
                                  className="tab-content"
                                  id="OutlineContent"
                                >
                                  <div
                                    className="tab-pane fade show active"
                                    id="basic-tab-pane"
                                    role="tabpanel"
                                    aria-labelledby="basic-tab"
                                    tabIndex={0}
                                  >
                                    <p className="tabs-disabled">
                                      Basic virtual machines with a mix of
                                      memory and compute resources. Best for
                                      small projects that can handle variable
                                      levels of CPU performance, like blogs, web
                                      apps and dev/test environments.
                                    </p>

                                    <h5 className="mb-2 mt-5">CPU Options</h5>

                                    <div className="row simple-pricing-container app-arrow">
                                      {plans.map((plan) => (
                                        <div
                                          key={plan.id}
                                          className={`col-md-6 col-xl-4 p-3`}
                                          onClick={() => {
                                            setSelectedPlanId(plan.id);
                                            setFormData((prev) => ({
                                              ...prev,
                                              vms_id: plan.id,
                                            }));
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
                                          <div
                                            className={`simple-pricing-card card ${
                                              selectedPlanId === plan.id
                                                ? "border border-primary shadow-lg"
                                                : ""
                                            }`}
                                          >
                                            <input
                                              type="hidden"
                                              name="vms_id"
                                            />
                                            <div className="card-body">
                                              <div className="simple-price-body">
                                                <div
                                                  className={`simple-price-value text-center b-r-5 d-block ${
                                                    selectedPlanId === plan.id
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
                                                  <p>
                                                    $
                                                    {(plan.price / 720).toFixed(
                                                      3
                                                    )}
                                                    /hour
                                                  </p>
                                                </div>

                                                <div className="simple-price-content">
                                                  <div className="d-flex">
                                                    <span>
                                                      <i
                                                        className={`ph-bold ph-check bg-primary p-1 b-r-100 f-s-12 ${
                                                          selectedPlanId ===
                                                          plan.id
                                                            ? "bg-primary text-white"
                                                            : "bg-light-dark"
                                                        }`}
                                                      />
                                                    </span>
                                                    <p className="ms-2 mb-0">
                                                      {plan.ram} GB / {plan.cpu}{" "}
                                                      CPU
                                                    </p>
                                                  </div>
                                                  <div className="app-divider-v" />
                                                  <div className="d-flex">
                                                    <span>
                                                      <i
                                                        className={`ph-bold ph-check bg-primary p-1 b-r-100 f-s-12 ${
                                                          selectedPlanId ===
                                                          plan.id
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
                                                <div className="app-divider-v" />
                                                  <div className="d-flex">
                                                    <span>
                                                      <i
                                                        className={`ph-bold ph-check bg-primary p-1 b-r-100 f-s-12 ${
                                                          selectedPlanId ===
                                                          plan.id
                                                            ? "bg-primary text-white"
                                                            : "bg-light-dark"
                                                        }`}
                                                      />
                                                    </span>
                                                    <p className="ms-2 mb-0">
                                                     Bandwidth: Unlimited
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                      ))}
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

                  <div className="card">
                    <div className="card-body p-0">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="card security-card-content">
                            <div className="card-header pb-0">
                              <h5>Add ons </h5>
                            </div>
                            <div className="card-body ">
                              <div className="row ">
                                <div className="col-12">
                                  <div className="form-check d-flex align-items-center gap-3">
                                    <div>
                                      <input
                                        className="form-check-input"
                                        id="invalidCheck2"
                                        type="checkbox"
                                        checked={formData.auto_backups}
                                        onChange={(e) =>
                                          setFormData((prev) => ({
                                            ...prev,
                                            auto_backups: e.target.checked,
                                          }))
                                        }
                                      />
                                    </div>
                                    <div>
                                      <label
                                        className="form-check-label f-s-18"
                                        htmlFor="invalidCheck2"
                                      >
                                        Enable automated backup plan
                                      </label>
                                      <p className="form-check-label-p">
                                        Ensure the safety of your valuable data
                                        with the peace of mind that comes from
                                        automatic server backups – your fortress
                                        against unexpected data loss. Embrace
                                        reliability, effortlessly safeguard your
                                        work, and focus on what truly matters,
                                        while we handle the protection of your
                                        critical information with seamless
                                        automated backups{" "}
                                        <strong className="f-s-19 text-primary">
                                          $5/month
                                        </strong>
                                      </p>
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

                <div className="col-xl-4 col-lg-12 col-md-12">
                  <div className="row">
                    <div className="col-12" ref={summaryRef} id="summaryCard">
                      <div className="card">
                        <div className="card-header">
                          <h4>Deploy Summary</h4>
                        </div>
                        <div className="card-body">
                          <form className="app-form row g-3">
                              <div className="col-12">
                              <label className="form-label" htmlFor="bandwidth">
                                Project
                              </label>
                              <select
                                name="project"
                                className="form-select"
                                required
                                onChange={(e) =>
                                  setSelectedProjectId(e.target.value)
                                }
                              >
                                <option>Select Project</option>
                                {projects.map((project) => (
                                  <option key={project.id} value={project.id}>
                                    {project.name}
                                  </option>
                                ))}
                              </select>
                              <div className="invalid-feedback">
                                Please select a valid version.
                              </div>
                            </div>
                            <div className="col-12">
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
                                required
                                checked={formData.hostname}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    hostname: e.target.value,
                                  }))
                                }
                              />
                            </div>

                            <div className="col-12">
                              <label className="form-label" htmlFor="bandwidth">
                                Description
                              </label>
                              <input
                                id="descriptionInput"
                                type="text"
                                className="form-control"
                                placeholder="Enter Description"
                                required
                                checked={formData.bandwidth}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    bandwidth: e.target.value,
                                  }))
                                }
                              />
                              <div className="invalid-feedback">
                                Please select a valid version.
                              </div>
                            </div>

                            <div className="col-12">
                              <label
                                className="form-label"
                                htmlFor="billingCycle"
                              >
                                billingCycle
                              </label>
                              <select
                                name="billingCycle"
                                className="form-select"
                                required
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    billingCycle: e.target.value,
                                  }))
                                }
                              >
                                <option value="">Select billingCycle</option>
                                <option value="hourlyBilling">
                                  Hourly Billing
                                </option>
                                <option value="monthlyBilling">
                                  Monthly Billing
                                </option>
                              </select>
                              <div className="invalid-feedback">
                                Please select a valid version.
                              </div>
                            </div>

                            <div className="col-12">
                              <label className="form-label" htmlFor="sshKeys">
                                SSH Keys (optional)
                              </label>

                              {/* Conditional warning if no keys */}
                              {!loadingKeys && sshKeys.length === 0 && (
                                <div
                                  className="alert alert-warning d-flex align-items-center py-2 px-3 small"
                                  role="alert"
                                >
                                  <i className="ph ph-warning-circle me-2" />
                                  No SSH keys found. Please add SSH keys in
                                  Solus first.
                                </div>
                              )}

                              {/* Refresh button */}
                              <button
                                type="button"
                                className="btn btn-outline-primary d-flex align-items-center gap-1 mb-2"
                                onClick={fetchSSHKeys}
                              >
                                <i className="ph ph-arrows-clockwise" />
                                Refresh SSH Keys
                              </button>

                              {/* Multi-select using react-select */}
                              <div className="react-select-container">
                                <Select
                                  isMulti
                                  options={sshKeys.map((key) => ({
                                    value: key.id,
                                    label: key.name,
                                  }))}
                                  value={selectedSSHKeys}
                                  onChange={(selectedOptions) => {
                                    setSelectedSSHKeys(selectedOptions); // Update UI state
                                    setFormData((prev) => ({
                                      ...prev,
                                      ssh_Keys: selectedOptions
                                        ? selectedOptions.map(
                                            (option) => option.value
                                          )
                                        : [], // Use correct key name
                                    }));
                                  }}
                                  placeholder="Select SSH Keys..."
                                  classNamePrefix="react-select"
                                  isDisabled={sshKeys.length === 0}
                                />
                              </div>
                            </div>
                          </form>
                                  {calculatedPrice && (
                                    <div className="mt-3 text-start">
                                      <p><strong>Base Price:</strong> ${calculatedPrice.basePrice}</p>
                                      {calculatedPrice.autoBackup && (
                                        <p><strong>Backup Cost:</strong> ${calculatedPrice.autoBackupCost}</p>
                                      )}
                                      <p><strong>Total:</strong> ${calculatedPrice.totalBeforeCycle}</p>
                                      <p><strong>Billing Cycle:</strong> {calculatedPrice.billingCycle}</p>
                                      <p><strong>Payable Amount:</strong> ${calculatedPrice.payableAmount}</p>
                                      <p><em>{calculatedPrice.note}</em></p>
                                    </div>
                                  )}
                          <hr />

                         <div className="table-responsive ps-3">
                            <div className="cart-gift text-end mt-4">
                              <button
                                type="button"
                                className="btn btn-info rounded me-2"
                                onClick={handleCalculatePrice}
                              >
                                Calculate Price
                              </button>

                              <button
                                type="button"
                                className={`btn btn-${!showdeploybutton ? 'secondary' : 'primary'} rounded`}
                                onClick={handleDeployServer}
                                disabled={!showdeploybutton}
                              >
                                 Deploy Server
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            {/* Projects end */}
          </div>

          <div
            aria-hidden="true"
            aria-labelledby="projectCardLabel"
            className="ltr dark modal fade"
            id="projectCard1"
            tabIndex={-1}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="d-flex align-items-center gap-2">
                    <h1 className="modal-title fs-5" id="projectCardLabel">
                      Create Volume{" "}
                    </h1>
                    <iconify-icon
                      icon="line-md:document-add"
                      className="f-s-22"
                      style={{ color: "#198754" }}
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
                  <div className="row align-items-center justify-content-center">
                    <div className="col-lg-5 text-center align-self-center">
                      <img
                        alt=""
                        className="img-fluid b-r-10"
                        src="../assets/images/new/cloud.png"
                      />
                    </div>
                    <div className="col-lg-6 ps-4 ">
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
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    id="addCard"
                    type="button"
                    data-bs-dismiss="modal"
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Fragment>
  );
}
export default Create;
