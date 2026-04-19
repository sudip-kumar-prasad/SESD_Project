import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User';
import Shop from '../models/Shop';
import Product from '../models/Product';

dotenv.config({ path: '../../.env' });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kiranaquick');
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Product.deleteMany({});

    // 1. Create a Shop Owner
    const hashedPassword = await bcrypt.hash('password123', 10);
    const owner = await User.create({
      name: 'Aditi Sharma',
      email: 'aditi@example.com',
      password: hashedPassword,
      role: 'shop_owner',
      phone: '9876543210',
      address: 'HSR Layout, Bangalore'
    });

    // 2. Create a Shop
    // Note: Schema uses 'shopName', 'lat', 'lng', 'isOpen', 'description', 'phone', 'imageUrl'
    const shop = await Shop.create({
      shopName: 'Daily Needs Supermarket',
      owner: owner._id,
      address: 'HSR Layout, Sector 7, Bangalore',
      lat: 12.9141,
      lng: 77.6411,
      isOpen: true,
      description: 'Your one-stop destination for fresh groceries and daily essentials in HSR.',
      phone: '080-12345678',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'
    });

    // 3. Create some Products
    // Note: Schema uses 'stockQuantity', 'isAvailable', 'imageUrl'
    const products = [
      {
        name: 'Organic Whole Milk',
        description: 'Fresh organic whole milk from local farms.',
        price: 68,
        category: 'Dairy',
        shop: shop._id,
        stockQuantity: 50,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1550583724-1277f2bc2764?w=500'
      },
      {
        name: 'Artisan Sourdough',
        description: 'Hard-crust freshly baked sourdough bread.',
        price: 120,
        category: 'Bakery',
        shop: shop._id,
        stockQuantity: 15,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'
      },
      {
        name: 'Ripe Hass Avocados',
        description: 'Imported ripe avocados, ready to eat.',
        price: 249,
        category: 'Fruits',
        shop: shop._id,
        stockQuantity: 20,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500'
      }
    ];

    await Product.insertMany(products);

    console.log('✅ Seeding complete!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
