
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//dependancies
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const govRoutes = require('./routes/Governorates');
const placeRoutes = require('./routes/places');
const productRoutes = require('./routes/products');
const nightRoutes = require('./routes/nights');
const reviewRoutes = require('./routes/reviews');
const categoriesRoutes = require('./routes/categories');
const { errorHandler } = require('./middlewares/errorHandle');
const PORT = process.env.PORT || 5000;
const path = require ("path")
//middlewares and routes
const app = express();

app.use(express.json());
app.use(cors({
  origin: '*',            // allow all origins
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'], // allow all methods
  allowedHeaders: ['Content-Type', 'Authorization'] // allow common headers
}));





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

//testing route
app.use((req, res) => res.json({
  message:"Api is running"
}));


app.use(errorHandler)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('DB connection error', err);
  });


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));