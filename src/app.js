const express = require('express');
const discountRoutes = require('./routes/discountRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/discount', discountRoutes);

app.get('/', (req, res) => {
    res.send('The API Discount Module is available');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;