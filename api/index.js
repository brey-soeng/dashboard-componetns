const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8000;



app.use(cors({ origin: 'http://localhost:8000' })); // Replace with your Vue.js app's domain

// Configure body-parser to handle incoming request bodies (optional, if needed)
app.use(bodyParser.json());

app.get('/api/products', (req, res) => {
    const products = [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
    ];
    res.json(products);
});
  
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});