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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
    <Box sx={{ padding: 3, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 2 }}>
        Employee List
      </Typography>

      {/* Search Input */}
      <TextField
        label="Search Employee"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Employee List */}
      <List sx={{ backgroundColor: "#fff", borderRadius: 1, boxShadow: 2 }}>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <ListItem
              key={employee.id}
              button
              onClick={() => navigate(`/${employee.id}/work-reports`)}
              sx={{
                "&:hover": { backgroundColor: "#f0f0f0" },
                borderBottom: "1px solid #ddd",
              }}
            >
              <ListItemText
                primary={employee.name}
                secondary={`DOB: ${new Date(employee.dob).toLocaleDateString()}`}
              />
            </ListItem>
          ))
        ) : (
          <Typography sx={{ textAlign: "center", padding: 2 }}>
            No employees found.
          </Typography>
        )}
      </List>

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
