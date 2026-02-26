import mongoose from 'mongoose';

class Database {
  private static instance: Database;
  private constructor() {}
  static getInstance(): Database {
    if (!Database.instance) Database.instance = new Database();
    return Database.instance;
  }
  async connect(): Promise<void> {
    const uri = process.env.MONGO_URI!;
    await mongoose.connect(uri);
    console.log('[DB] MongoDB connected');
  }
}

export default Database.getInstance();
