// import React from 'react'

// const CreateOrder = () => {
//   return (
//     <div>CreateOrder</div>
//   )
// }

// export default CreateOrder


import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import apiCall from "../../hooks/api/api";


const BASE_URL:string = import.meta.env.VITE_BASE_URL;


const CreateOrder = () => {
  const [formData, setFormData] = useState({
    customerDetails: {
      name: "",
      phone: "",
      address: "",
    },
    area: "",
    items: [{ name: "", quantity: 0, price: 0 }],
    scheduledFor: "",
    partnerId: "",
    assignmentStatus: "success",
  });

  const [partners, setPartners] = useState<any[]>([]); // To hold the list of partners

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const allPartnersApi = BASE_URL + "partner/getAllPartners";
        const response: any = await apiCall(
          allPartnersApi,
          "GET"
        );
        setPartners(response.partners); // Store partners data
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };
    fetchPartners();
  }, []);

  // Handle input changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle items dynamic fields
  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = formData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({ ...prev, items: [...prev.items, { name: "", quantity: 0, price: 0 }] }));
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createOrderApi = BASE_URL + "order/createOrder";
      const res: any = await apiCall(
        createOrderApi,
        "POST",
        formData
      );
      console.log("Response: ", res);
      setFormData({
        customerDetails: { name: "", phone: "", address: "" },
        area: "",
        items: [{ name: "", quantity: 0, price: 0 }],
        scheduledFor: "",
        partnerId: "",
        assignmentStatus: "success",
      });
      if (res.success) {
        alert("Order created successfully!");
      }
      else {
        alert(`Error: ${res.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 3, minWidth: 600,maxWidth:700, mx: "auto", boxShadow: 3, borderRadius: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Create Order
      </Typography>

      <Grid container spacing={2}>
        {/* Customer Details */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Customer Name"
            variant="outlined"
            value={formData.customerDetails.name}
            onChange={(e) => handleChange("customerDetails", { ...formData.customerDetails, name: e.target.value })}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone"
            variant="outlined"
            value={formData.customerDetails.phone}
            onChange={(e) => handleChange("customerDetails", { ...formData.customerDetails, phone: e.target.value })}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            variant="outlined"
            value={formData.customerDetails.address}
            onChange={(e) => handleChange("customerDetails", { ...formData.customerDetails, address: e.target.value })}
            required
          />
        </Grid>

        {/* Area */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Area"
            variant="outlined"
            value={formData.area}
            onChange={(e) => handleChange("area", e.target.value)}
            required
          />
        </Grid>

        {/* Items */}
        <Grid item xs={12}>
          <Typography variant="h6">Items</Typography>
          {formData.items.map((item, index) => (
            <Box key={index} display="flex" alignItems="center" sx={{ mb: 1 }}>
              <TextField
                fullWidth
                label={`Item ${index + 1} Name`}
                value={item.name}
                onChange={(e) => handleItemChange(index, "name", e.target.value)}
                required
              />
              <TextField
                fullWidth
                label={`Item ${index + 1} Quantity`}
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                required
              />
              <TextField
                fullWidth
                label={`Item ${index + 1} Price`}
                type="number"
                value={item.price}
                onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
                required
              />
              {formData.items.length > 1 && (
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ ml: 2 }}
                  onClick={() => handleRemoveItem(index)}
                >
                  Remove Item
                </Button>
              )}
            </Box>
          ))}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddItem}
            sx={{ mt: 2 }}
          >
            Add Another Item
          </Button>
        </Grid>

        {/* Scheduled For */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Scheduled For"
            type="datetime-local"
            variant="outlined"
            value={formData.scheduledFor}
            onChange={(e) => handleChange("scheduledFor", e.target.value)}
            required
          />
        </Grid>

        {/* Partner ID */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Partner ID</InputLabel>
            <Select
              value={formData.partnerId}
              onChange={(e) => handleChange("partnerId", e.target.value)}
              label="Partner ID"
              required
            >
              {partners.map((partner) => (
                <MenuItem key={partner._id} value={partner._id}>
                  {partner.name} - {partner._id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Assignment Status */}
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Assignment Status"
            value={formData.assignmentStatus}
            onChange={(e) => handleChange("assignmentStatus", e.target.value)}
          >
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="failure">Failure</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
      >
        Submit Assignment
      </Button>
    </Box>
  );
};

export default CreateOrder;
