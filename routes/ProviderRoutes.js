const express = require('express');
const router = express.Router();
const {authenticateToken, updateProviderAvailability, addProviderService} = require('../controllers/ProviderController')

router.put('/availability',authenticateToken, updateProviderAvailability); 
router.post('/service', authenticateToken, addProviderService);

module.exports = router;