import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    mongoose.connection.once('open', () => {
      console.log('✅ Connected to DB:', mongoose.connection.name);
    });
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');
    console.log('DB name:', mongoose.connection.name);
    console.log('DB host:', mongoose.connection.host);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1); // аварійне завершення програми
  }
};
