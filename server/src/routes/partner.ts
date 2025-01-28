import express from "express";
import { addPartner, getAllPartners, getPartnerDetails, updatePartner }  from "../controllers/partner.js";
const router = express.Router();


router.post('/addPartner', addPartner);
router.get('/getAllPartners', getAllPartners);
router.post('/updatePartner', updatePartner);
router.get('/getPartnerDetails/:partnerId', getPartnerDetails);


export default router;