import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
} from "@mui/material";
import apiCall from "../hooks/api/api";

const BASE_URL:string = import.meta.env.VITE_BASE_URL;


interface Item {
  name: string;
  quantity: number;
  price: number;
}

interface PartnerDetails {
  name: string;
  phone: string;
  partnerId: string;
}

interface CustomerDetail {
  name: string;
  phone: string;
  address: string;
}

interface OrderData {
  orderId: string;
  customerDetails: CustomerDetail;
  area: string;
  items: Item[];
  scheduledFor: string;
  totalAmount: number;
  partnerId: string;
  orderStatus: string;
  partnerDetails:PartnerDetails

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



const orderStatuses = ["pending", "assigned", "picked", "delivered"];
const UpdateOrderForm = () => {
  const { orderId } = useParams();
  const [partners, setPartners] = useState<Partners[]>([]);
  const [orderData, setOrderData] = useState<OrderData>({
    orderId: orderId || "",
    customerDetails: {
      name: "",
      phone: "",
      address: "",
    },
    area: "",
    items: [{ name: "", quantity: 0, price: 0 }],
    scheduledFor: "",
    totalAmount: 0,
    partnerId: "",
    orderStatus: "",
    partnerDetails: {
      name: "",
      phone: "",
      partnerId:"",
    }
  });

  // Handle change for general fields
  const handleChange = (field: string, value: any) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle change for customer details
  const handleCustomerDetailChange = (field: keyof CustomerDetail, value: string) => {
    setOrderData((prev) => ({
      ...prev,
      customerDetails: { ...prev.customerDetails, [field]: value },
    }));
  };

  const handleItemChange = (index: number, field: keyof Item, value: any) => {
    const updatedItems = orderData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setOrderData((prev) => ({ ...prev, items: updatedItems }));
  };
    

  const handleAddItem = () => {
    setOrderData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 0, price: 0 }],
    }));
  };
    
  const handleRemoveItem = (index: number) => {
    const updatedItems = orderData.items.filter((_, i) => i !== index);
    setOrderData((prev) => ({ ...prev, items: updatedItems }));
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        alert("Please provide a valid Order ID.");
        return;
      }
      try {
        const specificOrderUrl = BASE_URL + "order/getSpecificOrderDetails";

        const response: any = await apiCall(
          specificOrderUrl,
          "POST",
          { orderId }
        );
        if (response.success) {
          const fetchedOrder = response.order;
          setOrderData({
            orderId: fetchedOrder._id,
            customerDetails: {
              name: fetchedOrder.customer.name,
              phone: fetchedOrder.customer.phone,
              address: fetchedOrder.customer.address,
            },
            area: fetchedOrder.area,
            items: fetchedOrder.items,
            scheduledFor: fetchedOrder.scheduledFor,
            totalAmount: fetchedOrder.totalAmount,
            partnerId: fetchedOrder.assignedTo._id,
            orderStatus: fetchedOrder.status,
            partnerDetails: {
              name: fetchedOrder.assignedTo.name,
              phone: fetchedOrder.assignedTo.phone,
              partnerId:fetchedOrder.assignedTo._id,
            }
          });

          console.log('fetchedOrder ', fetchedOrder);
        } else {
          alert(`Error: ${response.message}`);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        alert("Failed to fetch order details.");
      }
    };

    fetchPartners();
    fetchOrderDetails();
  }, [orderId]);

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
    

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {

      const updateOrderUrl = `${BASE_URL}order/updateOrder/${orderId}`;
      const response: any = await apiCall(
        updateOrderUrl,
        "POST",
        orderData
      );
      if (response.success) {
        alert("Order updated successfully!");
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 3, maxWidth: 800, mx: "auto", boxShadow: 3, borderRadius: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Update Order
      </Typography>

      <Grid container spacing={2}>
        {/* Customer Details */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Customer Details
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Customer Name"
            variant="outlined"
            value={orderData.customerDetails.name}
            onChange={(e) =>
              handleCustomerDetailChange("name", e.target.value)
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Phone"
            variant="outlined"
            value={orderData.customerDetails.phone}
            onChange={(e) =>
              handleCustomerDetailChange("phone", e.target.value)
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            variant="outlined"
            value={orderData.customerDetails.address}
            onChange={(e) =>
              handleCustomerDetailChange("address", e.target.value)
            }
          />
        </Grid>

        {/* Area */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Area"
            variant="outlined"
            value={orderData.area}
            onChange={(e) => handleChange("area", e.target.value)}
          />
        </Grid>

        {/* Scheduled For */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Scheduled For"
            type="datetime-local"
            variant="outlined"
            value={orderData.scheduledFor}
            onChange={(e) => handleChange("scheduledFor", e.target.value)}
          />
        </Grid>

        {/* Partner Dropdown */}
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Select Partner"
            value={orderData.partnerId}
            onChange={(e) => handleChange("partnerId", e.target.value)}
          >
            {partners.map((partner) => (
              <MenuItem key={partner._id} value={partner._id}>
                {partner.name } {"  -   Mobile Number : "} {partner.phone}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Order Status Dropdown */}
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Order Status"
            value={orderData.orderStatus}
            onChange={(e) => handleChange("orderStatus", e.target.value)}
          >
            {orderStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Items Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Items
          </Typography>
        </Grid>
        {orderData.items.map((item, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Item Name"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", Number(e.target.value))
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", Number(e.target.value))
                }
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveItem(index)}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
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

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
      >
        Update Order
      </Button>
    </Box>
  );
};

export default UpdateOrderForm;
