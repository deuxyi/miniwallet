import express from 'express';
import mongoose from 'mongoose';

import accountRoutes from './routes/accountRoutes';

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());

app.use('/api',accountRoutes);
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
app.use((req, res) => {
    res.status(404).send('Not Found');
  });
mongoose.connect('mongodb://localhost:27017/virtualwallet')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));


    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });