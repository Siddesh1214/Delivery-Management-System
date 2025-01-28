import { Request, Response } from "express";

import Partner from "../models/Partner.js";


export const addPartner = async (req: Request, res: Response): Promise<any> => {
  try {
    
    const { name, email, phone, status, areas, shift, metrics } = req.body;
    if (!name || !email || !phone || !status || !areas || !shift) {
      return res.status(400).json({
        success:false,
        message: "Please fill in all fields"
      });
    }

    const existingPartner = await Partner.findOne({ email });
    if (existingPartner) {
      return res.status(409).json({
        success:false,
        message: "Partner already exists with the given email",
      });
    }
    const partner = await Partner.create({
      name,
      email,
      phone,
      status:status || "active",
      areas,
      shift,
      metrics: metrics || { rating: 0, completedOrders: 0, cancelledOrders: 0 },
    });
    
    console.log("PARTNER DETAILS ",partner);
    
    return res.status(201).json({
      success:true,
      message: "Partner added successfully.",
      partner,
    });

  } catch (error) {
    console.error("Error adding partner:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error
    });
  }
}


export const getAllPartners = async (req: Request, res: Response):Promise<any> => {
  try {
    const allPartners = await Partner.find({});
    console.log("ALL PARTNER DETAILS ",allPartners);
    return res.status(200).json({
      success:true,
      message: "All partners retrieved successfully",
      partners: allPartners
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
    
  }
}
export const getPartnerDetails = async (req: Request, res: Response):Promise<any> => {
  try {
    const { partnerId } = req.params;

    if (!partnerId) {
      console.log("PLEASE PROVIDE PARTNERID ");
      return res.status(400).json({
        success: false,
        message: "Partner ID is required.",
      });
    }

    const partner = await Partner.findById({ _id: partnerId });
    if (!partner) {
      console.log("PARTNER NOT FOUND WITH ", partnerId);
      return res.status(404).json({
        success: false,
        message: "Partner not found.",
      });
    }
    
    console.log("PARTNER DETAILS ",partner);
    return res.status(200).json({
      success:true,
      message: "Partner data retrieved successfully",
      partner: partner
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
    
  }
}


export const updatePartner = async (req: Request, res: Response):Promise<any> => {
  try {
    // const { id ,updateData} = req.body;
    const { partnerId ,...updateData} = req.body;

    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: "Partner ID is required for updating.",
      });
    }

    const updatedPartner = await Partner.findByIdAndUpdate(
      partnerId, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    );

    if (!updatedPartner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Partner updated successfully.",
      partner: updatedPartner,
    });
  } catch (error) {
    console.error("Error updating partner:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error,
    });
  }
};