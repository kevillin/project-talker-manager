const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const { generateToken } = require('./middlewares');

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

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const result = await fs.readFile(talkersArchive, 'utf-8');
  const talkers = JSON.parse(result);

  const filter = talkers.find((talker) => talker.id === Number(id));

  if (!filter) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK_STATUS).json(filter);
});

app.post('/login', async (req, res) => {
  const result = await fs.readFile(talkersArchive, 'utf-8');
  const tokenGen = generateToken();
  const newPerson = { ...req.body };
  const newPersonFile = [...JSON.parse(result), newPerson];
  await fs.writeFile(talkersArchive, JSON.stringify(newPersonFile));

  res.status(200).json({ token: tokenGen });
});
