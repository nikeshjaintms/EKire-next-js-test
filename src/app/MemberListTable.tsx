// 'use client';

// import React, { useState } from 'react';
// import styles from '../list.module.css'; // Assuming you still want to use some local styles

// interface Member {
//     id: number;
//     name: string;
//     email: string;
//     createdAt: string;
//     status: string;
// }

// const itemsPerPage = 10;

// const MemberListTable: React.FC = () => {
//     const [members, setMembers] = useState<Member[]>([
//         { id: 1, name: 'Alice Smith', email: 'alice.smith@example.com', createdAt: 'Feb 22nd, 2024', status: 'Active' },
//         { id: 2, name: 'Bob Johnson', email: 'bob.johnson@example.com', createdAt: 'Feb 22nd, 2024', status: 'Inactive' },
//         { id: 3, name: 'Charlie Brown', email: 'charlie.brown@example.com', createdAt: 'Feb 22nd, 2024', status: 'Pending' },
//         { id: 4, name: 'Diana Lee', email: 'diana.lee@example.com', createdAt: 'Feb 22nd, 2024', status: 'Active' },
//         { id: 5, name: 'Ethan Williams', email: 'ethan.williams@example.com', createdAt: 'Feb 22nd, 2024', status: 'Active' },
//     ]);

//     const [currentPage, setCurrentPage] = useState(1);
//     const [showModal, setShowModal] = useState(false);
//     const [newMemberEmail, setNewMemberEmail] = useState('');

//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentMembers = members.slice(indexOfFirstItem, indexOfLastItem);

//     const totalPages = Math.ceil(members.length / itemsPerPage);

//     const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
//     const openModal = () => setShowModal(true);
//     const closeModal = () => setShowModal(false);

//     const handleAddMember = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!newMemberEmail.trim()) {
//             alert('Please enter an email.');
//             return;
//         }

//         const nextId = members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;

//         const newMember: Member = {
//             id: nextId,
//             email: newMemberEmail,
//             name: generateNameFromEmail(newMemberEmail),
//             createdAt: formatDate(new Date()),
//             status: 'Active',
//         };

//         setMembers((prev) => [...prev, newMember]);
//         setNewMemberEmail('');
//         closeModal();
//     };

//     const dropMember = (id: number) => {
//         setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
//     };

//     const generateNameFromEmail = (email: string): string => {
//         const username = email.split('@')[0];
//         return username.replace(/[\W_]+/g, ' ') // replace non-word characters
//             .split(' ')
//             .map(w => w.charAt(0).toUpperCase() + w.slice(1)) // capitalize
//             .join(' ');
//     };

//     const formatDate = (date: Date): string => {
//         return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//     };

//     return (

//         <div className="card equal-card ">
//             <div className="card-header ps-0">
//                 <div className='d-flex justify-content-between'>
//                     <h5>Members List</h5>
//                     <div>
//                         <button className="btn btn-primary d-flex gap-3 p-2 align-items-center" onClick={openModal}>
//                             <i className='ph-bold  ph-plus f-s-18 '></i>  Add Member
//                         </button>
//                     </div>
//                 </div>

//             </div>
//             <div className="card-body p-0">
//                 <div className={styles.container}>



//                     {/* Bootstrap Modal Structure */}
//                     <div aria-hidden="true" aria-labelledby="exampleModalLabel" className={`modal ${showModal ? 'show' : ''}`} id="exampleModal" tabIndex={-1} style={{ display: showModal ? 'block' : 'none' }}>
//                         <div className="modal-dialog">
//                             <div className="modal-content">
//                                 <div className="modal-header">
//                                     <h1 className="modal-title fs-5" id="exampleModalLabel">Add Employee</h1>
//                                     <button aria-label="Close" className="btn-close m-0" data-bs-dismiss="modal" type="button" onClick={closeModal} />
//                                 </div>
//                                 <form id="add_employee_form" onSubmit={handleAddMember}>
//                                     <div className="modal-body">
//                                         <div className="mb-3">
//                                             <label className="form-label">Email :</label>
//                                             <input
//                                                 className="form-control"
//                                                 id="email-field"
//                                                 placeholder="Email"
//                                                 required
//                                                 type="email"
//                                                 name="email"
//                                                 value={newMemberEmail}
//                                                 onChange={(e) => setNewMemberEmail(e.target.value)}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="modal-footer add">
//                                         <button className="btn btn-secondary" type="button" onClick={closeModal}>Close</button>
//                                         <button className="btn btn-primary" id="add-btn" type="submit">Add</button>
//                                     </div>
//                                 </form>

//                             </div>
//                         </div>
//                     </div>

//                     <div className={styles.dataall}>
//                         <div className="app-datatable-default overflow-auto">
//                             <table className={styles.dataTable}>
//                             <thead>
//                                 <tr>
//                                     <th>ID</th>
//                                     <th>Name</th>
//                                     <th>Email</th>
//                                     <th>Created At</th>
//                                     <th>Status</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {currentMembers.map((member) => (
//                                     <tr key={member.id}>
//                                         <td>{member.id}</td>
//                                         <td>{member.name}</td>
//                                         <td>{member.email}</td>
//                                         <td>{member.createdAt}</td>
//                                         <td>{member.status}</td>
//                                         <td>
//                                             <button className='btn remove-item-btn btn-md btn-danger-light b-r-22 d-flex gap-1' onClick={() => dropMember(member.id)}>
//                                                 <i className='ph-fill  ph-trash f-s-22'></i> Delete
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                         <div className={styles.pagination}>
//                             {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
//                                 <button
//                                     key={number}
//                                     onClick={() => paginate(number)}
//                                     className={currentPage === number ? styles.active : ''}
//                                 >
//                                     {number}
//                                 </button>
//                             ))}
//                         </div>
//                         </div>
                        

                        
//                     </div>

//                 </div>

//             </div>
//         </div>

//     );
// };

// export default MemberListTable;