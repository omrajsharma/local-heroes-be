const express = require('express');
const { getProvidersByCategory } = require('../controllers/ClientController');
const router = express.Router();

router.get('/providers', getProvidersByCategory)

module.exports = router;