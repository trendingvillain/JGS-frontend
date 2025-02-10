import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, TextField} from '@mui/material';
import API_BASE_URL from '../config/apiConfig';

export default function Record() {
  const [workReports, setWorkReports] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState('');
  const [searchEngineer, setSearchEngineer] = useState('');
  
  const IST_OFFSET = 330; // Offset in minutes for IST (5 hours 30 minutes)

  // Convert UTC to IST
  const convertToIST = (utcDate) => {
    const date = new Date(utcDate);
    return new Date(date.getTime() - IST_OFFSET * 60 * 1000);
  };

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const workResponse = await fetch(`${API_BASE_URL}/work-reports`);
        const workData = await workResponse.json();
        setWorkReports(workData);

        // Fetch Companies
        const companyResponse = await fetch(`${API_BASE_URL}/companies`);
        const companyData = await companyResponse.json();
        setCompanies(companyData);

        // Fetch Employees (Engineers)
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

  // Sort work reports by date (most recent first)
  const sortedWorkReports = workReports.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Filter work reports by date and engineer
  const filteredWorkReports = sortedWorkReports.filter((report) => {
    const reportDate = new Date(report.date).toLocaleDateString('en-CA'); // Format to 'YYYY-MM-DD'
    const engineerName = employees[report.user_id];

    const dateMatch = searchDate ? reportDate === searchDate : true;
    const engineerMatch = searchEngineer ? engineerName?.toLowerCase().includes(searchEngineer.toLowerCase()) : true;

    return dateMatch && engineerMatch;
  });

  return (
    <Box sx={{ padding: 3, maxWidth: 1000, margin: 'auto' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>
        Work Reports
      </Typography>

      {/* Search Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <TextField
          label="Search by Date (YYYY-MM-DD)"
          variant="outlined"
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          sx={{ width: '45%' }}
        />
        <TextField
          label="Search by Engineer"
          variant="outlined"
          value={searchEngineer}
          onChange={(e) => setSearchEngineer(e.target.value)}
          sx={{ width: '45%' }}
        />
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredWorkReports.length > 0 ? (
            filteredWorkReports.map((report) => {
              const company = companies.find((c) => c.id === report.company_id);
              const engineerName = employees[report.user_id];

              return (
                <Card key={report.id} sx={{ marginBottom: 2, padding: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Machine Name: {report.machine_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {new Date(report.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Nature of Complaint:</strong> {report.nature_of_complaint}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Solution:</strong> {report.solution}
                    </Typography>
                    <Typography variant="body2">
                      <strong>In Time:</strong> {new Date(convertToIST(report.in_time)).toLocaleTimeString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Out Time:</strong> {new Date(convertToIST(report.out_time)).toLocaleTimeString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {report.status}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Assistant Name:</strong> {report.assistant_name}
                    </Typography>

                    {/* New fields added */}
                    <Typography variant="body2">
                      <strong>Company Name:</strong> {company ? company.company_name : 'Unknown'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Engineer Name:</strong> {engineerName || 'Unknown'}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })
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
