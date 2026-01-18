import mongoose from "mongoose"

const subscribeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now()
    }
})

export const subscribeModel = mongoose.model("Subscriber", subscribeSchema);