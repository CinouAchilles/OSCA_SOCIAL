import express from "express"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"

import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser"

const app = express();
app.use(express.json());
dotenv.config();
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const port = process.env.PORT || 3000;


app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.listen(port , ()=>{
    console.log("server is running in port: "+port);
    connectDB();
    // console.log(process.env.MONGO_URI)

})