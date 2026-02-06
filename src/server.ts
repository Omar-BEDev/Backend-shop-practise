import dotenv from "dotenv"
dotenv.config()
import app from './app';
import connectDB from './config/db';
import { catchAsyncStartup } from './api/utils/catchAsync';
const port = process.env.PORT || 3000;


const startServer = catchAsyncStartup(async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

startServer();
