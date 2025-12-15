"use client";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import React, { Fragment, useState, useEffect, useRef, useMemo } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import TableControls from "@/components/datatable/TableControls";
import PaginationControls from "@/components/datatable/PaginationControls";

function Project() {
  const tableRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
  });
  const [activeTab, setActiveTab] = useState(1);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshmsg, setRefreshmsg] = useState(null);

  const [error, setError] = useState([]);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const FetchProject = async () => {
    const token = Cookies.get("accessToken");
    if (token) {
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
          const data = result.data.data;

          if(result.success == true || result.success == "true"){
            console.log(data);
            setProjects(data);
          }
        } catch (error) {
          console.error("Error fetching cloud vps plan data:", error);
          setIsLoading(false);
        }
      };
    }

      // call on first load
useEffect(() => {
  FetchProject();
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    const refreshButton = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects/refresh`,
      {
        method: "GET", // or "GET" depending on backend
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );

    const result = await res.json();
    console.log("Refresh result:", result);

    if (res.ok && result.success) {
      setRefreshmsg(`${result.message} (Fetched: ${result.data.total_fetched}, New: ${result.data.newly_added}, Updated: ${result.data.updated})`);
      await FetchProject();
      setIsLoading(false);

    } else {
      setError(result.message || "Failed to refresh projects");
      setIsLoading(false);
    }
  } catch (err) {
    console.error("Error refreshing:", err);
    setError("Something went wrong while refreshing");
  }
};


  const handleProject = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    // Example POST request (Uncomment if you have a backend to send this to)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`, // Send the token
        },
        body: JSON.stringify(formData),
      }
    );

    const result = await res.json();

    if (res.ok && result.success) {
      setSuccess(result.message);
      setFormData({ name: "" });
      window.location.reload();
    } else {
      setError(result.message);
    }
    console.log(result);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
      setRefreshmsg("");
    }, 5000); // 5000 ms = 5 seconds

    return () => clearTimeout(timer); // cleanup on re-render
  }, [success, error, refreshmsg]);

  // auto load
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  // api for delete project with popup
  const confirmDelete = (projectId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary ms-2",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Delete Project?",
        text: "Are you sure you want to delete this project? This can't be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleDelete(projectId, swalWithBootstrapButtons);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your project is safe :)",
            "error"
          );
        }
      });
  };

  // api for delete project with popup end
   const handleDelete = async (projectId, swalInstance) => {
    if (!projectId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/solus-projects/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        swalInstance
          .fire("Deleted!", "Your project has been deleted.", "success")
          .then(() => {
            window.location.reload();
          });
      } else {
        swalInstance.fire(
          "Failed!",
          result.message || "Something went wrong.",
          "error"
        );
      }

      console.log(result);
    } catch (err) {
      swalInstance.fire(
        "Error!",
        "An error occurred while deleting the project.",
        "error"
      );
      console.error(err);
    }
  };

  // for project data table
  const projectData = projects || [];
  const [projectSearch, setProjectSearch] = useState("");
  const [projectEntries, setProjectEntries] = useState(10);
  const [projectPage, setProjectPage] = useState(1);

  const filteredProjects = useMemo(() => {
    return projectData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(projectSearch.toLowerCase())
      )
    );
  }, [projectData, projectSearch]);

  const paginatedProjects = useMemo(() => {
    const start = (projectPage - 1) * projectEntries;
    return filteredProjects.slice(start, start + projectEntries);
  }, [filteredProjects, projectPage, projectEntries]);

  // for collaborative project data table

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);




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

        {/* Always rendered page content */}
        <main
          className={`page-content  ${isLoading ? "pointer-events-none" : ""}`}
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          <div className="container-fluid">
            {/* Breadcrumb start */}
            <div className="row m-1">
              <div className="col-12 merge-title p-0">
                <h4 className="main-title">Projects </h4>
                <div className="d-flex overflow-auto">
                  <div className="text-end">
                    <button
                      className="btn btn-primary h-45 icon-btn m-2"
                      data-bs-target="#projectCard2"
                      data-bs-toggle="modal"
                    >
                      <i className="iconoir-open-new-window f-s-18" /> Create
                      New Project
                    </button>
                  </div>
                  <div className="text-end">
                    <button
                      className="btn btn-primary h-45 icon-btn m-2"
                      onClick={refreshButton}
                    >
                      <i className="iconoir-refresh  f-s-18" /> Refresh Project
                    </button>
                  </div>
                </div>
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
                      <i className="ph-bold  ph-align-right f-s-18" /> My
                      Projects
                    </li>
                    {/* <li
                      className={`tab-link ${activeTab === 2 ? "active" : ""}`}
                      onClick={() => setActiveTab(2)}
                    >
                      <i className="ph-fill ph-list-bullets f-s-18" />{" "}
                      Collaborative Projects
                    </li> */}
                  </ul>
                </div>

                <div className="content-wrapper" id="card-container">
                  <div
                    className={`tabs-content ${
                      activeTab === 1 ? "active" : ""
                    }`}
                    id="tab-1"
                  >
                    <div className="card p-l-r-30 pt-3 pb-3">
                      <div className="card-body p-0">
                        {/* <div className="app-datatable-default overflow-auto">
                                                    <table
                                                        className="datatable display app-data-table default-data-table"
                                                        ref={tableRef}
                                                        id="example"
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th width={10}>Sr no.</th>
                                                                <th>Project Name</th>
                                                                <th>Members</th>
                                                                <th>Servers</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {projects.map((project, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{project.name}</td>
                                                                    <td>{project.members_count}</td>
                                                                    <td>{project.servers_count}</td>
                                                                    <td className="d-flex gap-3">
                                                                        <Link href={`/project/${project?.id}`}>
                                                                            <span className="badge text-white bg-success d-flex gap-2">
                                                                                <i className="ph-duotone ph-eye f-s-18" />{" "}
                                                                                View
                                                                            </span>
                                                                        </Link>
                                                                        <button
                                                                            onClick={() => confirmDelete(project?.id)}
                                                                            className="badge text-white bg-danger border-0 d-flex gap-2 align-items-center"
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
                          {refreshmsg && (
                            <div className="alert alert-info">
                              {refreshmsg}
                            </div>
                          )}
                          <TableControls
                            entries={projectEntries}
                            setEntries={(val) => {
                              setProjectEntries(val);
                              setProjectPage(1);
                            }}
                            search={projectSearch}
                            setSearch={(val) => {
                              setProjectSearch(val);
                              setProjectPage(1);
                            }}
                          />

                          <table
                            className="datatable display app-data-table default-data-table"
                            ref={tableRef}
                            id="project-table"
                          >
                            <thead>
                              <tr>
                                <th className="text-center">Sr no.</th>
                                <th>Project Name</th>
                                <th>Members</th>
                                <th>Server</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedProjects.length > 0 ? (
                                paginatedProjects.map((project, index) => (
                                  <tr key={project.id}>
                                    <td>
                                      {(projectPage - 1) * projectEntries +
                                        index +
                                        1}
                                    </td>
                                    <td>{project.name}</td>
                                    <td>{project.members_count}</td>
                                    <td>{project.servers_count}</td>
                                    <td className="d-flex gap-2">
                                      <Link href={`/project/${project.id}`}>
                                        <span className="badge text-white bg-success d-flex gap-2 align-items-center">
                                          <i className="ph-duotone ph-eye f-s-18" />
                                          View
                                        </span>
                                      </Link>
                                      <button
                                        onClick={() =>
                                          confirmDelete(project.id)
                                        }
                                        className="badge text-white bg-danger border-0 d-flex gap-2 align-items-center"
                                      >
                                        <i className="ph ph-trash f-s-18" />
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={5} className="text-center py-3">
                                    No projects found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>

                          <PaginationControls
                            currentPage={projectPage}
                            setCurrentPage={setProjectPage}
                            entries={projectEntries}
                            totalCount={filteredProjects.length}
                          />
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

      {/* Project Modal */}
      <div className="modal fade" id="projectCard2" aria-hidden="true">
        <div className="modal-dialog ">
          <div className="modal-content">
            <div className="modal-header">
              <div className="d-flex align-items-center gap-3">
                <h5 className="modal-title">Create Project </h5>
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

            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <form id="projectForm" onSubmit={handleProject}>
                    {success && (
                      <div className="alert alert-success">{success}</div>
                    )}
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Project Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      {error.name && (
                        <div className="text-danger small">{error.name}</div>
                      )}
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default Project;
