import express from "express";
import { subscribe, listSubscribers } from "../controllers/newsletterController.js";

const newsletterRouter = express.Router();

newsletterRouter.post("/subscribe", subscribe);
newsletterRouter.get("/list",       listSubscribers);

export default newsletterRouter;
