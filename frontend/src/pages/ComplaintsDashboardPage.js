import React, { useEffect, useState, useContext } from 'react';
import { complaintService, userService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './MasterScreen.css';

const ComplaintsDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, assigned: 0, closed: 0 });
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignTarget, setAssignTarget] = useState({ complaintId: null, assignee: '' });
  const [statusTarget, setStatusTarget] = useState({ complaintId: null, status: '' });

  useEffect(() => {
    const load = async () => {
      try {
        setListLoading(true);
        const res = await complaintService.getAll();
        setComplaints(res.data || []);
        // fetch stats too
        try {
          const s = await complaintService.getStats();
          setStats(s.data || { total: 0, pending: 0, assigned: 0, closed: 0 });
        } catch (e) { }
      } catch (err) {
        setError('Failed to load complaints');
      } finally {
        setListLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (user?.role === 'SuperAdmin') {
      userService.getAll().then((res) => setUsers(res.data || [])).catch(() => { });
    }
  }, [user]);

  const refresh = async () => {
    try {
      const res = await complaintService.getAll();
      setComplaints(res.data || []);
      try {
        const s = await complaintService.getStats();
        setStats(s.data || { total: 0, pending: 0, assigned: 0, closed: 0 });
      } catch (e) { }
    } catch (e) { }
  };

  const handleAssignClick = (id) => setAssignTarget({ complaintId: id, assignee: '' });
  const handleAssignSubmit = async () => {
    if (!assignTarget.assignee) return setError('Select an assignee');
    try {
      await complaintService.assign(assignTarget.complaintId, assignTarget.assignee);
      setAssignTarget({ complaintId: null, assignee: '' });
      refresh();
    } catch (err) { setError('Failed to assign'); }
  };

  const handleStatusClick = (id) => setStatusTarget({ complaintId: id, status: '' });
  const handleStatusSubmit = async () => {
    if (!statusTarget.status) return setError('Select a status');
    try {
      await complaintService.updateStatus(statusTarget.complaintId, statusTarget.status);
      setStatusTarget({ complaintId: null, status: '' });
      refresh();
    } catch (err) { setError('Failed to update status'); }
  };

  const handleClose = async (id) => {
    try {
      await complaintService.updateStatus(id, 'Closed');
      refresh();
    } catch (err) { setError('Failed to close'); }
  };

  return (
    <div className="master-screen">
      <div className="screen-header"><h1>Complaints Dashboard</h1></div>
      {error && <div className="error-message">{error}</div>}

      <div style={{ marginTop: 12 }}>
        <div className="dashboard-stats">
          <div className="stat-card total">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Complaints</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
          <div className="stat-card assigned">
            <div className="stat-value">{stats.assigned}</div>
            <div className="stat-label">Active Assigned</div>
          </div>
          <div className="stat-card closed">
            <div className="stat-value">{stats.closed}</div>
            <div className="stat-label">Successfully Closed</div>
          </div>
        </div>
        {listLoading ? <p>Loading...</p> : (
          <div className="table-container">
            <table className="master-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Block</th>
                  <th>Room</th>
                  <th>Type</th>
                  <th>Remarks</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Attachment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => {
                  const isAssignee = c.assignedTo && String(c.assignedTo._id || c.assignedTo) === String(user?.id || user?._id);
                  return (
                    <tr key={c._id}>
                      <td>{new Date(c.createdAt).toLocaleString()}</td>
                      <td>{c.blockName}</td>
                      <td>{c.roomNumber}</td>
                      <td>{c.complaintType}</td>
                      <td>{c.remarks || '-'}</td>
                      <td>{c.status}</td>
                      <td>{c.createdBy?.username || c.createdBy?.email || '-'}</td>
                      <td>{c.attachment ? (<a href={`http://localhost:5000${c.attachment}`} target="_blank" rel="noreferrer">View</a>) : '-'}</td>
                      <td>
                        <div className="actions-cell">
                          {(isAssignee || user?.role === 'SuperAdmin') && c.status !== 'Closed' && (
                            <button onClick={() => handleClose(c._id)} className="btn-primary" style={{ padding: '8px 12px' }}>Mark Completed</button>
                          )}

                          {user?.role === 'SuperAdmin' && (
                            assignTarget.complaintId === c._id ? (
                              <div className="actions-cell">
                                <select value={assignTarget.assignee} onChange={(e) => setAssignTarget({ ...assignTarget, assignee: e.target.value })} style={{ minWidth: 140 }}>
                                  <option value="">Select user</option>
                                  {users.filter(u => u.role !== 'SuperAdmin' && u.role !== 'User').map(u => (
                                    <option key={u._id} value={u._id}>{u.username} ({u.role})</option>
                                  ))}
                                </select>
                                <button onClick={handleAssignSubmit} className="btn-primary btn-sm">Assign</button>
                                <button onClick={() => setAssignTarget({ complaintId: null, assignee: '' })} className="btn-secondary btn-sm">Cancel</button>
                              </div>
                            ) : (
                              <button onClick={() => handleAssignClick(c._id)} className="btn-primary btn-sm">Assign</button>
                            )
                          )}

                          {(isAssignee || user?.role === 'SuperAdmin') && (
                            statusTarget.complaintId === c._id ? (
                              <div className="actions-cell">
                                <select className="status-select" value={statusTarget.status} onChange={(e) => setStatusTarget({ ...statusTarget, status: e.target.value })}>
                                  <option value="">Select status</option>
                                  <option value="Pending">Pending</option>
                                  <option value="In-Progress">In-Progress</option>
                                  <option value="Onhold">Onhold</option>
                                  <option value="Closed">Closed</option>
                                </select>
                                <button onClick={handleStatusSubmit} className="btn-primary btn-sm">Save</button>
                                <button onClick={() => setStatusTarget({ complaintId: null, status: '' })} className="btn-secondary btn-sm">Cancel</button>
                              </div>
                            ) : (
                              <button onClick={() => handleStatusClick(c._id)} className="btn-primary btn-sm">Update Status</button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsDashboardPage;
