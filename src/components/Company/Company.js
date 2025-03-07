import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  TextField,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import API_BASE_URL from "./../config/apiConfig";

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
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        padding: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 3, color: "#1976d2" }}
      >
        Companies
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
        <TextField
          label="Search Companies"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {/* Company Grid */}
      <Grid container spacing={3} justifyContent="center">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={company.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/${company.id}/work-report`)}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <BusinessIcon sx={{ fontSize: 40, color: "#1976d2" }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#424242" }}
                    >
                      {company.company_name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography sx={{ textAlign: "center", color: "#757575", marginTop: 5 }}>
            No companies found.
          </Typography>
        )}
      </Grid>

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
