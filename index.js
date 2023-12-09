// const express=require('express')
// const app=express()
// const mongoose=require('mongoose')
// const dotenv=require('dotenv')
// const cookieParser=require('cookie-parser')
// const cors=require('cors')
// const multer=require('multer')
// const path=require('path')
// const authRoute=require('./routes/auth')
// const userRoute=require('./routes/users')
// const postRoute=require('./routes/posts')
// const categoryRoute=require('./routes/categories')
// const commentRoute=require('./routes/comments')
 


// //database




// //cors
// const corsOptions = {
//     origin: 'http://localhost:5173',
//     credentials: true, 
//   }

 
// //middlewares
// dotenv.config()
// app.use("/images",express.static(path.join(__dirname,"/images")))
// app.use(express.json())
// app.use(cors(corsOptions))
// app.use(cookieParser())
// app.use("/api/auth",authRoute)
// app.use("/api/users",userRoute)
// app.use("/api/posts",postRoute)
// app.use("/api/cats",categoryRoute) 
// app.use("/api/comments",commentRoute) 



// const Db = process.env.DB_URL;

// mongoose.connect(Db, { useNewUrlParser: true });

// const connect = mongoose.connection; 

// try {
//   connect.on("open", () => {
//     console.log("mongoose is connected!!!");
//   });
// } catch (err) {
//   console.log(err, "Error");
// }

// app.get("/",(req,res)=>{
//     res.json("hello")
// })

// //image upload
// const storage=multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,'images')
//     },filename:(req,file,cb)=>{
//         cb(null,req.body.name)
//     }
// })
// //image upload
// const upload=multer({storage:storage})
// app.post("/api/upload",upload.single("file"),(req,res)=>{
//     res.status(200).json("Image has been uploaded!")
// })



// const PORT=process.env.PORT 

// app.listen(PORT || 5000,()=>{
//     console.log(`app is running on port http://localhost:${PORT}`)
// })


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories');
const commentRoute = require('./routes/comments');

// Load environment variables
dotenv.config();

// Database connection
const Db = "mongodb+srv://charusurya17:CharlieDerex17@surya-ecommerce.fkvygn6.mongodb.net/blog_data?retryWrites=true&w=majority";

mongoose.connect(Db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongoose connected!');
  })
  .catch((err) => {
    console.error('Mongoose connection error:', err);
  });

// CORS options
const corsOptions = { 
  origin: 'https://blogserver-bskv.onrender.com',
  credentials: true,
};

// Middleware
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/cats", categoryRoute);
app.use("/api/comments", commentRoute);

// Routes
app.get("/", (req, res) => {
  res.json("hello");
});

// Image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("Image has been uploaded!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is running on port http://localhost:${PORT}`);
});
