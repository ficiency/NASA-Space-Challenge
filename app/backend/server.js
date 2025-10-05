const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hola desde el backend!' });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
