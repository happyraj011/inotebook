const express = require('express');
const connectToMongo=require('./db');


connectToMongo();
const app = express()
app.use(express.json())
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))
app.get('/', function (req, res) {
  res.send('Hello World')
})
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
