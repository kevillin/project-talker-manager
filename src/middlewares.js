const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

const validateFields = (req, res, next) => {
  const { email, password } = req.body;
  const re = /\S+@\S+\.\S+/;

  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  if (!re.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  return next();
};

const validateAutorizationAndName = (req, res, next) => {
  const { name } = req.body;
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });
  if (authorization.length < 16) return res.status(401).json({ message: 'Token inválido' });
  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  return next();
};

const validateAutorization = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });
  if (authorization.length < 16) return res.status(401).json({ message: 'Token inválido' });

  return next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;

  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (Number(age) < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  return next();
};

const validateTalk = (req, res, next) => {
  const regexDate = /(\d{2})\/?(\d{2})?\/(\d{4})/;
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  if (!talk.watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!regexDate.test(talk.watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  return next();
};

const validateTalk2 = (req, res, next) => {
  const { rate } = req.body.talk;
  // const er = /^-?[0-9]+$/;

  if (!('rate' in req.body.talk)) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  } if (rate < 1 || rate > 5 || !Number.isInteger(rate)) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  return next();
};

module.exports = {
  generateToken,
  validateFields,
  validateAutorization,
  validateAutorizationAndName,
  validateAge,
  validateTalk,
  validateTalk2,
};