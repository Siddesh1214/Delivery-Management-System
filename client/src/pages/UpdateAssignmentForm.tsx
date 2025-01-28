import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, MenuItem, Typography, Grid } from "@mui/material";
import apiCall from "../hooks/api/api"; // Replace with your actual API call utility

const BASE_URL:string = import.meta.env.VITE_BASE_URL;


interface Assignment {
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
  _id: string;
  orderId: {
    customer: {
      name: string;
      phone: string;
      address: string;
    };
    _id: string;
    orderNumber: string;
    area: string;
    items: { name: string; quantity: number; price: number; _id: string }[];
    status: string;
    scheduledFor: string;
    assignedTo: string;
    totalAmount: number;
    createdAt: string | number | Date;
    updatedAt: string | number | Date;
  };
  partnerId: {
    shift: {
      start: string;
      end: string;
    };
    metrics: {
      rating: number;
      completedOrders: number;
      cancelledOrders: number;
    };
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    currentLoad: number;
    areas: string[];
  };
  status: string;
  reason: string | null;
  timestamp: string;
}

interface Partners {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  areas: string[];
  shift: { start: string; end: string };
  metrics: { rating: number; completedOrders: number; cancelledOrders: number };
}

interface AssignmentEdit{
  partnerId: string;
  reason: string;
  assignmentStatus: string;
}

const UpdateAssignmentForm: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [partners, setPartners] = useState<Partners[]>([]);
  
  const [formData, setFormData] = useState<AssignmentEdit>({
    partnerId: "",
    reason: "",
    assignmentStatus: "", // Default status
  });

  const [loading, setLoading] = useState(false);
  console.log("base url ", BASE_URL);

  // Handle form field changes
  const handleChange = (field: keyof AssignmentEdit, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetchPartners = async () => {
    try {
      const partnersUrl = BASE_URL + "partner/getAllPartners";
      const response: any = await apiCall(partnersUrl, "GET");
      console.log('res ', response);
      setPartners(response.partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  // Fetch assignment details to prefill form (optional)
  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        if (!assignmentId) return;

        setLoading(true);
        const assignmentUrl = BASE_URL + "order/getSpecificAssignmentDetails";
        const response: any = await apiCall(assignmentUrl, "POST",{assignmentId});

        console.log(response);
        if (response.success) {
          // const { partnerId, reason, assignmentStatus } = response.assignment;
          // setFormData({ partnerId, reason, assignmentStatus });
          // setFormData()
          const assignmentDetails = response.assignment;
          setFormData({
            partnerId: assignmentDetails.partnerId._id,
            reason: assignmentDetails.reason,
            assignmentStatus:assignmentDetails.status,
          })
        } else {
          alert(`Error: ${response.message}`);
        }
      } catch (error) {
        console.error("Error fetching assignment details:", error);
        alert("Failed to fetch assignment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
    fetchAssignmentDetails();
  }, [assignmentId]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!assignmentId) {
      alert("Assignment ID is missing.");
      return;
    }

    try {
      setLoading(true);

      // const response: any = await apiCall(
      //   `http://localhost:3000/api/v1/order/updateAssignment/${assignmentId}`,
      //   "POST",
      //   formData
      // );

      const response: any = await apiCall(
        `${BASE_URL}order/updateAssignment/${assignmentId}`,
        "POST",
        formData
      );
      
      console.log("update assignment api res ", response);
      if (response.success) {
        alert("Assignment updated successfully!");
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert("Failed to update assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 3, maxWidth: 600, mx: "auto", boxShadow: 3, borderRadius: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Update Assignment
      </Typography>

      <Grid container spacing={2}>
        {/* Partner ID */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Select Partner"
            variant="outlined"
            value={formData.partnerId}
            onChange={(e) => handleChange("partnerId", e.target.value)}
            required
          >
            {partners.map((partner) => (
              <MenuItem key={partner._id} value={partner._id}>
                {partner.name} {"  -   Mobile Number : "} {partner.phone}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Reason */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Reason"
            variant="outlined"
            value={formData.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            multiline
            rows={3}
          />
        </Grid>

        {/* Assignment Status */}
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Assignment Status"
            value={formData.assignmentStatus}
            onChange={(e) => handleChange("assignmentStatus", e.target.value)}
            required
          >
            <MenuItem value="success">success</MenuItem>
            <MenuItem value="failed">failed</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Assignment"}
      </Button>
    </Box>
  );
};

export default UpdateAssignmentForm;
