import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import fsSync from 'fs';
import jwt from 'jsonwebtoken';
import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'skalades-secret-key-2026';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    if (!fsSync.existsSync(uploadDir)) {
      fsSync.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.trim().replace(/\s+/g, '-'));
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const DATA_FILE = path.join(__dirname, 'data.json');

// --- AUTH MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// --- ROUTES ---

// 1. Authenticate (Login)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
});

// 2. Client Public Config
app.get('/api/config', async (req, res) => {
  try {
     const settings = await db('payment_settings').first();
     res.json({
       midtransClientKey: settings?.client_key || 'SB-Mid-client-placeholder',
       isProduction: settings?.is_production ? true : false
     });
  } catch(e) {
     res.status(500).json({ error: 'Failed to fetch config' });
  }
});

// 2. Get Content
app.get('/api/content', async (req, res) => {
  try {
    const heroSettings = await db('hero_settings').first();
    const services = await db('services').select('*');
    const products = await db('products').select('*');
    const portfolio = await db('portfolios').select('*');
    
    const servicesData = services.map(s => ({
      ...s,
      features: typeof s.features === 'string' ? JSON.parse(s.features) : s.features
    }));

    res.json({
      hero: {
        subtitle: heroSettings.subtitle,
        title: heroSettings.title,
        description: heroSettings.description,
        buttonPrimary: heroSettings.buttonPrimary,
        buttonSecondary: heroSettings.buttonSecondary
      },
      services: servicesData,
      products: products,
      portfolio: portfolio
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read content from database' });
  }
});

// 3. Update Content (Protected)
app.put('/api/content', authenticate, async (req, res) => {
  try {
    const newData = req.body;
    
    await db('hero_settings').where({ id: 1 }).update({
      subtitle: newData.hero.subtitle,
      title: newData.hero.title,
      description: newData.hero.description,
      buttonPrimary: newData.hero.buttonPrimary,
      buttonSecondary: newData.hero.buttonSecondary
    });

    for (const prod of newData.products) {
      if(prod.id) {
         await db('products').where({ id: prod.id }).update({
            name: prod.name,
            price: prod.price,
            description: prod.description,
            status: prod.status,
            image: prod.image,
            priceDisplay: `IDR ${Math.round(prod.price / 1000)}K`
         });
      }
    }

    res.json({ message: 'Content updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update content data' });
  }
});

// 4. Checkout API
app.post('/api/checkout', async (req, res) => {
  try {
    const { product } = req.body;
    
    // Dynamically retrieve keys and trim hidden whitespaces from copy-pasting
    const settings = await db('payment_settings').first();
    const dynamicSnap = new midtransClient.Snap({
      isProduction: settings?.is_production ? true : false,
      serverKey: (settings?.server_key || 'SB-Mid-server-placeholder').trim(),
      clientKey: (settings?.client_key || 'SB-Mid-client-placeholder').trim()
    });

    const order_id = `SKLDS-${Date.now()}`;

    // Record pending transaction
    await db('transactions').insert({
      order_id,
      customer_name: "Tamu Skalades",
      customer_email: "tamu@skalades.id",
      product_id: product.id,
      product_name: product.name,
      gross_amount: product.price,
      status: 'pending'
    });

    let parameter = {
      transaction_details: {
        order_id,
        gross_amount: product.price
      },
      item_details: [{
        id: product.id,
        price: product.price,
        quantity: 1,
        name: product.name
      }],
      customer_details: {
        first_name: "Tamu",
        last_name: "Skalades",
        email: "tamu@skalades.id",
        phone: "08111222333"
      }
    };
    
    const transaction = await dynamicSnap.createTransaction(parameter);
    res.json({ token: transaction.token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// 5. Upload File Endpoint (Protected)
app.post('/api/upload', authenticate, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl, message: 'Image uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process image upload', details: err.message });
  }
});

// 6. Admin Payment Config (Protected)
app.get('/api/admin/payment', authenticate, async (req, res) => {
  try {
     const settings = await db('payment_settings').first();
     res.json(settings || {});
  } catch(e) {
     res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/admin/payment', authenticate, async (req, res) => {
  try {
     const payload = req.body;
     await db('payment_settings').where({ id: 1 }).update({
        is_production: payload.is_production,
        server_key: payload.server_key,
        client_key: payload.client_key
     });
     res.json({ message: 'Settings saved.' });
  } catch(e) {
     console.error("error updating settings", e);
     res.status(500).json({ error: 'Failed to update settings' });
  }
});

// 7. Store Logistics & Analytics (Protected)
app.get('/api/admin/transactions', authenticate, async (req, res) => {
  try {
    const transactions = await db('transactions').orderBy('created_at', 'desc');
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.put('/api/admin/transactions/:order_id/fulfillment', authenticate, async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;
    await db('transactions').where({ order_id }).update({ fulfillment_status: status });
    res.json({ message: `Order ${order_id} updated to ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update fulfillment status' });
  }
});

app.get('/api/admin/analytics/revenue', authenticate, async (req, res) => {
  try {
    const totalRevenue = await db('transactions')
      .where({ status: 'success' })
      .sum('gross_amount as total');
    
    // Simple monthly breakdown for the last 6 months
    const monthlyRevenue = await db('transactions')
      .where({ status: 'success' })
      .select(db.raw("DATE_FORMAT(created_at, '%Y-%m') as month"))
      .sum('gross_amount as total')
      .groupBy('month')
      .orderBy('month', 'desc')
      .limit(6);

    res.json({
      totalRevenue: totalRevenue[0].total || 0,
      monthlyRevenue: monthlyRevenue.reverse()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch revenue analytics' });
  }
});

// 7. Midtrans Webhook Notification
app.post('/api/payment/notification', async (req, res) => {
  try {
     const settings = await db('payment_settings').first();
     const core = new midtransClient.CoreApi({
       isProduction: settings?.is_production ? true : false,
       serverKey: (settings?.server_key || '').trim(),
       clientKey: (settings?.client_key || '').trim()
     });

     const notificationJson = req.body;
     const statusResponse = await core.transaction.notification(notificationJson);
     const orderId = statusResponse.order_id;
     const transactionStatus = statusResponse.transaction_status;
     const fraudStatus = statusResponse.fraud_status;

     let dbStatus = 'pending';

     if (transactionStatus == 'capture'){
        if (fraudStatus == 'challenge'){
           dbStatus = 'pending';
        } else if (fraudStatus == 'accept'){
           dbStatus = 'success';
        }
     } else if (transactionStatus == 'settlement'){
        dbStatus = 'success';
     } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire'){
        dbStatus = 'failed';
        if(transactionStatus === 'expire') dbStatus = 'expired';
        if(transactionStatus === 'cancel') dbStatus = 'canceled';
     } else if (transactionStatus == 'pending'){
        dbStatus = 'pending';
     }

     await db('transactions').where({ order_id: orderId }).update({ status: dbStatus });

     res.status(200).json({ status: 'OK', update: dbStatus });

  } catch(e) {
     res.status(500).json({ error: 'Failed to process notification' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
