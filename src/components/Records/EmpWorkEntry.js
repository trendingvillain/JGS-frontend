import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import {
  TextField,
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import moment from 'moment'; // Import moment.js for time formatting
import API_BASE_URL from '../config/apiConfig';

export default function EmpWorkEntry() {
  const [date, setDate] = useState('');
  const [machineName, setMachineName] = useState('');
  const [natureOfComplaint, setNatureOfComplaint] = useState('');
  const [solution, setSolution] = useState('');
  const [inTime, setInTime] = useState('');
  const [outTime, setOutTime] = useState('');
  const [status, setStatus] = useState('');
  const [assistantName, setAssistantName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [userId] = useState(localStorage.getItem('id')); // Fetch user ID from localStorage
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for redirection

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/companies`);
        const data = await response.json();
        setCompanies(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format time to 'HH:mm:ss' before sending to backend
    const formattedInTime = moment(inTime, 'HH:mm').format('HH:mm:ss');
    const formattedOutTime = moment(outTime, 'HH:mm').format('HH:mm:ss');

    const reportData = {
      date,
      machine_name: machineName,
      nature_of_complaint: natureOfComplaint,
      solution,
      in_time: formattedInTime,
      out_time: formattedOutTime,
      status,
      assistant_name: assistantName,
      company_id: companyId,
      user_id: userId,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/work-reports/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        alert('Work report created successfully!');
        navigate('/dashboard'); // Redirect to dashboard after submission
      } else {
        alert('Failed to create work report!');
      }
    } catch (error) {
      console.error('Error creating work report:', error);
      alert('Error creating work report');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <h2>Create Work Report</h2>
      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Machine Name"
            fullWidth
            value={machineName}
            onChange={(e) => setMachineName(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Nature of Complaint"
            fullWidth
            value={natureOfComplaint}
            onChange={(e) => setNatureOfComplaint(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Solution"
            fullWidth
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="In Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={inTime}
            onChange={(e) => setInTime(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Out Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={outTime}
            onChange={(e) => setOutTime(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Status"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Assistant Name"
            fullWidth
            value={assistantName}
            onChange={(e) => setAssistantName(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="company-label">Company</InputLabel>
            <Select
              labelId="company-label"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              label="Company"
              required
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit Report
          </Button>
        </form>
      )}
    </Box>
  );
}
