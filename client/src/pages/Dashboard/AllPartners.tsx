import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Chip, Typography, Box, TablePagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiCall from "../../hooks/api/api";

const BASE_URL:string = import.meta.env.VITE_BASE_URL;


interface Partner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  areas: string[];
  shift: { start: string; end: string };
  metrics: { rating: number; completedOrders: number; cancelledOrders: number };
}

const AllPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const allOrders = BASE_URL + 'partner/getAllPartners';
        const response: any = await apiCall(allOrders, "GET");
        console.log('res ', response);
        setPartners(response.partners);
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };
    fetchPartners();
  }, []);

  const getStatusColor = (status: "active" | "inactive") => {
    return status === "active" ? "primary" : "secondary";  // green for active, default for inactive
  };

  const handleEdit = (partnerId: string) => {
    // Redirect to the Edit Partner page with the Partner ID in the URL
    navigate(`/edit-partner/${partnerId}`);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  const paginatedPartners = partners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer component={Paper} sx={{
          // maxHeight: 500,
          overflowX: "auto", // Enables horizontal scrolling
        }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 150 }}>Name</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Areas</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell sx={{ minWidth: 250 }}>Metrics</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPartners.map((partner) => (
              <TableRow key={partner._id}>
                <TableCell sx={{ minWidth: 150 }}>{partner.name}</TableCell>
                <TableCell sx={{ minWidth: 150 }}>{partner.email}</TableCell>
                <TableCell>{partner.phone}</TableCell>
                <TableCell>
                  <Chip label={partner.status} color={getStatusColor(partner.status)} />
                </TableCell>
                <TableCell>{partner.areas.join(", ")}</TableCell>
                <TableCell>{partner.shift.start} - {partner.shift.end}</TableCell>
                <TableCell sx={{ minWidth: 250 }}>
                  <Box>
                    <Typography variant="body2">Rating: {partner.metrics.rating}</Typography>
                    <Typography variant="body2">Completed Orders: {partner.metrics.completedOrders}</Typography>
                    <Typography variant="body2">Cancelled Orders: {partner.metrics.cancelledOrders}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(partner._id)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[2, 5, 10, 25]}
        component="div"
        count={partners.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default AllPartners;
