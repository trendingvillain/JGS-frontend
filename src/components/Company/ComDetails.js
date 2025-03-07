import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, TextField, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import API_BASE_URL from './../config/apiConfig';

export default function ComDetails() {
  const { com_id } = useParams();
  const [workReports, setWorkReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState('');
  const [searchEngineer, setSearchEngineer] = useState('');

  const IST_OFFSET = 330;

  const convertToIST = (utcDate) => {
    const date = new Date(utcDate);
    return new Date(date.getTime() - IST_OFFSET * 60 * 1000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workResponse = await fetch(`${API_BASE_URL}/companies/${com_id}/work-reports`);
        const workData = await workResponse.json();

        const companyResponse = await fetch(`${API_BASE_URL}/companies`);
        const companyData = await companyResponse.json();
        const company = companyData.find((c) => c.id === parseInt(com_id));
        setCompanyName(company?.company_name || 'Unknown Company');

        const employeeResponse = await fetch(`${API_BASE_URL}/auth`);
        const employeeData = await employeeResponse.json();
        const employeeMap = {};
        employeeData.forEach(employee => {
          employeeMap[employee.id] = employee.name;
        });
        setEmployees(employeeMap);

        setWorkReports(workData);
        setFilteredReports(workData); // Initially unfiltered
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [com_id]);

  const countReports = (filterFn) => workReports.filter(filterFn).length;

  useEffect(() => {
    let filtered = [...workReports];

    if (searchDate) {
      filtered = filtered.filter(report => format(new Date(report.date), 'yyyy-MM-dd') === searchDate);
    }

    if (searchEngineer) {
      filtered = filtered.filter(report =>
        employees[report.user_id]?.toLowerCase().includes(searchEngineer.toLowerCase())
      );
    }

    filtered.sort((a, b) => b.id - a.id); // Sort by Call Code descending

    setFilteredReports(filtered);
  }, [searchDate, searchEngineer, workReports, employees]);

  const todayCount = countReports(report =>
    format(new Date(report.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const monthCount = countReports(report =>
    format(new Date(report.date), 'yyyy-MM') === format(new Date(), 'yyyy-MM')
  );

  const yearCount = countReports(report =>
    format(new Date(report.date), 'yyyy') === format(new Date(), 'yyyy')
  );

  return (
    <Box sx={{ padding: 3, maxWidth: 900, margin: 'auto', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 3, color: '#1976d2' }}>
        Work Reports - {companyName}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Counts Summary */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              backgroundColor: '#ffffff',
              padding: 2,
              borderRadius: 2,
              boxShadow: 1,
              marginBottom: 3,
            }}
          >
            <Typography variant="body1"><strong>Today:</strong> {todayCount}</Typography>
            <Typography variant="body1"><strong>This Month:</strong> {monthCount}</Typography>
            <Typography variant="body1"><strong>This Year:</strong> {yearCount}</Typography>
          </Box>

          {/* Filters */}
          <Grid container spacing={2} marginBottom={2}>
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
                label="Search by Engineer"
                value={searchEngineer}
                onChange={(e) => setSearchEngineer(e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Work Reports List */}
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <Card
                key={report.id}
                sx={{
                  marginBottom: 2,
                  boxShadow: 3,
                  borderLeft: '5px solid #1976d2',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      backgroundColor: '#1976d2',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: 1,
                      display: 'inline-block',
                      marginBottom: 1,
                    }}
                  >
                    Call Code: {report.id}
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    Engineer: {employees[report.user_id] || 'Unknown'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Date: {new Date(report.date).toLocaleDateString()}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Machine:</strong> {report.machine_name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Complaint:</strong> {report.nature_of_complaint}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Solution:</strong> {report.solution}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Time:</strong>{' '}
                    {format(convertToIST(report.in_time), 'hh:mm a')} -{' '}
                    {format(convertToIST(report.out_time), 'hh:mm a')}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {report.status}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Assistant:</strong> {report.assistant_name}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography sx={{ textAlign: 'center', marginTop: 4, color: '#666' }}>
              No work reports found.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
