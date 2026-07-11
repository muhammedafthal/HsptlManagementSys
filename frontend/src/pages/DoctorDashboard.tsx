import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  PlusCircle, 
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';

interface DoctorDashboardProps {
  currentTab: string;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ currentTab }) => {
  const { token, apiUrl } = useAuth();
  
  // Data States
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Consultation Form State
  const [activeConsultationAppt, setActiveConsultationAppt] = useState<any>(null);
  const [consultForm, setConsultForm] = useState({
    symptoms: '',
    diagnosis: '',
    medName: '',
    medDosage: '',
    medFreq: 'Once daily after food',
    medDur: '5 days',
    prescription: [] as { medicineName: string; dosage: string; frequency: string; duration: string }[]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch appointments (will be filtered by user context inside controller)
      const resAppts = await fetch(`${apiUrl}/appointments`, { headers });
      const dataAppts = await resAppts.json();
      const apptsList = dataAppts.success ? dataAppts.data : [];
      setAppointments(apptsList);

      // Fetch consultations
      const resRecords = await fetch(`${apiUrl}/records`, { headers });
      const dataRecords = await resRecords.json();
      const recordsList = dataRecords.success ? dataRecords.data : [];
      setRecords(recordsList);

      // Fetch all patients for directory
      const resPatients = await fetch(`${apiUrl}/patients`, { headers });
      const dataPatients = await resPatients.json();
      const patientsList = dataPatients.success ? dataPatients.data : [];
      setPatients(patientsList);

    } catch (err) {
      console.error('Error fetching doctor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, currentTab]);

  // Appointment Cancel
  const handleCancelAppointment = async (apptId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await fetch(`${apiUrl}/appointments/${apptId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert('Appointment cancelled successfully');
        fetchData();
      }
    } catch (err) {
      alert('Error cancelling appointment');
    }
  };

  // Add prescription item to consultation form
  const handleAddMedication = () => {
    if (!consultForm.medName || !consultForm.medDosage) return;
    setConsultForm({
      ...consultForm,
      prescription: [
        ...consultForm.prescription,
        {
          medicineName: consultForm.medName,
          dosage: consultForm.medDosage,
          frequency: consultForm.medFreq,
          duration: consultForm.medDur
        }
      ],
      medName: '',
      medDosage: ''
    });
  };

  const handleRemoveMedication = (idx: number) => {
    const list = [...consultForm.prescription];
    list.splice(idx, 1);
    setConsultForm({ ...consultForm, prescription: list });
  };

  // Submit patient consultation and generate medical record
  const handleSubmitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultForm.symptoms || !consultForm.diagnosis) {
      alert('Symptoms and Diagnosis are required');
      return;
    }
    
    try {
      const payload = {
        appointmentId: activeConsultationAppt._id,
        patientId: activeConsultationAppt.patient?._id,
        symptoms: consultForm.symptoms,
        diagnosis: consultForm.diagnosis,
        prescription: consultForm.prescription
      };

      const res = await fetch(`${apiUrl}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert('Consultation saved successfully. Appointment completed.');
        setActiveConsultationAppt(null);
        setConsultForm({
          symptoms: '',
          diagnosis: '',
          medName: '',
          medDosage: '',
          medFreq: 'Once daily after food',
          medDur: '5 days',
          prescription: []
        });
        fetchData();
      } else {
        alert(data.message || 'Failed to submit consultation record');
      }
    } catch (err) {
      alert('Error saving consultation record');
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="dashboard-loading">
        <RefreshCw className="animate-spin" size={32} color="#0284c7" />
        <p>Loading clinic schedule...</p>
      </div>
    );
  }

  // Count stats
  const pendingCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="dashboard-content fade-in">
      <div className="dashboard-title-row">
        <h1>Doctor consultation board</h1>
        <button onClick={fetchData} className="btn btn-secondary btn-sm">
          <RefreshCw size={16} />
          <span>Refresh List</span>
        </button>
      </div>

      {currentTab === 'overview' && (
        <>
          {/* Clinic Stats */}
          <div className="stats-grid">
            <div className="stat-card card">
              <div className="stat-icon-wrapper warning">
                <Clock size={24} />
              </div>
              <div className="stat-numbers">
                <h3>{pendingCount}</h3>
                <p>Scheduled Visits</p>
              </div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon-wrapper green">
                <CheckCircle size={24} />
              </div>
              <div className="stat-numbers">
                <h3>{completedCount}</h3>
                <p>Completed Visits</p>
              </div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon-wrapper blue">
                <FileText size={24} />
              </div>
              <div className="stat-numbers">
                <h3>{records.length}</h3>
                <p>Diagnoses Handled</p>
              </div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon-wrapper info">
                <Users size={24} />
              </div>
              <div className="stat-numbers">
                <h3>{patients.length}</h3>
                <p>Hospital Directory</p>
              </div>
            </div>
          </div>

          {/* Today's Schedule panel */}
          <div className="dashboard-layout-grid">
            <div className="card grid-span-2">
              <h3>Today's Scheduled Consultations</h3>
              {appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length === 0 ? (
                <p className="no-data-text">You have no pending consultations today.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Slot</th>
                        <th>Reason for Visit</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments
                        .filter(a => a.status === 'pending' || a.status === 'confirmed')
                        .slice(0, 5)
                        .map((appt) => (
                          <tr key={appt._id}>
                            <td className="strong-text">{appt.patient?.user?.name || 'N/A'}</td>
                            <td>{appt.timeSlot}</td>
                            <td>{appt.reason}</td>
                            <td>
                              <button 
                                onClick={() => setActiveConsultationAppt(appt)} 
                                className="btn btn-primary btn-sm"
                              >
                                <PlusCircle size={14} />
                                <span>Consult Patient</span>
                              </button>
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

      {currentTab === 'appointments' && (
        <div className="tab-pane-container">
          <h3>My Appointments Board</h3>
          
          {/* Active consultation wizard modal/card overlay */}
          {activeConsultationAppt && (
            <div className="card active-consultation-wizard fade-in">
              <div className="card-header-row">
                <h4>Consulting Patient: {activeConsultationAppt.patient?.user?.name}</h4>
                <button onClick={() => setActiveConsultationAppt(null)} className="btn btn-danger btn-sm">Close Wizard</button>
              </div>
              <div className="patient-quick-card">
                <span><strong>Gender</strong>: {activeConsultationAppt.patient?.gender}</span>
                <span><strong>Age/DOB</strong>: {new Date(activeConsultationAppt.patient?.dateOfBirth).toLocaleDateString()}</span>
                <span><strong>Blood Group</strong>: {activeConsultationAppt.patient?.bloodGroup}</span>
                <span><strong>Reason</strong>: {activeConsultationAppt.reason}</span>
              </div>
              
              <form onSubmit={handleSubmitConsultation} className="consult-form">
                <div className="form-group">
                  <label className="form-label">Patient Symptoms *</label>
                  <textarea 
                    className="form-control" 
                    required 
                    rows={2} 
                    placeholder="Describe symptoms (e.g. fever, headache, bodyache)"
                    value={consultForm.symptoms}
                    onChange={e => setConsultForm({...consultForm, symptoms: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Diagnosis / Impression *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    placeholder="Enter diagnosis (e.g. Viral Fever)"
                    value={consultForm.diagnosis}
                    onChange={e => setConsultForm({...consultForm, diagnosis: e.target.value})}
                  />
                </div>

                <div className="prescription-wizard-section">
                  <h5>Prescription Pad</h5>
                  <div className="prescribe-row">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Medicine name (e.g. Paracetamol)" 
                      value={consultForm.medName} 
                      onChange={e => setConsultForm({...consultForm, medName: e.target.value})}
                    />
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Dosage (e.g. 500mg)" 
                      value={consultForm.medDosage} 
                      onChange={e => setConsultForm({...consultForm, medDosage: e.target.value})}
                    />
                    <select 
                      className="form-control" 
                      value={consultForm.medFreq} 
                      onChange={e => setConsultForm({...consultForm, medFreq: e.target.value})}
                    >
                      <option value="Once daily after food">Once daily after food</option>
                      <option value="Once daily empty stomach">Once daily empty stomach</option>
                      <option value="Twice a day (1-0-1)">Twice a day (1-0-1)</option>
                      <option value="Thrice a day (1-1-1)">Thrice a day (1-1-1)</option>
                      <option value="As needed (SOS)">As needed (SOS)</option>
                    </select>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Duration (e.g. 5 days)" 
                      value={consultForm.medDur} 
                      onChange={e => setConsultForm({...consultForm, medDur: e.target.value})}
                    />
                    <button type="button" onClick={handleAddMedication} className="btn btn-secondary">
                      <Plus size={16} />
                    </button>
                  </div>

                  {consultForm.prescription.length > 0 && (
                    <div className="prescription-preview-table-wrapper">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Medicine</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Duration</th>
                            <th>Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {consultForm.prescription.map((med, idx) => (
                            <tr key={idx}>
                              <td className="strong-text">{med.medicineName}</td>
                              <td>{med.dosage}</td>
                              <td>{med.frequency}</td>
                              <td>{med.duration}</td>
                              <td>
                                <button type="button" onClick={() => handleRemoveMedication(idx)} className="btn btn-danger btn-sm">
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="form-actions-row">
                  <button type="submit" className="btn btn-primary">Complete Consultation & Save</button>
                  <button type="button" onClick={() => setActiveConsultationAppt(null)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {appointments.length === 0 ? (
            <p className="no-data-text">No appointments found on your board.</p>
          ) : (
            <div className="table-responsive fade-in">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Gender</th>
                    <th>Blood Group</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt._id}>
                      <td className="strong-text">{appt.patient?.user?.name || 'N/A'}</td>
                      <td>{appt.patient?.gender}</td>
                      <td className="blood-type">{appt.patient?.bloodGroup}</td>
                      <td>{new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}</td>
                      <td>{appt.reason}</td>
                      <td>
                        <span className={`badge badge-${
                          appt.status === 'confirmed' ? 'success' : 
                          appt.status === 'pending' ? 'warning' : 
                          appt.status === 'completed' ? 'info' : 'danger'
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-action-buttons">
                          {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                            <>
                              <button 
                                onClick={() => setActiveConsultationAppt(appt)} 
                                className="btn btn-primary btn-sm"
                                title="Consult Patient"
                              >
                                <PlusCircle size={14} />
                                <span>Consult</span>
                              </button>
                              <button 
                                onClick={() => handleCancelAppointment(appt._id)} 
                                className="btn btn-danger btn-sm"
                                title="Cancel Appointment"
                              >
                                <span>Cancel</span>
                              </button>
                            </>
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

      {currentTab === 'records' && (
        <div className="tab-pane-container">
          <h3>My Diagnoses & Medical History</h3>
          {records.length === 0 ? (
            <p className="no-data-text">You haven't filed any medical records yet.</p>
          ) : (
            <div className="medical-records-cards-grid fade-in">
              {records.map((rec) => (
                <div key={rec._id} className="card record-details-card">
                  <div className="record-card-header">
                    <h4>Patient: {rec.patient?.user?.name}</h4>
                    <span className="record-date">{new Date(rec.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="record-body">
                    <p><strong>Symptoms:</strong> {rec.symptoms}</p>
                    <p><strong>Diagnosis:</strong> <span className="text-primary strong-text">{rec.diagnosis}</span></p>
                    
                    {rec.prescription && rec.prescription.length > 0 && (
                      <div className="record-prescription-box">
                        <h5>Prescribed Medications:</h5>
                        <ul>
                          {rec.prescription.map((med: any, idx: number) => (
                            <li key={idx}>
                              <strong>{med.medicineName}</strong> - {med.dosage} ({med.frequency} for {med.duration})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {currentTab === 'patients' && (
        <div className="tab-pane-container">
          <h3>Clinic Patient Directory</h3>
          {patients.length === 0 ? (
            <p className="no-data-text">No patients found in directory.</p>
          ) : (
            <div className="table-responsive fade-in">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Gender</th>
                    <th>Date of Birth</th>
                    <th>Blood Group</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((pat) => (
                    <tr key={pat._id}>
                      <td className="strong-text">{pat.user?.name || 'N/A'}</td>
                      <td>{pat.gender}</td>
                      <td>{new Date(pat.dateOfBirth).toLocaleDateString()}</td>
                      <td className="blood-type">{pat.bloodGroup}</td>
                      <td>{pat.user?.phoneNumber || 'N/A'}</td>
                      <td>{pat.address}</td>
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

export default DoctorDashboard;
