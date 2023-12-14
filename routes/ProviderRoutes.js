const express = require('express');
const router = express.Router();
const {updateProviderAvailability, addProviderService} = require('../controllers/ProviderController')

router.put('/availability', updateProviderAvailability); 
router.post('/service', addProviderService); 

module.exports = router;