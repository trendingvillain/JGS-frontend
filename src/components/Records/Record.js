import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, TextField, MenuItem, Button, Grid, Divider, Chip } from '@mui/material';
import { format, parseISO } from "date-fns";
import API_BASE_URL from '../config/apiConfig';

export default function Record() {
  const [workReports, setWorkReports] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchEngineer, setSearchEngineer] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [filteredWorkReports, setFilteredWorkReports] = useState([]);

  const IST_OFFSET = 330;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workResponse = await fetch(`${API_BASE_URL}/work-reports`);
        const workData = await workResponse.json();
        setWorkReports(workData.sort((a, b) => b.id - a.id));
        setFilteredWorkReports(workData.sort((a, b) => b.id - a.id));

        const companyResponse = await fetch(`${API_BASE_URL}/companies`);
        setCompanies(await companyResponse.json());

        const employeeResponse = await fetch(`${API_BASE_URL}/auth`);
        const employeeData = await employeeResponse.json();

        const employeeMap = employeeData.reduce((map, emp) => {
          map[emp.id] = emp.name;
          return map;
        }, {});
        setEmployees(employeeMap);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = workReports.filter((report) => {
      const reportDate = new Date(report.date);
      const engineerName = employees[report.user_id] || '';
      return (
        (!fromDate || reportDate >= new Date(fromDate)) &&
        (!toDate || reportDate <= new Date(toDate)) &&
        (!searchEngineer || engineerName.toLowerCase().includes(searchEngineer.toLowerCase())) &&
        (!searchStatus || report.status.toLowerCase() === searchStatus.toLowerCase())
      );
    });
    setFilteredWorkReports(filtered.sort((a, b) => b.id - a.id));
  };

  const today = new Date().toISOString().split('T')[0];
  const todayCount = workReports.filter(report => report.date === today).length;
  const monthCount = workReports.filter(report => {
    const date = new Date(report.date);
    return date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
  }).length;
  const yearCount = workReports.filter(report => new Date(report.date).getFullYear() === new Date().getFullYear()).length;

  const convertToIST = (utcDate) => {
    const date = parseISO(utcDate);
    return new Date(date.getTime() - IST_OFFSET * 60 * 1000);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3 }}>📊 Work Reports</Typography>

      {/* Summary Counts */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Box sx={summaryBoxStyle}><Typography><strong>Today's Reports:</strong> {todayCount}</Typography></Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={summaryBoxStyle}><Typography><strong>This Month:</strong> {monthCount}</Typography></Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={summaryBoxStyle}><Typography><strong>This Year:</strong> {yearCount}</Typography></Box>
        </Grid>
      </Grid>

      {/* Search Filters */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          backgroundColor: 'white',
          padding: 2,
          borderRadius: 2,
          boxShadow: 1,
          mb: 3
        }}
      >
        <TextField
          label="From Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          sx={{ flex: '1 1 200px' }}
        />
        <TextField
          label="To Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          sx={{ flex: '1 1 200px' }}
        />
        <TextField
          label="Engineer Name"
          value={searchEngineer}
          onChange={(e) => setSearchEngineer(e.target.value)}
          sx={{ flex: '1 1 200px' }}
        />
        <TextField
          label="Status"
          select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          sx={{ flex: '1 1 200px' }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>
        <Button variant="contained" onClick={handleSearch} sx={{ flex: '1 1 200px' }}>🔍 Search</Button>
      </Box>

      {/* Report List */}
      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        filteredWorkReports.length > 0 ? (
          filteredWorkReports.map((report) => {
            const inTime = convertToIST(report.in_time);
            const outTime = convertToIST(report.out_time);
            const company = companies.find(c => c.id === report.company_id);
            const engineerName = employees[report.user_id] || 'Unknown';

            return (
              <Card key={report.id} sx={reportCardStyle}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Call Code: {report.id}</Typography>
                  <Typography variant="body2" color="text.secondary">{new Date(report.date).toLocaleDateString()}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography><strong>Company:</strong> {company ? company.company_name : 'N/A'}</Typography>
                  <Typography><strong>Machine:</strong> {report.machine_name}</Typography>
                  <Typography><strong>Complaint:</strong> {report.nature_of_complaint}</Typography>
                  <Typography><strong>Solution:</strong> {report.solution}</Typography>
                  <Typography><strong>Time:</strong> {format(inTime, "hh:mm a")} - {format(outTime, "hh:mm a")}</Typography>
                  <Typography><strong>Status:</strong>
                    <Chip
                      label={report.status}
                      color={report.status === 'Completed' ? 'success' : 'warning'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography><strong>Engineer:</strong> {engineerName}</Typography>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography sx={{ textAlign: 'center', mt: 4 }}>No work reports found.</Typography>
        )
      )}
    </Box>
  );
}

// Styles
const summaryBoxStyle = {
  backgroundColor: '#1976d2',
  color: 'white',
  padding: 2,
  textAlign: 'center',
  borderRadius: 1
};

const reportCardStyle = {
  backgroundColor: 'white',
  marginBottom: 2,
  borderRadius: 2,
  boxShadow: 2,
  overflow: 'hidden',
  transition: 'all 0.3s',
  '&:hover': {
    boxShadow: 5
  }
};
