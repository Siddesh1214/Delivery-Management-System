// import express from "express";
import express from "express";

import { createOrder, getAllAssignmentsDetails, getAllOrders, getSpecificAssignmentDetails, getSpecificOrderDetails, updateAssignment, updateOrder } from "../controllers/order.js";

const router = express.Router();

router.post('/createOrder', createOrder);
router.get('/getAllAssignmentsDetails', getAllAssignmentsDetails);
router.get('/getAllOrders', getAllOrders);
router.post('/getSpecificAssignmentDetails', getSpecificAssignmentDetails);
router.post('/getSpecificOrderDetails', getSpecificOrderDetails);
router.post('/updateOrder/:orderId', updateOrder);
router.post('/updateAssignment/:assignmentId', updateAssignment);

export default router;