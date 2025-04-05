const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shop.html'));
});

// API route to get product data
app.get('/api/products', (req, res) => {
    fs.readFile(path.join(__dirname, 'products.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Помилка при читанні файлу:', err);
            res.status(500).json({ error: 'Не вдалося отримати дані' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
