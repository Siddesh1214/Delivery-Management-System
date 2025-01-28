import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const Instructions: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Instructions
      </Typography>

      <Typography variant="body1" gutterBottom>
        Please follow the steps below to navigate and use the application effectively:
      </Typography>

      <List>
        <ListItem>
          <ListItemText
            primary="Viewing Details"
            secondary="Navigate to the Dashboard dropdown menu to view all Partners, Orders, and Assignments. Each section displays detailed information in a tabular format, with options to edit specific records as needed."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Adding Partners"
            secondary="To add a new partner, go to the Forms dropdown menu and select 'Add Partner.' Fill out the required fields in the form and submit it to add the partner to the system."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Creating Orders"
            secondary="To create a new order, navigate to the Forms dropdown menu and click on 'Create Order.' Complete the form with the necessary details and submit it. The new order will then be visible under the Orders section."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Viewing Updated Data"
            secondary="Once a partner or order has been added, you can view the updated information by revisiting the 'All Partners,' 'All Orders,' or 'All Assignments' sections under the Dashboard dropdown menu."
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default Instructions;
