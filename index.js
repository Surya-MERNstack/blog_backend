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
  origin: ['https://master--blogworkspace.netlify.app', "http://localhost:5173", "*"],
  credentials: true,
};

// Middleware
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/cats", categoryRoute);
app.use("/api/comments", commentRoute);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173', "*","https://master--blogworkspace.netlify.app" );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

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
    // cb(null, req.body.img);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
   console.log(req.body);
  res.status(200).json("Image has been uploaded!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is running on port http://localhost:${PORT}`);
});
