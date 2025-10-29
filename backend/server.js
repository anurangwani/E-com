require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('MongoDB connected');

    
    app.use('/api/products', require('./routes/products'));
    app.use('/api/cart', require('./routes/cart'));
    app.use('/api/checkout', require('./routes/checkout'));

    app.get('/', (req, res) => res.send('Mock Ecom Backend Running'));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
