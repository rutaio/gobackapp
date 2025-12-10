/**
 * This backend folder is NOT used in Phase 1.
 * The app currently runs frontend-only and will use Supabase as backend-as-a-service.
 * A custom Node/Express backend MAY be added in Phase 2 or later.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
