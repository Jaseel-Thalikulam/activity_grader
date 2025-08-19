import mongoose from "mongoose";
import { secrets } from "../constants/constants.js";


export function connectMongoDB() { 
    mongoose
    .connect(secrets.mongodb_url)
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.error(err);
    });
}