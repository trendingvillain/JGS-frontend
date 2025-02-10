import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, TextField, Grid } from '@mui/material';
import { useParams } from 'react-router-dom'; // To fetch company_id from URL params if needed
import { format } from 'date-fns'; // For formatting dates
import API_BASE_URL from './../config/apiConfig';

export default function ComDetails() {
  const { com_id } = useParams(); // Get company_id from URL params dynamically (if available)
  const [workReports, setWorkReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState('');
  const [searchEngineer, setSearchEngineer] = useState('');

  const IST_OFFSET = 330; // Offset in minutes (5 hours 30 minutes)

  // Convert UTC time to IST
  const convertToIST = (utcDate) => {
    const date = new Date(utcDate);
    return new Date(date.getTime() - IST_OFFSET * 60 * 1000);
  };

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Work Reports for the company
        const workResponse = await fetch(`${API_BASE_URL}/companies/${com_id}/work-reports`);
        const workData = await workResponse.json();

        // Fetch Company Details
        const companyResponse = await fetch(`${API_BASE_URL}/companies`);
        const companyData = await companyResponse.json();
        const company = companyData.find((c) => c.id === parseInt(com_id));
        setCompanyName(company?.company_name || 'Unknown Company');

        // Fetch Employee Details
        const employeeResponse = await fetch(`${API_BASE_URL}/auth`);
        const employeeData = await employeeResponse.json();
        const employeeMap = {};
        employeeData.forEach(employee => {
          employeeMap[employee.id] = employee.name;
        });
        setEmployees(employeeMap);

        // Set Work Reports
        setWorkReports(workData);
        setFilteredReports(workData); // Initially set the filtered reports as all work reports
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [com_id]);

  // Helper function to count reports by time
  const countReports = (filterFn) => {
    return workReports.filter(filterFn).length;
  };

  // Filter work reports by search criteria
  useEffect(() => {
    let filtered = [...workReports];

    // Filter by date
    if (searchDate) {
      filtered = filtered.filter(report => format(new Date(report.date), 'yyyy-MM-dd') === searchDate);
    }

    // Filter by engineer name
    if (searchEngineer) {
      filtered = filtered.filter(report => employees[report.user_id]?.toLowerCase().includes(searchEngineer.toLowerCase()));
    }

    // Sort reports by the most recent (last modified) first
    filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredReports(filtered);
  }, [searchDate, searchEngineer, workReports, employees]);

  // Count for Today, This Month, and This Year
  const todayCount = countReports(report => format(new Date(report.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'));
  const monthCount = countReports(report => format(new Date(report.date), 'yyyy-MM') === format(new Date(), 'yyyy-MM'));
  const yearCount = countReports(report => format(new Date(report.date), 'yyyy') === format(new Date(), 'yyyy'));

  return (
    <Box sx={{ padding: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>
        Work Reports - {companyName}
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Counts Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: 2 }}>
            <Typography variant="h6">Today: {todayCount}</Typography>
            <Typography variant="h6">This Month: {monthCount}</Typography>
            <Typography variant="h6">This Year: {yearCount}</Typography>
          </Box>

          {/* Filter Section */}
          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Search by Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Search by Engineer Name"
                value={searchEngineer}
                onChange={(e) => setSearchEngineer(e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Display Reports */}
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <Card key={report.id} sx={{ marginBottom: 2, padding: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Engineer: {employees[report.user_id] || 'Unknown'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(report.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Machine Name:</strong> {report.machine_name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Nature of Complaint:</strong> {report.nature_of_complaint}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Solution:</strong> {report.solution}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Time:</strong> {format(convertToIST(report.in_time), "hh:mm a")} - {format(convertToIST(report.out_time), "hh:mm a")}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {report.status}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Assistant Name:</strong> {report.assistant_name}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography sx={{ textAlign: 'center', marginTop: 4 }}>
              No work reports found.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
