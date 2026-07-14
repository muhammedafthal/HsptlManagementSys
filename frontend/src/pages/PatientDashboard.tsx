// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import {
//   FileText,
//   CreditCard,
//   User,
//   Info,
//   RefreshCw,
//   Clock,
//   DollarSign,
// } from 'lucide-react';

// interface PatientDashboardProps {
//   currentTab: string;
//   setCurrentTab: (tab: string) => void;
// }

// export const PatientDashboard: React.FC<PatientDashboardProps> = ({ currentTab, setCurrentTab }) => {
//   const { token, apiUrl } = useAuth();

//   // Data States
//   const [doctors, setDoctors] = useState<any[]>([]);
//   const [appointments, setAppointments] = useState<any[]>([]);
//   const [records, setRecords] = useState<any[]>([]);
//   const [bills, setBills] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Filter & Booking Form State
//   const [selectedDepartment, setSelectedDepartment] = useState('All');
//   const [bookingForm, setBookingForm] = useState({
//     doctorId: '',
//     date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // tomorrow
//     timeSlot: '',
//     reason: ''
//   });

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const headers = { 'Authorization': `Bearer ${token}` };

//       // Fetch doctors (to browse/book)
//       const resDocs = await fetch(`${apiUrl}/doctors`);
//       const dataDocs = await resDocs.json();
//       setDoctors(dataDocs.success ? dataDocs.data : []);

//       // Fetch patient's appointments
//       const resAppts = await fetch(`${apiUrl}/appointments`, { headers });
//       const dataAppts = await resAppts.json();
//       setAppointments(dataAppts.success ? dataAppts.data : []);

//       // Fetch patient's medical history
//       const resRecords = await fetch(`${apiUrl}/records`, { headers });
//       const dataRecords = await resRecords.json();
//       setRecords(dataRecords.success ? dataRecords.data : []);

//       // Fetch patient's bills
//       const resBills = await fetch(`${apiUrl}/bills`, { headers });
//       const dataBills = await resBills.json();
//       setBills(dataBills.success ? dataBills.data : []);

//     } catch (err) {
//       console.error('Error fetching patient dashboard data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchData();
//     }
//   }, [token, currentTab]);

//   // Appointment Cancel
//   const handleCancelAppointment = async (apptId: string) => {
//     if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
//     try {
//       const res = await fetch(`${apiUrl}/appointments/${apptId}/cancel`, {
//         method: 'PUT',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert('Appointment cancelled successfully');
//         fetchData();
//       }
//     } catch (err) {
//       alert('Error cancelling appointment');
//     }
//   };

//   // Submit Booking Form
//   const handleBookAppointment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!bookingForm.doctorId || !bookingForm.date || !bookingForm.timeSlot || !bookingForm.reason) {
//       alert('Please fill in all details');
//       return;
//     }

//     try {
//       const res = await fetch(`${apiUrl}/appointments`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           doctorId: bookingForm.doctorId,
//           date: bookingForm.date,
//           timeSlot: bookingForm.timeSlot,
//           reason: bookingForm.reason
//         })
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert('Appointment request submitted successfully!');
//         setBookingForm({
//           doctorId: '',
//           date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//           timeSlot: '',
//           reason: ''
//         });
//         setCurrentTab('appointments'); // switch tab
//       } else {
//         alert(data.message || 'Failed to book appointment');
//       }
//     } catch (err) {
//       alert('Error submitting appointment booking');
//     }
//   };

//   // Mock Payment Gateway
//   const handlePayBill = async (billId: string) => {
//     try {
//       // Simulation call to complete payment
//       const res = await fetch(`${apiUrl}/bills/${billId}/status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ paymentStatus: 'paid' })
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert('Payment processed successfully via MediPay Gateway!');
//         fetchData();
//       }
//     } catch (err) {
//       alert('Error processing mock payment');
//     }
//   };

//   // Filtered Doctors list
//   const filteredDoctors = selectedDepartment === 'All'
//     ? doctors
//     : doctors.filter(d => d.department === selectedDepartment);

//   const selectedDocInfo = doctors.find(d => d._id === bookingForm.doctorId);

//   if (loading && appointments.length === 0) {
//     return (
//       <div className="dashboard-loading">
//         <RefreshCw className="animate-spin" size={32} color="#0284c7" />
//         <p>Retrieving your health profile...</p>
//       </div>
//     );
//   }

//   // Stats
//   const activeVisits = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length;
//   const unpaidBillsCount = bills.filter(b => b.paymentStatus === 'unpaid').length;

//   return (
//     <div className="dashboard-content fade-in">
//       <div className="dashboard-title-row">
//         <h1>Patient Portal</h1>
//         <button onClick={fetchData} className="btn btn-secondary btn-sm">
//           <RefreshCw size={16} />
//           <span>Sync Records</span>
//         </button>
//       </div>

//       {currentTab === 'overview' && (
//         <>
//           {/* Welcome Info */}
//           <div className="welcome-banner card">
//             <h2>Welcome to your Patient Dashboard</h2>
//             <p>Access your doctor prescriptions, book consultation visits, and view pending invoices directly.</p>
//           </div>

//           {/* Quick Metrics */}
//           <div className="stats-grid">
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper warning">
//                 <Clock size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{activeVisits}</h3>
//                 <p>Upcoming Bookings</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper blue">
//                 <FileText size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{records.length}</h3>
//                 <p>Prescriptions Issued</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper danger">
//                 <CreditCard size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{unpaidBillsCount}</h3>
//                 <p>Unpaid Invoices</p>
//               </div>
//             </div>
//           </div>

//           {/* Next Bookings Panel */}
//           <div className="dashboard-layout-grid">
//             <div className="card grid-span-2">
//               <h3>Upcoming Consultation Bookings</h3>
//               {appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length === 0 ? (
//                 <div className="no-bookings-placeholder">
//                   <p>You have no scheduled bookings.</p>
//                   <button onClick={() => setCurrentTab('book_appointment')} className="btn btn-primary btn-sm">
//                     Book First Consultation
//                   </button>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>Doctor</th>
//                         <th>Department</th>
//                         <th>Schedule</th>
//                         <th>Visit Reason</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {appointments
//                         .filter(a => a.status === 'pending' || a.status === 'confirmed')
//                         .slice(0, 5)
//                         .map((appt) => (
//                           <tr key={appt._id}>
//                             <td className="strong-text">Dr. {appt.doctor?.user?.name || 'N/A'}</td>
//                             <td>{appt.doctor?.department}</td>
//                             <td>{new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}</td>
//                             <td>{appt.reason}</td>
//                             <td>
//                               <span className={`badge badge-${appt.status === 'confirmed' ? 'success' : 'warning'}`}>
//                                 {appt.status}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {currentTab === 'book_appointment' && (
//         <div className="tab-pane-container">
//           <h3>Schedule a Doctor Visit</h3>

//           <div className="booking-grid">
//             {/* Step 1: Browse Doctors */}
//             <div className="doctor-browser card">
//               <div className="department-filter-row">
//                 <label className="form-label">Filter Specialty</label>
//                 <select
//                   className="form-control"
//                   value={selectedDepartment}
//                   onChange={e => setSelectedDepartment(e.target.value)}
//                 >
//                   <option value="All">All Specialties</option>
//                   <option value="Cardiology">Cardiology</option>
//                   <option value="Neurology">Neurology</option>
//                   <option value="Pediatrics">Pediatrics</option>
//                   <option value="General Medicine">General Medicine</option>
//                   <option value="Orthopedics">Orthopedics</option>
//                   <option value="Dermatology">Dermatology</option>
//                 </select>
//               </div>

//               <div className="doctors-directory-list">
//                 {filteredDoctors.length === 0 ? (
//                   <p className="no-data-text">No doctors available in this specialty.</p>
//                 ) : (
//                   filteredDoctors.map(doc => (
//                     <div
//                       key={doc._id}
//                       className={`doctor-profile-item ${bookingForm.doctorId === doc._id ? 'selected' : ''}`}
//                       onClick={() => setBookingForm({...bookingForm, doctorId: doc._id, timeSlot: ''})}
//                     >
//                       <div className="doc-avatar-small">
//                         <User size={18} color="#0284c7" />
//                       </div>
//                       <div className="doc-item-details">
//                         <h5>Dr. {doc.user?.name}</h5>
//                         <span className="doc-dept">{doc.department} ({doc.specialization})</span>
//                         <span className="doc-qual">{doc.qualification} • {doc.experience} Years Exp</span>
//                         <div className="doc-fees-slot">
//                           <span>Fee: <strong>₹{doc.consultationFee}</strong></span>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Step 2: Appointment Form */}
//             <div className="booking-details-form card">
//               <h4>Consultation Details</h4>
//               {!bookingForm.doctorId ? (
//                 <div className="form-placeholder-info">
//                   <Info size={24} color="#0284c7" />
//                   <p>Please select a doctor from the directory list on the left to start booking.</p>
//                 </div>
//               ) : (
//                 <form onSubmit={handleBookAppointment} className="fade-in">
//                   <div className="selected-doctor-banner">
//                     <span>Selected: <strong>Dr. {selectedDocInfo?.user?.name}</strong></span>
//                     <span>Department: {selectedDocInfo?.department}</span>
//                   </div>

//                   <div className="form-group">
//                     <label className="form-label">Preferred Date</label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       required
//                       min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // minimum tomorrow
//                       value={bookingForm.date}
//                       onChange={e => setBookingForm({...bookingForm, date: e.target.value})}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label className="form-label">Select Available Slot</label>
//                     {selectedDocInfo?.availability && selectedDocInfo.availability.length > 0 ? (
//                       <select
//                         className="form-control"
//                         required
//                         value={bookingForm.timeSlot}
//                         onChange={e => setBookingForm({...bookingForm, timeSlot: e.target.value})}
//                       >
//                         <option value="">-- Choose Time Slot --</option>
//                         {selectedDocInfo.availability.map((av: any) => (
//                           <optgroup key={av._id} label={av.day}>
//                             {av.slots.map((slot: string, sIdx: number) => (
//                               <option key={sIdx} value={`${av.day}: ${slot}`}>{av.day} - {slot}</option>
//                             ))}
//                           </optgroup>
//                         ))}
//                       </select>
//                     ) : (
//                       <div className="no-slots-warning">
//                         Doctor hasn't configured availability. Defaulting to general slots.
//                         <select
//                           className="form-control"
//                           required
//                           value={bookingForm.timeSlot}
//                           onChange={e => setBookingForm({...bookingForm, timeSlot: e.target.value})}
//                         >
//                           <option value="">-- Choose Slot --</option>
//                           <option value="Monday: 09:00 - 11:00">Monday: 09:00 - 11:00</option>
//                           <option value="Wednesday: 14:00 - 16:00">Wednesday: 14:00 - 16:00</option>
//                           <option value="Friday: 10:00 - 12:00">Friday: 10:00 - 12:00</option>
//                         </select>
//                       </div>
//                     )}
//                   </div>

//                   <div className="form-group">
//                     <label className="form-label">Symptoms / Reason for Consultation</label>
//                     <textarea
//                       className="form-control"
//                       required
//                       rows={3}
//                       placeholder="Explain your medical symptoms briefly..."
//                       value={bookingForm.reason}
//                       onChange={e => setBookingForm({...bookingForm, reason: e.target.value})}
//                     />
//                   </div>

//                   <button type="submit" className="btn btn-primary booking-submit-btn">
//                     Confirm Schedule Booking
//                   </button>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {currentTab === 'appointments' && (
//         <div className="tab-pane-container">
//           <h3>My Booked Consultations</h3>
//           {appointments.length === 0 ? (
//             <p className="no-data-text">You have no booking history.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Doctor</th>
//                     <th>Department</th>
//                     <th>Date & Slot</th>
//                     <th>Reason</th>
//                     <th>Status</th>
//                     <th>Notes/Reminders</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments.map((appt) => (
//                     <tr key={appt._id}>
//                       <td className="strong-text">Dr. {appt.doctor?.user?.name || 'N/A'}</td>
//                       <td>{appt.doctor?.department}</td>
//                       <td>{new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}</td>
//                       <td>{appt.reason}</td>
//                       <td>
//                         <span className={`badge badge-${
//                           appt.status === 'confirmed' ? 'success' :
//                           appt.status === 'pending' ? 'warning' :
//                           appt.status === 'completed' ? 'info' : 'danger'
//                         }`}>
//                           {appt.status}
//                         </span>
//                       </td>
//                       <td>{appt.notes || 'No notes added yet.'}</td>
//                       <td>
//                         {(appt.status === 'pending' || appt.status === 'confirmed') && (
//                           <button
//                             onClick={() => handleCancelAppointment(appt._id)}
//                             className="btn btn-danger btn-sm"
//                           >
//                             Cancel Visit
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === 'records' && (
//         <div className="tab-pane-container">
//           <h3>My Consultation Diagnoses & Prescriptions</h3>
//           {records.length === 0 ? (
//             <p className="no-data-text">No diagnoses recorded yet.</p>
//           ) : (
//             <div className="medical-records-cards-grid fade-in">
//               {records.map((rec) => (
//                 <div key={rec._id} className="card record-details-card">
//                   <div className="record-card-header">
//                     <h4>Dr. {rec.doctor?.user?.name} ({rec.doctor?.department})</h4>
//                     <span className="record-date">{new Date(rec.createdAt).toLocaleDateString()}</span>
//                   </div>
//                   <div className="record-body">
//                     <p><strong>Symptoms reported:</strong> {rec.symptoms}</p>
//                     <p><strong>Diagnosis:</strong> <span className="text-primary strong-text">{rec.diagnosis}</span></p>

//                     {rec.prescription && rec.prescription.length > 0 && (
//                       <div className="record-prescription-box">
//                         <h5>Prescribed Medications:</h5>
//                         <table className="table mini-prescription-table">
//                           <thead>
//                             <tr>
//                               <th>Medicine</th>
//                               <th>Dosage</th>
//                               <th>Frequency</th>
//                               <th>Duration</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {rec.prescription.map((med: any, idx: number) => (
//                               <tr key={idx}>
//                                 <td className="strong-text">{med.medicineName}</td>
//                                 <td>{med.dosage}</td>
//                                 <td>{med.frequency}</td>
//                                 <td>{med.duration}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === 'bills' && (
//         <div className="tab-pane-container">
//           <h3>Hospital Invoices & Payments</h3>
//           {bills.length === 0 ? (
//             <p className="no-data-text">No invoices generated for your account.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Invoice ID</th>
//                     <th>Items Charged</th>
//                     <th>Total Amount (₹)</th>
//                     <th>Due Date</th>
//                     <th>Payment Status</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bills.map((bill) => (
//                     <tr key={bill._id}>
//                       <td>#{bill._id.substring(bill._id.length - 8)}</td>
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
//                         <span className={`badge badge-${bill.paymentStatus === 'paid' ? 'success' : 'danger'}`}>
//                           {bill.paymentStatus}
//                         </span>
//                       </td>
//                       <td>
//                         {bill.paymentStatus === 'unpaid' ? (
//                           <button
//                             onClick={() => handlePayBill(bill._id)}
//                             className="btn btn-primary btn-sm"
//                           >
//                             <DollarSign size={14} />
//                             <span>Pay Bill</span>
//                           </button>
//                         ) : (
//                           <span className="text-success strong-text">Settled</span>
//                         )}
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

// export default PatientDashboard;

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import {
//   FileText,
//   CreditCard,
//   User,
//   Info,
//   RefreshCw,
//   Clock,
//   DollarSign,
//   Edit2,
//   Filter,
//   Stethoscope,
// } from "lucide-react";

// interface PatientDashboardProps {
//   currentTab: string;
//   setCurrentTab: (tab: string) => void;
// }

// export const PatientDashboard: React.FC<PatientDashboardProps> = ({
//   currentTab,
//   setCurrentTab,
// }) => {
//   const { token, apiUrl } = useAuth();

//   // Data States
//   const [doctors, setDoctors] = useState<any[]>([]);
//   const [appointments, setAppointments] = useState<any[]>([]);
//   const [records, setRecords] = useState<any[]>([]);
//   const [bills, setBills] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Filter & Booking Form State
//   const [selectedDepartment, setSelectedDepartment] = useState(" ");
//   const [bookingForm, setBookingForm] = useState({
//     doctorId: "",
//     date: new Date(Date.now() + 24 * 60 * 60 * 1000)
//       .toISOString()
//       .split("T")[0], // tomorrow
//     timeSlot: "",
//     reason: "",
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

//       // Fetch doctors (to browse/book)
//       const resDocs = await fetch(`${apiUrl}/doctors`);
//       const dataDocs = await resDocs.json();
//       setDoctors(dataDocs.success ? dataDocs.data : []);

//       // Fetch patient's appointments
//       const resAppts = await fetch(`${apiUrl}/appointments`, { headers });
//       const dataAppts = await resAppts.json();
//       setAppointments(dataAppts.success ? dataAppts.data : []);

//       // Fetch patient's medical history
//       const resRecords = await fetch(`${apiUrl}/records`, { headers });
//       const dataRecords = await resRecords.json();
//       setRecords(dataRecords.success ? dataRecords.data : []);

//       // Fetch patient's bills
//       const resBills = await fetch(`${apiUrl}/bills`, { headers });
//       const dataBills = await resBills.json();
//       setBills(dataBills.success ? dataBills.data : []);
//     } catch (err) {
//       console.error("Error fetching patient dashboard data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchData();
//     }
//   }, [token, currentTab]);

//   // Appointment Cancel
//   const handleCancelAppointment = async (apptId: string) => {
//     if (!window.confirm("Are you sure you want to cancel this appointment?"))
//       return;
//     try {
//       const res = await fetch(`${apiUrl}/appointments/${apptId}/cancel`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Appointment cancelled successfully");
//         fetchData();
//       }
//     } catch (err) {
//       alert("Error cancelling appointment");
//     }
//   };

//   // Appointment Edit
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

//   const handleUpdateAppointment = async (e: React.FormEvent) => {
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
//           data.data?.status === "pending" && editingAppt?.status === "confirmed"
//             ? "Appointment updated — it now needs to be re-confirmed by the clinic."
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

//   // Submit Booking Form
//   const handleBookAppointment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (
//       !bookingForm.doctorId ||
//       !bookingForm.date ||
//       !bookingForm.timeSlot ||
//       !bookingForm.reason
//     ) {
//       alert("Please fill in all details");
//       return;
//     }

//     try {
//       const res = await fetch(`${apiUrl}/appointments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           doctorId: bookingForm.doctorId,
//           date: bookingForm.date,
//           timeSlot: bookingForm.timeSlot,
//           reason: bookingForm.reason,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Appointment request submitted successfully!");
//         setBookingForm({
//           doctorId: "",
//           date: new Date(Date.now() + 24 * 60 * 60 * 1000)
//             .toISOString()
//             .split("T")[0],
//           timeSlot: "",
//           reason: "",
//         });
//         setCurrentTab("appointments"); // switch tab
//       } else {
//         alert(data.message || "Failed to book appointment");
//       }
//     } catch (err) {
//       alert("Error submitting appointment booking");
//     }
//   };

//   // Mock Payment Gateway
//   const handlePayBill = async (billId: string) => {
//     try {
//       // Simulation call to complete payment
//       const res = await fetch(`${apiUrl}/bills/${billId}/status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ paymentStatus: "paid" }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Payment processed successfully via MediPay Gateway!");
//         fetchData();
//       }
//     } catch (err) {
//       alert("Error processing mock payment");
//     }
//   };

//   const filteredDoctors = selectedDepartment
//     ? doctors.filter((doc) => doc.department === selectedDepartment)
//     : [];

//   const selectedDocInfo = doctors.find((d) => d._id === bookingForm.doctorId);

//   // Doctor info for whichever appointment is currently being edited (used to build the slot dropdown)
//   const editingAppt = appointments.find((a) => a._id === editingApptId);
//   const editingDocInfo = doctors.find(
//     (d) => d._id === editingAppt?.doctor?._id,
//   );

//   if (loading && appointments.length === 0) {
//     return (
//       <div className="dashboard-loading">
//         <RefreshCw className="animate-spin" size={32} color="#0284c7" />
//         <p>Retrieving your health profile...</p>
//       </div>
//     );
//   }

//   // Stats
//   const activeVisits = appointments.filter(
//     (a) => a.status === "confirmed" || a.status === "pending",
//   ).length;
//   const unpaidBillsCount = bills.filter(
//     (b) => b.paymentStatus === "unpaid",
//   ).length;

//   return (
//     <div className="dashboard-content fade-in">
//       <div className="dashboard-title-row">
//         <h1>Patient Portal</h1>
//         <button onClick={fetchData} className="btn btn-secondary btn-sm">
//           <RefreshCw size={16} />
//           <span>Sync Records</span>
//         </button>
//       </div>

//       {currentTab === "overview" && (
//         <>
//           {/* Welcome Info */}
//           <div className="welcome-banner card">
//             <h2>Welcome to your Patient Dashboard</h2>
//             <p>
//               Access your doctor prescriptions, book consultation visits, and
//               view pending invoices directly.
//             </p>
//           </div>

//           {/* Quick Metrics */}
//           <div className="stats-grid">
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper warning">
//                 <Clock size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{activeVisits}</h3>
//                 <p>Upcoming Bookings</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper blue">
//                 <FileText size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{records.length}</h3>
//                 <p>Prescriptions Issued</p>
//               </div>
//             </div>
//             <div className="stat-card card">
//               <div className="stat-icon-wrapper danger">
//                 <CreditCard size={24} />
//               </div>
//               <div className="stat-numbers">
//                 <h3>{unpaidBillsCount}</h3>
//                 <p>Unpaid Invoices</p>
//               </div>
//             </div>
//           </div>

//           {/* Next Bookings Panel */}
//           <div className="dashboard-layout-grid">
//             <div className="card grid-span-2">
//               <h3>Upcoming Consultation Bookings</h3>
//               {appointments.filter(
//                 (a) => a.status === "pending" || a.status === "confirmed",
//               ).length === 0 ? (
//                 <div className="no-bookings-placeholder">
//                   <p>You have no scheduled bookings.</p>
//                   <button
//                     onClick={() => setCurrentTab("book_appointment")}
//                     className="btn btn-primary btn-sm"
//                   >
//                     Book First Consultation
//                   </button>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>Doctor</th>
//                         <th>Department</th>
//                         <th>Schedule</th>
//                         <th>Visit Reason</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {appointments
//                         .filter(
//                           (a) =>
//                             a.status === "pending" || a.status === "confirmed",
//                         )
//                         .slice(0, 5)
//                         .map((appt) => (
//                           <tr key={appt._id}>
//                             <td className="strong-text">
//                               Dr. {appt.doctor?.user?.name || "N/A"}
//                             </td>
//                             <td>{appt.doctor?.department}</td>
//                             <td>
//                               {new Date(appt.date).toLocaleDateString()} at{" "}
//                               {appt.timeSlot}
//                             </td>
//                             <td>{appt.reason}</td>
//                             <td>
//                               <span
//                                 className={`badge badge-${appt.status === "confirmed" ? "success" : "warning"}`}
//                               >
//                                 {appt.status}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {currentTab === "book_appointment" && (
//         <div className="tab-pane-container">
//           <h3>Schedule a Doctor Visit</h3>
//           <div className="booking-grid">
//             <div className="doctor-browser card">
//               <div className="department-filter-row">
//                 <div className="filter-label-group">
//                   <Filter size={16} className="filter-icon" />
//                   <label className="form-label">Filter by Specialty</label>
//                 </div>
//                 <div className="specialty-chip-group">
//                   {[
//                     "Cardiology",
//                     "Neurology",
//                     "Pediatrics",
//                     "General Medicine",
//                     "Orthopedics",
//                     "Dermatology",
//                   ].map((dept) => (
//                     <button
//                       key={dept}
//                       type="button"
//                       className={`specialty-chip ${selectedDepartment === dept ? "active" : ""}`}
//                       onClick={() => setSelectedDepartment(dept)}
//                     >
//                       {dept === "All" ? "All Specialties" : dept}
//                     </button>
//                   ))}
//                 </div>
//                 {selectedDepartment !== "All" && (
//                   <span className="filter-result-count">
//                     {filteredDoctors.length} doctor
//                     {filteredDoctors.length !== 1 ? "s" : ""} found
//                   </span>
//                 )}
//               </div>

//               <div className="doctors-directory-list">
//                 {filteredDoctors.length === 0 ? (
//                   <div className="empty-doctor-list">
//                     <Stethoscope size={28} color="#94a3b8" />
//                     <p className="no-data-text">
//                       {selectedDepartment === "All"
//                         ? "No doctors available right now."
//                         : `No doctors found in ${selectedDepartment}. Try a different specialty.`}
//                     </p>
//                   </div>
//                 ) : (
//                   filteredDoctors.map((doc) => (
//                     <div
//                       key={doc._id}
//                       className={`doctor-profile-item ${bookingForm.doctorId === doc._id ? "selected" : ""}`}
//                       onClick={() =>
//                         setBookingForm({
//                           ...bookingForm,
//                           doctorId: doc._id,
//                           timeSlot: "",
//                         })
//                       }
//                     >
//                       <div className="doc-avatar-small">
//                         <User size={18} color="#0284c7" />
//                       </div>
//                       <div className="doc-item-details">
//                         <h5>Dr. {doc.user?.name}</h5>
//                         <span className="doc-dept">
//                           {doc.department} ({doc.specialization})
//                         </span>
//                         <span className="doc-qual">
//                           {doc.qualification} • {doc.experience} Years Exp
//                         </span>
//                         <div className="doc-fees-slot">
//                           <span>
//                             Fee: <strong>₹{doc.consultationFee}</strong>
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Step 2: Appointment Form */}
//             <div className="booking-details-form card">
//               <h4>Consultation Details</h4>
//               {!bookingForm.doctorId ? (
//                 <div className="form-placeholder-info">
//                   <Info size={24} color="#0284c7" />
//                   <p>
//                     Please select a doctor from the directory list on the left
//                     to start booking.
//                   </p>
//                 </div>
//               ) : (
//                 <form onSubmit={handleBookAppointment} className="fade-in">
//                   <div className="selected-doctor-banner">
//                     <span>
//                       Selected:{" "}
//                       <strong>Dr. {selectedDocInfo?.user?.name}</strong>
//                     </span>
//                     <span>Department: {selectedDocInfo?.department}</span>
//                   </div>

//                   <div className="form-group">
//                     <label className="form-label">Preferred Date</label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       required
//                       min={
//                         new Date(Date.now() + 24 * 60 * 60 * 1000)
//                           .toISOString()
//                           .split("T")[0]
//                       } // minimum tomorrow
//                       value={bookingForm.date}
//                       onChange={(e) =>
//                         setBookingForm({ ...bookingForm, date: e.target.value })
//                       }
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label className="form-label">Select Available Slot</label>
//                     {selectedDocInfo?.availability &&
//                     selectedDocInfo.availability.length > 0 ? (
//                       <select
//                         className="form-control"
//                         required
//                         value={bookingForm.timeSlot}
//                         onChange={(e) =>
//                           setBookingForm({
//                             ...bookingForm,
//                             timeSlot: e.target.value,
//                           })
//                         }
//                       >
//                         <option value="">-- Choose Time Slot --</option>
//                         {selectedDocInfo.availability.map((av: any) => (
//                           <optgroup key={av._id} label={av.day}>
//                             {av.slots.map((slot: string, sIdx: number) => (
//                               <option key={sIdx} value={`${av.day}: ${slot}`}>
//                                 {av.day} - {slot}
//                               </option>
//                             ))}
//                           </optgroup>
//                         ))}
//                       </select>
//                     ) : (
//                       <div className="no-slots-warning">
//                         Doctor hasn't configured availability. Defaulting to
//                         general slots.
//                         <select
//                           className="form-control"
//                           required
//                           value={bookingForm.timeSlot}
//                           onChange={(e) =>
//                             setBookingForm({
//                               ...bookingForm,
//                               timeSlot: e.target.value,
//                             })
//                           }
//                         >
//                           <option value="">-- Choose Slot --</option>
//                           <option value="Monday: 09:00 - 11:00">
//                             Monday: 09:00 - 11:00
//                           </option>
//                           <option value="Wednesday: 14:00 - 16:00">
//                             Wednesday: 14:00 - 16:00
//                           </option>
//                           <option value="Friday: 10:00 - 12:00">
//                             Friday: 10:00 - 12:00
//                           </option>
//                         </select>
//                       </div>
//                     )}
//                   </div>

//                   <div className="form-group">
//                     <label className="form-label">
//                       Symptoms / Reason for Consultation
//                     </label>
//                     <textarea
//                       className="form-control"
//                       required
//                       rows={3}
//                       placeholder="Explain your medical symptoms briefly..."
//                       value={bookingForm.reason}
//                       onChange={(e) =>
//                         setBookingForm({
//                           ...bookingForm,
//                           reason: e.target.value,
//                         })
//                       }
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     className="btn btn-primary booking-submit-btn"
//                   >
//                     Confirm Schedule Booking
//                   </button>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {currentTab === "appointments" && (
//         <div className="tab-pane-container">
//           <h3>My Booked Consultations</h3>

//           {editingApptId && (
//             <form
//               onSubmit={handleUpdateAppointment}
//               className="card inline-form-card fade-in"
//             >
//               <h4>Edit Consultation Booking</h4>
//               <div className="form-grid-three">
//                 <div className="form-group">
//                   <label className="form-label">Preferred Date</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     required
//                     min={
//                       new Date(Date.now() + 24 * 60 * 60 * 1000)
//                         .toISOString()
//                         .split("T")[0]
//                     }
//                     value={editApptForm.date}
//                     onChange={(e) => {
//                       setEditApptForm({
//                         ...editApptForm,
//                         date: e.target.value,
//                       });
//                     }}
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
//                       placeholder="e.g. Monday: 09:00 - 11:00"
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
//                   <label className="form-label">
//                     Symptoms / Reason for Consultation
//                   </label>
//                   <textarea
//                     className="form-control"
//                     required
//                     rows={3}
//                     placeholder="Explain your medical symptoms briefly..."
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
//             <p className="no-data-text">You have no booking history.</p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Doctor</th>
//                     <th>Department</th>
//                     <th>Date & Slot</th>
//                     <th>Reason</th>
//                     <th>Status</th>
//                     <th>Notes/Reminders</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments.map((appt) => (
//                     <tr key={appt._id}>
//                       <td className="strong-text">
//                         Dr. {appt.doctor?.user?.name || "N/A"}
//                       </td>
//                       <td>{appt.doctor?.department}</td>
//                       <td>
//                         {new Date(appt.date).toLocaleDateString()} at{" "}
//                         {appt.timeSlot}
//                       </td>
//                       <td>{appt.reason}</td>
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
//                       <td>{appt.notes || "No notes added yet."}</td>
//                       <td>
//                         {appt.status === "pending" && (
//                           <div className="table-action-buttons">
//                             <button
//                               onClick={() => handleOpenEditAppointment(appt)}
//                               className="btn btn-secondary btn-sm"
//                               title="Edit Booking"
//                             >
//                               Edit
//                               <Edit2 size={14} />
//                             </button>
//                             <button
//                               onClick={() => handleCancelAppointment(appt._id)}
//                               className="btn btn-danger btn-sm"
//                             >
//                               Cancel Visit
//                             </button>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "records" && (
//         <div className="tab-pane-container">
//           <h3>My Consultation Diagnoses & Prescriptions</h3>
//           {records.length === 0 ? (
//             <p className="no-data-text">No diagnoses recorded yet.</p>
//           ) : (
//             <div className="medical-records-cards-grid fade-in">
//               {records.map((rec) => (
//                 <div key={rec._id} className="card record-details-card">
//                   <div className="record-card-header">
//                     <h4>
//                       Dr. {rec.doctor?.user?.name} ({rec.doctor?.department})
//                     </h4>
//                     <span className="record-date">
//                       {new Date(rec.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className="record-body">
//                     <p>
//                       <strong>Symptoms reported:</strong> {rec.symptoms}
//                     </p>
//                     <p>
//                       <strong>Diagnosis:</strong>{" "}
//                       <span className="text-primary strong-text">
//                         {rec.diagnosis}
//                       </span>
//                     </p>

//                     {rec.prescription && rec.prescription.length > 0 && (
//                       <div className="record-prescription-box">
//                         <h5>Prescribed Medications:</h5>
//                         <table className="table mini-prescription-table">
//                           <thead>
//                             <tr>
//                               <th>Medicine</th>
//                               <th>Dosage</th>
//                               <th>Frequency</th>
//                               <th>Duration</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {rec.prescription.map((med: any, idx: number) => (
//                               <tr key={idx}>
//                                 <td className="strong-text">
//                                   {med.medicineName}
//                                 </td>
//                                 <td>{med.dosage}</td>
//                                 <td>{med.frequency}</td>
//                                 <td>{med.duration}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {currentTab === "bills" && (
//         <div className="tab-pane-container">
//           <h3>Hospital Invoices & Payments</h3>
//           {bills.length === 0 ? (
//             <p className="no-data-text">
//               No invoices generated for your account.
//             </p>
//           ) : (
//             <div className="table-responsive fade-in">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Invoice ID</th>
//                     <th>Items Charged</th>
//                     <th>Total Amount (₹)</th>
//                     <th>Due Date</th>
//                     <th>Payment Status</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bills.map((bill) => (
//                     <tr key={bill._id}>
//                       <td>#{bill._id.substring(bill._id.length - 8)}</td>
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
//                         {bill.paymentStatus === "unpaid" ? (
//                           <button
//                             onClick={() => handlePayBill(bill._id)}
//                             className="btn btn-primary btn-sm"
//                           >
//                             <DollarSign size={14} />
//                             <span>Pay Bill</span>
//                           </button>
//                         ) : (
//                           <span className="text-success strong-text">
//                             Settled
//                           </span>
//                         )}
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

// export default PatientDashboard;

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  CreditCard,
  RefreshCw,
  Clock,
  DollarSign,
  Edit2,
  Stethoscope,
} from "lucide-react";

interface PatientDashboardProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onBookingStatusChange?: (hasBookings: boolean) => void;
}

const DEPARTMENTS = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "General Medicine",
  "Orthopedics",
  "Dermatology",
];

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  currentTab,
  setCurrentTab,
  onBookingStatusChange,
}) => {
  const { token, apiUrl } = useAuth();

  // Data States
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [bookingForm, setBookingForm] = useState({
    doctorId: "",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // tomorrow
    timeSlot: "",
    reason: "",
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

      // Fetch doctors (to browse/book)
      const resDocs = await fetch(`${apiUrl}/doctors`);
      const dataDocs = await resDocs.json();
      setDoctors(dataDocs.success ? dataDocs.data : []);

      // Fetch patient's appointments
      const resAppts = await fetch(`${apiUrl}/appointments`, { headers });
      const dataAppts = await resAppts.json();
      setAppointments(dataAppts.success ? dataAppts.data : []);

      // Fetch patient's medical history
      const resRecords = await fetch(`${apiUrl}/records`, { headers });
      const dataRecords = await resRecords.json();
      setRecords(dataRecords.success ? dataRecords.data : []);

      // Fetch patient's bills
      const resBills = await fetch(`${apiUrl}/bills`, { headers });
      const dataBills = await resBills.json();
      setBills(dataBills.success ? dataBills.data : []);
    } catch (err) {
      console.error("Error fetching patient dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, currentTab]);

  // Report booking status up to App.tsx once we've actually checked.
  // This is what drives whether the Sidebar renders at all.
  useEffect(() => {
    if (!loading) {
      onBookingStatusChange?.(appointments.length > 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, appointments]);

  // Appointment Cancel
  const handleCancelAppointment = async (apptId: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;
    try {
      const res = await fetch(`${apiUrl}/appointments/${apptId}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert("Appointment cancelled successfully");
        fetchData();
      }
    } catch (err) {
      alert("Error cancelling appointment");
    }
  };

  // Appointment Edit
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

  const handleUpdateAppointment = async (e: React.FormEvent) => {
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
          data.data?.status === "pending" && editingAppt?.status === "confirmed"
            ? "Appointment updated — it now needs to be re-confirmed by the clinic."
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

  // Submit Booking Form
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !bookingForm.doctorId ||
      !bookingForm.date ||
      !bookingForm.timeSlot ||
      !bookingForm.reason
    ) {
      alert("Please fill in all details");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: bookingForm.doctorId,
          date: bookingForm.date,
          timeSlot: bookingForm.timeSlot,
          reason: bookingForm.reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Appointment request submitted successfully!");
        setSelectedDepartment("");
        setBookingForm({
          doctorId: "",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          timeSlot: "",
          reason: "",
        });
        setCurrentTab("appointments"); // switch tab
        fetchData(); // re-check appointment count -> reveals sidebar
      } else {
        alert(data.message || "Failed to book appointment");
      }
    } catch (err) {
      alert("Error submitting appointment booking");
    }
  };

  // Mock Payment Gateway
  const handlePayBill = async (billId: string) => {
    try {
      const res = await fetch(`${apiUrl}/bills/${billId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus: "paid" }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Payment processed successfully via MediPay Gateway!");
        fetchData();
      }
    } catch (err) {
      alert("Error processing mock payment");
    }
  };

  const filteredDoctors = selectedDepartment
    ? doctors.filter((doc) => doc.department === selectedDepartment)
    : [];

  const selectedDocInfo = doctors.find((d) => d._id === bookingForm.doctorId);

  const editingAppt = appointments.find((a) => a._id === editingApptId);
  const editingDocInfo = doctors.find(
    (d) => d._id === editingAppt?.doctor?._id,
  );

  const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // --- Reusable single-form booking UI (Register-style) ---
  const renderBookingForm = () => (
    <div className="register-card booking-form-card">
      <div className="login-header">
        <div className="login-logo-circle">
          <Stethoscope size={32} color="#0284c7" />
        </div>
        <h1>Book an Appointment</h1>
        <p>Choose a specialty and doctor to schedule your consultation.</p>
      </div>

      <form onSubmit={handleBookAppointment} className="register-grid-form">
        <div className="form-group grid-col-2">
          <label className="form-label">Specialty / Department</label>
          <div className="specialty-chip-group">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                type="button"
                className={`specialty-chip ${selectedDepartment === dept ? "active" : ""}`}
                onClick={() => {
                  setSelectedDepartment(dept);
                  setBookingForm({
                    ...bookingForm,
                    doctorId: "",
                    timeSlot: "",
                  });
                }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group grid-col-2">
          <label className="form-label">Select Doctor</label>
          <select
            className="form-control"
            required
            disabled={!selectedDepartment}
            value={bookingForm.doctorId}
            onChange={(e) =>
              setBookingForm({
                ...bookingForm,
                doctorId: e.target.value,
                timeSlot: "",
              })
            }
          >
            <option value="">
              {!selectedDepartment
                ? "Select a specialty first"
                : filteredDoctors.length === 0
                  ? "No doctors available in this specialty"
                  : "-- Select Doctor --"}
            </option>
            {filteredDoctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                Dr. {doc.user?.name} • {doc.qualification} • ₹
                {doc.consultationFee}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Preferred Date</label>
          <input
            type="date"
            className="form-control"
            required
            min={tomorrowStr}
            value={bookingForm.date}
            onChange={(e) =>
              setBookingForm({ ...bookingForm, date: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">Time Slot</label>
          {selectedDocInfo?.availability &&
          selectedDocInfo.availability.length > 0 ? (
            <select
              className="form-control"
              required
              value={bookingForm.timeSlot}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, timeSlot: e.target.value })
              }
            >
              <option value="">-- Choose Time Slot --</option>
              {selectedDocInfo.availability.map((av: any) => (
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
            <select className="form-control" disabled required value="">
              <option value="">
                {bookingForm.doctorId
                  ? "Doctor has no availability configured"
                  : "Select a doctor first"}
              </option>
            </select>
          )}
        </div>

        <div className="form-group grid-col-2">
          <label className="form-label">
            Symptoms / Reason for Consultation
          </label>
          <textarea
            className="form-control"
            required
            rows={3}
            placeholder="Explain your medical symptoms briefly..."
            value={bookingForm.reason}
            onChange={(e) =>
              setBookingForm({ ...bookingForm, reason: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary register-submit-btn grid-col-2"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );

  if (loading && appointments.length === 0) {
    return (
      <div className="dashboard-loading">
        <RefreshCw className="animate-spin" size={32} color="#0284c7" />
        <p>Retrieving your health profile...</p>
      </div>
    );
  }

  // First-time patient with zero appointments: show ONLY the booking
  // form, full-page style, no sidebar (handled by App.tsx), no tabs.
  if (!loading && appointments.length === 0) {
    return (
      <div className="login-page-container fade-in">{renderBookingForm()}</div>
    );
  }

  // Stats
  const activeVisits = appointments.filter(
    (a) => a.status === "confirmed" || a.status === "pending",
  ).length;
  const unpaidBillsCount = bills.filter(
    (b) => b.paymentStatus === "unpaid",
  ).length;

  return (
    <div className="dashboard-content fade-in">
      <div className="dashboard-title-row">
        <h1>Patient Portal</h1>
        <button onClick={fetchData} className="btn btn-secondary btn-sm">
          <RefreshCw size={16} />
          <span>Sync Records</span>
        </button>
      </div>

      {currentTab === "overview" && (
        <>
          <div className="welcome-banner card">
            <h2>Welcome to your Patient Dashboard</h2>
            <p>
              Access your doctor prescriptions, book consultation visits, and
              view pending invoices directly.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card card">
              <div className="stat-icon-wrapper warning">
                <Clock size={24} />
              </div>
              <div className="stat-numbers">
                <h3>{activeVisits}</h3>
                <p>Upcoming Bookings</p>
              </div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon-wrapper blue">
                <FileText size={24} />
              </div>
              <div className="stat-numbers">
                <h3>{records.length}</h3>
                <p>Prescriptions Issued</p>
              </div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon-wrapper danger">
                <CreditCard size={24} />
              </div>
              <div className="stat-numbers">
                <h3>{unpaidBillsCount}</h3>
                <p>Unpaid Invoices</p>
              </div>
            </div>
          </div>

          <div className="dashboard-layout-grid">
            <div className="card grid-span-2">
              <h3>Upcoming Consultation Bookings</h3>
              {appointments.filter(
                (a) => a.status === "pending" || a.status === "confirmed",
              ).length === 0 ? (
                <div className="no-bookings-placeholder">
                  <p>You have no scheduled bookings.</p>
                  {/* <button
                    onClick={() => setCurrentTab("book_appointment")}
                    className="btn btn-primary btn-sm"
                  >
                    Book First Consultation
                  </button> */}

                  <button
                    onClick={() => setCurrentTab("book_appointment")}
                    className="btn btn-primary btn-sm"
                  >
                    Book First Consultation
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Doctor</th>
                        <th>Department</th>
                        <th>Schedule</th>
                        <th>Visit Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments
                        .filter(
                          (a) =>
                            a.status === "pending" || a.status === "confirmed",
                        )
                        .slice(0, 5)
                        .map((appt) => (
                          <tr key={appt._id}>
                            <td className="strong-text">
                              Dr. {appt.doctor?.user?.name || "N/A"}
                            </td>
                            <td>{appt.doctor?.department}</td>
                            <td>
                              {new Date(appt.date).toLocaleDateString()} at{" "}
                              {appt.timeSlot}
                            </td>
                            <td>{appt.reason}</td>
                            <td>
                              <span
                                className={`badge badge-${appt.status === "confirmed" ? "success" : "warning"}`}
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

      {currentTab === "book_appointment" && (
        <div className="tab-pane-container centered-form-pane">
          <h3>Schedule a Doctor Visit</h3>
          {renderBookingForm()}
        </div>
      )}

      {currentTab === "appointments" && (
        <div className="tab-pane-container">
          <h3>My Booked Consultations</h3>

          {editingApptId && (
            <form
              onSubmit={handleUpdateAppointment}
              className="card inline-form-card fade-in"
            >
              <h4>Edit Consultation Booking</h4>
              <div className="form-grid-three">
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    min={tomorrowStr}
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
                      placeholder="e.g. Monday: 09:00 - 11:00"
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
                  <label className="form-label">
                    Symptoms / Reason for Consultation
                  </label>
                  <textarea
                    className="form-control"
                    required
                    rows={3}
                    placeholder="Explain your medical symptoms briefly..."
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
            <p className="no-data-text">You have no booking history.</p>
          ) : (
            <div className="table-responsive fade-in">
              <table className="table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Date & Slot</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Notes/Reminders</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt._id}>
                      <td className="strong-text">
                        Dr. {appt.doctor?.user?.name || "N/A"}
                      </td>
                      <td>{appt.doctor?.department}</td>
                      <td>
                        {new Date(appt.date).toLocaleDateString()} at{" "}
                        {appt.timeSlot}
                      </td>
                      <td>{appt.reason}</td>
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
                      <td>{appt.notes || "No notes added yet."}</td>
                      <td>
                        {appt.status === "pending" && (
                          <div className="table-action-buttons">
                            <button
                              onClick={() => handleOpenEditAppointment(appt)}
                              className="btn btn-secondary btn-sm"
                              title="Edit Booking"
                            >
                              Edit
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(appt._id)}
                              className="btn btn-danger btn-sm"
                            >
                              Cancel Visit
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {currentTab === "records" && (
        <div className="tab-pane-container">
          <h3>My Consultation Diagnoses & Prescriptions</h3>
          {records.length === 0 ? (
            <p className="no-data-text">No diagnoses recorded yet.</p>
          ) : (
            <div className="medical-records-cards-grid fade-in">
              {records.map((rec) => (
                <div key={rec._id} className="card record-details-card">
                  <div className="record-card-header">
                    <h4>
                      Dr. {rec.doctor?.user?.name} ({rec.doctor?.department})
                    </h4>
                    <span className="record-date">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="record-body">
                    <p>
                      <strong>Symptoms reported:</strong> {rec.symptoms}
                    </p>
                    <p>
                      <strong>Diagnosis:</strong>{" "}
                      <span className="text-primary strong-text">
                        {rec.diagnosis}
                      </span>
                    </p>

                    {rec.prescription && rec.prescription.length > 0 && (
                      <div className="record-prescription-box">
                        <h5>Prescribed Medications:</h5>
                        <table className="table mini-prescription-table">
                          <thead>
                            <tr>
                              <th>Medicine</th>
                              <th>Dosage</th>
                              <th>Frequency</th>
                              <th>Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rec.prescription.map((med: any, idx: number) => (
                              <tr key={idx}>
                                <td className="strong-text">
                                  {med.medicineName}
                                </td>
                                <td>{med.dosage}</td>
                                <td>{med.frequency}</td>
                                <td>{med.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {currentTab === "bills" && (
        <div className="tab-pane-container">
          <h3>Hospital Invoices & Payments</h3>
          {bills.length === 0 ? (
            <p className="no-data-text">
              No invoices generated for your account.
            </p>
          ) : (
            <div className="table-responsive fade-in">
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Items Charged</th>
                    <th>Total Amount (₹)</th>
                    <th>Due Date</th>
                    <th>Payment Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill._id}>
                      <td>#{bill._id.substring(bill._id.length - 8)}</td>
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
                        {bill.paymentStatus === "unpaid" ? (
                          <button
                            onClick={() => handlePayBill(bill._id)}
                            className="btn btn-primary btn-sm"
                          >
                            <DollarSign size={14} />
                            <span>Pay Bill</span>
                          </button>
                        ) : (
                          <span className="text-success strong-text">
                            Settled
                          </span>
                        )}
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

export default PatientDashboard;
