import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Fab,
  Avatar,
  Divider,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import API_BASE_URL from "../config/apiConfig";

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth`);
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        padding: 3,
        maxWidth: 600,
        margin: "auto",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          marginBottom: 3,
          fontWeight: "bold",
          color: "#1976d2",
        }}
      >
        Employee Directory
      </Typography>

      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "#fff",
          padding: "8px 12px",
          borderRadius: 2,
          boxShadow: 1,
          marginBottom: 2,
        }}
      >
        <SearchIcon color="action" />
        <TextField
          variant="standard"
          placeholder="Search Employee"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ disableUnderline: true }}
        />
      </Box>

      {/* Employee List */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {filteredEmployees.length > 0 ? (
          <List>
            {filteredEmployees.map((employee, index) => (
              <React.Fragment key={employee.id}>
                <ListItem
                  button
                  onClick={() => navigate(`/${employee.id}/work-reports`)}
                  sx={{
                    padding: "12px 16px",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar sx={{ bgcolor: "#1976d2" }}>
                    <PersonIcon />
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        {employee.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        DOB: {new Date(employee.dob).toLocaleDateString()}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < filteredEmployees.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography sx={{ textAlign: "center", padding: 3, color: "#666" }}>
            No employees found.
          </Typography>
        )}
      </Paper>

      {/* Floating Add Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#1976d2",
          "&:hover": { backgroundColor: "#1565c0" },
        }}
        onClick={() => navigate("/register")}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default Employee;
