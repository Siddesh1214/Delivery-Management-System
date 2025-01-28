// import { Request, Response } from "express";
import express, { Request, Response } from "express";
import  Order  from "../models/Order.js";
import Assignment from "../models/Assignment.js";

import { ApiResponse } from '../config/types.js';

export const createOrder = async (req: Request, res: Response):Promise<any>=> {
  try {
    const {customerDetails, area, items, scheduledFor, totalAmount,partnerId,reason,assignmentStatus } = req.body;

    if (!customerDetails || !area || !items || !scheduledFor || !partnerId) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields"
      });
    }



    const indiaTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const formattedTime = indiaTime.replace(/[\/,:\s]/g, '').replace(/pm|am/i, '').toLowerCase();
    const orderNumber = "ORD" + formattedTime;

    let totalAmt: number=0;
    for (let i = 0; i < items.length; i++){
      const stepPrice = items[i].quantity * items[i].price;
      totalAmt += stepPrice;
    }
    const order = await Order.create({
      orderNumber,
      customer:customerDetails,
      area,
      items,
      scheduledFor,
      totalAmount:totalAmt,
      assignedTo: partnerId,
    })

    console.log('ORDER DETAILS ', order);
    
    const assignmentDoc = await Assignment.create({
      orderId: order._id,
      partnerId: order.assignedTo,
      reason: reason || null,
      status:assignmentStatus
    })

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      // order:order,
      // Assignment: assignmentDoc,
      data:{order, assignmentDoc}
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error,
    });
  }
}


export const updateOrder = async (req: Request, res: Response):Promise<any> => {

  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }
    const { customerDetails, area, items, scheduledFor, totalAmount, partnerId, orderStatus, reason, assignmentStatus } = req.body;
    if (!customerDetails && !area && !items && !scheduledFor && !totalAmount && !partnerId && !orderStatus && !reason && !assignmentStatus) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update.",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }
    if (customerDetails) {
      order.customer = customerDetails;
    }
    if (area) {
      order.area = area;
    }
    if (items) {
      order.items = items;
    }
    if (scheduledFor) {
      order.scheduledFor = scheduledFor;
    }
    if (totalAmount) {
      order.totalAmount = totalAmount;
    }
    if (partnerId) {
      order.assignedTo = partnerId;
    }
    if (orderStatus) {
      order.status = orderStatus;
    }

    let totalAmt: number=0;
    for (let i = 0; i < items.length; i++){
      const stepPrice = items[i].quantity * items[i].price;
      totalAmt += stepPrice;
    }
    order.totalAmount = totalAmt;

    const updatedOrder = await order.save();

    const assignmentDetails = await Assignment.findOne({ orderId: orderId })
    if (!assignmentDetails) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }
    if (partnerId) {
      assignmentDetails.partnerId = partnerId;
    }
    if (reason) {
      assignmentDetails.reason = reason;
    }
    if (assignmentStatus) {
      assignmentDetails.status = assignmentStatus;
    }

    
    const updatedAssignment = await assignmentDetails.save();
    

    return res.status(200).json({
      success: true,
      message: "Order and Assignment updated successfully.",
      order: updatedOrder,
      assigment:updatedAssignment
    });

  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error
    });
  }
}


export const getSpecificOrderDetails = async (req: Request, res: Response):Promise<any> => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      console.log("PLEASE PROVIDE ORDERID ");
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    const orderDetails = await Order.findById({ _id: orderId }).populate("assignedTo").exec();
    
    if (!orderDetails) {
      console.log("ORDER NOT FOUND WITH ", orderId);
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order details retrieved successfully.",
      order: orderDetails
    });
    
  } catch (error) {
    console.error("Error in getting order details :", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error
    });
  }
}



export const getSpecificAssignmentDetails = async (req: Request, res: Response):Promise<any> => {
  try {
    const { assignmentId } = req.body;
    if (!assignmentId) {
      console.log("ASSIGNMENT NOT FOUND WITH ", assignmentId);
      return res.status(400).json({
        success: false,
        message: "Assignment ID is required.",
      });
    }

    const assigmentDetails = await Assignment.findById({ _id: assignmentId }).populate("partnerId orderId").exec();

    if (!assigmentDetails) {
      console.log("ASSIGNMENT NOT FOUND WITH ", assignmentId);
      return res.status(404).json({
        success: false,
        message: "ASSIGNMENT not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "ASSIGNMENT details retrieved successfully.",
      assignment: assigmentDetails
    });
    
  } catch (error) {
    console.error("Error in getting assignment details :", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error
    });
  }
}


export const getAllAssignmentsDetails = async (req: Request, res: Response):Promise<any> => {
  try {
    const allAssigments = await Assignment.find({}).populate("partnerId orderId").exec();

    if (!allAssigments) {
      console.log("NO ASSIGNMENTS FOUND ");
      return res.status(404).json({
        success: false,
        message: "NO ASSIGNMENTS FOUND.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "assignments details retrieved successfully.",
      assignments: allAssigments
    });
    
  } catch (error) {
    console.error("Error in getting assignments :", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error
    });
  }
}

export const getAllOrders = async (req: Request, res: Response):Promise<any> => {
  try {
    const allOrders = await Order.find({}).populate('assignedTo');

    if (!allOrders) {
      console.log("NO ORDERS FOUND ");
      return res.status(404).json({
        success: false,
        message: "NO ORDERS FOUND.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "all orders details retrieved successfully.",
      orders: allOrders
    });
    
  } catch (error) {
    console.error("Error in getting orders details :", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error
    });
  }
}



export const updateAssignment = async (req: Request, res: Response):Promise<any> => {
  try {
    const { assignmentId } = req.params;
    
    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        message: "Assignment ID is required.",
      });
    }

    const { partnerId, reason, assignmentStatus } = req.body;

    console.log("partnerId ",partnerId);
    console.log("reason ",reason);
    console.log("assignmentStatus ",assignmentStatus);

    if (!partnerId && !assignmentStatus && !reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update.",
      });
    }



    const assignmentDetails = await Assignment.findById(assignmentId);
    if (!assignmentDetails) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }
    if (partnerId) {
      assignmentDetails.partnerId = partnerId;
    }
    if (reason) {
      assignmentDetails.reason = reason;
    }
    if (assignmentStatus) {
      assignmentDetails.status = assignmentStatus;
    }

    await assignmentDetails.save();
    
    const assignmentDetailsNew = await Assignment.findById(assignmentId);

    console.log("assignmentDetailsOld ", assignmentDetails);
    console.log("-------------------------------");
    console.log("assignmentDetailsNew after", assignmentDetailsNew);

    
    return res.status(200).json({
      success: true,
      message: "Assignment Details updated successfully.",
      data: assignmentDetails
    });
    
  } catch (error) {
    console.error("Error in getting Assignment details :", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error
    });
  }
}

