import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Box,
  Button,
  CircularProgress,
  Autocomplete,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Paper
} from '@mui/material';
import moment from 'moment';
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
  const [companyName, setCompanyName] = useState('');
  const [userId] = useState(localStorage.getItem('id'));
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/companies`);
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      company_id: companyId || null,
      company_name: companyName,
      user_id: userId,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/work-reports/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        alert('Work report created successfully!');
        navigate('/dashboard');
      } else {
        alert('Failed to create work report!');
      }
    } catch (error) {
      console.error('Error creating work report:', error);
      alert('Error creating work report');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          borderRadius: 3,
          width: '100%',
          maxWidth: 650,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
          Create Work Report
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
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
              sx={{ mb: 2 }}
            />
            <TextField
              label="Machine Name"
              fullWidth
              value={machineName}
              onChange={(e) => setMachineName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Nature of Complaint"
              fullWidth
              value={natureOfComplaint}
              onChange={(e) => setNatureOfComplaint(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Solution"
              fullWidth
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="In Time"
              type="time"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={inTime}
              onChange={(e) => setInTime(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Out Time"
              type="time"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={outTime}
              onChange={(e) => setOutTime(e.target.value)}
              required
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Assistant Name"
              fullWidth
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />

            <Autocomplete
              freeSolo
              options={companies.map((company) => ({ id: company.id, label: company.company_name }))}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              value={companyName}
              onChange={(event, newValue) => {
                if (newValue && newValue.id) {
                  setCompanyId(newValue.id);
                  setCompanyName(newValue.label);
                } else {
                  setCompanyId('');
                  setCompanyName(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Company" fullWidth sx={{ mb: 2 }} />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #0073e6, #005bb5)',
                fontWeight: 'bold',
                color: 'white',
                textTransform: 'none',
                borderRadius: 2,
                py: 1.5,
                mt: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #005bb5, #004494)',
                },
              }}
            >
              Submit Report
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}
