// src/app.jsconst 
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.js';
import productRoutes from  './routes/product.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('E-commerce backend is running 🚀');
});


app.use('/api/users', userRoutes);
app.use("/api/products", productRoutes);





export default app;
