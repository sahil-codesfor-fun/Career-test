import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CounsellingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/counselling`);
      setRequests(res.data);
    } catch (error) {
      console.error('Failed to fetch counselling requests', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (requests.length === 0) return;
    
    const headers = ['Name', 'Email', 'Mobile', 'Date Submitted'];
    const csvRows = [headers.join(',')];
    
    requests.forEach(req => {
      const values = [
        `"${req.name}"`,
        `"${req.email}"`,
        `"${req.mobile}"`,
        `"${new Date(req.createdAt).toLocaleString()}"`
      ];
      csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'counselling_requests.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Counselling Requests</h1>
        <button 
          onClick={downloadCSV}
          disabled={requests.length === 0}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            requests.length === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-brand-blue hover:bg-brand-blue/90 text-white'
          }`}
        >
          Download CSV
        </button>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(req.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No counselling requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CounsellingRequests;
