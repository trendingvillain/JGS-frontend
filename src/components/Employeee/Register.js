import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "Employee",
    name: "",
    dob: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Registration successful!");
        navigate("/employee");
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 3,
            color: "#1976d2",
          }}
        >
          Employee Registration
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {/* Full Name */}
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* Date of Birth */}
          <TextField
            label="Date of Birth"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Hidden Role Input */}
          <input type="hidden" name="role" value="Employee" />

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{
              marginTop: 3,
              padding: 1,
              fontWeight: "bold",
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
