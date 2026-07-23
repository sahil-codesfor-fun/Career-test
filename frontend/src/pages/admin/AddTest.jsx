import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import axios from 'axios';

const AddTest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pdfFile, setPdfFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => processParsedData(results.data),
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
        processParsedData(data);
      };
      reader.readAsBinaryString(file);
    } else {
      alert('Please upload a valid CSV or Excel file.');
    }
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else if (file) {
      alert('Please upload a valid PDF file.');
    }
  };

  const processParsedData = (data) => {
    // Expecting columns: Question, Option 1, Option 2, Option 3, Option 4
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
    } else {
      setParsedQuestions(formatted);
      alert(`Successfully parsed ${formatted.length} questions.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || parsedQuestions.length === 0) {
      alert('Please provide a title and upload a file with questions.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the test
      const testRes = await axios.post('http://localhost:3000/api/admin/tests', {
        title,
        description,
        questions: parsedQuestions
      });

      // 2. Upload the PDF template if provided
      if (pdfFile) {
        const testId = testRes.data.id;
        const formData = new FormData();
        formData.append('pdfTemplate', pdfFile);
        await axios.post(`http://localhost:3000/api/admin/tests/${testId}/template`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      alert('Test created successfully!');
      setTitle('');
      setDescription('');
      setParsedQuestions([]);
      setPdfFile(null);
    } catch (error) {
      console.error('Error creating test', error);
      alert('Failed to create test.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Test</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Engineering Aptitude Test"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-orange"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Excel Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center mt-4">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-orange hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-orange">
                  <span>Upload Questions (CSV/Excel)</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileUpload} />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">Required: Question, Option 1-4</p>
              {parsedQuestions.length > 0 && (
                <p className="text-sm text-green-700 font-medium mt-2">✓ {parsedQuestions.length} questions loaded</p>
              )}
            </div>

            {/* PDF Template Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <div className="flex text-sm text-gray-600 justify-center mt-4">
                <label htmlFor="pdf-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload Result PDF Template</span>
                  <input id="pdf-upload" name="pdf-upload" type="file" className="sr-only" accept="application/pdf" onChange={handlePdfUpload} />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">Optional: Upload custom report template</p>
              {pdfFile && (
                <p className="text-sm text-green-700 font-medium mt-2">✓ {pdfFile.name}</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-bold py-3 px-4 rounded transition-colors ${loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-brand-orange hover:bg-brand-orange/90 text-white'}`}
            >
              {loading ? 'Creating Test...' : 'Create Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTest;
