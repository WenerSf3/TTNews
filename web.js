// routes.js
const express = require('express');
const router = express.Router();

// Rota raiz
router.get('/', (req, res) => {
  res.send('Página inicial');
});

// Grupo de rotas para '/users'
router.use('/users', require('./routes/users'));

// Grupo de rotas para '/products'
router.use('/products', require('./routes/products'));

module.exports = router;
