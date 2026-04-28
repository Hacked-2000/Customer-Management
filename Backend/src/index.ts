import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import customerRoutes from './routes/customerRoutes.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use('/', customerRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    data: null
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    data: null
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
