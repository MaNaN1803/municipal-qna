import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { 
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Flag
} from 'lucide-react';

const ModeratorDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('questions');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [questionsData, reportsData] = await Promise.all([
          apiRequest('/questions?status=under review', 'GET', null, token),
          apiRequest('/admin/reports', 'GET', null, token)
        ]);
        
        setQuestions(questionsData);
        setReports(reportsData);
      } catch (err) {
        setError('Failed to load moderator data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuestionStatus = async (questionId, status) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(`/questions/${questionId}/status`, 'PUT', { status }, token);
      
      // Refresh questions
      const updatedQuestions = await apiRequest('/questions?status=under review', 'GET', null, token);
      setQuestions(updatedQuestions);
    } catch (err) {
      setError('Failed to update question status');
    }
  };

  const handleReportReview = async (reportId, action) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(`/admin/reports/${reportId}`, 'PUT', { action }, token);
      
      // Refresh reports
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
      <h1 className="text-3xl font-bold mb-8">Moderator Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-bold">{questions.length}</p>
            </div>
            <MessageSquare className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Reports</p>
              <p className="text-2xl font-bold">{reports.filter(r => r.status === 'pending').length}</p>
            </div>
            <Flag className="text-red-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Resolved Today</p>
              <p className="text-2xl font-bold">
                {reports.filter(r => r.status === 'reviewed' && 
                  new Date(r.updatedAt).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('questions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'questions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Questions Under Review
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reported Content
            </button>
          </nav>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="text-red-400" size={24} />
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      )}

      {activeTab === 'questions' ? (
        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {questions.map((question) => (
                  <tr key={question._id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{question.title}</div>
                      <div className="text-sm text-gray-500">{question.description.substring(0, 100)}...</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{question.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleQuestionStatus(question._id, 'resolved')}
                          className="text-green-500 hover:text-green-700"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          onClick={() => handleQuestionStatus(question._id, 'rejected')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report._id}>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{report.contentId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{report.contentType}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{report.reason}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReportReview(report._id, 'approve')}
                          className="text-green-500 hover:text-green-700"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          onClick={() => handleReportReview(report._id, 'reject')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorDashboard;