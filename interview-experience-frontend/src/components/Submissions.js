import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    country: '',
    name: '',
    questions: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setSubmissions(response.data);
        setFilteredSubmissions(response.data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };

    fetchSubmissions();
  }, []);

  useEffect(() => {
    const filtered = submissions.filter((submission) =>
      submission.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubmissions(filtered);
  }, [searchTerm, submissions]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/submissions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setSubmissions(submissions.filter((submission) => submission._id !== id));
    } catch (err) {
      console.error('Error deleting submission:', err);
    }
  };

  const handleEdit = (submission) => {
    setEditId(submission._id);
    setFormData({
      company: submission.company,
      country: submission.country,
      name: submission.name,
      questions: submission.questions.join(', '),
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/submissions/${editId}`, {
        ...formData,
        questions: formData.questions.split(',').map((q) => q.trim()),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setSubmissions(submissions.map((submission) =>
        submission._id === editId ? { ...submission, ...formData, questions: formData.questions.split(',').map(q => q.trim()) } : submission
      ));
      setEditId(null);
    } catch (err) {
      console.error('Error saving submission:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Your Interview Submissions</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by company name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>

      {filteredSubmissions.length === 0 ? (
        <p className="text-center text-lg">No submissions found!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredSubmissions.map((submission) => (
            <div className="bg-white shadow-lg rounded-lg p-6" key={submission._id}>
              {editId === submission._id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Company"
                  />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Country"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Your Name"
                  />
                  <input
                    type="text"
                    name="questions"
                    value={formData.questions}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Interview Questions (comma separated)"
                  />
                  <button
                    onClick={handleSave}
                    className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">{submission.company} - {submission.country}</h3>
                  <p><strong>Candidate:</strong> {submission.name}</p>
                  <div>
                    <strong>Interview Questions:</strong>
                    <ul className="list-disc pl-5">
                      {submission.questions.map((question, index) => (
                        <li key={index}>{question}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(submission)}
                      className="px-8 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(submission._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Submissions;
