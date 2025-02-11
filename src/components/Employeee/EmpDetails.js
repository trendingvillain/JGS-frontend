import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography, CircularProgress, TextField } from "@mui/material";
import { format, parseISO, isSameDay, isThisMonth, isThisYear } from "date-fns";
import API_BASE_URL from './../config/apiConfig';

function EmpDetails() {
  const { user_id } = useParams();
  const [workReports, setWorkReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [companies, setCompanies] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [todayCount, setTodayCount] = useState(0);
  const [thisMonthCount, setThisMonthCount] = useState(0);
  const [thisYearCount, setThisYearCount] = useState(0);
  const IST_OFFSET = 330; // Offset in minutes (5 hours 30 minutes)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const workResponse = await fetch(`${API_BASE_URL}/auth/${user_id}/work-reports`);
        const workData = await workResponse.json();
        workData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setWorkReports(workData);
        setFilteredReports(workData);

        const employeeResponse = await fetch(`${API_BASE_URL}/auth`);
        const employeeData = await employeeResponse.json();
        const employee = employeeData.find(emp => emp.id === parseInt(user_id));
        setEmployeeName(employee ? employee.name : "Unknown");

        const companyResponse = await fetch(`${API_BASE_URL}/companies`)
        const companyData = await companyResponse.json();
        const companyMap = Object.fromEntries(companyData.map(company => [company.id, company.company_name]));
        setCompanies(companyMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user_id]);

  useEffect(() => {
    const today = new Date();
    let todayCount = 0, thisMonthCount = 0, thisYearCount = 0;
    workReports.forEach((report) => {
      const reportDate = parseISO(report.date);
      if (isSameDay(reportDate, today)) todayCount++;
      if (isThisMonth(reportDate)) thisMonthCount++;
      if (isThisYear(reportDate)) thisYearCount++;
    });
    setTodayCount(todayCount);
    setThisMonthCount(thisMonthCount);
    setThisYearCount(thisYearCount);

    let filtered = workReports;
    if (searchDate) {
      const parsedSearchDate = parseISO(searchDate);
      filtered = filtered.filter(report => isSameDay(parseISO(report.date), parsedSearchDate));
    }
    if (searchCompany) {
      filtered = filtered.filter(report =>
        companies[report.company_id]?.toLowerCase().includes(searchCompany.toLowerCase())
      );
    }
    setFilteredReports(filtered);
  }, [workReports, searchDate, searchCompany, companies]);

  const convertToIST = (utcDate) => {
    const date = parseISO(utcDate);
    return new Date(date.getTime() - IST_OFFSET * 60 * 1000);
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 800, margin: "auto" }}>
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 2 }}>
        Work Reports - {employeeName}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, marginBottom: 2, justifyContent: "center" }}>
        <Box sx={{ padding: 2, backgroundColor: "#f0f0f0", borderRadius: 1, boxShadow: 2 }}>
          <Typography variant="h6">Reports Today: {todayCount}</Typography>
        </Box>
        <Box sx={{ padding: 2, backgroundColor: "#f0f0f0", borderRadius: 1, boxShadow: 2 }}>
          <Typography variant="h6">Reports This Month: {thisMonthCount}</Typography>
        </Box>
        <Box sx={{ padding: 2, backgroundColor: "#f0f0f0", borderRadius: 1, boxShadow: 2 }}>
          <Typography variant="h6">Reports This Year: {thisYearCount}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField label="Search by Date" type="date" InputLabelProps={{ shrink: true }} value={searchDate} onChange={(e) => setSearchDate(e.target.value)} fullWidth />
        <TextField label="Search by Company Name" value={searchCompany} onChange={(e) => setSearchCompany(e.target.value)} fullWidth />
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredReports.length > 0 ? (
        filteredReports.map((report) => {
          const inTime = convertToIST(report.in_time);
          const outTime = convertToIST(report.out_time);

          return (
            <Card key={report.id} sx={{ marginBottom: 2, padding: 2, boxShadow: 3 }}>
              <CardContent>
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>Report ID: {report.id}</Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>{companies[report.company_id] || "Unknown"}</Typography>
                <Typography variant="body2" color="text.secondary">Date: {format(parseISO(report.date), "dd/MM/yyyy")}</Typography>
                <Typography variant="body2"><strong>Machine Name:</strong> {report.machine_name}</Typography>
                <Typography variant="body2"><strong>Nature of Complaint:</strong> {report.nature_of_complaint}</Typography>
                <Typography variant="body2"><strong>Solution:</strong> {report.solution}</Typography>
                <Typography variant="body2"><strong>Time:</strong> {format(inTime, "hh:mm a")} - {format(outTime, "hh:mm a")}</Typography>
                <Typography variant="body2"><strong>Status:</strong> {report.status}</Typography>
                <Typography variant="body2"><strong>Assistant:</strong> {report.assistant_name}</Typography>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography sx={{ textAlign: "center", marginTop: 4 }}>No work reports found.</Typography>
      )}
    </Box>
  );
}

export default EmpDetails;
