import express from 'express';
import fs from 'fs';
import morgan from 'morgan';

const app = express();

app.use(morgan('tiny'));

app.post('/upload', (req, res) => {
  console.log(req);
  res.send({
    status: 'ok',
    image: 'https://i.imgur.com/sQpk5WE.png'
  });
});

app.listen(8008, () => {
  console.log('Server started on port 8008');
});