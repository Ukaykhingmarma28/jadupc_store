import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './configs/ormconfig';
import userRouter from './services/users/userRoute';
import globalErrorHandler from './middleware/globalErrorHandler';
import { config } from './configs/config';
import productRouter from './services/products/productRoute';

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);

// Global error handler
app.use(globalErrorHandler);

const PORT = config.port || 3000;

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization', error);
  });

