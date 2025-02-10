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
import API_BASE_URL from './../config/apiConfig';

function Company() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/companies`);
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) =>
    company.company_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 2 }}>
        Company List
      </Typography>

      {/* Search Input */}
      <TextField
        label="Search Company"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Company List */}
      <List sx={{ backgroundColor: "#fff", borderRadius: 1, boxShadow: 2 }}>
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <ListItem
              key={company.id}
              button
              onClick={() => navigate(`/${company.id}/work-report`)} // Adjust navigation path
              sx={{
                "&:hover": { backgroundColor: "#f0f0f0" },
                borderBottom: "1px solid #ddd",
              }}
            >
              <ListItemText primary={company.company_name} />
            </ListItem>
          ))
        ) : (
          <Typography sx={{ textAlign: "center", padding: 2 }}>
            No companies found.
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
        onClick={() => navigate("/Com_register")}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default Company;
