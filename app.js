const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// ✅ مصفوفة المنتجات (بيانات داخلية)
let products = [
  { id: '1', name: 'Laptop', price: '1000', quantity: 5 },
  { id: '2', name: 'Phone', price: '500', quantity: 10 }
];

// ✅ عداد لتوليد ID تلقائي
let nextId = products.length + 1;

// ✅ GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// ✅ GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// ✅ POST /api/products (مع توليد ID تلقائي)
app.post('/api/products', (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    if (!name || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (Number(price) <= 0 || Number(quantity) < 0) {
      return res.status(400).json({ message: 'Invalid price or quantity' });
    }

    const newProduct = {
      id: String(nextId++), // توليد ID تلقائي كسلسلة
      name,
      price,
      quantity
    };

    products.push(newProduct);
    res.status(201).json({ message: 'Product added', product: newProduct });

  } catch (error) {
    console.error('❌ Error in POST /api/products:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ PUT /api/products/:id
app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  const { name, price, quantity } = req.body;

  if ((price !== undefined && Number(price) <= 0) ||
      (quantity !== undefined && Number(quantity) < 0)) {
    return res.status(400).json({ message: 'Invalid price or quantity' });
  }

  if (name !== undefined) products[index].name = name;
  if (price !== undefined) products[index].price = price;
  if (quantity !== undefined) products[index].quantity = quantity;

  res.json({ message: 'Product updated', product: products[index] });
});

// ✅ DELETE /api/products/:id
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  const deleted = products.splice(index, 1);
  res.json({ message: 'Product deleted', product: deleted[0] });
});

// ✅ GET /api/products/export/json
app.get('/api/products/export/json', (req, res) => {
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];
  const fileName = `products_${formattedDate}.json`;
  const filePath = path.join(__dirname, fileName);

  fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
    if (err) return res.status(500).json({ message: 'Error writing file' });
    res.download(filePath, fileName);
  });
});

// ✅ تشغيل الخادم
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
