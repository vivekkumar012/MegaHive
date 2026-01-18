import express from "express";
import { subscribeModel } from "../models/subscriberModel.js";

const subscriberRouter = express.Router();

subscriberRouter.post("/subscribe", async (req, res) => {
    const {email} = req.body;
    if(!email) {
        return res.status(402).json({
            message: "Email is required"
        })
    }
    try {
        let subscriber = await subscribeModel.findOne({email});

        if(subscriber) {
            return res.status(400).json({
                message: "email is already subscribed"
            })
        }

        subscriber = new subscribeModel({email});
        await subscriber.save();

        res.status(200).json({
            message: "successfully subscribed to the newsletter!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error in Subscribing",
            error: error.message
        })
    }
})

export default subscriberRouter;