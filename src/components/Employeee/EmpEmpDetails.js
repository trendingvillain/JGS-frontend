import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress, TextField, Grid } from "@mui/material";
import { format, parseISO, isSameDay, isThisMonth, isThisYear } from "date-fns";
import API_BASE_URL from "../config/apiConfig";

function EmpEmpDetails() {
  const user_id = localStorage.getItem("id");
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

  const IST_OFFSET = 330; // 5 hours 30 minutes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workResponse, employeeResponse, companyResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/auth/${user_id}/work-reports`),
          fetch(`${API_BASE_URL}/auth`),
          fetch(`${API_BASE_URL}/companies`),
        ]);

        const workData = await workResponse.json();
        const employeeData = await employeeResponse.json();
        const companyData = await companyResponse.json();

        // Sort by Call Code (id) DESC
        workData.sort((a, b) => b.id - a.id);

        setWorkReports(workData);
        setFilteredReports(workData);

        const employee = employeeData.find((emp) => emp.id === parseInt(user_id));
        setEmployeeName(employee ? employee.name : "Unknown");

        const companyMap = Object.fromEntries(companyData.map((company) => [company.id, company.company_name]));
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
    let todayCount = 0, monthCount = 0, yearCount = 0;

    workReports.forEach((report) => {
      const reportDate = parseISO(report.date);
      if (isSameDay(reportDate, today)) todayCount++;
      if (isThisMonth(reportDate)) monthCount++;
      if (isThisYear(reportDate)) yearCount++;
    });

    setTodayCount(todayCount);
    setThisMonthCount(monthCount);
    setThisYearCount(yearCount);

    let filtered = workReports;
    if (searchDate) {
      const parsedDate = parseISO(searchDate);
      filtered = filtered.filter((report) => isSameDay(parseISO(report.date), parsedDate));
    }
    if (searchCompany) {
      filtered = filtered.filter((report) =>
        companies[report.company_id]?.toLowerCase().includes(searchCompany.toLowerCase())
      );
    }
    setFilteredReports(filtered);
  }, [workReports, searchDate, searchCompany, companies]);

  const convertToIST = (utcDate) => {
    const date = parseISO(utcDate);
    return new Date(date.getTime() - IST_OFFSET * 60 * 1000);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#4caf50"; // green
      case "pending":
        return "#f44336"; // red
      default:
        return "#ff9800"; // orange
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 1000, margin: "auto", backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 3, color: "#1976d2" }}>
        Work Reports - {employeeName}
      </Typography>

      {/* Summary Counts */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        {[
          { label: "Today's Reports", count: todayCount },
          { label: "This Month's Reports", count: thisMonthCount },
          { label: "This Year's Reports", count: thisYearCount },
        ].map(({ label, count }, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box
              sx={{ backgroundColor: "#1976d2", color: "white", padding: 2, borderRadius: 2, textAlign: "center", boxShadow: 3 }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>{label}</Typography>
              <Typography variant="h5">{count}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Company Name"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Work Reports List */}
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredReports.length > 0 ? (
        filteredReports.map((report) => {
          const inTime = convertToIST(report.in_time);
          const outTime = convertToIST(report.out_time);

          return (
            <Card
              key={report.id}
              sx={{
                mb: 2,
                boxShadow: 3,
                borderLeft: `6px solid ${getStatusColor(report.status)}`,
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "#fff",
              }}
            >
              <CardContent>
                

                <Typography variant="body2" sx={{ fontWeight: "bold", color: "#555" }}>
                  Call Code: {report.id}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#1976d2" }}
                >
                  {companies[report.company_id] || "Unknown Company"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {format(parseISO(report.date), "dd/MM/yyyy")}
                </Typography>
                
                <Typography variant="body2"><strong>Machine:</strong> {report.machine_name}</Typography>
                
                <Typography variant="body2"><strong>Complaint:</strong> {report.nature_of_complaint}</Typography>
                
                <Typography variant="body2"><strong>Solution:</strong> {report.solution}</Typography>
                
                <Typography variant="body2">
                  <strong>Time:</strong> {format(inTime, "hh:mm a")} - {format(outTime, "hh:mm a")}
                </Typography>
                
                <Typography variant="body2" sx={{ fontWeight: "bold", color: getStatusColor(report.status) }}>
                  <strong>Status:</strong> {report.status}
                </Typography>
                
                <Typography variant="body2"><strong>Assistant:</strong> {report.assistant_name}</Typography>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography sx={{ textAlign: "center", mt: 4 }}>No work reports found.</Typography>
      )}
    </Box>
  );
}

export default EmpEmpDetails;
