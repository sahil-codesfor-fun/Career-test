import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const LiveTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Test State
  const [editingTestId, setEditingTestId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Questions State
  const [managingQuestionsFor, setManagingQuestionsFor] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/assessments/tests`);
      setTests(res.data);
    } catch (error) {
      console.error('Failed to fetch tests', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e, testId) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => processParsedData(results.data, testId),
        error: (error) => alert('Error parsing CSV: ' + error.message)
      });
    } else if (['xls', 'xlsx'].includes(fileExtension)) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        processParsedData(data, testId);
      };
      reader.readAsBinaryString(file);
    } else {
      alert('Please upload a valid CSV or Excel file.');
    }
  };

  const processParsedData = async (data, testId) => {
    const formatted = data.filter(row => row.Question).map(row => ({
      text: row.Question,
      options: [
        { text: row['Option 1'] || 'Option 1', weight: 4 },
        { text: row['Option 2'] || 'Option 2', weight: 3 },
        { text: row['Option 3'] || 'Option 3', weight: 2 },
        { text: row['Option 4'] || 'Option 4', weight: 1 }
      ]
    }));
    
    if (formatted.length === 0) {
      alert('No valid questions found. Please ensure your file has a "Question" column.');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/tests/${testId}/questions`, {
        questions: formatted
      });
      alert(`Successfully added and overwritten ${formatted.length} questions to the test!`);
      fetchTests();
    } catch (error) {
      console.error('Error adding questions', error);
      alert('Failed to add questions.');
    }
  };

  const handleDeleteTest = async (testId) => {
    if (window.confirm('Are you sure you want to completely delete this test and all its questions and results? This action cannot be undone.')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/tests/${testId}`);
        setTests(tests.filter(t => t.id !== testId));
        alert('Test deleted successfully.');
      } catch (error) {
        console.error('Error deleting test', error);
        alert('Failed to delete test.');
      }
    }
  };

  const startEditingTest = (test) => {
    setEditingTestId(test.id);
    setEditTitle(test.title);
    setEditDescription(test.description || '');
  };

  const handleSaveEditTest = async (testId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/tests/${testId}`, {
        title: editTitle,
        description: editDescription
      });
      setTests(tests.map(t => t.id === testId ? { ...t, title: editTitle, description: editDescription } : t));
      setEditingTestId(null);
    } catch (error) {
      console.error('Error saving test', error);
      alert('Failed to update test.');
    }
  };

  const toggleManageQuestions = (testId) => {
    if (managingQuestionsFor === testId) {
      setManagingQuestionsFor(null);
    } else {
      setManagingQuestionsFor(testId);
    }
  };

  const handleDeleteQuestion = async (testId, questionId) => {
    if (window.confirm('Delete this question?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/questions/${questionId}`);
        setTests(tests.map(t => {
          if (t.id === testId) {
            return { ...t, questions: t.questions.filter(q => q.id !== questionId) };
          }
          return t;
        }));
      } catch (error) {
        console.error('Error deleting question', error);
        alert('Failed to delete question.');
      }
    }
  };

  const handlePdfUpload = async (e, testId) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdfTemplate', file);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/tests/${testId}/template`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('PDF Template uploaded successfully!');
      fetchTests();
    } catch (error) {
      console.error('Error uploading PDF', error);
      alert('Failed to upload PDF template.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Live Tests</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
              <div className="p-6">
                {editingTestId === test.id ? (
                  <div className="mb-4 space-y-2">
                    <input 
                      type="text" 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-xl font-bold text-gray-800"
                    />
                    <textarea 
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 min-h-[60px]"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveEditTest(test.id)} className="text-xs bg-green-500 text-white px-3 py-1 rounded">Save</button>
                      <button onClick={() => setEditingTestId(null)} className="text-xs bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{test.title}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => startEditingTest(test)} className="text-blue-500 hover:text-blue-700 p-1" title="Edit Test">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>
                        <button onClick={() => handleDeleteTest(test.id)} className="text-red-500 hover:text-red-700 p-1" title="Delete Test">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      {test.description || 'No description provided.'}
                    </p>
                    {test.pdfTemplatePath && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-4">
                        ✓ PDF Template Uploaded
                      </span>
                    )}
                  </>
                )}
                
                <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-brand-orange text-white px-3 py-1.5 rounded-md font-medium hover:bg-brand-orange/90 transition-colors">
                      <span>+ Overwrite Questions (CSV/Excel)</span>
                      <input 
                        type="file" 
                        className="sr-only" 
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                        onChange={(e) => handleFileUpload(e, test.id)} 
                      />
                    </label>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-blue-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-blue-700 transition-colors">
                      <span>📄 Upload PDF Template</span>
                      <input 
                        type="file" 
                        className="sr-only" 
                        accept="application/pdf" 
                        onChange={(e) => handlePdfUpload(e, test.id)} 
                      />
                    </label>
                  </div>

                  <button 
                    onClick={() => toggleManageQuestions(test.id)}
                    className="text-sm border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    {managingQuestionsFor === test.id ? 'Hide Questions' : `Manage Questions (${test.questions?.length || 0})`}
                  </button>
                </div>
              </div>

              {/* Questions Panel */}
              {managingQuestionsFor === test.id && (
                <div className="bg-gray-50 p-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-4">Questions ({test.questions?.length || 0})</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {test.questions?.map((q, idx) => (
                      <div key={q.id} className="bg-white p-4 rounded border border-gray-200 shadow-sm flex justify-between items-start">
                        <div className="flex-1 text-sm text-gray-800">
                          <div className="font-medium mb-2">
                            <span className="font-bold mr-2">{idx + 1}.</span> {q.text}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-6">
                            {q.options?.map((opt, oIdx) => (
                              <div key={oIdx} className="text-gray-600 text-xs bg-gray-50 px-2 py-1.5 rounded border border-gray-200">
                                {opt.text}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button onClick={() => handleDeleteQuestion(test.id, q.id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                        </div>
                      </div>
                    ))}
                    {(!test.questions || test.questions.length === 0) && (
                      <p className="text-sm text-gray-500">No questions added yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {tests.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center border border-gray-100">
              <p className="text-gray-500 mb-4">No live tests available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveTests;
