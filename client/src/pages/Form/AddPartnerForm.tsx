import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
} from "@mui/material";
import apiCall from "../../hooks/api/api";

const BASE_URL:string = import.meta.env.VITE_BASE_URL;


const AddPartnerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active",
    areas: [""],
    shift: { start: "", end: "" },
    metrics: { rating: 0, completedOrders: 0, cancelledOrders: 0 },
  });

  // Handle input changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle areas dynamic fields
  const handleAreaChange = (index: number, value: string) => {
    const updatedAreas = formData.areas.map((area, i) =>
      i === index ? value : area
    );
    setFormData((prev) => ({ ...prev, areas: updatedAreas }));
  };

  const handleShiftChange = (key: "start" | "end", value: string) => {
    setFormData((prev) => ({
      ...prev,
      shift: { ...prev.shift, [key]: value },
    }));
  };

  const handleAddArea = () => {
    setFormData((prev) => ({ ...prev, areas: [...prev.areas, ""] }));
  };

  const handleRemoveArea = (index: number) => {
    const updatedAreas = formData.areas.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, areas: updatedAreas }));
  };

  

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      const addPartnerApi = BASE_URL + "partner/addPartner";
      const res :any= await apiCall(addPartnerApi, "POST",formData);
      console.log('res ', res);
      setFormData({
        name: "",
        email: "",
        phone: "",
        status: "active",
        areas: [""],
        shift: { start: "", end: "" },
        metrics: { rating: 0, completedOrders: 0, cancelledOrders: 0 },
      });
      if (res.success) {
        alert("Partner added successfully!");
      }
      else {
        alert(`Error: ${res.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 3, maxWidth: 700, mx: "auto", boxShadow: 3, borderRadius: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Add Partner
      </Typography>

      <Grid container spacing={2}>
        {/* Name */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </Grid>

        {/* Phone */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone"
            variant="outlined"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
          />
        </Grid>

        {/* Status */}
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Grid>

        {/* Areas */}
        <Grid item xs={12}>
          <Typography variant="h6">Areas</Typography>
          {formData.areas.map((area, index) => (
            <Box key={index} display="flex" alignItems="center" sx={{ mb: 1 }}>
              <TextField
                fullWidth
                label={`Area ${index + 1}`}
                value={area}
                onChange={(e) => handleAreaChange(index, e.target.value)}
                required
              />
              {formData.areas.length > 1 && (
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ ml: 2 }}
                  onClick={() => handleRemoveArea(index)}
                >
                  Remove
                </Button>
              )}
            </Box>
          ))}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddArea}
            sx={{ mt: 2 }}
          >
            Add Another Area
          </Button>
        </Grid>


        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Shift Start"
            type="time"
            variant="outlined"
            value={formData.shift.start}
            onChange={(e) => handleShiftChange("start", e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Shift End"
            type="time"
            variant="outlined"
            value={formData.shift.end}
            onChange={(e) => handleShiftChange("end", e.target.value)}
            required
          />
        </Grid>

        {/* Metrics */}
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Rating"
            type="number"
            variant="outlined"
            value={formData.metrics.rating}
            onChange={(e) =>
              handleChange("metrics", {
                ...formData.metrics,
                rating: Number(e.target.value),
              })
            }
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Completed Orders"
            type="number"
            variant="outlined"
            value={formData.metrics.completedOrders}
            onChange={(e) =>
              handleChange("metrics", {
                ...formData.metrics,
                completedOrders: Number(e.target.value),
              })
            }
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Cancelled Orders"
            type="number"
            variant="outlined"
            value={formData.metrics.cancelledOrders}
            onChange={(e) =>
              handleChange("metrics", {
                ...formData.metrics,
                cancelledOrders: Number(e.target.value),
              })
            }
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddPartnerForm;
