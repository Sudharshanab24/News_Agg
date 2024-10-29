require("dotenv").config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express=require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imgUrl: { type: String },
  description: { type: String },
  url: { type: String },
  source: { type: String },
  author: { type: String },
  publishedAt: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
});

const Article = mongoose.model('Article', articleSchema);

app.use(
  cors({
    origin: 'https://newsaggr3.netlify.app', // Replace with your Netlify frontend URL
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  });
  
const User = mongoose.model('User', userSchema);

const API_KEY=process.env.API_KEY;

function fetchNews(url,res)
{
    axios.get(url)
    .then(response=>{
        if(response.data.totalResults>0){
            res.json({
                status:200,
                success:true,
                message:"Success",
                data:response.data
            });
        }
        else{
            res.json({
                status:200,
                success:true,
                message:"No results"
            });
        }
    })
    .catch(error=>{
        res.json({
            status:500,
            success:false,
            message:"failed",
            error:error.message
        });
    });
}

app.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();
    res.status(201).send({ message: 'User registered' });
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }
  
    // Include the email in the token payload
    const token = jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
    
    res.send({ token, name: user.name });
  });
  
  app.get('/profile', async (req, res) => {
    const authHeader = req.headers['authorization'];
    
    // Ensure the token is in the "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send('Access denied. No token provided.');
    }
  
    const token = authHeader.split(' ')[1]; // Extract the token
  
    try {
      const verified = jwt.verify(token, 'your_jwt_secret');
      
      // Fetch user by email from the token payload
      const user = await User.findOne({ email: verified.email });
      
      if (!user) {
        return res.status(404).send('User not found');
      }

      // Fetch saved articles for the user
      const articles = await Article.find({ userId: user._id });

      // Return user data (email, name) and their articles
      res.send({ email: user.email, name: user.name, articles });
    } catch (error) {
      res.status(400).send('Invalid token');
    }
});

  
  

app.get("/all-news",(req,res)=>{
    let pageSize=parseInt(req.query.pagesize) || 10;
    let page=parseInt(req.query.page)||1;
    let url=`https://newsapi.org/v2/everything?q=news&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`
    fetchNews(url,res);
})

app.options("/top-headlines",cors());

app.get("/top-headlines",(req,res)=>{
    let pageSize=parseInt(req.query.pagesize) || 20;
    let page=parseInt(req.query.page)||1;
    let category=req.query.category||"business";

    let url=`https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`
    fetchNews(url,res);
})

app.post('/save-article', async (req, res) => {
  const authHeader = req.headers['authorization'];
  
  // Ensure the token is in the "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1]; // Extract the token

  try {
    const verified = jwt.verify(token, 'your_jwt_secret');
    
    const newArticle = new Article({
      ...req.body,
      userId: verified.id, // Associate the article with the logged-in user
    });

    await newArticle.save();
    res.status(201).send({ message: 'Article saved successfully' });
  } catch (error) {
    res.status(400).send('Invalid token');
  }
});

const fetchArticles = async () => {
  const response = await fetch(`http://localhost:${process.env.PORT}/saved-articles`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    const articlesData = await response.json();
    setArticles(articlesData);
  } else {
    console.error('Failed to fetch articles:', response.status, response.statusText);
    alert('Failed to fetch articles');
  }
};




const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
    
})
