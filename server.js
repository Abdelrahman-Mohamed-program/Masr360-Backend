
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
const { errorHandler } = require('./middlewares/errorHandle');
const PORT = process.env.PORT || 5000;

//middlewares and routes
const app = express();

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/governorates', govRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/nights', nightRoutes);
app.use('/api/reviews', reviewRoutes);


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