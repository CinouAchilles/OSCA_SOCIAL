import express from "express"
import dotenv from "dotenv"
import cloudinary from 'cloudinary'

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import notificationsRoutes from "./routes/notification.routes.js"

import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(
    cors({
      origin: "*", // Allow all origins for testing
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true, // Allow cookies
    })
  );

const port = process.env.PORT || 3000;


app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationsRoutes)

app.listen(port , ()=>{
    console.log("server is running in port: "+port);
    connectDB();
    // console.log(process.env.MONGO_URI)

})