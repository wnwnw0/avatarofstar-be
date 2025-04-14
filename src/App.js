const express = require('express');
const cors = require('cors');
require('dotenv').config();
const birthRoutes = require('./routes/birthRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/birth', birthRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

