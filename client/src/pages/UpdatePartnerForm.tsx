import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, MenuItem, Typography, Grid } from "@mui/material";
import apiCall from "../hooks/api/api";

const BASE_URL:string = import.meta.env.VITE_BASE_URL;


interface Shift {
  start: string;
  end: string;
}

interface Metrics {
  rating: number;
  completedOrders: number;
  cancelledOrders: number;
}

interface FormData {
  partnerId: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive"; // Limiting status to active or inactive
  areas: string[];
  shift: Shift;
  metrics: Metrics;
}

const UpdatePartnerForm = () => {
  const { partnerId } = useParams(); // Get Partner ID from the URL
  const [formData, setFormData] = useState<FormData>({
    partnerId:partnerId || "",
    name: "",
    email: "",
    phone: "",
    status: "active",
    areas: [""],
    shift: { start: "", end: "" },
    metrics: { rating: 0, completedOrders: 0, cancelledOrders: 0 },
  });


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

  const handleRemoveArea = (index:number) => {
    const updatedAreas = formData.areas.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, areas: updatedAreas }));
  };


  // Fetch partner details when the component mounts or Partner ID changes
  useEffect(() => {
    const fetchPartnerDetails = async () => {
      if (!partnerId) {
        alert("Please enter a valid Partner ID.");
        return;
      }
      try {
        const response:any = await apiCall(`${BASE_URL}partner/getPartnerDetails/${partnerId}`,"GET");
        console.log("RESPONSE ", response);
        if (response.success) {
          // setFormData(response.partner);
          const fetchedPartner = response?.partner;

          setFormData({
            partnerId:fetchedPartner?._id,
            name: fetchedPartner?.name,
            email: fetchedPartner?.email,
            phone: fetchedPartner?.phone ,
            status: fetchedPartner?.status,
            areas: fetchedPartner?.areas,
            shift: {
              start: fetchedPartner?.shift?.start,
              end: fetchedPartner?.shift?.end,
            },
            metrics: {
            rating: fetchedPartner?.metrics?.rating,
            completedOrders: fetchedPartner?.metrics?.completedOrders ,
            cancelledOrders: fetchedPartner?.metrics?.cancelledOrders,
          },
        });
        } else {
          alert(`Error: ${response.message}`);
        }

      } catch (error) {
        console.error("Error fetching partner details:", error);
        alert("Failed to fetch partner details.");
      }
    };

    fetchPartnerDetails();
  }, [partnerId]);

  const handleSubmit = async (event:React.FormEvent) => {
    event.preventDefault();

    // API call
    console.log("formData is console ", formData);
    try {
      const updatePartnerUrl=BASE_URL+'partner/updatePartner'
      const response:any = await apiCall(updatePartnerUrl,"POST",formData);
      console.log("Server Response:", response);
      if (response.success) {
        alert("Partner updated successfully!");
      } else {
        alert(`Error: ${response.message}`);
      }
      const updatedData = response?.partner;
      setFormData({
        partnerId:updatedData?._id,
        name: updatedData?.name,
        email: updatedData?.email ,
        phone: updatedData?.phone,
        status: updatedData?.status,
        areas: updatedData?.areas,
        shift: { start: updatedData?.shift?.start, end: updatedData?.shift?.end },
        metrics: { rating: updatedData?.shift?.rating, completedOrders: updatedData?.shift?.completedOrders, cancelledOrders: updatedData?.shift?.cancelledOrders },
      })
    } catch (error) {
      console.error("Error updating partner:", error);
      alert("An error occurred. Please try again.");
    }
  };
  // Handle the rest of the form and submission logic as before...

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 700, mx: "auto", boxShadow: 3, borderRadius: 2 }}>
      {/* Form rendering as you have in UpdatePartnerForm */}
      {/* Use formData for binding values */}
      <Typography variant="h5" gutterBottom>
        Update Partner
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

        {/* Shift Timing */}
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Shift Start"
            type="time"
            variant="outlined"
            value={formData.shift.start}
            onChange={(e) => handleShiftChange("start", e.target.value)}
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
        Update Partner
      </Button>
    </Box>
  );
};

export default UpdatePartnerForm;
