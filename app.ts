import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './src/routes/route';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/api', router);

const url: any = process.env.DB_URL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.listen(port, () => {
  console.log(`Listing from: ${port}`);
});
