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
import path from "path"

dotenv.config();
const app = express();
app.use(express.json({limit:"2mb"}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const __dirname = path.resolve();

app.use(
    cors({
      origin: "http://localhost:5173", // Allow all origins for testing
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

const port = process.env.PORT || 3000;


app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationsRoutes)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  })
}

app.listen(port , ()=>{
    console.log("server is running in port: "+port);
    connectDB();
    // console.log(process.env.MONGO_URI)

})