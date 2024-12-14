import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { Link } from 'react-router-dom';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  BarChart2,
  Settings,
  Flag
} from 'lucide-react';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalAnswers: 0,
    pendingReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const reportsData = await apiRequest('/admin/reports', 'GET', null, token);
        setReports(reportsData);
        
        // Fetch dashboard stats
        const statsData = await apiRequest('/admin/stats', 'GET', null, token);
        setStats(statsData);
      } catch (err) {
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReportAction = async (reportId, action) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(`/admin/reports/${reportId}`, 'PUT', { action }, token);
      
      // Refresh reports after action
      const updatedReports = await apiRequest('/admin/reports', 'GET', null, token);
      setReports(updatedReports);
    } catch (err) {
      setError('Failed to process report');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Questions</p>
              <p className="text-2xl font-bold">{stats.totalQuestions}</p>
            </div>
            <BarChart2 className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Answers</p>
              <p className="text-2xl font-bold">{stats.totalAnswers}</p>
            </div>
            <CheckCircle className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Reports</p>
              <p className="text-2xl font-bold">{stats.pendingReports}</p>
            </div>
            <AlertTriangle className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/users" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Users size={24} className="mb-4 text-blue-500" />
          <h3 className="text-lg font-semibold mb-2">Manage Users</h3>
          <p className="text-gray-600">View and manage user accounts</p>
        </Link>

        <Link to="/admin/reports" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Flag size={24} className="mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Review Reports</h3>
          <p className="text-gray-600">Handle reported content</p>
        </Link>

        <Link to="/admin/settings" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Settings size={24} className="mb-4 text-gray-500" />
          <h3 className="text-lg font-semibold mb-2">System Settings</h3>
          <p className="text-gray-600">Configure platform settings</p>
        </Link>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Content</th>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">Reason</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-b">
                  <td className="py-3">{report.contentId}</td>
                  <td className="py-3">{report.contentType}</td>
                  <td className="py-3">{report.reason}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      report.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleReportAction(report._id, 'delete')}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <XCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleReportAction(report._id, 'approve')}
                        className="p-1 text-green-500 hover:bg-green-50 rounded"
                      >
                        <CheckCircle size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;