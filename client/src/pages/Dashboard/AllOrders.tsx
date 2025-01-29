import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  TablePagination,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiCall from "../../hooks/api/api";

const BASE_URL: string = import.meta.env.VITE_BASE_URL;


interface Order {
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
  assignedTo: {
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
    status: 'pending' | 'assigned' | 'picked' | 'delivered';
    currentLoad: number;
    areas: string[];
    __v: number;
  };
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}



const OrderTable = () => {

  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const allOrders = BASE_URL + 'order/getAllOrders';
        const response: any = await apiCall(allOrders, "GET");
        console.log('res ', response);
        setAllOrders(response.orders);
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };
    fetchPartners();
  }, []);


  const handleEdit = (orderId: string) => {
    // Redirect to the Edit Partner page with the Partner ID in the URL
    navigate(`/edit-order/${orderId}`);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };
  
  const paginatedOrders = allOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  
  const getStatusColor = (status:string) => {
    switch (status) {
      case "pending":
        return "warning"; // Yellow for pending
      case "assigned":
        return "info"; // Blue for assigned
      case "picked":
        return "primary"; // Light green for picked
      case "delivered":
        return "success"; // Green for delivered
      default:
        return "default"; // Default gray for unknown statuses
    }
  };
  

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom>
        Orders Table
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 500,
          overflowX: "auto", // Enables horizontal scrolling
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 150 }}>Order Number</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Customer Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Area</TableCell>
              <TableCell sx={{ minWidth: 250 }}>Items</TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Scheduled For</TableCell>
              <TableCell sx={{ minWidth: 350 }}>Assigned To</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Created At</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Updated At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell sx={{ minWidth: 150 }}>{order.orderNumber}</TableCell>
                <TableCell sx={{ minWidth: 150 }}>{order.customer.name}</TableCell>
                <TableCell>{order.customer.phone}</TableCell>
                <TableCell>{order.area}</TableCell>
                <TableCell sx={{ minWidth: 250 }}>
                  {order.items.map((item) => (
                    <Box key={item._id}>
                      {item.name} (Qty: {item.quantity}, Price: {item.price})
                    </Box>
                  ))}
                </TableCell>
                <TableCell>
                  {/* {order.status} */}
                  <Chip label={order.status} color={getStatusColor(order.status)} />

                </TableCell>
                <TableCell sx={{ minWidth: 150 }}>{new Date(order.scheduledFor).toLocaleString()}</TableCell>
                <TableCell sx={{ minWidth: 350 }}>
                  {order.assignedTo.name} (Shift: {order.assignedTo.shift.start}-
                  {order.assignedTo.shift.end}, Rating: {order.assignedTo.metrics.rating})
                </TableCell>
                <TableCell>{order.totalAmount}</TableCell>
                <TableCell sx={{ minWidth: 150 }}>{new Date(order.createdAt).toLocaleString()}</TableCell>
                <TableCell sx={{ minWidth: 150 }}>{new Date(order.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(order._id)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[2, 5, 10, 25]}
        component="div"
        count={allOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default OrderTable;
