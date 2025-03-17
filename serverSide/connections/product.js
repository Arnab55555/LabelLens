import mongoose from "mongoose"

export function connectDB(mongo_url){
    return mongoose.connect(mongo_url)
}