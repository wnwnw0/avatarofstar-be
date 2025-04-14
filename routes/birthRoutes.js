const express = require('express');
const router = express.Router();
const birthController = require('../controllers/birthController');

router.post('/', birthController.getBirthData);

module.exports = router;
