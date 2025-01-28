// import React from 'react'

// const AllAssignments = () => {
//   return (
//     <div>AllAssignments</div>
//   )
// }

// export default AllAssignments


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

const AssignmentTable = () => {
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response: any = await apiCall(
          "http://localhost:3000/api/v1/order/getAllAssignmentsDetails",
          "GET"
        );
        console.log(response);
        setAllAssignments(response.assignments);


      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    fetchAssignments();
  }, []);

  const handleEdit = (assignmentId: string) => {
    navigate(`/edit-assignment/${assignmentId}`);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
    
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };
    
  const paginatedAssignments = allAssignments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    
  const getOrderStatusColor = (status:string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "assigned":
        return "info"; 
      case "picked":
        return "primary";
      case "delivered":
        return "success";
      default:
        return "default";
    }
  };

  const getAssignmentStatusColor = (status: string) => {
    return status === "success" ? "primary" : "secondary";  
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom>
        Assignments Table
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
              <TableCell sx={{ minWidth: 200 }}>Order Number</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Customer Phone</TableCell>
              <TableCell>Partner Name</TableCell>
              <TableCell>Partner Phone</TableCell>
              <TableCell>Partner Email</TableCell>
              <TableCell>Partner Rating</TableCell>
              <TableCell>Assignment Status</TableCell>
              <TableCell sx={{ minWidth: 250 }}>Reason</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Created At</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Updated At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAssignments.map((assignment) => (
              <TableRow key={assignment._id}>
                <TableCell sx={{ minWidth: 200 }}>{assignment.orderId.orderNumber}</TableCell>
                <TableCell>{assignment.orderId.customer.name}</TableCell>
                <TableCell>{assignment.orderId.customer.phone}</TableCell>
                <TableCell>{assignment.partnerId.name}</TableCell>
                <TableCell>{assignment.partnerId.phone}</TableCell>
                <TableCell>{assignment.partnerId.email}</TableCell>
                <TableCell>{assignment.partnerId.metrics.rating}</TableCell>
                <TableCell>
                  <Chip label={assignment.status} color={getAssignmentStatusColor(assignment.status)} />
                </TableCell>
                <TableCell sx={{ minWidth: 250 }}>{assignment.reason || "N/A"}</TableCell>
                <TableCell>{assignment.orderId.totalAmount}</TableCell>
                <TableCell>
                  <Chip label={assignment.orderId.status} color={getOrderStatusColor(assignment.orderId.status)} />
                </TableCell>
                <TableCell sx={{ minWidth: 150 }}>{new Date(assignment.createdAt).toLocaleString()}</TableCell>
                <TableCell sx={{ minWidth: 150 }}>{new Date(assignment.updatedAt).toLocaleString()}</TableCell>
                {/* <TableCell>{assignment?.createdAt}</TableCell> */}
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(assignment._id)}
                  >
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
        count={allAssignments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default AssignmentTable;
