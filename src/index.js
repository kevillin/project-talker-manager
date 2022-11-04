const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const { generateToken, validateFields, validateAutorizationAndName,
  validateAge,
  validateTalk,
  validateTalk2 } = require('./middlewares');

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

app.post('/login', validateFields, async (_req, res) => {
  // const result = await fs.readFile(talkersArchive, 'utf-8');
  const tokenGen = generateToken();
  // const newPerson = { ...req.body };
  // const newPersonFile = [...JSON.parse(result), newPerson];
  // await fs.writeFile(talkersArchive, JSON.stringify(newPersonFile));

  res.status(HTTP_OK_STATUS).json({ token: tokenGen });
});

app.post('/talker',
  validateAutorizationAndName,
  validateAge,
  validateTalk,
  validateTalk2,
  async (req, res) => {
    const person = req.body;
    const result = await fs.readFile(talkersArchive, 'utf-8');
    const parseTalkers = JSON.parse(result);
    const nextId = parseTalkers[parseTalkers.length - 1].id + 1;
    const newPerson = { id: nextId, ...person };
    const newPersonFile = [...parseTalkers, newPerson];
    await fs.writeFile(talkersArchive, JSON.stringify(newPersonFile));

    return res.status(201).json(newPerson);
});