// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import {
//   Users,
//   UserPlus,
//   Calendar,
//   DollarSign,
//   CreditCard,
//   FilePlus,
//   Plus,
//   Trash2,
//   Check,
//   X,
//   RefreshCw,
//   AlignCenter,
// } from "lucide-react";

// interface AdminDashboardProps {
//   currentTab: string;
// }

// export const AdminDashboard: React.FC<AdminDashboardProps> = ({
//   currentTab,
// }) => {
//   const { token, apiUrl } = useAuth();

//   // States
//   const [stats, setStats] = useState({
//     doctorsCount: 0,
//     patientsCount: 0,
//     appointmentsCount: 0,
//     totalRevenue: 0,
//     unpaidBills: 0,
//   });

//   const [doctors, setDoctors] = useState<any[]>([]);
//   const [patients, setPatients] = useState<any[]>([]);
//   const [appointments, setAppointments] = useState<any[]>([]);
//   const [bills, setBills] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Forms States
//   const [showDoctorForm, setShowDoctorForm] = useState(false);
//   const [doctorForm, setDoctorForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phoneNumber: "",
//     specialization: "",
//     department: "General Medicine",
//     qualification: "",
//     experience: 5,
//     consultationFee: 500,
//     availabilityDay: "Monday",
//     availabilitySlots: "09:00 - 13:00, 14:00 - 17:00",
//   });

//   const [showBillForm, setShowBillForm] = useState(false);
//   const [billForm, setBillForm] = useState({
//     patientId: "",
//     appointmentId: "",
//     itemDesc: "",
//     itemAmount: 0,
//     items: [] as { description: string; amount: number }[],
//     dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//       .toISOString()
//       .split("T")[0],
//   });

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const headers = { Authorization: `Bearer ${token}` };

//       // Fetch Doctors
//       const resDocs = await fetch(`${apiUrl}/doctors`, { headers });
//       const dataDocs = await resDocs.json();
//       const docsList = dataDocs.success ? dataDocs.data : [];
//       setDoctors(docsList);

//       // Fetch Patients
//       const resPatients = await fetch(`${apiUrl}/patients`, { headers });
//       const dataPatients = await resPatients.json();
//       const patientsList = dataPatients.success ? dataPatients.data : [];
//       setPatients(patientsList);

//       // Fetch Appointments
//       const resAppointments = await fetch(`${apiUrl}/appointments`, {
//         headers,
//       });
//       const dataAppointments = await resAppointments.json();
//       const apptsList = dataAppointments.success ? dataAppointments.data : [];
//       setAppointments(apptsList);

//       // Fetch Bills
//       const resBills = await fetch(`${apiUrl}/bills`, { headers });
//       const dataBills = await resBills.json();
//       const billsList = dataBills.success ? dataBills.data : [];
//       setBills(billsList);

//       // Calculate Stats
//       const revenue = billsList
//         .filter((b: any) => b.paymentStatus === "paid")
//         .reduce((sum: number, b: any) => sum + b.totalAmount, 0);

//       const unpaidCount = billsList.filter(
//         (b: any) => b.paymentStatus === "unpaid",
//       ).length;

//       setStats({
//         doctorsCount: docsList.length,
//         patientsCount: patientsList.length,
//         appointmentsCount: apptsList.length,
//         totalRevenue: revenue,
//         unpaidBills: unpaidCount,
//       });
//     } catch (err) {
//       console.error("Error loading admin dashboard data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchData();
//     }
//   }, [token, currentTab]);

//   // Doctor CRUD
//   const handleCreateDoctor = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const slotsArray = doctorForm.availabilitySlots
//         .split(",")
//         .map((s) => s.trim());
//       const payload = {
//         name: doctorForm.name,
//         email: doctorForm.email,
//         password: doctorForm.password,
//         phoneNumber: doctorForm.phoneNumber,
//         specialization: doctorForm.specialization,
//         department: doctorForm.department,
//         qualification: doctorForm.qualification,
//         experience: Number(doctorForm.experience),
//         consultationFee: Number(doctorForm.consultationFee),
//         availability: [
//           {
//             day: doctorForm.availabilityDay,
//             slots: slotsArray,
//           },
//         ],
//       };

//       const res = await fetch(`${apiUrl}/doctors`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Doctor account created successfully");
//         setShowDoctorForm(false);
//         setDoctorForm({
//           name: "",
//           email: "",
//           password: "",
//           phoneNumber: "",
//           specialization: "",
//           department: "General Medicine",
//           qualification: "",
//           experience: 5,
//           consultationFee: 500,
//           availabilityDay: "Monday",
//           availabilitySlots: "09:00 - 13:00, 14:00 - 17:00",
//         });
//         fetchData();
//       } else {
//         alert(data.message || "Failed to create doctor");
//       }
//     } catch (error) {
//       alert("Error creating doctor");
//     }
//   };

//   const handleDeleteDoctor = async (docId: string) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this doctor? All associated user credentials will be removed.",
//       )
//     )
//       return;
//     try {
//       const res = await fetch(`${apiUrl}/doctors/${docId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Doctor deleted successfully");
//         fetchData();
//       } else {
//         alert(data.message || "Failed to delete doctor");
//       }
//     } catch (err) {
//       alert("Error deleting doctor");
//     }
//   };

//   // Appointment status toggle
//   const handleUpdateAppointment = async (apptId: string, status: string) => {
//     try {
//       const res = await fetch(`${apiUrl}/appointments/${apptId}/status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         fetchData();
//       } else {
//         alert(data.message || "Failed to update appointment");
//       }
//     } catch (err) {
//       alert("Error updating status");
//     }
//   };

//   // Billing Actions
//   const handleAddBillItem = () => {
//     if (!billForm.itemDesc || billForm.itemAmount <= 0) return;
//     setBillForm({
//       ...billForm,
//       items: [
//         ...billForm.items,
//         { description: billForm.itemDesc, amount: Number(billForm.itemAmount) },
//       ],
//       itemDesc: "",
//       itemAmount: 0,
//     });
//   };

//   const handleCreateBill = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (billForm.items.length === 0) {
//       alert("Please add at least one item to the invoice");
//       return;
//     }
//     try {
//       const res = await fetch(`${apiUrl}/bills`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           patientId: billForm.patientId,
//           appointmentId: billForm.appointmentId || undefined,
//           items: billForm.items,
//           dueDate: billForm.dueDate,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Invoice generated successfully");
//         setShowBillForm(false);
//         setBillForm({
//           patientId: "",
//           appointmentId: "",
//           itemDesc: "",
//           itemAmount: 0,
//           items: [],
//           dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//             .toISOString()
//             .split("T")[0],
//         });
//         fetchData();
//       } else {
//         alert(data.message || "Failed to generate invoice");
//       }
//     } catch (err) {
//       alert("Error generating bill");
//     }
//   };

//   const handleToggleBillStatus = async (
//     billId: string,
//     currentStatus: string,
//   ) => {
//     const nextStatus = currentStatus === "paid" ? "unpaid" : "paid";
//     try {
//       const res = await fetch(`${apiUrl}/bills/${billId}/status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ paymentStatus: nextStatus }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         fetchData();
//       }
//     } catch (err) {
//       alert("Error updating payment status");
//     }
//   };

//   if (loading && doctors.length === 0) {
//     return (
//       <div className="dashboard-loading">
//         <RefreshCw className="animate-spin" size={32} color="#0284c7" />
//         <p>Loading dashboard metrics...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-content fade-in">
//       <div className="dashboard-title-row">
//         <h1>Admin Control Room</h1>
//         <button onClick={fetchData} className="btn btn-secondary btn-sm">
//           <RefreshCw size={16} />
//           <span>Refresh Data</span>
//         </button>
//       </div>

//       {currentTab === "overview" && (
//         <>
//           {/* Summary Cards */}
//           <div className="stats-grid">
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper blue">
//                 <UserPlus size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.doctorsCount}</h3>
//                 <p>Doctors On Duty</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper green">
//                 <Users size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.patientsCount}</h3>
//                 <p>Registered Patients</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper warning">
//                 <Calendar size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.appointmentsCount}</h3>
//                 <p>Appointments Booked</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper info">
//                 <DollarSign size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
//                 <p>Revenue Collected</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper danger">
//                 <CreditCard size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.unpaidBills}</h3>
//                 <p>Pending Invoices</p>
//               </div>
//             </div>
//           </div>

//           {/* Quick Schedule Overview */}
//           <div className="dashboard-layout-grid">
//             <div className="card grid-span-2">
//               <div className="card-header-row">
//                 <h3>Recent Appointments</h3>
//               </div>
//               {appointments.length === 0 ? (
//                 <p className="no-data-text">No appointments recorded yet.</p>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>Patient</th>
//                         <th>Doctor</th>
//                         <th>Date & Time</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {appointments.slice(0, 5).map((appt) => (
//                         <tr key={appt._id}>
//                           <td>{appt.patient?.user?.name || "N/A"}</td>
//                           <td>Dr. {appt.doctor?.user?.name || "N/A"}</td>
//                           <td>
//                             {new Date(appt.date).toLocaleDateString()} at{" "}
//                             {appt.timeSlot}
//                           </td>
//                           <td>
//                             <span
//                               className={`badge badge-${
//                                 appt.status === "confirmed"
//                                   ? "success"
//                                   : appt.status === "pending"
//                                     ? "warning"
//                                     : appt.status === "completed"
//                                       ? "info"
//                                       : "danger"
//                               }`}
//                             >
//                               {appt.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {currentTab === "doctors" && (
//         <div className="tab-pane-container">
//           <div className="card-header-row">
//             <h3>Medical Officers Directory</h3>
//             <button
//               onClick={() => setShowDoctorForm(!showDoctorForm)}
//               className="btn btn-primary btn-sm"
//             >
//               <Plus size={16} />
//               <span>Add Doctor Account</span>
//             </button>
//           </div>

//           {showDoctorForm && (
//             <form
//               onSubmit={handleCreateDoctor}
//               className="card inline-form-card fade-in"
//             >
//               <h4>Register New Doctor</h4>
//               <div className="form-grid-three">
//                 <div className="form-group">
//                   <label className="form-label">Full Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.name}
//                     onChange={(e) =>
//                       setDoctorForm({ ...doctorForm, name: e.target.value })
//                     }
//                     placeholder="e.g. John Watson"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Email Address</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     required
//                     value={doctorForm.email}
//                     onChange={(e) =>
//                       setDoctorForm({ ...doctorForm, email: e.target.value })
//                     }
//                     placeholder="drjohn@hospital.com"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     required
//                     value={doctorForm.password}
//                     onChange={(e) =>
//                       setDoctorForm({ ...doctorForm, password: e.target.value })
//                     }
//                     placeholder="••••••"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Phone Number</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.phoneNumber}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         phoneNumber: e.target.value,
//                       })
//                     }
//                     placeholder="9998887776"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Specialization</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.specialization}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         specialization: e.target.value,
//                       })
//                     }
//                     placeholder="e.g. Cardiology specialist"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Department</label>
//                   <select
//                     className="form-control"
//                     value={doctorForm.department}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         department: e.target.value,
//                       })
//                     }
//                   >
//                     <option value="Cardiology">Cardiology</option>
//                     <option value="Neurology">Neurology</option>
//                     <option value="Pediatrics">Pediatrics</option>
//                     <option value="General Medicine">General Medicine</option>
//                     <option value="Orthopedics">Orthopedics</option>
//                     <option value="Critical Care">Critical care</option>
//                     <option value="Dermatology">Dermatology</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Qualifications</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.qualification}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         qualification: e.target.value,
//                       })
//                     }
//                     placeholder="e.g. MBBS, MD"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Years of Experience</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     required
//                     value={doctorForm.experience}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         experience: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Consultation Fee (₹)</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     required
//                     value={doctorForm.consultationFee}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         consultationFee: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Availability Day</label>
//                   <select
//                     className="form-control"
//                     value={doctorForm.availabilityDay}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         availabilityDay: e.target.value,
//                       })
//                     }
//                   >
//                     <option value="Monday">Monday</option>
//                     <option value="Tuesday">Tuesday</option>
//                     <option value="Wednesday">Wednesday</option>
//                     <option value="Thursday">Thursday</option>
//                     <option value="Friday">Friday</option>
//                     <option value="Saturday">Saturday</option>
//                     <option value="Sunday">Sunday</option>
//                   </select>
//                 </div>
//                 <div className="form-group grid-span-2-col">
//                   <label className="form-label">Slots (comma separated)</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.availabilitySlots}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         availabilitySlots: e.target.value,
//                       })
//                     }
//                     placeholder="09:00 - 11:00, 15:00 - 17:00"
//                   />
//                 </div>
//               </div>
//               <div className="form-actions-row">
//                 <button type="submit" className="btn btn-primary">
//                   Create Doctor Profile
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowDoctorForm(false)}
//                   className="btn btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {doctors.length === 0 ? (
//             <p className="no-data-text">No doctors registered yet.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Doctor Name</th>
//                     <th>Department</th>
//                     <th>Speciality</th>
//                     <th>Qualifications</th>
//                     <th>Experience</th>
//                     <th>Fee (₹)</th>
//                     <th>Availability</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {doctors.map((doc) => (
//                     <tr key={doc._id}>
//                       <td className="strong-text">
//                         Dr. {doc.user?.name || "N/A"}
//                       </td>
//                       <td>{doc.department}</td>
//                       <td>{doc.specialization}</td>
//                       <td>{doc.qualification}</td>
//                       <td>{doc.experience} Years</td>
//                       <td>₹{doc.consultationFee}</td>
//                       <td>
//                         {doc.availability?.map((av: any, idx: number) => (
//                           <div key={idx} className="availability-slot-badge">
//                             <strong>{av.day}</strong>: {av.slots.join(", ")}
//                           </div>
//                         ))}
//                       </td>
//                       <td>
//                         <button
//                           onClick={() => handleDeleteDoctor(doc._id)}
//                           className="btn btn-danger btn-sm"
//                           title="Delete Profile"
//                         >
//                           <Trash2 size={14} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "patients" && (
//         <div className="tab-pane-container">
//           <h3>Registered Patients</h3>
//           {patients.length === 0 ? (
//             <p className="no-data-text">
//               No patients registered in the database.
//             </p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Patient Name</th>
//                     <th>Gender</th>
//                     <th>Date of Birth</th>
//                     <th>Blood Group</th>
//                     <th>Phone Number</th>
//                     <th>Address</th>
//                     <th>Joined Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {patients.map((pat) => (
//                     <tr key={pat._id}>
//                       <td className="strong-text">{pat.user?.name || "N/A"}</td>
//                       <td>{pat.gender}</td>
//                       <td>{new Date(pat.dateOfBirth).toLocaleDateString()}</td>
//                       <td className="blood-type">{pat.bloodGroup}</td>
//                       <td>{pat.user?.phoneNumber || "N/A"}</td>
//                       <td>{pat.address}</td>
//                       <td>{new Date(pat.createdAt).toLocaleDateString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "appointments" && (
//         <div className="tab-pane-container">
//           <h3>Patient Appointment Schedule</h3>
//           {appointments.length === 0 ? (
//             <p className="no-data-text">No appointments booked.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Patient</th>
//                     <th>Doctor</th>
//                     <th>Reason</th>
//                     <th>Date & Slot</th>
//                     <th>Status</th>
//                     <th>Manage</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments.map((appt) => (
//                     <tr key={appt._id}>
//                       <td className="strong-text">
//                         {appt.patient?.user?.name || "N/A"}
//                       </td>
//                       <td>
//                         Dr. {appt.doctor?.user?.name || "N/A"} (
//                         {appt.doctor?.department})
//                       </td>
//                       <td>{appt.reason}</td>
//                       <td>
//                         {new Date(appt.date).toLocaleDateString()} -{" "}
//                         {appt.timeSlot}
//                       </td>
//                       <td>
//                         <span
//                           className={`badge badge-${
//                             appt.status === "confirmed"
//                               ? "success"
//                               : appt.status === "pending"
//                                 ? "warning"
//                                 : appt.status === "completed"
//                                   ? "info"
//                                   : "danger"
//                           }`}
//                         >
//                           {appt.status}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="table-action-buttons">
//                           {appt.status === "pending" && (
//                             <button
//                               onClick={() =>
//                                 handleUpdateAppointment(appt._id, "confirmed")
//                               }
//                               className="btn btn-secondary btn-sm text-success"
//                               title="Confirm Appointment"
//                             >
//                               <Check size={14} />
//                             </button>
//                           )}
//                           {appt.status !== "cancelled" &&
//                             appt.status !== "completed" && (
//                               <button
//                                 onClick={() =>
//                                   handleUpdateAppointment(appt._id, "cancelled")
//                                 }
//                                 className="btn btn-secondary btn-sm text-danger"
//                                 title="Cancel Appointment"
//                               >
//                                 <X size={14} />
//                               </button>
//                             )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "bills" && (
//         <div className="tab-pane-container">
//           <div className="card-header-row">
//             <h3>Hospital Billings & Invoices</h3>
//             <button
//               onClick={() => setShowBillForm(!showBillForm)}
//               className="btn btn-primary btn-sm"
//             >
//               <FilePlus size={16} />
//               <span>Generate New Invoice</span>
//             </button>
//           </div>

//           {showBillForm && (
//             <form
//               onSubmit={handleCreateBill}
//               className="card inline-form-card fade-in"
//             >
//               <h4>Generate Invoice</h4>
//               <div className="form-grid-three">
//                 <div className="form-group">
//                   <label className="form-label">Select Patient</label>
//                   <select
//                     className="form-control"
//                     required
//                     value={billForm.patientId}
//                     onChange={(e) =>
//                       setBillForm({ ...billForm, patientId: e.target.value })
//                     }
//                   >
//                     <option value="">-- Select Patient --</option>
//                     {patients.map((p) => (
//                       <option key={p._id} value={p._id}>
//                         {p.user?.name} ({p.user?.phoneNumber})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Due Date</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     required
//                     value={billForm.dueDate}
//                     onChange={(e) =>
//                       setBillForm({ ...billForm, dueDate: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Add line item */}
//               <div className="billing-line-item-creator">
//                 <h5>Invoice Items</h5>
//                 <div className="line-item-fields">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Item description (e.g. Lab Test, Consultation)"
//                     value={billForm.itemDesc}
//                     onChange={(e) =>
//                       setBillForm({ ...billForm, itemDesc: e.target.value })
//                     }
//                   />
//                   <input
//                     type="number"
//                     className="form-control"
//                     placeholder="Amount (₹)"
//                     value={billForm.itemAmount || ""}
//                     onChange={(e) =>
//                       setBillForm({
//                         ...billForm,
//                         itemAmount: Number(e.target.value),
//                       })
//                     }
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddBillItem}
//                     className="btn btn-secondary"
//                   >
//                     Add Item
//                   </button>
//                 </div>

//                 {billForm.items.length > 0 && (
//                   <div className="billing-items-list">
//                     <h6>Added Items:</h6>
//                     <ul>
//                       {billForm.items.map((item, idx) => (
//                         <li key={idx}>
//                           <span>{item.description}</span>
//                           <strong>₹{item.amount}</strong>
//                         </li>
//                       ))}
//                     </ul>
//                     <div className="bill-total-calc">
//                       Total:{" "}
//                       <strong>
//                         ₹{billForm.items.reduce((s, i) => s + i.amount, 0)}
//                       </strong>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="form-actions-row">
//                 <button type="submit" className="btn btn-primary">
//                   Save and Issue Invoice
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowBillForm(false)}
//                   className="btn btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {bills.length === 0 ? (
//             <p className="no-data-text">No invoices issued.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Invoice ID</th>
//                     <th>Patient Name</th>
//                     <th>Invoice Items</th>
//                     <th>Total Amount (₹)</th>
//                     <th>Due Date</th>
//                     <th>Payment Status</th>
//                     <th>Toggle Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bills.map((bill) => (
//                     <tr key={bill._id}>
//                       <td>#{bill._id.substring(bill._id.length - 8)}</td>
//                       <td className="strong-text">
//                         {bill.patient?.user?.name || "N/A"}
//                       </td>
//                       <td>
//                         {bill.items?.map((item: any, idx: number) => (
//                           <div key={idx} className="bill-list-subitem">
//                             • {item.description}: ₹{item.amount}
//                           </div>
//                         ))}
//                       </td>
//                       <td className="strong-text">₹{bill.totalAmount}</td>
//                       <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
//                       <td>
//                         <span
//                           className={`badge badge-${bill.paymentStatus === "paid" ? "success" : "danger"}`}
//                         >
//                           {bill.paymentStatus}
//                         </span>
//                       </td>
//                       <td>
//                         <button
//                           onClick={() =>
//                             handleToggleBillStatus(bill._id, bill.paymentStatus)
//                           }
//                           className={`btn btn-sm ${bill.paymentStatus === "paid" ? "btn-secondary" : "btn-primary"}`}
//                         >
//                           Mark as{" "}
//                           {bill.paymentStatus === "paid" ? "Unpaid" : "Paid"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import {
//   Users,
//   UserPlus,
//   Calendar,
//   DollarSign,
//   CreditCard,
//   FilePlus,
//   Plus,
//   Trash2,
//   Edit2,
//   Check,
//   X,
//   RefreshCw,
// } from "lucide-react";

// interface AdminDashboardProps {
//   currentTab: string;
// }

// const emptyDoctorForm = {
//   name: "",
//   email: "",
//   password: "",
//   phoneNumber: "",
//   specialization: "",
//   department: "General Medicine",
//   qualification: "",
//   experience: 5,
//   consultationFee: 500,
//   availabilityDay: "Monday",
//   availabilitySlots: "09:00 - 13:00, 14:00 - 17:00",
// };

// export const AdminDashboard: React.FC<AdminDashboardProps> = ({
//   currentTab,
// }) => {
//   const { token, apiUrl } = useAuth();

//   // States
//   const [stats, setStats] = useState({
//     doctorsCount: 0,
//     patientsCount: 0,
//     appointmentsCount: 0,
//     totalRevenue: 0,
//     unpaidBills: 0,
//   });

//   const [doctors, setDoctors] = useState<any[]>([]);
//   const [patients, setPatients] = useState<any[]>([]);
//   const [appointments, setAppointments] = useState<any[]>([]);
//   const [bills, setBills] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Forms States
//   const [showDoctorForm, setShowDoctorForm] = useState(false);
//   const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
//   const [doctorForm, setDoctorForm] = useState(emptyDoctorForm);

//   const [showBillForm, setShowBillForm] = useState(false);
//   const [billForm, setBillForm] = useState({
//     patientId: "",
//     appointmentId: "",
//     itemDesc: "",
//     itemAmount: 0,
//     items: [] as { description: string; amount: number }[],
//     dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//       .toISOString()
//       .split("T")[0],
//   });

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const headers = { Authorization: `Bearer ${token}` };

//       // Fetch Doctors
//       const resDocs = await fetch(`${apiUrl}/doctors`, { headers });
//       const dataDocs = await resDocs.json();
//       const docsList = dataDocs.success ? dataDocs.data : [];
//       setDoctors(docsList);

//       // Fetch Patients
//       const resPatients = await fetch(`${apiUrl}/patients`, { headers });
//       const dataPatients = await resPatients.json();
//       const patientsList = dataPatients.success ? dataPatients.data : [];
//       setPatients(patientsList);

//       // Fetch Appointments
//       const resAppointments = await fetch(`${apiUrl}/appointments`, {
//         headers,
//       });
//       const dataAppointments = await resAppointments.json();
//       const apptsList = dataAppointments.success ? dataAppointments.data : [];
//       setAppointments(apptsList);

//       // Fetch Bills
//       const resBills = await fetch(`${apiUrl}/bills`, { headers });
//       const dataBills = await resBills.json();
//       const billsList = dataBills.success ? dataBills.data : [];
//       setBills(billsList);

//       // Calculate Stats
//       const revenue = billsList
//         .filter((b: any) => b.paymentStatus === "paid")
//         .reduce((sum: number, b: any) => sum + b.totalAmount, 0);

//       const unpaidCount = billsList.filter(
//         (b: any) => b.paymentStatus === "unpaid",
//       ).length;

//       setStats({
//         doctorsCount: docsList.length,
//         patientsCount: patientsList.length,
//         appointmentsCount: apptsList.length,
//         totalRevenue: revenue,
//         unpaidBills: unpaidCount,
//       });
//     } catch (err) {
//       console.error("Error loading admin dashboard data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchData();
//     }
//   }, [token, currentTab]);

//   // Doctor CRUD
//   const resetDoctorForm = () => {
//     setDoctorForm(emptyDoctorForm);
//     setEditingDoctorId(null);
//     setShowDoctorForm(false);
//   };

//   const handleOpenAddDoctor = () => {
//     setDoctorForm(emptyDoctorForm);
//     setEditingDoctorId(null);
//     setShowDoctorForm(true);
//   };

//   const handleOpenEditDoctor = (doc: any) => {
//     const firstAvailability = doc.availability?.[0];
//     setDoctorForm({
//       name: doc.user?.name || "",
//       email: doc.user?.email || "",
//       password: "", // left blank; only sent if the admin types a new one
//       phoneNumber: doc.user?.phoneNumber || "",
//       specialization: doc.specialization || "",
//       department: doc.department || "General Medicine",
//       qualification: doc.qualification || "",
//       experience: doc.experience ?? 5,
//       consultationFee: doc.consultationFee ?? 500,
//       availabilityDay: firstAvailability?.day || "Monday",
//       availabilitySlots: firstAvailability?.slots?.join(", ") || "",
//     });
//     setEditingDoctorId(doc._id);
//     setShowDoctorForm(true);
//   };

//   const handleSubmitDoctor = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const slotsArray = doctorForm.availabilitySlots
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean);

//       const isEditing = Boolean(editingDoctorId);

//       const payload: any = {
//         name: doctorForm.name,
//         email: doctorForm.email,
//         phoneNumber: doctorForm.phoneNumber,
//         specialization: doctorForm.specialization,
//         department: doctorForm.department,
//         qualification: doctorForm.qualification,
//         experience: Number(doctorForm.experience),
//         consultationFee: Number(doctorForm.consultationFee),
//         availability: [
//           {
//             day: doctorForm.availabilityDay,
//             slots: slotsArray,
//           },
//         ],
//       };

//       // Only send password if creating, or if the admin explicitly typed one while editing
//       if (!isEditing || doctorForm.password) {
//         payload.password = doctorForm.password;
//       }

//       const res = await fetch(
//         isEditing
//           ? `${apiUrl}/doctors/${editingDoctorId}`
//           : `${apiUrl}/doctors`,
//         {
//           method: isEditing ? "PUT" : "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         },
//       );
//       const data = await res.json();
//       if (data.success) {
//         alert(
//           isEditing
//             ? "Doctor profile updated successfully"
//             : "Doctor account created successfully",
//         );
//         resetDoctorForm();
//         fetchData();
//       } else {
//         alert(
//           data.message ||
//             (isEditing ? "Failed to update doctor" : "Failed to create doctor"),
//         );
//       }
//     } catch (error) {
//       alert(
//         editingDoctorId ? "Error updating doctor" : "Error creating doctor",
//       );
//     }
//   };

//   const handleDeleteDoctor = async (docId: string) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this doctor? All associated user credentials will be removed.",
//       )
//     )
//       return;
//     try {
//       const res = await fetch(`${apiUrl}/doctors/${docId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Doctor deleted successfully");
//         fetchData();
//       } else {
//         alert(data.message || "Failed to delete doctor");
//       }
//     } catch (err) {
//       alert("Error deleting doctor");
//     }
//   };

//   // Appointment status toggle
//   const handleUpdateAppointment = async (apptId: string, status: string) => {
//     try {
//       const res = await fetch(`${apiUrl}/appointments/${apptId}/status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         fetchData();
//       } else {
//         alert(data.message || "Failed to update appointment");
//       }
//     } catch (err) {
//       alert("Error updating status");
//     }
//   };

//   // Billing Actions
//   const handleAddBillItem = () => {
//     if (!billForm.itemDesc || billForm.itemAmount <= 0) return;
//     setBillForm({
//       ...billForm,
//       items: [
//         ...billForm.items,
//         { description: billForm.itemDesc, amount: Number(billForm.itemAmount) },
//       ],
//       itemDesc: "",
//       itemAmount: 0,
//     });
//   };

//   const handleCreateBill = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (billForm.items.length === 0) {
//       alert("Please add at least one item to the invoice");
//       return;
//     }
//     try {
//       const res = await fetch(`${apiUrl}/bills`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           patientId: billForm.patientId,
//           appointmentId: billForm.appointmentId || undefined,
//           items: billForm.items,
//           dueDate: billForm.dueDate,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Invoice generated successfully");
//         setShowBillForm(false);
//         setBillForm({
//           patientId: "",
//           appointmentId: "",
//           itemDesc: "",
//           itemAmount: 0,
//           items: [],
//           dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//             .toISOString()
//             .split("T")[0],
//         });
//         fetchData();
//       } else {
//         alert(data.message || "Failed to generate invoice");
//       }
//     } catch (err) {
//       alert("Error generating bill");
//     }
//   };

//   const handleToggleBillStatus = async (
//     billId: string,
//     currentStatus: string,
//   ) => {
//     const nextStatus = currentStatus === "paid" ? "unpaid" : "paid";
//     try {
//       const res = await fetch(`${apiUrl}/bills/${billId}/status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ paymentStatus: nextStatus }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         fetchData();
//       }
//     } catch (err) {
//       alert("Error updating payment status");
//     }
//   };

//   if (loading && doctors.length === 0) {
//     return (
//       <div className="dashboard-loading">
//         <RefreshCw className="animate-spin" size={32} color="#0284c7" />
//         <p>Loading dashboard metrics...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-content fade-in">
//       <div className="dashboard-title-row">
//         <h1>Admin Control Room</h1>
//         <button onClick={fetchData} className="btn btn-secondary btn-sm">
//           <RefreshCw size={16} />
//           <span>Refresh Data</span>
//         </button>
//       </div>

//       {currentTab === "overview" && (
//         <>
//           {/* Summary Cards */}
//           <div className="stats-grid">
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper blue">
//                 <UserPlus size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.doctorsCount}</h3>
//                 <p>Doctors On Duty</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper green">
//                 <Users size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.patientsCount}</h3>
//                 <p>Registered Patients</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper warning">
//                 <Calendar size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.appointmentsCount}</h3>
//                 <p>Appointments Booked</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper info">
//                 <DollarSign size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
//                 <p>Revenue Collected</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper danger">
//                 <CreditCard size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.unpaidBills}</h3>
//                 <p>Pending Invoices</p>
//               </div>
//             </div>
//           </div>

//           {/* Quick Schedule Overview */}
//           <div className="dashboard-layout-grid">
//             <div className="card grid-span-2">
//               <div className="card-header-row">
//                 <h3>Recent Appointments</h3>
//               </div>
//               {appointments.length === 0 ? (
//                 <p className="no-data-text">No appointments recorded yet.</p>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>Patient</th>
//                         <th>Doctor</th>
//                         <th>Date & Time</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {appointments.slice(0, 5).map((appt) => (
//                         <tr key={appt._id}>
//                           <td>{appt.patient?.user?.name || "N/A"}</td>
//                           <td>Dr. {appt.doctor?.user?.name || "N/A"}</td>
//                           <td>
//                             {new Date(appt.date).toLocaleDateString()} at{" "}
//                             {appt.timeSlot}
//                           </td>
//                           <td>
//                             <span
//                               className={`badge badge-${
//                                 appt.status === "confirmed"
//                                   ? "success"
//                                   : appt.status === "pending"
//                                     ? "warning"
//                                     : appt.status === "completed"
//                                       ? "info"
//                                       : "danger"
//                               }`}
//                             >
//                               {appt.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {currentTab === "doctors" && (
//         <div className="tab-pane-container">
//           <div className="card-header-row">
//             <h3>Medical Officers Directory</h3>
//             <button
//               onClick={() =>
//                 showDoctorForm ? resetDoctorForm() : handleOpenAddDoctor()
//               }
//               className="btn btn-primary btn-sm"
//             >
//               <Plus size={16} />
//               <span>Add Doctor Account</span>
//             </button>
//           </div>

//           {showDoctorForm && (
//             <form
//               onSubmit={handleSubmitDoctor}
//               className="card inline-form-card fade-in"
//             >
//               <h4>
//                 {editingDoctorId
//                   ? "Edit Doctor Profile"
//                   : "Register New Doctor"}
//               </h4>
//               <div className="form-grid-three">
//                 <div className="form-group">
//                   <label className="form-label">Full Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.name}
//                     onChange={(e) =>
//                       setDoctorForm({ ...doctorForm, name: e.target.value })
//                     }
//                     placeholder="e.g. John Watson"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Email Address</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     required
//                     value={doctorForm.email}
//                     onChange={(e) =>
//                       setDoctorForm({ ...doctorForm, email: e.target.value })
//                     }
//                     placeholder="drjohn@hospital.com"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">
//                     Password{" "}
//                     {editingDoctorId && (
//                       <span
//                         style={{ fontWeight: 400, color: "var(--text-muted)" }}
//                       >
//                         (leave blank to keep current)
//                       </span>
//                     )}
//                   </label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     required={!editingDoctorId}
//                     value={doctorForm.password}
//                     onChange={(e) =>
//                       setDoctorForm({ ...doctorForm, password: e.target.value })
//                     }
//                     placeholder="••••••"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Phone Number</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.phoneNumber}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         phoneNumber: e.target.value,
//                       })
//                     }
//                     placeholder="9998887776"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Specialization</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.specialization}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         specialization: e.target.value,
//                       })
//                     }
//                     placeholder="e.g. Cardiology specialist"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Department</label>
//                   <select
//                     className="form-control"
//                     value={doctorForm.department}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         department: e.target.value,
//                       })
//                     }
//                   >
//                     <option value="Cardiology">Cardiology</option>
//                     <option value="Neurology">Neurology</option>
//                     <option value="Pediatrics">Pediatrics</option>
//                     <option value="General Medicine">General Medicine</option>
//                     <option value="Orthopedics">Orthopedics</option>
//                     <option value="Critical Care">Critical care</option>
//                     <option value="Dermatology">Dermatology</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Qualifications</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.qualification}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         qualification: e.target.value,
//                       })
//                     }
//                     placeholder="e.g. MBBS, MD"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Years of Experience</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     required
//                     value={doctorForm.experience}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         experience: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Consultation Fee (₹)</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     required
//                     value={doctorForm.consultationFee}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         consultationFee: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Availability Day</label>
//                   <select
//                     className="form-control"
//                     value={doctorForm.availabilityDay}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         availabilityDay: e.target.value,
//                       })
//                     }
//                   >
//                     <option value="Monday">Monday</option>
//                     <option value="Tuesday">Tuesday</option>
//                     <option value="Wednesday">Wednesday</option>
//                     <option value="Thursday">Thursday</option>
//                     <option value="Friday">Friday</option>
//                     <option value="Saturday">Saturday</option>
//                     <option value="Sunday">Sunday</option>
//                   </select>
//                 </div>
//                 <div className="form-group grid-span-2-col">
//                   <label className="form-label">Slots (comma separated)</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.availabilitySlots}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         availabilitySlots: e.target.value,
//                       })
//                     }
//                     placeholder="09:00 - 11:00, 15:00 - 17:00"
//                   />
//                 </div>
//               </div>
//               <div className="form-actions-row">
//                 <button type="submit" className="btn btn-primary">
//                   {editingDoctorId ? "Save Changes" : "Create Doctor Profile"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetDoctorForm}
//                   className="btn btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {doctors.length === 0 ? (
//             <p className="no-data-text">No doctors registered yet.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Doctor Name</th>
//                     <th>Department</th>
//                     <th>Speciality</th>
//                     <th>Qualifications</th>
//                     <th>Experience</th>
//                     <th>Fee (₹)</th>
//                     <th>Availability</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {doctors.map((doc) => (
//                     <tr key={doc._id}>
//                       <td className="strong-text">
//                         Dr. {doc.user?.name || "N/A"}
//                       </td>
//                       <td>{doc.department}</td>
//                       <td>{doc.specialization}</td>
//                       <td>{doc.qualification}</td>
//                       <td>{doc.experience} Years</td>
//                       <td>₹{doc.consultationFee}</td>
//                       <td>
//                         {doc.availability?.map((av: any, idx: number) => (
//                           <div key={idx} className="availability-slot-badge">
//                             <strong>{av.day}</strong>: {av.slots.join(", ")}
//                           </div>
//                         ))}
//                       </td>
//                       <td>
//                         <div className="table-action-buttons">
//                           <button
//                             onClick={() => handleOpenEditDoctor(doc)}
//                             className="btn btn-secondary btn-sm"
//                             title="Edit Profile"
//                           >
//                             <Edit2 size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteDoctor(doc._id)}
//                             className="btn btn-danger btn-sm"
//                             title="Delete Profile"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "patients" && (
//         <div className="tab-pane-container">
//           <h3>Registered Patients</h3>
//           {patients.length === 0 ? (
//             <p className="no-data-text">
//               No patients registered in the database.
//             </p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Patient Name</th>
//                     <th>Phone Number</th>
//                     <th>Address</th>
//                     <th>Joined Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {patients.map((pat) => (
//                     <tr key={pat._id}>
//                       <td className="strong-text">{pat.user?.name || "N/A"}</td>
//                       <td>{pat.user?.phoneNumber || "N/A"}</td>
//                       <td>{pat.address}</td>
//                       <td>{new Date(pat.createdAt).toLocaleDateString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "appointments" && (
//         <div className="tab-pane-container">
//           <h3>Patient Appointment Schedule</h3>
//           {appointments.length === 0 ? (
//             <p className="no-data-text">No appointments booked.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Patient</th>
//                     <th>Doctor</th>
//                     <th>Reason</th>
//                     <th>Date & Slot</th>
//                     <th>Status</th>
//                     <th>Manage</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments.map((appt) => (
//                     <tr key={appt._id}>
//                       <td className="strong-text">
//                         {appt.patient?.user?.name || "N/A"}
//                       </td>
//                       <td>
//                         Dr. {appt.doctor?.user?.name || "N/A"} (
//                         {appt.doctor?.department})
//                       </td>
//                       <td>{appt.reason}</td>
//                       <td>
//                         {new Date(appt.date).toLocaleDateString()} -{" "}
//                         {appt.timeSlot}
//                       </td>
//                       <td>
//                         <span
//                           className={`badge badge-${
//                             appt.status === "confirmed"
//                               ? "success"
//                               : appt.status === "pending"
//                                 ? "warning"
//                                 : appt.status === "completed"
//                                   ? "info"
//                                   : "danger"
//                           }`}
//                         >
//                           {appt.status}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="table-action-buttons">
//                           {appt.status === "pending" && (
//                             <button
//                               onClick={() =>
//                                 handleUpdateAppointment(appt._id, "confirmed")
//                               }
//                               className="btn btn-secondary btn-sm text-success"
//                               title="Confirm Appointment"
//                             >
//                               <Check size={14} />
//                             </button>
//                           )}
//                           {appt.status !== "cancelled" &&
//                             appt.status !== "completed" && (
//                               <button
//                                 onClick={() =>
//                                   handleUpdateAppointment(appt._id, "cancelled")
//                                 }
//                                 className="btn btn-secondary btn-sm text-danger"
//                                 title="Cancel Appointment"
//                               >
//                                 <X size={14} />
//                               </button>
//                             )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "bills" && (
//         <div className="tab-pane-container">
//           <div className="card-header-row">
//             <h3>Hospital Billings & Invoices</h3>
//             <button
//               onClick={() => setShowBillForm(!showBillForm)}
//               className="btn btn-primary btn-sm"
//             >
//               <FilePlus size={16} />
//               <span>Generate New Invoice</span>
//             </button>
//           </div>

//           {showBillForm && (
//             <form
//               onSubmit={handleCreateBill}
//               className="card inline-form-card fade-in"
//             >
//               <h4>Generate Invoice</h4>
//               <div className="form-grid-three">
//                 <div className="form-group">
//                   <label className="form-label">Select Patient</label>
//                   <select
//                     className="form-control"
//                     required
//                     value={billForm.patientId}
//                     onChange={(e) =>
//                       setBillForm({ ...billForm, patientId: e.target.value })
//                     }
//                   >
//                     <option value="">-- Select Patient --</option>
//                     {patients.map((p) => (
//                       <option key={p._id} value={p._id}>
//                         {p.user?.name} ({p.user?.phoneNumber})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Due Date</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     required
//                     value={billForm.dueDate}
//                     onChange={(e) =>
//                       setBillForm({ ...billForm, dueDate: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Add line item */}
//               <div className="billing-line-item-creator">
//                 <h5>Invoice Items</h5>
//                 <div className="line-item-fields">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Item description (e.g. Lab Test, Consultation)"
//                     value={billForm.itemDesc}
//                     onChange={(e) =>
//                       setBillForm({ ...billForm, itemDesc: e.target.value })
//                     }
//                   />
//                   <input
//                     type="number"
//                     className="form-control"
//                     placeholder="Amount (₹)"
//                     value={billForm.itemAmount || ""}
//                     onChange={(e) =>
//                       setBillForm({
//                         ...billForm,
//                         itemAmount: Number(e.target.value),
//                       })
//                     }
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddBillItem}
//                     className="btn btn-secondary"
//                   >
//                     Add Item
//                   </button>
//                 </div>

//                 {billForm.items.length > 0 && (
//                   <div className="billing-items-list">
//                     <h6>Added Items:</h6>
//                     <ul>
//                       {billForm.items.map((item, idx) => (
//                         <li key={idx}>
//                           <span>{item.description}</span>
//                           <strong>₹{item.amount}</strong>
//                         </li>
//                       ))}
//                     </ul>
//                     <div className="bill-total-calc">
//                       Total:{" "}
//                       <strong>
//                         ₹{billForm.items.reduce((s, i) => s + i.amount, 0)}
//                       </strong>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="form-actions-row">
//                 <button type="submit" className="btn btn-primary">
//                   Save and Issue Invoice
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowBillForm(false)}
//                   className="btn btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {bills.length === 0 ? (
//             <p className="no-data-text">No invoices issued.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Invoice ID</th>
//                     <th>Patient Name</th>
//                     <th>Invoice Items</th>
//                     <th>Total Amount (₹)</th>
//                     <th>Due Date</th>
//                     <th>Payment Status</th>
//                     <th>Toggle Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bills.map((bill) => (
//                     <tr key={bill._id}>
//                       <td>#{bill._id.substring(bill._id.length - 8)}</td>
//                       <td className="strong-text">
//                         {bill.patient?.user?.name || "N/A"}
//                       </td>
//                       <td>
//                         {bill.items?.map((item: any, idx: number) => (
//                           <div key={idx} className="bill-list-subitem">
//                             • {item.description}: ₹{item.amount}
//                           </div>
//                         ))}
//                       </td>
//                       <td className="strong-text">₹{bill.totalAmount}</td>
//                       <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
//                       <td>
//                         <span
//                           className={`badge badge-${bill.paymentStatus === "paid" ? "success" : "danger"}`}
//                         >
//                           {bill.paymentStatus}
//                         </span>
//                       </td>
//                       <td>
//                         <button
//                           onClick={() =>
//                             handleToggleBillStatus(bill._id, bill.paymentStatus)
//                           }
//                           className={`btn btn-sm ${bill.paymentStatus === "paid" ? "btn-secondary" : "btn-primary"}`}
//                         >
//                           Mark as{" "}
//                           {bill.paymentStatus === "paid" ? "Unpaid" : "Paid"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import {
//   Users,
//   UserPlus,
//   Calendar,
//   DollarSign,
//   CreditCard,
//   FilePlus,
//   Plus,
//   Trash2,
//   Edit2,
//   Check,
//   X,
//   RefreshCw,
// } from "lucide-react";

// interface AdminDashboardProps {
//   currentTab: string;
// }

// const emptyDoctorForm = {
//   name: "",
//   email: "",
//   password: "",
//   phoneNumber: "",
//   specialization: "",
//   department: "General Medicine",
//   qualification: "",
//   experience: 5,
//   consultationFee: 500,
//   availabilityDay: "Mon",
//   availabilitySlots: "09:00 - 13:00, 14:00 - 17:00",
// };

// const emptyPatientForm = {
//   name: "",
//   phoneNumber: "",
//   address: "",
// };

// export const AdminDashboard: React.FC<AdminDashboardProps> = ({
//   currentTab,
// }) => {
//   const { token, apiUrl } = useAuth();

//   // States
//   const [stats, setStats] = useState({
//     doctorsCount: 0,
//     patientsCount: 0,
//     appointmentsCount: 0,
//     totalRevenue: 0,
//     unpaidBills: 0,
//   });

//   const [doctors, setDoctors] = useState<any[]>([]);
//   const [patients, setPatients] = useState<any[]>([]);
//   const [appointments, setAppointments] = useState<any[]>([]);
//   const [bills, setBills] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Forms States
//   const [showDoctorForm, setShowDoctorForm] = useState(false);
//   const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
//   const [doctorForm, setDoctorForm] = useState(emptyDoctorForm);

//   const [showPatientForm, setShowPatientForm] = useState(false);
//   const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
//   const [patientForm, setPatientForm] = useState(emptyPatientForm);

//   const [showBillForm, setShowBillForm] = useState(false);
//   const [billForm, setBillForm] = useState({
//     patientId: "",
//     appointmentId: "",
//     itemDesc: "",
//     itemAmount: 0,
//     items: [] as { description: string; amount: number }[],
//     dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//       .toISOString()
//       .split("T")[0],
//   });

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const headers = { Authorization: `Bearer ${token}` };

//       // Fetch Doctors
//       const resDocs = await fetch(`${apiUrl}/doctors`, { headers });
//       const dataDocs = await resDocs.json();
//       const docsList = dataDocs.success ? dataDocs.data : [];
//       setDoctors(docsList);

//       // Fetch Patients
//       const resPatients = await fetch(`${apiUrl}/patients`, { headers });
//       const dataPatients = await resPatients.json();
//       const patientsList = dataPatients.success ? dataPatients.data : [];
//       setPatients(patientsList);

//       // Fetch Appointments
//       const resAppointments = await fetch(`${apiUrl}/appointments`, {
//         headers,
//       });
//       const dataAppointments = await resAppointments.json();
//       const apptsList = dataAppointments.success ? dataAppointments.data : [];
//       setAppointments(apptsList);

//       // Fetch Bills
//       const resBills = await fetch(`${apiUrl}/bills`, { headers });
//       const dataBills = await resBills.json();
//       const billsList = dataBills.success ? dataBills.data : [];
//       setBills(billsList);

//       // Calculate Stats
//       const revenue = billsList
//         .filter((b: any) => b.paymentStatus === "paid")
//         .reduce((sum: number, b: any) => sum + b.totalAmount, 0);

//       const unpaidCount = billsList.filter(
//         (b: any) => b.paymentStatus === "unpaid",
//       ).length;

//       setStats({
//         doctorsCount: docsList.length,
//         patientsCount: patientsList.length,
//         appointmentsCount: apptsList.length,
//         totalRevenue: revenue,
//         unpaidBills: unpaidCount,
//       });
//     } catch (err) {
//       console.error("Error loading admin dashboard data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchData();
//     }
//   }, [token, currentTab]);

//   // Doctor CRUD
//   const resetDoctorForm = () => {
//     setDoctorForm(emptyDoctorForm);
//     setEditingDoctorId(null);
//     setShowDoctorForm(false);
//   };

//   const handleOpenAddDoctor = () => {
//     setDoctorForm(emptyDoctorForm);
//     setEditingDoctorId(null);
//     setShowDoctorForm(true);
//   };

//   const handleOpenEditDoctor = (doc: any) => {
//     const firstAvailability = doc.availability?.[0];
//     setDoctorForm({
//       name: doc.user?.name || "",
//       email: doc.user?.email || "",
//       password: "", // left blank; only sent if the admin types a new one
//       phoneNumber: doc.user?.phoneNumber || "",
//       specialization: doc.specialization || "",
//       department: doc.department || "General Medicine",
//       qualification: doc.qualification || "",
//       experience: doc.experience ?? 5,
//       consultationFee: doc.consultationFee ?? 500,
//       availabilityDay: firstAvailability?.day || "Mon",
//       availabilitySlots: firstAvailability?.slots?.join(", ") || "",
//     });
//     setEditingDoctorId(doc._id);
//     setShowDoctorForm(true);
//   };

//   const handleSubmitDoctor = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const slotsArray = doctorForm.availabilitySlots
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean);

//       const isEditing = Boolean(editingDoctorId);

//       const payload: any = {
//         name: doctorForm.name,
//         email: doctorForm.email,
//         phoneNumber: doctorForm.phoneNumber,
//         specialization: doctorForm.specialization,
//         department: doctorForm.department,
//         qualification: doctorForm.qualification,
//         experience: Number(doctorForm.experience),
//         consultationFee: Number(doctorForm.consultationFee),
//         availability: [
//           {
//             day: doctorForm.availabilityDay,
//             slots: slotsArray,
//           },
//         ],
//       };

//       // Only send password if creating, or if the admin explicitly typed one while editing
//       if (!isEditing || doctorForm.password) {
//         payload.password = doctorForm.password;
//       }

//       const res = await fetch(
//         isEditing
//           ? `${apiUrl}/doctors/${editingDoctorId}`
//           : `${apiUrl}/doctors`,
//         {
//           method: isEditing ? "PUT" : "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         },
//       );
//       const data = await res.json();
//       if (data.success) {
//         alert(
//           isEditing
//             ? "Doctor profile updated successfully"
//             : "Doctor account created successfully",
//         );
//         resetDoctorForm();
//         fetchData();
//       } else {
//         alert(
//           data.message ||
//             (isEditing ? "Failed to update doctor" : "Failed to create doctor"),
//         );
//       }
//     } catch (error) {
//       alert(
//         editingDoctorId ? "Error updating doctor" : "Error creating doctor",
//       );
//     }
//   };

//   const handleDeleteDoctor = async (docId: string) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this doctor? All associated user credentials will be removed.",
//       )
//     )
//       return;
//     try {
//       const res = await fetch(`${apiUrl}/doctors/${docId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Doctor deleted successfully");
//         fetchData();
//       } else {
//         alert(data.message || "Failed to delete doctor");
//       }
//     } catch (err) {
//       alert("Error deleting doctor");
//     }
//   };

//   // Patient CRUD
//   const resetPatientForm = () => {
//     setPatientForm(emptyPatientForm);
//     setEditingPatientId(null);
//     setShowPatientForm(false);
//   };

//   const handleOpenEditPatient = (pat: any) => {
//     setPatientForm({
//       name: pat.user?.name || "",
//       phoneNumber: pat.user?.phoneNumber || "",
//       address: pat.address || "",
//     });
//     setEditingPatientId(pat._id);
//     setShowPatientForm(true);
//   };

//   const handleSubmitPatient = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingPatientId) return; // this form is edit-only; creation happens via Register

//     try {
//       const res = await fetch(`${apiUrl}/patients/${editingPatientId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: patientForm.name,
//           phoneNumber: patientForm.phoneNumber,
//           address: patientForm.address,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Patient details updated successfully");
//         resetPatientForm();
//         fetchData();
//       } else {
//         alert(data.message || "Failed to update patient");
//       }
//     } catch (error) {
//       alert("Error updating patient");
//     }
//   };

//   const handleDeletePatient = async (patId: string) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this patient? Their account and records will be removed.",
//       )
//     )
//       return;
//     try {
//       const res = await fetch(`${apiUrl}/patients/${patId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Patient deleted successfully");
//         fetchData();
//       } else {
//         alert(data.message || "Failed to delete patient");
//       }
//     } catch (err) {
//       alert("Error deleting patient");
//     }
//   };

//   // Appointment status toggle
//   const handleUpdateAppointment = async (apptId: string, status: string) => {
//     try {
//       const res = await fetch(`${apiUrl}/appointments/${apptId}/status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         fetchData();
//       } else {
//         alert(data.message || "Failed to update appointment");
//       }
//     } catch (err) {
//       alert("Error updating status");
//     }
//   };

//   // Billing Actions
//   const handleAddBillItem = () => {
//     if (!billForm.itemDesc || billForm.itemAmount <= 0) return;
//     setBillForm({
//       ...billForm,
//       items: [
//         ...billForm.items,
//         { description: billForm.itemDesc, amount: Number(billForm.itemAmount) },
//       ],
//       itemDesc: "",
//       itemAmount: 0,
//     });
//   };

//   const handleCreateBill = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (billForm.items.length === 0) {
//       alert("Please add at least one item to the invoice");
//       return;
//     }
//     try {
//       const res = await fetch(`${apiUrl}/bills`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           patientId: billForm.patientId,
//           appointmentId: billForm.appointmentId || undefined,
//           items: billForm.items,
//           dueDate: billForm.dueDate,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Invoice generated successfully");
//         setShowBillForm(false);
//         setBillForm({
//           patientId: "",
//           appointmentId: "",
//           itemDesc: "",
//           itemAmount: 0,
//           items: [],
//           dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//             .toISOString()
//             .split("T")[0],
//         });
//         fetchData();
//       } else {
//         alert(data.message || "Failed to generate invoice");
//       }
//     } catch (err) {
//       alert("Error generating bill");
//     }
//   };

//   const handleToggleBillStatus = async (
//     billId: string,
//     currentStatus: string,
//   ) => {
//     const nextStatus = currentStatus === "paid" ? "unpaid" : "paid";
//     try {
//       const res = await fetch(`${apiUrl}/bills/${billId}/status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ paymentStatus: nextStatus }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         fetchData();
//       }
//     } catch (err) {
//       alert("Error updating payment status");
//     }
//   };

//   if (loading && doctors.length === 0) {
//     return (
//       <div className="dashboard-loading">
//         <RefreshCw className="animate-spin" size={32} color="#0284c7" />
//         <p>Loading dashboard metrics...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-content fade-in">
//       <div className="dashboard-title-row">
//         <h1>Admin Control Room</h1>
//         <button onClick={fetchData} className="btn btn-secondary btn-sm">
//           <RefreshCw size={16} />
//           <span>Refresh Data</span>
//         </button>
//       </div>

//       {currentTab === "overview" && (
//         <>
//           {/* Summary Cards */}
//           <div className="stats-grid">
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper blue">
//                 <UserPlus size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.doctorsCount}</h3>
//                 <p>Doctors On Duty</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper green">
//                 <Users size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.patientsCount}</h3>
//                 <p>Registered Patients</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper warning">
//                 <Calendar size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.appointmentsCount}</h3>
//                 <p>Appointments Booked</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper info">
//                 <DollarSign size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
//                 <p>Revenue Collected</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper danger">
//                 <CreditCard size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.unpaidBills}</h3>
//                 <p>Pending Invoices</p>
//               </div>
//             </div>
//           </div>

//           {/* Quick Schedule Overview */}
//           <div className="dashboard-layout-grid">
//             <div className="card grid-span-2">
//               <div className="card-header-row">
//                 <h3>Recent Appointments</h3>
//               </div>
//               {appointments.length === 0 ? (
//                 <p className="no-data-text">No appointments recorded yet.</p>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>Patient</th>
//                         <th>Doctor</th>
//                         <th>Date & Time</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {appointments.slice(0, 5).map((appt) => (
//                         <tr key={appt._id}>
//                           <td>{appt.patient?.user?.name || "N/A"}</td>
//                           <td>Dr. {appt.doctor?.user?.name || "N/A"}</td>
//                           <td>
//                             {new Date(appt.date).toLocaleDateString()} at{" "}
//                             {appt.timeSlot}
//                           </td>
//                           <td>
//                             <span
//                               className={`badge badge-${
//                                 appt.status === "confirmed"
//                                   ? "success"
//                                   : appt.status === "pending"
//                                     ? "warning"
//                                     : appt.status === "completed"
//                                       ? "info"
//                                       : "danger"
//                               }`}
//                             >
//                               {appt.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {currentTab === "doctors" && (
//         <div className="tab-pane-container">
//           <div className="card-header-row">
//             <h3>Medical Officers Directory</h3>
//             <button
//               onClick={() =>
//                 showDoctorForm ? resetDoctorForm() : handleOpenAddDoctor()
//               }
//               className="btn btn-primary btn-sm"
//             >
//               <Plus size={16} />
//               <span>Add Doctor Account</span>
//             </button>
//           </div>

//           {showDoctorForm && (
//             <form
//               onSubmit={handleSubmitDoctor}
//               className="card inline-form-card fade-in"
//             >
//               <h4>
//                 {editingDoctorId
//                   ? "Edit Doctor Profile"
//                   : "Register New Doctor"}
//               </h4>
//               <div className="form-grid-three">
//                 <div className="form-group">
//                   <label className="form-label">Full Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.name}
//                     onChange={(e) =>
//                       setDoctorForm({ ...doctorForm, name: e.target.value })
//                     }
//                     placeholder="e.g. John Watson"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Email Address</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     required
//                     value={doctorForm.email}
//                     onChange={(e) =>
//                       setDoctorForm({ ...doctorForm, email: e.target.value })
//                     }
//                     placeholder="drjohn@hospital.com"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">
//                     Password{" "}
//                     {editingDoctorId && (
//                       <span
//                         style={{ fontWeight: 400, color: "var(--text-muted)" }}
//                       >
//                         (leave blank to keep current)
//                       </span>
//                     )}
//                   </label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     required={!editingDoctorId}
//                     value={doctorForm.password}
//                     onChange={(e) =>
//                       setDoctorForm({ ...doctorForm, password: e.target.value })
//                     }
//                     placeholder="••••••"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Phone Number</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.phoneNumber}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         phoneNumber: e.target.value,
//                       })
//                     }
//                     placeholder="9998887776"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Specialization</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.specialization}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         specialization: e.target.value,
//                       })
//                     }
//                     placeholder="e.g. Cardiology specialist"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Department</label>
//                   <select
//                     className="form-control"
//                     value={doctorForm.department}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         department: e.target.value,
//                       })
//                     }
//                   >
//                     <option value="Cardiology">Cardiology</option>
//                     <option value="Neurology">Neurology</option>
//                     <option value="Pediatrics">Pediatrics</option>
//                     <option value="General Medicine">General Medicine</option>
//                     <option value="Orthopedics">Orthopedics</option>
//                     <option value="Critical Care">Critical care</option>
//                     <option value="Dermatology">Dermatology</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Qualifications</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.qualification}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         qualification: e.target.value,
//                       })
//                     }
//                     placeholder="e.g. MBBS, MD"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Years of Experience</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     required
//                     value={doctorForm.experience}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         experience: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Consultation Fee (₹)</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     required
//                     value={doctorForm.consultationFee}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         consultationFee: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Availability Day</label>
//                   <select
//                     className="form-control"
//                     value={doctorForm.availabilityDay}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         availabilityDay: e.target.value,
//                       })
//                     }
//                   >
//                     <option value="Mon">Mon</option>
//                     <option value="Tue">Tue</option>
//                     <option value="Wed">Wed</option>
//                     <option value="Thu">Thu</option>
//                     <option value="Fri">Fri</option>
//                     <option value="Sat">Sat</option>
//                     <option value="Sun">Sun</option>
//                   </select>
//                 </div>
//                 <div className="form-group grid-span-2-col">
//                   <label className="form-label">Slots (comma separated)</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.availabilitySlots}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         availabilitySlots: e.target.value,
//                       })
//                     }
//                     placeholder="09:00 - 11:00, 15:00 - 17:00"
//                   />
//                 </div>
//               </div>
//               <div className="form-actions-row">
//                 <button type="submit" className="btn btn-primary">
//                   {editingDoctorId ? "Save Changes" : "Create Doctor Profile"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetDoctorForm}
//                   className="btn btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {doctors.length === 0 ? (
//             <p className="no-data-text">No doctors registered yet.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Doctor Name</th>
//                     <th>Department</th>
//                     <th>Speciality</th>
//                     <th>Qualifications</th>
//                     <th>Experience</th>
//                     <th>Fee (₹)</th>
//                     <th>Availability</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {doctors.map((doc) => (
//                     <tr key={doc._id}>
//                       <td className="strong-text">
//                         Dr. {doc.user?.name || "N/A"}
//                       </td>
//                       <td>{doc.department}</td>
//                       <td>{doc.specialization}</td>
//                       <td>{doc.qualification}</td>
//                       <td>{doc.experience} Years</td>
//                       <td>₹{doc.consultationFee}</td>
//                       <td>
//                         {doc.availability?.map((av: any, idx: number) => (
//                           <div key={idx} className="availability-slot-badge">
//                             <strong>{av.day}</strong>: {av.slots.join(", ")}
//                           </div>
//                         ))}
//                       </td>
//                       <td>
//                         <div className="table-action-buttons">
//                           <button
//                             onClick={() => handleOpenEditDoctor(doc)}
//                             className="btn btn-secondary btn-sm"
//                             title="Edit Profile"
//                           >
//                             <Edit2 size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteDoctor(doc._id)}
//                             className="btn btn-danger btn-sm"
//                             title="Delete Profile"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "patients" && (
//         <div className="tab-pane-container">
//           <div className="card-header-row">
//             <h3>Registered Patients</h3>
//           </div>

//           {showPatientForm && (
//             <form
//               onSubmit={handleSubmitPatient}
//               className="card inline-form-card fade-in"
//             >
//               <h4>Edit Patient Details</h4>
//               <div className="form-grid-three">
//                 <div className="form-group">
//                   <label className="form-label">Full Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={patientForm.name}
//                     onChange={(e) =>
//                       setPatientForm({ ...patientForm, name: e.target.value })
//                     }
//                     placeholder="e.g. Jane Doe"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Phone Number</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={patientForm.phoneNumber}
//                     onChange={(e) =>
//                       setPatientForm({
//                         ...patientForm,
//                         phoneNumber: e.target.value,
//                       })
//                     }
//                     placeholder="9876543210"
//                   />
//                 </div>
//                 <div className="form-group grid-span-2-col">
//                   <label className="form-label">Place</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={patientForm.address}
//                     onChange={(e) =>
//                       setPatientForm({
//                         ...patientForm,
//                         address: e.target.value,
//                       })
//                     }
//                     placeholder="Street address, City, ZIP Code"
//                   />
//                 </div>
//               </div>
//               <div className="form-actions-row">
//                 <button type="submit" className="btn btn-primary">
//                   Save Changes
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetPatientForm}
//                   className="btn btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {patients.length === 0 ? (
//             <p className="no-data-text">
//               No patients registered in the database.
//             </p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Patient Name</th>
//                     <th>Phone Number</th>
//                     <th>Address</th>
//                     <th>Joined Date</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {patients.map((pat) => (
//                     <tr key={pat._id}>
//                       <td className="strong-text">{pat.user?.name || "N/A"}</td>
//                       <td>{pat.user?.phoneNumber || "N/A"}</td>
//                       <td>{pat.address}</td>
//                       <td>{new Date(pat.createdAt).toLocaleDateString()}</td>
//                       <td>
//                         <div className="table-action-buttons">
//                           <button
//                             onClick={() => handleOpenEditPatient(pat)}
//                             className="btn btn-secondary btn-sm"
//                             title="Edit Patient"
//                           >
//                             <Edit2 size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleDeletePatient(pat._id)}
//                             className="btn btn-danger btn-sm"
//                             title="Delete Patient"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "appointments" && (
//         <div className="tab-pane-container">
//           <h3>Patient Appointment Schedule</h3>
//           {appointments.length === 0 ? (
//             <p className="no-data-text">No appointments booked.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Patient</th>
//                     <th>Doctor</th>
//                     <th>Reason</th>
//                     <th>Date & Slot</th>
//                     <th>Status</th>
//                     <th>Manage</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments.map((appt) => (
//                     <tr key={appt._id}>
//                       <td className="strong-text">
//                         {appt.patient?.user?.name || "N/A"}
//                       </td>
//                       <td>
//                         Dr. {appt.doctor?.user?.name || "N/A"} (
//                         {appt.doctor?.department})
//                       </td>
//                       <td>{appt.reason}</td>
//                       <td>
//                         {new Date(appt.date).toLocaleDateString()} -{" "}
//                         {appt.timeSlot}
//                       </td>
//                       <td>
//                         <span
//                           className={`badge badge-${
//                             appt.status === "confirmed"
//                               ? "success"
//                               : appt.status === "pending"
//                                 ? "warning"
//                                 : appt.status === "completed"
//                                   ? "info"
//                                   : "danger"
//                           }`}
//                         >
//                           {appt.status}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="table-action-buttons">
//                           {appt.status === "pending" && (
//                             <button
//                               onClick={() =>
//                                 handleUpdateAppointment(appt._id, "confirmed")
//                               }
//                               className="btn btn-secondary btn-sm text-success"
//                               title="Confirm Appointment"
//                             >
//                               <Check size={14} />
//                             </button>
//                           )}
//                           {appt.status !== "cancelled" &&
//                             appt.status !== "completed" && (
//                               <button
//                                 onClick={() =>
//                                   handleUpdateAppointment(appt._id, "cancelled")
//                                 }
//                                 className="btn btn-secondary btn-sm text-danger"
//                                 title="Cancel Appointment"
//                               >
//                                 <X size={14} />
//                               </button>
//                             )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "bills" && (
//         <div className="tab-pane-container">
//           <div className="card-header-row">
//             <h3>Hospital Billings & Invoices</h3>
//             <button
//               onClick={() => setShowBillForm(!showBillForm)}
//               className="btn btn-primary btn-sm"
//             >
//               <FilePlus size={16} />
//               <span>Generate New Invoice</span>
//             </button>
//           </div>

//           {showBillForm && (
//             <form
//               onSubmit={handleCreateBill}
//               className="card inline-form-card fade-in"
//             >
//               <h4>Generate Invoice</h4>
//               <div className="form-grid-three">
//                 <div className="form-group">
//                   <label className="form-label">Select Patient</label>
//                   <select
//                     className="form-control"
//                     required
//                     value={billForm.patientId}
//                     onChange={(e) =>
//                       setBillForm({ ...billForm, patientId: e.target.value })
//                     }
//                   >
//                     <option value="">-- Select Patient --</option>
//                     {patients.map((p) => (
//                       <option key={p._id} value={p._id}>
//                         {p.user?.name} ({p.user?.phoneNumber})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Due Date</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     required
//                     value={billForm.dueDate}
//                     onChange={(e) =>
//                       setBillForm({ ...billForm, dueDate: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Add line item */}
//               <div className="billing-line-item-creator">
//                 <h5>Invoice Items</h5>
//                 <div className="line-item-fields">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Item description (e.g. Lab Test, Consultation)"
//                     value={billForm.itemDesc}
//                     onChange={(e) =>
//                       setBillForm({ ...billForm, itemDesc: e.target.value })
//                     }
//                   />
//                   <input
//                     type="number"
//                     className="form-control"
//                     placeholder="Amount (₹)"
//                     value={billForm.itemAmount || ""}
//                     onChange={(e) =>
//                       setBillForm({
//                         ...billForm,
//                         itemAmount: Number(e.target.value),
//                       })
//                     }
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddBillItem}
//                     className="btn btn-secondary"
//                   >
//                     Add Item
//                   </button>
//                 </div>

//                 {billForm.items.length > 0 && (
//                   <div className="billing-items-list">
//                     <h6>Added Items:</h6>
//                     <ul>
//                       {billForm.items.map((item, idx) => (
//                         <li key={idx}>
//                           <span>{item.description}</span>
//                           <strong>₹{item.amount}</strong>
//                         </li>
//                       ))}
//                     </ul>
//                     <div className="bill-total-calc">
//                       Total:{" "}
//                       <strong>
//                         ₹{billForm.items.reduce((s, i) => s + i.amount, 0)}
//                       </strong>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="form-actions-row">
//                 <button type="submit" className="btn btn-primary">
//                   Save and Issue Invoice
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowBillForm(false)}
//                   className="btn btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {bills.length === 0 ? (
//             <p className="no-data-text">No invoices issued.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Invoice ID</th>
//                     <th>Patient Name</th>
//                     <th>Invoice Items</th>
//                     <th>Total Amount (₹)</th>
//                     <th>Due Date</th>
//                     <th>Payment Status</th>
//                     <th>Toggle Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bills.map((bill) => (
//                     <tr key={bill._id}>
//                       <td>#{bill._id.substring(bill._id.length - 8)}</td>
//                       <td className="strong-text">
//                         {bill.patient?.user?.name || "N/A"}
//                       </td>
//                       <td>
//                         {bill.items?.map((item: any, idx: number) => (
//                           <div key={idx} className="bill-list-subitem">
//                             • {item.description}: ₹{item.amount}
//                           </div>
//                         ))}
//                       </td>
//                       <td className="strong-text">₹{bill.totalAmount}</td>
//                       <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
//                       <td>
//                         <span
//                           className={`badge badge-${bill.paymentStatus === "paid" ? "success" : "danger"}`}
//                         >
//                           {bill.paymentStatus}
//                         </span>
//                       </td>
//                       <td>
//                         <button
//                           onClick={() =>
//                             handleToggleBillStatus(bill._id, bill.paymentStatus)
//                           }
//                           className={`btn btn-sm ${bill.paymentStatus === "paid" ? "btn-secondary" : "btn-primary"}`}
//                         >
//                           Mark as{" "}
//                           {bill.paymentStatus === "paid" ? "Unpaid" : "Paid"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import {
//   Users,
//   UserPlus,
//   Calendar,
//   DollarSign,
//   CreditCard,
//   FilePlus,
//   Plus,
//   Trash2,
//   Edit2,
//   Check,
//   X,
//   RefreshCw,
// } from "lucide-react";

// interface AdminDashboardProps {
//   currentTab: string;
// }

// const emptyDoctorForm = {
//   name: "",
//   email: "",
//   password: "",
//   phoneNumber: "",
//   specialization: "",
//   department: "General Medicine",
//   qualification: "",
//   experience: 5,
//   consultationFee: 500,
//   availabilityDay: "Mon",
//   availabilitySlots: "09:00 - 13:00, 14:00 - 17:00",
// };

// const emptyPatientForm = {
//   name: "",
//   phoneNumber: "",
//   address: "",
// };

// export const AdminDashboard: React.FC<AdminDashboardProps> = ({
//   currentTab,
// }) => {
//   const { token, apiUrl } = useAuth();

//   // States
//   const [stats, setStats] = useState({
//     doctorsCount: 0,
//     patientsCount: 0,
//     appointmentsCount: 0,
//     totalRevenue: 0,
//     unpaidBills: 0,
//   });

//   const [doctors, setDoctors] = useState<any[]>([]);
//   const [patients, setPatients] = useState<any[]>([]);
//   const [appointments, setAppointments] = useState<any[]>([]);
//   const [bills, setBills] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Forms States
//   const [showDoctorForm, setShowDoctorForm] = useState(false);
//   const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
//   const [doctorForm, setDoctorForm] = useState(emptyDoctorForm);

//   const [showPatientForm, setShowPatientForm] = useState(false);
//   const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
//   const [patientForm, setPatientForm] = useState(emptyPatientForm);

//   const [showBillForm, setShowBillForm] = useState(false);
//   const [billForm, setBillForm] = useState({
//     patientId: "",
//     appointmentId: "",
//     itemDesc: "",
//     itemAmount: 0,
//     items: [] as { description: string; amount: number }[],
//     dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//       .toISOString()
//       .split("T")[0],
//   });

//   // Edit Appointment State
//   const [editingApptId, setEditingApptId] = useState<string | null>(null);
//   const [editApptForm, setEditApptForm] = useState({
//     date: "",
//     timeSlot: "",
//     reason: "",
//   });

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const headers = { Authorization: `Bearer ${token}` };

//       // Fetch Doctors
//       const resDocs = await fetch(`${apiUrl}/doctors`, { headers });
//       const dataDocs = await resDocs.json();
//       const docsList = dataDocs.success ? dataDocs.data : [];
//       setDoctors(docsList);

//       // Fetch Patients
//       const resPatients = await fetch(`${apiUrl}/patients`, { headers });
//       const dataPatients = await resPatients.json();
//       const patientsList = dataPatients.success ? dataPatients.data : [];
//       setPatients(patientsList);

//       // Fetch Appointments
//       const resAppointments = await fetch(`${apiUrl}/appointments`, {
//         headers,
//       });
//       const dataAppointments = await resAppointments.json();
//       const apptsList = dataAppointments.success ? dataAppointments.data : [];
//       setAppointments(apptsList);

//       // Fetch Bills
//       const resBills = await fetch(`${apiUrl}/bills`, { headers });
//       const dataBills = await resBills.json();
//       const billsList = dataBills.success ? dataBills.data : [];
//       setBills(billsList);

//       // Calculate Stats
//       const revenue = billsList
//         .filter((b: any) => b.paymentStatus === "paid")
//         .reduce((sum: number, b: any) => sum + b.totalAmount, 0);

//       const unpaidCount = billsList.filter(
//         (b: any) => b.paymentStatus === "unpaid",
//       ).length;

//       setStats({
//         doctorsCount: docsList.length,
//         patientsCount: patientsList.length,
//         appointmentsCount: apptsList.length,
//         totalRevenue: revenue,
//         unpaidBills: unpaidCount,
//       });
//     } catch (err) {
//       console.error("Error loading admin dashboard data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchData();
//     }
//   }, [token, currentTab]);

//   // Doctor CRUD
//   const resetDoctorForm = () => {
//     setDoctorForm(emptyDoctorForm);
//     setEditingDoctorId(null);
//     setShowDoctorForm(false);
//   };

//   const handleOpenAddDoctor = () => {
//     setDoctorForm(emptyDoctorForm);
//     setEditingDoctorId(null);
//     setShowDoctorForm(true);
//   };

//   const handleOpenEditDoctor = (doc: any) => {
//     const firstAvailability = doc.availability?.[0];
//     setDoctorForm({
//       name: doc.user?.name || "",
//       email: doc.user?.email || "",
//       password: "", // left blank; only sent if the admin types a new one
//       phoneNumber: doc.user?.phoneNumber || "",
//       specialization: doc.specialization || "",
//       department: doc.department || "General Medicine",
//       qualification: doc.qualification || "",
//       experience: doc.experience ?? 5,
//       consultationFee: doc.consultationFee ?? 500,
//       availabilityDay: firstAvailability?.day || "Mon",
//       availabilitySlots: firstAvailability?.slots?.join(", ") || "",
//     });
//     setEditingDoctorId(doc._id);
//     setShowDoctorForm(true);
//   };

//   const handleSubmitDoctor = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const slotsArray = doctorForm.availabilitySlots
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean);

//       const isEditing = Boolean(editingDoctorId);

//       const payload: any = {
//         name: doctorForm.name,
//         email: doctorForm.email,
//         phoneNumber: doctorForm.phoneNumber,
//         specialization: doctorForm.specialization,
//         department: doctorForm.department,
//         qualification: doctorForm.qualification,
//         experience: Number(doctorForm.experience),
//         consultationFee: Number(doctorForm.consultationFee),
//         availability: [
//           {
//             day: doctorForm.availabilityDay,
//             slots: slotsArray,
//           },
//         ],
//       };

//       // Only send password if creating, or if the admin explicitly typed one while editing
//       if (!isEditing || doctorForm.password) {
//         payload.password = doctorForm.password;
//       }

//       const res = await fetch(
//         isEditing
//           ? `${apiUrl}/doctors/${editingDoctorId}`
//           : `${apiUrl}/doctors`,
//         {
//           method: isEditing ? "PUT" : "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         },
//       );
//       const data = await res.json();
//       if (data.success) {
//         alert(
//           isEditing
//             ? "Doctor profile updated successfully"
//             : "Doctor account created successfully",
//         );
//         resetDoctorForm();
//         fetchData();
//       } else {
//         alert(
//           data.message ||
//             (isEditing ? "Failed to update doctor" : "Failed to create doctor"),
//         );
//       }
//     } catch (error) {
//       alert(
//         editingDoctorId ? "Error updating doctor" : "Error creating doctor",
//       );
//     }
//   };

//   const handleDeleteDoctor = async (docId: string) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this doctor? All associated user credentials will be removed.",
//       )
//     )
//       return;
//     try {
//       const res = await fetch(`${apiUrl}/doctors/${docId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Doctor deleted successfully");
//         fetchData();
//       } else {
//         alert(data.message || "Failed to delete doctor");
//       }
//     } catch (err) {
//       alert("Error deleting doctor");
//     }
//   };

//   // Patient CRUD
//   const resetPatientForm = () => {
//     setPatientForm(emptyPatientForm);
//     setEditingPatientId(null);
//     setShowPatientForm(false);
//   };

//   const handleOpenEditPatient = (pat: any) => {
//     setPatientForm({
//       name: pat.user?.name || "",
//       phoneNumber: pat.user?.phoneNumber || "",
//       address: pat.address || "",
//     });
//     setEditingPatientId(pat._id);
//     setShowPatientForm(true);
//   };

//   const handleSubmitPatient = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingPatientId) return; // this form is edit-only; creation happens via Register

//     try {
//       const res = await fetch(`${apiUrl}/patients/${editingPatientId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: patientForm.name,
//           phoneNumber: patientForm.phoneNumber,
//           address: patientForm.address,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Patient details updated successfully");
//         resetPatientForm();
//         fetchData();
//       } else {
//         alert(data.message || "Failed to update patient");
//       }
//     } catch (error) {
//       alert("Error updating patient");
//     }
//   };

//   const handleDeletePatient = async (patId: string) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this patient? Their account and records will be removed.",
//       )
//     )
//       return;
//     try {
//       const res = await fetch(`${apiUrl}/patients/${patId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Patient deleted successfully");
//         fetchData();
//       } else {
//         alert(data.message || "Failed to delete patient");
//       }
//     } catch (err) {
//       alert("Error deleting patient");
//     }
//   };

//   // Appointment status toggle
//   const handleUpdateAppointment = async (apptId: string, status: string) => {
//     try {
//       const res = await fetch(`${apiUrl}/appointments/${apptId}/status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         fetchData();
//       } else {
//         alert(data.message || "Failed to update appointment");
//       }
//     } catch (err) {
//       alert("Error updating status");
//     }
//   };

//   // Appointment Edit (reschedule)
//   const handleOpenEditAppointment = (appt: any) => {
//     setEditApptForm({
//       date: new Date(appt.date).toISOString().split("T")[0],
//       timeSlot: appt.timeSlot || "",
//       reason: appt.reason || "",
//     });
//     setEditingApptId(appt._id);
//   };

//   const handleCancelEditAppointment = () => {
//     setEditingApptId(null);
//     setEditApptForm({ date: "", timeSlot: "", reason: "" });
//   };

//   const handleUpdateAppointmentDetails = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingApptId) return;

//     if (!editApptForm.date || !editApptForm.timeSlot || !editApptForm.reason) {
//       alert("Please fill in all details");
//       return;
//     }

//     try {
//       const res = await fetch(`${apiUrl}/appointments/${editingApptId}/edit`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           date: editApptForm.date,
//           timeSlot: editApptForm.timeSlot,
//           reason: editApptForm.reason,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert(
//           editingAppt?.status === "confirmed" && data.data?.status === "pending"
//             ? "Appointment rescheduled — it now needs to be re-confirmed."
//             : "Appointment updated successfully",
//         );
//         handleCancelEditAppointment();
//         fetchData();
//       } else {
//         alert(data.message || "Failed to update appointment");
//       }
//     } catch (err) {
//       alert("Error updating appointment");
//     }
//   };

//   // Billing Actions
//   const handleAddBillItem = () => {
//     if (!billForm.itemDesc || billForm.itemAmount <= 0) return;
//     setBillForm({
//       ...billForm,
//       items: [
//         ...billForm.items,
//         { description: billForm.itemDesc, amount: Number(billForm.itemAmount) },
//       ],
//       itemDesc: "",
//       itemAmount: 0,
//     });
//   };

//   const handleCreateBill = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (billForm.items.length === 0) {
//       alert("Please add at least one item to the invoice");
//       return;
//     }
//     try {
//       const res = await fetch(`${apiUrl}/bills`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           patientId: billForm.patientId,
//           appointmentId: billForm.appointmentId || undefined,
//           items: billForm.items,
//           dueDate: billForm.dueDate,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Invoice generated successfully");
//         setShowBillForm(false);
//         setBillForm({
//           patientId: "",
//           appointmentId: "",
//           itemDesc: "",
//           itemAmount: 0,
//           items: [],
//           dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//             .toISOString()
//             .split("T")[0],
//         });
//         fetchData();
//       } else {
//         alert(data.message || "Failed to generate invoice");
//       }
//     } catch (err) {
//       alert("Error generating bill");
//     }
//   };

//   const handleToggleBillStatus = async (
//     billId: string,
//     currentStatus: string,
//   ) => {
//     const nextStatus = currentStatus === "paid" ? "unpaid" : "paid";
//     try {
//       const res = await fetch(`${apiUrl}/bills/${billId}/status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ paymentStatus: nextStatus }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         fetchData();
//       }
//     } catch (err) {
//       alert("Error updating payment status");
//     }
//   };

//   // Doctor info for whichever appointment is currently being edited (used to build the slot dropdown)
//   const editingAppt = appointments.find((a) => a._id === editingApptId);
//   const editingDocInfo = doctors.find(
//     (d) => d._id === (editingAppt?.doctor?._id || editingAppt?.doctor),
//   );

//   if (loading && doctors.length === 0) {
//     return (
//       <div className="dashboard-loading">
//         <RefreshCw className="animate-spin" size={32} color="#0284c7" />
//         <p>Loading dashboard metrics...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-content fade-in">
//       <div className="dashboard-title-row">
//         <h1>Admin Control Room</h1>
//         <button onClick={fetchData} className="btn btn-secondary btn-sm">
//           <RefreshCw size={16} />
//           <span>Refresh Data</span>
//         </button>
//       </div>

//       {currentTab === "overview" && (
//         <>
//           {/* Summary Cards */}
//           <div className="stats-grid">
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper blue">
//                 <UserPlus size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.doctorsCount}</h3>
//                 <p>Doctors On Duty</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper green">
//                 <Users size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.patientsCount}</h3>
//                 <p>Registered Patients</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper warning">
//                 <Calendar size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.appointmentsCount}</h3>
//                 <p>Appointments Booked</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper info">
//                 <DollarSign size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
//                 <p>Revenue Collected</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper danger">
//                 <CreditCard size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{stats.unpaidBills}</h3>
//                 <p>Pending Invoices</p>
//               </div>
//             </div>
//           </div>

//           {/* Quick Schedule Overview */}
//           <div className="dashboard-layout-grid">
//             <div className="card grid-span-2">
//               <div className="card-header-row">
//                 <h3>Recent Appointments</h3>
//               </div>
//               {appointments.length === 0 ? (
//                 <p className="no-data-text">No appointments recorded yet.</p>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>Patient</th>
//                         <th>Doctor</th>
//                         <th>Date & Time</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {appointments.slice(0, 5).map((appt) => (
//                         <tr key={appt._id}>
//                           <td>{appt.patient?.user?.name || "N/A"}</td>
//                           <td>Dr. {appt.doctor?.user?.name || "N/A"}</td>
//                           <td>
//                             {new Date(appt.date).toLocaleDateString()} at{" "}
//                             {appt.timeSlot}
//                           </td>
//                           <td>
//                             <span
//                               className={`badge badge-${
//                                 appt.status === "confirmed"
//                                   ? "success"
//                                   : appt.status === "pending"
//                                     ? "warning"
//                                     : appt.status === "completed"
//                                       ? "info"
//                                       : "danger"
//                               }`}
//                             >
//                               {appt.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {currentTab === "doctors" && (
//         <div className="tab-pane-container">
//           <div className="card-header-row">
//             <h3>Medical Officers Directory</h3>
//             <button
//               onClick={() =>
//                 showDoctorForm ? resetDoctorForm() : handleOpenAddDoctor()
//               }
//               className="btn btn-primary btn-sm"
//             >
//               <Plus size={16} />
//               <span>Add Doctor Account</span>
//             </button>
//           </div>

//           {showDoctorForm && (
//             <form
//               onSubmit={handleSubmitDoctor}
//               className="card inline-form-card fade-in"
//             >
//               <h4>
//                 {editingDoctorId
//                   ? "Edit Doctor Profile"
//                   : "Register New Doctor"}
//               </h4>
//               <div className="form-grid-three">
//                 <div className="form-group">
//                   <label className="form-label">Full Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.name}
//                     onChange={(e) =>
//                       setDoctorForm({ ...doctorForm, name: e.target.value })
//                     }
//                     placeholder="e.g. John Watson"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Email Address</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     required
//                     value={doctorForm.email}
//                     onChange={(e) =>
//                       setDoctorForm({ ...doctorForm, email: e.target.value })
//                     }
//                     placeholder="drjohn@hospital.com"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">
//                     Password{" "}
//                     {editingDoctorId && (
//                       <span
//                         style={{ fontWeight: 400, color: "var(--text-muted)" }}
//                       >
//                         (leave blank to keep current)
//                       </span>
//                     )}
//                   </label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     required={!editingDoctorId}
//                     value={doctorForm.password}
//                     onChange={(e) =>
//                       setDoctorForm({ ...doctorForm, password: e.target.value })
//                     }
//                     placeholder="••••••"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Phone Number</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.phoneNumber}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         phoneNumber: e.target.value,
//                       })
//                     }
//                     placeholder="9998887776"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Specialization</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.specialization}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         specialization: e.target.value,
//                       })
//                     }
//                     placeholder="e.g. Cardiology specialist"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Department</label>
//                   <select
//                     className="form-control"
//                     value={doctorForm.department}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         department: e.target.value,
//                       })
//                     }
//                   >
//                     <option value="Cardiology">Cardiology</option>
//                     <option value="Neurology">Neurology</option>
//                     <option value="Pediatrics">Pediatrics</option>
//                     <option value="General Medicine">General Medicine</option>
//                     <option value="Orthopedics">Orthopedics</option>
//                     <option value="Critical Care">Critical care</option>
//                     <option value="Dermatology">Dermatology</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Qualifications</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.qualification}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         qualification: e.target.value,
//                       })
//                     }
//                     placeholder="e.g. MBBS, MD"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Years of Experience</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     required
//                     value={doctorForm.experience}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         experience: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Consultation Fee (₹)</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     required
//                     value={doctorForm.consultationFee}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         consultationFee: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Availability Day</label>
//                   <select
//                     className="form-control"
//                     value={doctorForm.availabilityDay}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         availabilityDay: e.target.value,
//                       })
//                     }
//                   >
//                     <option value="Mon">Mon</option>
//                     <option value="Tue">Tue</option>
//                     <option value="Wed">Wed</option>
//                     <option value="Thu">Thu</option>
//                     <option value="Fri">Fri</option>
//                     <option value="Sat">Sat</option>
//                     <option value="Sun">Sun</option>
//                   </select>
//                 </div>
//                 <div className="form-group grid-span-2-col">
//                   <label className="form-label">Slots (comma separated)</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={doctorForm.availabilitySlots}
//                     onChange={(e) =>
//                       setDoctorForm({
//                         ...doctorForm,
//                         availabilitySlots: e.target.value,
//                       })
//                     }
//                     placeholder="09:00 - 11:00, 15:00 - 17:00"
//                   />
//                 </div>
//               </div>
//               <div className="form-actions-row">
//                 <button type="submit" className="btn btn-primary">
//                   {editingDoctorId ? "Save Changes" : "Create Doctor Profile"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetDoctorForm}
//                   className="btn btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {doctors.length === 0 ? (
//             <p className="no-data-text">No doctors registered yet.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Doctor Name</th>
//                     <th>Department</th>
//                     <th>Speciality</th>
//                     <th>Qualifications</th>
//                     <th>Experience</th>
//                     <th>Fee (₹)</th>
//                     <th>Availability</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {doctors.map((doc) => (
//                     <tr key={doc._id}>
//                       <td className="strong-text">
//                         Dr. {doc.user?.name || "N/A"}
//                       </td>
//                       <td>{doc.department}</td>
//                       <td>{doc.specialization}</td>
//                       <td>{doc.qualification}</td>
//                       <td>{doc.experience} Years</td>
//                       <td>₹{doc.consultationFee}</td>
//                       <td>
//                         {doc.availability?.map((av: any, idx: number) => (
//                           <div key={idx} className="availability-slot-badge">
//                             <strong>{av.day}</strong>: {av.slots.join(", ")}
//                           </div>
//                         ))}
//                       </td>
//                       <td>
//                         <div className="table-action-buttons">
//                           <button
//                             onClick={() => handleOpenEditDoctor(doc)}
//                             className="btn btn-secondary btn-sm"
//                             title="Edit Profile"
//                           >
//                             <Edit2 size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteDoctor(doc._id)}
//                             className="btn btn-danger btn-sm"
//                             title="Delete Profile"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "patients" && (
//         <div className="tab-pane-container">
//           <div className="card-header-row">
//             <h3>Registered Patients</h3>
//           </div>

//           {showPatientForm && (
//             <form
//               onSubmit={handleSubmitPatient}
//               className="card inline-form-card fade-in"
//             >
//               <h4>Edit Patient Details</h4>
//               <div className="form-grid-three">
//                 <div className="form-group">
//                   <label className="form-label">Full Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={patientForm.name}
//                     onChange={(e) =>
//                       setPatientForm({ ...patientForm, name: e.target.value })
//                     }
//                     placeholder="e.g. Jane Doe"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Phone Number</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={patientForm.phoneNumber}
//                     onChange={(e) =>
//                       setPatientForm({
//                         ...patientForm,
//                         phoneNumber: e.target.value,
//                       })
//                     }
//                     placeholder="9876543210"
//                   />
//                 </div>
//                 <div className="form-group grid-span-2-col">
//                   <label className="form-label">Place</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={patientForm.address}
//                     onChange={(e) =>
//                       setPatientForm({
//                         ...patientForm,
//                         address: e.target.value,
//                       })
//                     }
//                     placeholder="Street address, City, ZIP Code"
//                   />
//                 </div>
//               </div>
//               <div className="form-actions-row">
//                 <button type="submit" className="btn btn-primary">
//                   Save Changes
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetPatientForm}
//                   className="btn btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {patients.length === 0 ? (
//             <p className="no-data-text">
//               No patients registered in the database.
//             </p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Patient Name</th>
//                     <th>Phone Number</th>
//                     <th>Address</th>
//                     <th>Joined Date</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {patients.map((pat) => (
//                     <tr key={pat._id}>
//                       <td className="strong-text">{pat.user?.name || "N/A"}</td>
//                       <td>{pat.user?.phoneNumber || "N/A"}</td>
//                       <td>{pat.address}</td>
//                       <td>{new Date(pat.createdAt).toLocaleDateString()}</td>
//                       <td>
//                         <div className="table-action-buttons">
//                           <button
//                             onClick={() => handleOpenEditPatient(pat)}
//                             className="btn btn-secondary btn-sm"
//                             title="Edit Patient"
//                           >
//                             <Edit2 size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleDeletePatient(pat._id)}
//                             className="btn btn-danger btn-sm"
//                             title="Delete Patient"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "appointments" && (
//         <div className="tab-pane-container">
//           <h3>Patient Appointment Schedule</h3>

//           {editingApptId && (
//             <form
//               onSubmit={handleUpdateAppointmentDetails}
//               className="card inline-form-card fade-in"
//             >
//               <h4>Reschedule Appointment</h4>
//               <div className="form-grid-three">
//                 <div className="form-group">
//                   <label className="form-label">Date</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     required
//                     value={editApptForm.date}
//                     onChange={(e) =>
//                       setEditApptForm({
//                         ...editApptForm,
//                         date: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="form-group grid-span-2-col">
//                   <label className="form-label">Select Available Slot</label>
//                   {editingDocInfo?.availability &&
//                   editingDocInfo.availability.length > 0 ? (
//                     <select
//                       className="form-control"
//                       required
//                       value={editApptForm.timeSlot}
//                       onChange={(e) =>
//                         setEditApptForm({
//                           ...editApptForm,
//                           timeSlot: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="">-- Choose Time Slot --</option>
//                       {editingDocInfo.availability.map((av: any) => (
//                         <optgroup key={av._id} label={av.day}>
//                           {av.slots.map((slot: string, sIdx: number) => (
//                             <option key={sIdx} value={`${av.day}: ${slot}`}>
//                               {av.day} - {slot}
//                             </option>
//                           ))}
//                         </optgroup>
//                       ))}
//                     </select>
//                   ) : (
//                     <input
//                       type="text"
//                       className="form-control"
//                       required
//                       placeholder="e.g. Mon: 09:00 - 11:00"
//                       value={editApptForm.timeSlot}
//                       onChange={(e) =>
//                         setEditApptForm({
//                           ...editApptForm,
//                           timeSlot: e.target.value,
//                         })
//                       }
//                     />
//                   )}
//                 </div>

//                 <div className="form-group grid-span-2-col">
//                   <label className="form-label">Reason for Visit</label>
//                   <textarea
//                     className="form-control"
//                     required
//                     rows={3}
//                     value={editApptForm.reason}
//                     onChange={(e) =>
//                       setEditApptForm({
//                         ...editApptForm,
//                         reason: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="form-actions-row">
//                 <button type="submit" className="btn btn-primary">
//                   Save Changes
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCancelEditAppointment}
//                   className="btn btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {appointments.length === 0 ? (
//             <p className="no-data-text">No appointments booked.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Patient</th>
//                     <th>Doctor</th>
//                     <th>Reason</th>
//                     <th>Date & Slot</th>
//                     <th>Status</th>
//                     <th>Manage</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments.map((appt) => (
//                     <tr key={appt._id}>
//                       <td className="strong-text">
//                         {appt.patient?.user?.name || "N/A"}
//                       </td>
//                       <td>
//                         Dr. {appt.doctor?.user?.name || "N/A"} (
//                         {appt.doctor?.department})
//                       </td>
//                       <td>{appt.reason}</td>
//                       <td>
//                         {new Date(appt.date).toLocaleDateString()} -{" "}
//                         {appt.timeSlot}
//                       </td>
//                       <td>
//                         <span
//                           className={`badge badge-${
//                             appt.status === "confirmed"
//                               ? "success"
//                               : appt.status === "pending"
//                                 ? "warning"
//                                 : appt.status === "completed"
//                                   ? "info"
//                                   : "danger"
//                           }`}
//                         >
//                           {appt.status}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="table-action-buttons">
//                           {(appt.status === "pending" ||
//                             appt.status === "confirmed") && (
//                             <button
//                               onClick={() => handleOpenEditAppointment(appt)}
//                               className="btn btn-secondary btn-sm"
//                               title="Reschedule Appointment"
//                             >
//                               <Edit2 size={14} />
//                             </button>
//                           )}
//                           {appt.status === "pending" && (
//                             <button
//                               onClick={() =>
//                                 handleUpdateAppointment(appt._id, "confirmed")
//                               }
//                               className="btn btn-secondary btn-sm text-success"
//                               title="Confirm Appointment"
//                             >
//                               <Check size={14} />
//                             </button>
//                           )}
//                           {appt.status !== "cancelled" &&
//                             appt.status !== "completed" && (
//                               <button
//                                 onClick={() =>
//                                   handleUpdateAppointment(appt._id, "cancelled")
//                                 }
//                                 className="btn btn-secondary btn-sm text-danger"
//                                 title="Cancel Appointment"
//                               >
//                                 <X size={14} />
//                               </button>
//                             )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "bills" && (
//         <div className="tab-pane-container">
//           <div className="card-header-row">
//             <h3>Hospital Billings & Invoices</h3>
//             <button
//               onClick={() => setShowBillForm(!showBillForm)}
//               className="btn btn-primary btn-sm"
//             >
//               <FilePlus size={16} />
//               <span>Generate New Invoice</span>
//             </button>
//           </div>

//           {showBillForm && (
//             <form
//               onSubmit={handleCreateBill}
//               className="card inline-form-card fade-in"
//             >
//               <h4>Generate Invoice</h4>
//               <div className="form-grid-three">
//                 <div className="form-group">
//                   <label className="form-label">Select Patient</label>
//                   <select
//                     className="form-control"
//                     required
//                     value={billForm.patientId}
//                     onChange={(e) =>
//                       setBillForm({ ...billForm, patientId: e.target.value })
//                     }
//                   >
//                     <option value="">-- Select Patient --</option>
//                     {patients.map((p) => (
//                       <option key={p._id} value={p._id}>
//                         {p.user?.name} ({p.user?.phoneNumber})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Due Date</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     required
//                     value={billForm.dueDate}
//                     onChange={(e) =>
//                       setBillForm({ ...billForm, dueDate: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Add line item */}
//               <div className="billing-line-item-creator">
//                 <h5>Invoice Items</h5>
//                 <div className="line-item-fields">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Item description (e.g. Lab Test, Consultation)"
//                     value={billForm.itemDesc}
//                     onChange={(e) =>
//                       setBillForm({ ...billForm, itemDesc: e.target.value })
//                     }
//                   />
//                   <input
//                     type="number"
//                     className="form-control"
//                     placeholder="Amount (₹)"
//                     value={billForm.itemAmount || ""}
//                     onChange={(e) =>
//                       setBillForm({
//                         ...billForm,
//                         itemAmount: Number(e.target.value),
//                       })
//                     }
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddBillItem}
//                     className="btn btn-secondary"
//                   >
//                     Add Item
//                   </button>
//                 </div>

//                 {billForm.items.length > 0 && (
//                   <div className="billing-items-list">
//                     <h6>Added Items:</h6>
//                     <ul>
//                       {billForm.items.map((item, idx) => (
//                         <li key={idx}>
//                           <span>{item.description}</span>
//                           <strong>₹{item.amount}</strong>
//                         </li>
//                       ))}
//                     </ul>
//                     <div className="bill-total-calc">
//                       Total:{" "}
//                       <strong>
//                         ₹{billForm.items.reduce((s, i) => s + i.amount, 0)}
//                       </strong>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="form-actions-row">
//                 <button type="submit" className="btn btn-primary">
//                   Save and Issue Invoice
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowBillForm(false)}
//                   className="btn btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {bills.length === 0 ? (
//             <p className="no-data-text">No invoices issued.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Invoice ID</th>
//                     <th>Patient Name</th>
//                     <th>Invoice Items</th>
//                     <th>Total Amount (₹)</th>
//                     <th>Due Date</th>
//                     <th>Payment Status</th>
//                     <th>Toggle Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bills.map((bill) => (
//                     <tr key={bill._id}>
//                       <td>#{bill._id.substring(bill._id.length - 8)}</td>
//                       <td className="strong-text">
//                         {bill.patient?.user?.name || "N/A"}
//                       </td>
//                       <td>
//                         {bill.items?.map((item: any, idx: number) => (
//                           <div key={idx} className="bill-list-subitem">
//                             • {item.description}: ₹{item.amount}
//                           </div>
//                         ))}
//                       </td>
//                       <td className="strong-text">₹{bill.totalAmount}</td>
//                       <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
//                       <td>
//                         <span
//                           className={`badge badge-${bill.paymentStatus === "paid" ? "success" : "danger"}`}
//                         >
//                           {bill.paymentStatus}
//                         </span>
//                       </td>
//                       <td>
//                         <button
//                           onClick={() =>
//                             handleToggleBillStatus(bill._id, bill.paymentStatus)
//                           }
//                           className={`btn btn-sm ${bill.paymentStatus === "paid" ? "btn-secondary" : "btn-primary"}`}
//                         >
//                           Mark as{" "}
//                           {bill.paymentStatus === "paid" ? "Unpaid" : "Paid"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  UserPlus,
  Calendar,
  DollarSign,
  CreditCard,
  FilePlus,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

interface AdminDashboardProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const emptyDoctorForm = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
  specialization: "",
  department: "General Medicine",
  qualification: "",
  experience: 5,
  consultationFee: 500,
};

type AvailabilityRow = { day: string; slots: string };

const emptyAvailabilityRows: AvailabilityRow[] = [
  { day: "Mon", slots: "09:00 - 13:00, 14:00 - 17:00" },
];

const emptyPatientForm = {
  name: "",
  phoneNumber: "",
  address: "",
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const { token, apiUrl } = useAuth();

  const navigate = useNavigate();

  // States
  const [stats, setStats] = useState({
    doctorsCount: 0,
    patientsCount: 0,
    appointmentsCount: 0,
    totalRevenue: 0,
    unpaidBills: 0,
  });

  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms States
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [doctorForm, setDoctorForm] = useState(emptyDoctorForm);
  const [availabilityRows, setAvailabilityRows] = useState<AvailabilityRow[]>(
    emptyAvailabilityRows,
  );

  const [showPatientForm, setShowPatientForm] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [patientForm, setPatientForm] = useState(emptyPatientForm);

  const [showBillForm, setShowBillForm] = useState(false);
  const [billForm, setBillForm] = useState({
    patientId: "",
    appointmentId: "",
    itemDesc: "",
    itemAmount: 0,
    items: [] as { description: string; amount: number }[],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  // Edit Appointment State
  const [editingApptId, setEditingApptId] = useState<string | null>(null);
  const [editApptForm, setEditApptForm] = useState({
    date: "",
    timeSlot: "",
    reason: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Doctors
      const resDocs = await fetch(`${apiUrl}/doctors`, { headers });
      const dataDocs = await resDocs.json();
      const docsList = dataDocs.success ? dataDocs.data : [];
      setDoctors(docsList);

      // Fetch Patients
      const resPatients = await fetch(`${apiUrl}/patients`, { headers });
      const dataPatients = await resPatients.json();
      const patientsList = dataPatients.success ? dataPatients.data : [];
      setPatients(patientsList);

      // Fetch Appointments
      const resAppointments = await fetch(`${apiUrl}/appointments`, {
        headers,
      });
      const dataAppointments = await resAppointments.json();
      const apptsList = dataAppointments.success ? dataAppointments.data : [];
      setAppointments(apptsList);

      // Fetch Bills
      const resBills = await fetch(`${apiUrl}/bills`, { headers });
      const dataBills = await resBills.json();
      const billsList = dataBills.success ? dataBills.data : [];
      setBills(billsList);

      // Calculate Stats
      const revenue = billsList
        .filter((b: any) => b.paymentStatus === "paid")
        .reduce((sum: number, b: any) => sum + b.totalAmount, 0);

      const unpaidCount = billsList.filter(
        (b: any) => b.paymentStatus === "unpaid",
      ).length;

      setStats({
        doctorsCount: docsList.length,
        patientsCount: patientsList.length,
        appointmentsCount: apptsList.length,
        totalRevenue: revenue,
        unpaidBills: unpaidCount,
      });
    } catch (err) {
      console.error("Error loading admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, currentTab]);

  // Doctor CRUD
  const resetDoctorForm = () => {
    setDoctorForm(emptyDoctorForm);
    setAvailabilityRows(emptyAvailabilityRows);
    setEditingDoctorId(null);
    setShowDoctorForm(false);
  };

  const handleOpenAddDoctor = () => {
    setDoctorForm(emptyDoctorForm);
    setAvailabilityRows(emptyAvailabilityRows);
    setEditingDoctorId(null);
    setShowDoctorForm(true);
  };

  const handleOpenEditDoctor = (doc: any) => {
    setDoctorForm({
      name: doc.user?.name || "",
      email: doc.user?.email || "",
      password: "", // left blank; only sent if the admin types a new one
      phoneNumber: doc.user?.phoneNumber || "",
      specialization: doc.specialization || "",
      department: doc.department || "General Medicine",
      qualification: doc.qualification || "",
      experience: doc.experience ?? 5,
      consultationFee: doc.consultationFee ?? 500,
    });

    // Load every existing day/slot pair, not just the first
    const rows: AvailabilityRow[] =
      doc.availability && doc.availability.length > 0
        ? doc.availability.map((av: any) => ({
            day: av.day,
            slots: (av.slots || []).join(", "),
          }))
        : emptyAvailabilityRows;

    setAvailabilityRows(rows);
    setEditingDoctorId(doc._id);
    setShowDoctorForm(true);
  };

  // Availability row management
  const handleAddAvailabilityRow = () => {
    // Suggest the next day in sequence that isn't already used, as a convenience default
    const usedDays = availabilityRows.map((r) => r.day);
    const nextDay =
      DAY_OPTIONS.find((d) => !usedDays.includes(d)) || DAY_OPTIONS[0];
    setAvailabilityRows([...availabilityRows, { day: nextDay, slots: "" }]);
  };

  const handleRemoveAvailabilityRow = (index: number) => {
    setAvailabilityRows(availabilityRows.filter((_, i) => i !== index));
  };

  const handleAvailabilityRowChange = (
    index: number,
    field: "day" | "slots",
    value: string,
  ) => {
    setAvailabilityRows(
      availabilityRows.map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
      ),
    );
  };

  const handleSubmitDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const availability = availabilityRows
        .map((row) => ({
          day: row.day,
          slots: row.slots
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }))
        .filter((row) => row.slots.length > 0);

      if (availability.length === 0) {
        alert("Please add at least one day with time slots");
        return;
      }

      const isEditing = Boolean(editingDoctorId);

      const payload: any = {
        name: doctorForm.name,
        email: doctorForm.email,
        phoneNumber: doctorForm.phoneNumber,
        specialization: doctorForm.specialization,
        department: doctorForm.department,
        qualification: doctorForm.qualification,
        experience: Number(doctorForm.experience),
        consultationFee: Number(doctorForm.consultationFee),
        availability,
      };

      // Only send password if creating, or if the admin explicitly typed one while editing
      if (!isEditing || doctorForm.password) {
        payload.password = doctorForm.password;
      }

      const res = await fetch(
        isEditing
          ? `${apiUrl}/doctors/${editingDoctorId}`
          : `${apiUrl}/doctors`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (data.success) {
        alert(
          isEditing
            ? "Doctor profile updated successfully"
            : "Doctor account created successfully",
        );
        resetDoctorForm();
        fetchData();
      } else {
        alert(
          data.message ||
            (isEditing ? "Failed to update doctor" : "Failed to create doctor"),
        );
      }
    } catch (error) {
      alert(
        editingDoctorId ? "Error updating doctor" : "Error creating doctor",
      );
    }
  };

  const handleDeleteDoctor = async (docId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this doctor? All associated user credentials will be removed.",
      )
    )
      return;
    try {
      const res = await fetch(`${apiUrl}/doctors/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert("Doctor deleted successfully");
        fetchData();
      } else {
        alert(data.message || "Failed to delete doctor");
      }
    } catch (err) {
      alert("Error deleting doctor");
    }
  };

  // Patient CRUD
  const resetPatientForm = () => {
    setPatientForm(emptyPatientForm);
    setEditingPatientId(null);
    setShowPatientForm(false);
  };

  const handleOpenAddPatient = () => {
    setPatientForm(emptyPatientForm);
    setEditingPatientId(null);
    setShowPatientForm(true);
  };

  const handleOpenEditPatient = (pat: any) => {
    setPatientForm({
      name: pat.user?.name || "",
      phoneNumber: pat.user?.phoneNumber || "",
      address: pat.address || "",
    });
    setEditingPatientId(pat._id);
    setShowPatientForm(true);
  };

  // const handleSubmitPatient = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!editingPatientId) return; // this form is edit-only; creation happens via Register

  //   try {
  //     const res = await fetch(`${apiUrl}/patients/${editingPatientId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         name: patientForm.name,
  //         phoneNumber: patientForm.phoneNumber,
  //         address: patientForm.address,
  //       }),
  //     });
  //     const data = await res.json();
  //     if (data.success) {
  //       alert("Patient details updated successfully");
  //       resetPatientForm();
  //       fetchData();
  //     } else {
  //       alert(data.message || "Failed to update patient");
  //     }
  //   } catch (error) {
  //     alert("Error updating patient");
  //   }
  // };

  const handleSubmitPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = Boolean(editingPatientId);

    try {
      const res = await fetch(
        isEditing
          ? `${apiUrl}/patients/${editingPatientId}`
          : `${apiUrl}/auth/register`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            // Note: no Authorization header needed for /auth/register — it's
            // a public endpoint. We deliberately do NOT use AuthContext's
            // register() here, since that would overwrite the admin's stored
            // token/session with the new patient's.
            ...(isEditing ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: patientForm.name,
            phoneNumber: patientForm.phoneNumber,
            address: patientForm.address,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        alert(
          isEditing
            ? "Patient details updated successfully"
            : "Patient account created successfully",
        );
        resetPatientForm();
        setCurrentTab("patients"); // ensure we land on the patients table
        fetchData();
      } else {
        alert(
          data.message ||
            (isEditing
              ? "Failed to update patient"
              : "Failed to create patient"),
        );
      }
    } catch (error) {
      alert(isEditing ? "Error updating patient" : "Error creating patient");
    }
  };

  const handleDeletePatient = async (patId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this patient? Their account and records will be removed.",
      )
    )
      return;
    try {
      const res = await fetch(`${apiUrl}/patients/${patId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert("Patient deleted successfully");
        fetchData();
      } else {
        alert(data.message || "Failed to delete patient");
      }
    } catch (err) {
      alert("Error deleting patient");
    }
  };

  // Appointment status toggle
  const handleUpdateAppointment = async (apptId: string, status: string) => {
    try {
      const res = await fetch(`${apiUrl}/appointments/${apptId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.message || "Failed to update appointment");
      }
    } catch (err) {
      alert("Error updating status");
    }
  };

  // Appointment Edit (reschedule)
  const handleOpenEditAppointment = (appt: any) => {
    setEditApptForm({
      date: new Date(appt.date).toISOString().split("T")[0],
      timeSlot: appt.timeSlot || "",
      reason: appt.reason || "",
    });
    setEditingApptId(appt._id);
  };

  const handleCancelEditAppointment = () => {
    setEditingApptId(null);
    setEditApptForm({ date: "", timeSlot: "", reason: "" });
  };

  const handleUpdateAppointmentDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApptId) return;

    if (!editApptForm.date || !editApptForm.timeSlot || !editApptForm.reason) {
      alert("Please fill in all details");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/appointments/${editingApptId}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: editApptForm.date,
          timeSlot: editApptForm.timeSlot,
          reason: editApptForm.reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(
          editingAppt?.status === "confirmed" && data.data?.status === "pending"
            ? "Appointment rescheduled — it now needs to be re-confirmed."
            : "Appointment updated successfully",
        );
        handleCancelEditAppointment();
        fetchData();
      } else {
        alert(data.message || "Failed to update appointment");
      }
    } catch (err) {
      alert("Error updating appointment");
    }
  };

  // Billing Actions
  const handleAddBillItem = () => {
    if (!billForm.itemDesc || billForm.itemAmount <= 0) return;
    setBillForm({
      ...billForm,
      items: [
        ...billForm.items,
        { description: billForm.itemDesc, amount: Number(billForm.itemAmount) },
      ],
      itemDesc: "",
      itemAmount: 0,
    });
  };

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (billForm.items.length === 0) {
      alert("Please add at least one item to the invoice");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/bills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId: billForm.patientId,
          appointmentId: billForm.appointmentId || undefined,
          items: billForm.items,
          dueDate: billForm.dueDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Invoice generated successfully");
        setShowBillForm(false);
        setBillForm({
          patientId: "",
          appointmentId: "",
          itemDesc: "",
          itemAmount: 0,
          items: [],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        });
        fetchData();
      } else {
        alert(data.message || "Failed to generate invoice");
      }
    } catch (err) {
      alert("Error generating bill");
    }
  };

  const handleToggleBillStatus = async (
    billId: string,
    currentStatus: string,
  ) => {
    const nextStatus = currentStatus === "paid" ? "unpaid" : "paid";
    try {
      const res = await fetch(`${apiUrl}/bills/${billId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      alert("Error updating payment status");
    }
  };

  // Doctor info for whichever appointment is currently being edited (used to build the slot dropdown)
  const editingAppt = appointments.find((a) => a._id === editingApptId);
  const editingDocInfo = doctors.find(
    (d) => d._id === (editingAppt?.doctor?._id || editingAppt?.doctor),
  );

  if (loading && doctors.length === 0) {
    return (
      <div className="dashboard-loading">
        <RefreshCw className="animate-spin" size={32} color="#0284c7" />
        <p>Loading dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content fade-in">
      <div className="dashboard-title-row">
        <h1>Admin Control Room</h1>
        <button onClick={fetchData} className="btn btn-secondary btn-sm">
          <RefreshCw size={16} />
          <span>Refresh Data</span>
        </button>
      </div>

      {currentTab === "overview" && (
        <>
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card card">
              <div className="stat-icon-wrapper blue">
                <UserPlus size={24} />
              </div>
              <div className="stat-numbers">
                <h3>{stats.doctorsCount}</h3>
                <p>Doctors On Duty</p>
              </div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon-wrapper green">
                <Users size={24} />
              </div>
              <div className="stat-numbers">
                <h3>{stats.patientsCount}</h3>
                <p>Registered Patients</p>
              </div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon-wrapper warning">
                <Calendar size={24} />
              </div>
              <div className="stat-numbers">
                <h3>{stats.appointmentsCount}</h3>
                <p>Appointments Booked</p>
              </div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon-wrapper info">
                <DollarSign size={24} />
              </div>
              <div className="stat-numbers">
                <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                <p>Revenue Collected</p>
              </div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon-wrapper danger">
                <CreditCard size={24} />
              </div>
              <div className="stat-numbers">
                <h3>{stats.unpaidBills}</h3>
                <p>Pending Invoices</p>
              </div>
            </div>
          </div>

          {/* Quick Schedule Overview */}
          <div className="dashboard-layout-grid">
            <div className="card grid-span-2">
              <div className="card-header-row">
                <h3>Recent Appointments</h3>
              </div>
              {appointments.length === 0 ? (
                <p className="no-data-text">No appointments recorded yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map((appt) => (
                        <tr key={appt._id}>
                          <td>{appt.patient?.user?.name || "N/A"}</td>
                          <td>Dr. {appt.doctor?.user?.name || "N/A"}</td>
                          <td>
                            {new Date(appt.date).toLocaleDateString()} at{" "}
                            {appt.timeSlot}
                          </td>
                          <td>
                            <span
                              className={`badge badge-${
                                appt.status === "confirmed"
                                  ? "success"
                                  : appt.status === "pending"
                                    ? "warning"
                                    : appt.status === "completed"
                                      ? "info"
                                      : "danger"
                              }`}
                            >
                              {appt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {currentTab === "doctors" && (
        <div className="tab-pane-container">
          <div className="card-header-row">
            <h3>Medical Officers Directory</h3>
            <button
              onClick={() =>
                showDoctorForm ? resetDoctorForm() : handleOpenAddDoctor()
              }
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} />
              <span>Add Doctor Account</span>
            </button>
          </div>

          {showDoctorForm && (
            <form
              onSubmit={handleSubmitDoctor}
              className="card inline-form-card fade-in"
            >
              <h4>
                {editingDoctorId
                  ? "Edit Doctor Profile"
                  : "Register New Doctor"}
              </h4>
              <div className="form-grid-three">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={doctorForm.name}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, name: e.target.value })
                    }
                    placeholder="e.g. John Watson"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={doctorForm.email}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, email: e.target.value })
                    }
                    placeholder="drjohn@hospital.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Password{" "}
                    {editingDoctorId && (
                      <span
                        style={{ fontWeight: 400, color: "var(--text-muted)" }}
                      >
                        (leave blank to keep current)
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    required={!editingDoctorId}
                    value={doctorForm.password}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, password: e.target.value })
                    }
                    placeholder="••••••"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={doctorForm.phoneNumber}
                    onChange={(e) =>
                      setDoctorForm({
                        ...doctorForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="9998887776"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={doctorForm.specialization}
                    onChange={(e) =>
                      setDoctorForm({
                        ...doctorForm,
                        specialization: e.target.value,
                      })
                    }
                    placeholder="e.g. Cardiology specialist"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="form-control"
                    value={doctorForm.department}
                    onChange={(e) =>
                      setDoctorForm({
                        ...doctorForm,
                        department: e.target.value,
                      })
                    }
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Critical Care">Critical care</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Qualifications</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={doctorForm.qualification}
                    onChange={(e) =>
                      setDoctorForm({
                        ...doctorForm,
                        qualification: e.target.value,
                      })
                    }
                    placeholder="e.g. MBBS, MD"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={doctorForm.experience}
                    onChange={(e) =>
                      setDoctorForm({
                        ...doctorForm,
                        experience: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={doctorForm.consultationFee}
                    onChange={(e) =>
                      setDoctorForm({
                        ...doctorForm,
                        consultationFee: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              {/* Availability — one row per day, each with its own slots */}
              <div className="availability-builder">
                <div className="availability-builder-header">
                  <label className="form-label">Weekly Availability</label>
                  <button
                    type="button"
                    onClick={handleAddAvailabilityRow}
                    className="btn btn-secondary btn-sm"
                  >
                    <Plus size={14} />
                    <span>Add Day</span>
                  </button>
                </div>

                {availabilityRows.map((row, index) => (
                  <div key={index} className="availability-row">
                    <select
                      className="form-control availability-day-select"
                      value={row.day}
                      onChange={(e) =>
                        handleAvailabilityRowChange(
                          index,
                          "day",
                          e.target.value,
                        )
                      }
                    >
                      {DAY_OPTIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="form-control availability-slots-input"
                      required
                      value={row.slots}
                      onChange={(e) =>
                        handleAvailabilityRowChange(
                          index,
                          "slots",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. 09:00 - 11:00, 15:00 - 17:00"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAvailabilityRow(index)}
                      className="btn btn-danger btn-sm availability-remove-btn"
                      disabled={availabilityRows.length === 1}
                      title={
                        availabilityRows.length === 1
                          ? "At least one day is required"
                          : "Remove this day"
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <p className="availability-hint">
                  Add a separate row for each day the doctor is available — each
                  row can have its own times, so Wednesday mornings and Friday
                  evenings can differ.
                </p>
              </div>

              <div className="form-actions-row">
                <button type="submit" className="btn btn-primary">
                  {editingDoctorId ? "Save Changes" : "Create Doctor Profile"}
                </button>
                <button
                  type="button"
                  onClick={resetDoctorForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {doctors.length === 0 ? (
            <p className="no-data-text">No doctors registered yet.</p>
          ) : (
            <>
              {/* Desktop / tablet table view */}
              <div className="table-responsive fade-in doctors-table-view">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Doctor Name</th>
                      <th>Department</th>
                      <th>Speciality</th>
                      <th>Qualifications</th>
                      <th>Experience</th>
                      <th>Fee (₹)</th>
                      <th>Availability</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doc) => (
                      <tr key={doc._id}>
                        <td className="strong-text">
                          Dr. {doc.user?.name || "N/A"}
                        </td>
                        <td>{doc.department}</td>
                        <td>{doc.specialization}</td>
                        <td>{doc.qualification}</td>
                        <td>{doc.experience} Years</td>
                        <td>₹{doc.consultationFee}</td>
                        <td>
                          {doc.availability?.map((av: any, idx: number) => (
                            <div key={idx} className="availability-slot-badge">
                              <strong>{av.day}</strong>: {av.slots.join(", ")}
                            </div>
                          ))}
                        </td>
                        <td>
                          <div className="table-action-buttons">
                            <button
                              onClick={() => handleOpenEditDoctor(doc)}
                              className="btn btn-secondary btn-sm"
                              title="Edit Profile"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteDoctor(doc._id)}
                              className="btn btn-danger btn-sm"
                              title="Delete Profile"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card view */}
              <div className="doctors-card-view fade-in">
                {doctors.map((doc) => (
                  <div key={doc._id} className="doctor-mobile-card">
                    <div className="doctor-mobile-card-header">
                      <div className="doctor-mobile-avatar">
                        <UserPlus size={18} color="#0284c7" />
                      </div>
                      <div className="doctor-mobile-title">
                        <h5>Dr. {doc.user?.name || "N/A"}</h5>
                        <span className="doc-dept">{doc.department}</span>
                      </div>
                      <div className="doctor-mobile-fee">
                        <span className="doctor-mobile-fee-label">Fee</span>
                        <span className="doctor-mobile-fee-value">
                          ₹{doc.consultationFee}
                        </span>
                      </div>
                    </div>

                    <div className="doctor-mobile-body">
                      <div className="doctor-mobile-row">
                        <span className="doctor-mobile-label">Speciality</span>
                        <span className="doctor-mobile-value">
                          {doc.specialization}
                        </span>
                      </div>
                      <div className="doctor-mobile-row">
                        <span className="doctor-mobile-label">
                          Qualifications
                        </span>
                        <span className="doctor-mobile-value">
                          {doc.qualification}
                        </span>
                      </div>
                      <div className="doctor-mobile-row">
                        <span className="doctor-mobile-label">Experience</span>
                        <span className="doctor-mobile-value">
                          {doc.experience} Years
                        </span>
                      </div>
                    </div>

                    {doc.availability && doc.availability.length > 0 && (
                      <div className="doctor-mobile-availability">
                        <span className="doctor-mobile-label">
                          Availability
                        </span>
                        <div className="doctor-mobile-availability-badges">
                          {doc.availability.map((av: any, idx: number) => (
                            <div key={idx} className="availability-slot-badge">
                              <strong>{av.day}</strong>: {av.slots.join(", ")}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="doctor-mobile-actions">
                      <button
                        onClick={() => handleOpenEditDoctor(doc)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doc._id)}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* {doctors.length === 0 ? (
            <p className="no-data-text">No doctors registered yet.</p>
          ) : (
            <div className="table-responsive fade-in">
              <table className="table">
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Department</th>
                    <th>Speciality</th>
                    <th>Qualifications</th>
                    <th>Experience</th>
                    <th>Fee (₹)</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => (
                    <tr key={doc._id}>
                      <td className="strong-text">
                        Dr. {doc.user?.name || "N/A"}
                      </td>
                      <td>{doc.department}</td>
                      <td>{doc.specialization}</td>
                      <td>{doc.qualification}</td>
                      <td>{doc.experience} Years</td>
                      <td>₹{doc.consultationFee}</td>
                      <td>
                        {doc.availability?.map((av: any, idx: number) => (
                          <div key={idx} className="availability-slot-badge">
                            <strong>{av.day}</strong>: {av.slots.join(", ")}
                          </div>
                        ))}
                      </td>
                      <td>
                        <div className="table-action-buttons">
                          <button
                            onClick={() => handleOpenEditDoctor(doc)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Profile"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(doc._id)}
                            className="btn btn-danger btn-sm"
                            title="Delete Profile"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )} */}
        </div>
      )}

      {/* {currentTab === "patients" && (
        <div className="tab-pane-container">
          <div className="card-header-row">
            <h3>Registered Patients</h3>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("register", {
                state: {
                  from: "admin",
                },
              })
            }
          >
            Add Patient
          </button>

          {showPatientForm && (
            <form
              onSubmit={handleSubmitPatient}
              className="card inline-form-card fade-in"
            >
              <h4>Edit Patient Details</h4>
              <div className="form-grid-three">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={patientForm.name}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, name: e.target.value })
                    }
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={patientForm.phoneNumber}
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="9876543210"
                  />
                </div>
                <div className="form-group grid-span-2-col">
                  <label className="form-label">Place</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={patientForm.address}
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        address: e.target.value,
                      })
                    }
                    placeholder="Street address, City, ZIP Code"
                  />
                </div>
              </div>
              <div className="form-actions-row">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={resetPatientForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {patients.length === 0 ? (
            <p className="no-data-text">
              No patients registered in the database.
            </p>
          ) : (
            <div className="table-responsive fade-in">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>Joined Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((pat) => (
                    <tr key={pat._id}>
                      <td className="strong-text">{pat.user?.name || "N/A"}</td>
                      <td>{pat.user?.phoneNumber || "N/A"}</td>
                      <td>{pat.address}</td>
                      <td>{new Date(pat.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="table-action-buttons">
                          <button
                            onClick={() => handleOpenEditPatient(pat)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Patient"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(pat._id)}
                            className="btn btn-danger btn-sm"
                            title="Delete Patient"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )} */}

      {currentTab === "patients" && (
        <div className="tab-pane-container">
          <div className="card-header-row">
            <h3>Registered Patients</h3>
            <button
              onClick={() =>
                showPatientForm ? resetPatientForm() : handleOpenAddPatient()
              }
              className="btn btn-primary btn-sm"
            >
              <UserPlus size={16} />
              <span>Add Patient</span>
            </button>
          </div>

          {showPatientForm && (
            <form
              onSubmit={handleSubmitPatient}
              className="card inline-form-card fade-in"
            >
              <h4>
                {editingPatientId
                  ? "Edit Patient Details"
                  : "Register New Patient"}
              </h4>
              <div className="form-grid-three">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={patientForm.name}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, name: e.target.value })
                    }
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={patientForm.phoneNumber}
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="9876543210"
                  />
                </div>
                <div className="form-group grid-span-2-col">
                  <label className="form-label">Place</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={patientForm.address}
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        address: e.target.value,
                      })
                    }
                    placeholder="Street address, City, ZIP Code"
                  />
                </div>
              </div>
              <div className="form-actions-row">
                <button type="submit" className="btn btn-primary">
                  {editingPatientId ? "Save Changes" : "Create Patient Account"}
                </button>
                <button
                  type="button"
                  onClick={resetPatientForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {patients.length === 0 ? (
            <p className="no-data-text">
              No patients registered in the database.
            </p>
          ) : (
            <div className="table-responsive fade-in">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>Joined Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((pat) => (
                    <tr key={pat._id}>
                      <td className="strong-text">{pat.user?.name || "N/A"}</td>
                      <td>{pat.user?.phoneNumber || "N/A"}</td>
                      <td>{pat.address}</td>
                      <td>{new Date(pat.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="table-action-buttons">
                          <button
                            onClick={() => handleOpenEditPatient(pat)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Patient"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(pat._id)}
                            className="btn btn-danger btn-sm"
                            title="Delete Patient"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {currentTab === "appointments" && (
        <div className="tab-pane-container">
          <h3>Patient Appointment Schedule</h3>

          {editingApptId && (
            <form
              onSubmit={handleUpdateAppointmentDetails}
              className="card inline-form-card fade-in"
            >
              <h4>Reschedule Appointment</h4>
              <div className="form-grid-three">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={editApptForm.date}
                    onChange={(e) =>
                      setEditApptForm({
                        ...editApptForm,
                        date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group grid-span-2-col">
                  <label className="form-label">Select Available Slot</label>
                  {editingDocInfo?.availability &&
                  editingDocInfo.availability.length > 0 ? (
                    <select
                      className="form-control"
                      required
                      value={editApptForm.timeSlot}
                      onChange={(e) =>
                        setEditApptForm({
                          ...editApptForm,
                          timeSlot: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Choose Time Slot --</option>
                      {editingDocInfo.availability.map((av: any) => (
                        <optgroup key={av._id} label={av.day}>
                          {av.slots.map((slot: string, sIdx: number) => (
                            <option key={sIdx} value={`${av.day}: ${slot}`}>
                              {av.day} - {slot}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Mon: 09:00 - 11:00"
                      value={editApptForm.timeSlot}
                      onChange={(e) =>
                        setEditApptForm({
                          ...editApptForm,
                          timeSlot: e.target.value,
                        })
                      }
                    />
                  )}
                </div>

                <div className="form-group grid-span-2-col">
                  <label className="form-label">Reason for Visit</label>
                  <textarea
                    className="form-control"
                    required
                    rows={3}
                    value={editApptForm.reason}
                    onChange={(e) =>
                      setEditApptForm({
                        ...editApptForm,
                        reason: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-actions-row">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelEditAppointment}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {appointments.length === 0 ? (
            <p className="no-data-text">No appointments booked.</p>
          ) : (
            <div className="table-responsive fade-in">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Reason</th>
                    <th>Date & Slot</th>
                    <th>Status</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt._id}>
                      <td className="strong-text">
                        {appt.patient?.user?.name || "N/A"}
                      </td>
                      <td>
                        Dr. {appt.doctor?.user?.name || "N/A"} (
                        {appt.doctor?.department})
                      </td>
                      <td>{appt.reason}</td>
                      <td>
                        {new Date(appt.date).toLocaleDateString()} -{" "}
                        {appt.timeSlot}
                      </td>
                      <td>
                        <span
                          className={`badge badge-${
                            appt.status === "confirmed"
                              ? "success"
                              : appt.status === "pending"
                                ? "warning"
                                : appt.status === "completed"
                                  ? "info"
                                  : "danger"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-action-buttons">
                          {(appt.status === "pending" ||
                            appt.status === "confirmed") && (
                            <button
                              onClick={() => handleOpenEditAppointment(appt)}
                              className="btn btn-secondary btn-sm"
                              title="Reschedule Appointment"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          {appt.status === "pending" && (
                            <button
                              onClick={() =>
                                handleUpdateAppointment(appt._id, "confirmed")
                              }
                              className="btn btn-secondary btn-sm text-success"
                              title="Confirm Appointment"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          {appt.status !== "cancelled" &&
                            appt.status !== "completed" && (
                              <button
                                onClick={() =>
                                  handleUpdateAppointment(appt._id, "cancelled")
                                }
                                className="btn btn-secondary btn-sm text-danger"
                                title="Cancel Appointment"
                              >
                                <X size={14} />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {currentTab === "bills" && (
        <div className="tab-pane-container">
          <div className="card-header-row">
            <h3>Hospital Billings & Invoices</h3>
            <button
              onClick={() => setShowBillForm(!showBillForm)}
              className="btn btn-primary btn-sm"
            >
              <FilePlus size={16} />
              <span>Generate New Invoice</span>
            </button>
          </div>

          {showBillForm && (
            <form
              onSubmit={handleCreateBill}
              className="card inline-form-card fade-in"
            >
              <h4>Generate Invoice</h4>
              <div className="form-grid-three">
                <div className="form-group">
                  <label className="form-label">Select Patient</label>
                  <select
                    className="form-control"
                    required
                    value={billForm.patientId}
                    onChange={(e) =>
                      setBillForm({ ...billForm, patientId: e.target.value })
                    }
                  >
                    <option value="">-- Select Patient --</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.user?.name} ({p.user?.phoneNumber})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={billForm.dueDate}
                    onChange={(e) =>
                      setBillForm({ ...billForm, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Add line item */}
              <div className="billing-line-item-creator">
                <h5>Invoice Items</h5>
                <div className="line-item-fields">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Item description (e.g. Lab Test, Consultation)"
                    value={billForm.itemDesc}
                    onChange={(e) =>
                      setBillForm({ ...billForm, itemDesc: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Amount (₹)"
                    value={billForm.itemAmount || ""}
                    onChange={(e) =>
                      setBillForm({
                        ...billForm,
                        itemAmount: Number(e.target.value),
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={handleAddBillItem}
                    className="btn btn-secondary"
                  >
                    Add Item
                  </button>
                </div>

                {billForm.items.length > 0 && (
                  <div className="billing-items-list">
                    <h6>Added Items:</h6>
                    <ul>
                      {billForm.items.map((item, idx) => (
                        <li key={idx}>
                          <span>{item.description}</span>
                          <strong>₹{item.amount}</strong>
                        </li>
                      ))}
                    </ul>
                    <div className="bill-total-calc">
                      Total:{" "}
                      <strong>
                        ₹{billForm.items.reduce((s, i) => s + i.amount, 0)}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions-row">
                <button type="submit" className="btn btn-primary">
                  Save and Issue Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setShowBillForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {bills.length === 0 ? (
            <p className="no-data-text">No invoices issued.</p>
          ) : (
            <div className="table-responsive fade-in">
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Patient Name</th>
                    <th>Invoice Items</th>
                    <th>Total Amount (₹)</th>
                    <th>Due Date</th>
                    <th>Payment Status</th>
                    <th>Toggle Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill._id}>
                      <td>#{bill._id.substring(bill._id.length - 8)}</td>
                      <td className="strong-text">
                        {bill.patient?.user?.name || "N/A"}
                      </td>
                      <td>
                        {bill.items?.map((item: any, idx: number) => (
                          <div key={idx} className="bill-list-subitem">
                            • {item.description}: ₹{item.amount}
                          </div>
                        ))}
                      </td>
                      <td className="strong-text">₹{bill.totalAmount}</td>
                      <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge badge-${bill.paymentStatus === "paid" ? "success" : "danger"}`}
                        >
                          {bill.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            handleToggleBillStatus(bill._id, bill.paymentStatus)
                          }
                          className={`btn btn-sm ${bill.paymentStatus === "paid" ? "btn-secondary" : "btn-primary"}`}
                        >
                          Mark as{" "}
                          {bill.paymentStatus === "paid" ? "Unpaid" : "Paid"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
