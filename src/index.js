const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const bodyParser = require('body-parser');

const talkersArchive = path.resolve(__dirname, './talker.json');

const app = express();
app.use(bodyParser.json());
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  const result = await fs.readFile(talkersArchive, 'utf-8');
  const talkers = result ? JSON.parse(result) : [];
  return res.status(HTTP_OK_STATUS).json(talkers);
});

