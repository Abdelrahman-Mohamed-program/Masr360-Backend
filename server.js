
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//dependancies
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const govRoutes = require('./routes/Governorates');
const placeRoutes = require('./routes/places');
const productRoutes = require('./routes/products');
const nightRoutes = require('./routes/nights');
const reviewRoutes = require('./routes/reviews');
const categoriesRoutes = require('./routes/categories');
const imagesRoutes = require("./routes/images")
const allRoutes = require("./routes/all")
const { errorHandler } = require('./middlewares/errorHandle');
const PORT = process.env.PORT || 5000;
const path = require ("path");
const connectDB = require('./config/dbConnection');
const favouriteRoutes = require('./routes/favourites');

const app = express();
connectDB();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: '*',           
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));



mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected! Attempting reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected!');
});

mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err);
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);//for serving photos 

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/governorates', govRoutes);
app.use('/api/v1/places', placeRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/nights', nightRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/images',imagesRoutes)
app.use('/api/v1/all',allRoutes);
app.use('/api/v1/favourites',favouriteRoutes)
//testing route
app.use((req, res) => res.json({
  message:"Api is running"
}));


app.use(errorHandler)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));