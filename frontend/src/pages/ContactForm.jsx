import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ContactForm = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    gender: '',
    state: '',
    district: '',
    city: '',
    school: '',
    dob: '',
    fatherName: '',
    motherName: '',
    address: ''
  });

  const [indiaData, setIndiaData] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);

  // Common Haryana Schools (for autocomplete)
  const popularSchools = [
    "Geeta University",
    "Geeta Engineering College",
    "Delhi Public School, Panipat",
    "DAV Public School",
    "Kendriya Vidyalaya",
    "St. Mary's Convent School",
    "Arya Bal Shiksha Mandir",
    "Bal Vikas School"
  ];

  useEffect(() => {
    // Fetch Indian States and Districts
    fetch('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.states) {
          setIndiaData(data.states);
        }
      })
      .catch(err => console.error("Error fetching location data:", err));
  }, []);

  // Update available districts when state changes
  useEffect(() => {
    if (formData.state) {
      const stateObj = indiaData.find(s => s.state === formData.state);
      if (stateObj && stateObj.districts) {
        setAvailableDistricts(stateObj.districts);
      } else {
        setAvailableDistricts([]);
      }
      // Reset district and city if the state changed
      setFormData(prev => ({ ...prev, district: '', city: '' }));
    } else {
      setAvailableDistricts([]);
    }
  }, [formData.state, indiaData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('studentInfo', JSON.stringify(formData));
    navigate(`/quiz/${testId}`);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center text-brand-orange">
          Contact Information
        </h2>
        <p className="text-center text-gray-600 mb-8">Please provide your details before starting the assessment.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Name *" className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-orange" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email Address *" className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-orange" />
            <div className="flex gap-2">
              <select className="w-20 px-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:border-brand-orange">
                <option>+91</option>
              </select>
              <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter Mobile Number *" className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-orange" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select required name="gender" value={formData.gender} onChange={handleChange} className={`w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-orange ${!formData.gender ? 'text-gray-400' : 'text-gray-900'}`}>
              <option value="" disabled hidden>Select Gender *</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            
            <select required name="state" value={formData.state} onChange={handleChange} className={`w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-orange ${!formData.state ? 'text-gray-400' : 'text-gray-900'}`}>
              <option value="" disabled hidden>Select School State *</option>
              {indiaData.map((stateObj, idx) => (
                <option key={idx} value={stateObj.state}>{stateObj.state}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select required name="district" value={formData.district} onChange={handleChange} disabled={!formData.state} className={`w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-orange ${!formData.district ? 'text-gray-400' : 'text-gray-900'} ${!formData.state ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
              <option value="" disabled hidden>Select School District *</option>
              {availableDistricts.map((district, idx) => (
                <option key={idx} value={district}>{district}</option>
              ))}
            </select>

            <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Enter School City/Town *" className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-orange" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input required type="text" name="school" list="school-list" value={formData.school} onChange={handleChange} placeholder="Select or Type School Name *" className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-orange" />
              <datalist id="school-list">
                {popularSchools.map((school, idx) => (
                  <option key={idx} value={school} />
                ))}
              </datalist>
            </div>
            <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className={`w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-orange ${!formData.dob ? 'text-gray-400' : 'text-gray-900'}`} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter Father Name *" className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-orange" />
            <input required type="text" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Enter Mother Name *" className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-orange" />
          </div>

          <input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Full Address *" className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-orange" />

          <div className="pt-4 flex justify-center">
            <button type="submit" className="w-full md:w-1/3 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-3 px-8 rounded transition-colors uppercase tracking-wider">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
