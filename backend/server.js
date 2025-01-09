import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import connectDB from "./db/connectDB.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;


app.use("/api/auth", authRoutes)

app.listen(port , ()=>{
    console.log("server is running in port: "+port);
    connectDB();
    // console.log(process.env.MONGO_URI)

})