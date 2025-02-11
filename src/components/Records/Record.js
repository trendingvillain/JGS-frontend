import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, TextField, MenuItem, Button } from '@mui/material';
import { format, parseISO } from "date-fns";
import API_BASE_URL from '../config/apiConfig';

export default function Record() {
  const [workReports, setWorkReports] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Search Filters
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
        setWorkReports(workData);
        setFilteredWorkReports(workData);

        const companyResponse = await fetch(`${API_BASE_URL}/companies`);
        const companyData = await companyResponse.json();
        setCompanies(companyData);

        const employeeResponse = await fetch(`${API_BASE_URL}/auth`);
        const employeeData = await employeeResponse.json();
        const employeeMap = {};
        employeeData.forEach(employee => {
          employeeMap[employee.id] = employee.name;
        });
        setEmployees(employeeMap);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to filter reports based on user input
  const handleSearch = () => {
    const filtered = workReports.filter((report) => {
      const reportDate = new Date(report.date);
      const engineerName = employees[report.user_id];
      const dateMatch = fromDate && toDate ? (reportDate >= new Date(fromDate) && reportDate <= new Date(toDate)) : true;
      const engineerMatch = searchEngineer ? engineerName?.toLowerCase().includes(searchEngineer.toLowerCase()) : true;
      const statusMatch = searchStatus ? report.status.toLowerCase() === searchStatus.toLowerCase() : true;
      return dateMatch && engineerMatch && statusMatch;
    });
    setFilteredWorkReports(filtered);
  };

  // Count logic
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const todayCount = workReports.filter(report => new Date(report.date).toISOString().split('T')[0] === today).length;
  const monthCount = workReports.filter(report => new Date(report.date).getMonth() === currentMonth && new Date(report.date).getFullYear() === currentYear).length;
  const yearCount = workReports.filter(report => new Date(report.date).getFullYear() === currentYear).length;

  const convertToIST = (utcDate) => {
      const date = parseISO(utcDate);
      return new Date(date.getTime() - IST_OFFSET * 60 * 1000); // Adjusted for IST
    };

  return (
    <Box sx={{ padding: 3, maxWidth: 1000, margin: 'auto' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>Work Reports</Typography>
      
      {/* Summary Counts */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: 3 }}>
        <Typography variant="body1"><strong>Today's Reports:</strong> {todayCount}</Typography>
        <Typography variant="body1"><strong>This Month's Reports:</strong> {monthCount}</Typography>
        <Typography variant="body1"><strong>This Year's Reports:</strong> {yearCount}</Typography>
      </Box>

      {/* Search Filters */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 3 }}>
        <TextField label="From Date" type="date" InputLabelProps={{ shrink: true }} value={fromDate} onChange={(e) => setFromDate(e.target.value)} sx={{ width: '30%' }} />
        <TextField label="To Date" type="date" InputLabelProps={{ shrink: true }} value={toDate} onChange={(e) => setToDate(e.target.value)} sx={{ width: '30%' }} />
        <TextField label="Engineer Name" value={searchEngineer} onChange={(e) => setSearchEngineer(e.target.value)} sx={{ width: '30%' }} />
        <TextField label="Status" select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)} sx={{ width: '30%' }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>
        <Button variant="contained" onClick={handleSearch} sx={{ height: '56px' }}>Search</Button>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredWorkReports.length > 0 ? (
              filteredWorkReports.map((report) => {
              const inTime = convertToIST(report.in_time);
          const outTime = convertToIST(report.out_time);
              const company = companies.find((c) => c.id === report.company_id);
              const engineerName = employees[report.user_id];
              return (
                <Card key={report.id} sx={{ marginBottom: 2, padding: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>Call Code: {report.id}</Typography>
                                
                    <Typography variant="body2" color="text.secondary">Date: {new Date(report.date).toLocaleDateString()}</Typography>
                    <Typography variant="body2" ><strong>Company Name:</strong> {company ? company.company_name : 'Unknown'}</Typography>
                    <Typography variant="body2"><strong>Machine Name: </strong>{report.machine_name}</Typography>
                    <Typography variant="body2"><strong>Nature of Complaint:</strong> {report.nature_of_complaint}</Typography>
                    <Typography variant="body2"><strong>Time:</strong> {format(inTime, "hh:mm a")} - {format(outTime, "hh:mm a")}</Typography>
                    <Typography variant="body2"><strong>Solution:</strong> {report.solution}</Typography>
                    <Typography variant="body2"><strong>Status:</strong> {report.status}</Typography>
                    <Typography variant="body2"><strong>Engineer Name:</strong> {engineerName || 'Unknown'}</Typography>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Typography sx={{ textAlign: 'center', marginTop: 4 }}>No work reports found.</Typography>
          )}
        </>
      )}
    </Box>
  );
}
