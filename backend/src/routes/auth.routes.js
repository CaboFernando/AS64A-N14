import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuario.model.js';
import { security } from '../config/security.config.js';
import { redisClient } from '../config/cache.config.js';
import { registrarLog } from '../models/log.model.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Email e senha são obrigatórios' } });
  }
  try {
    const user = await Usuario.findOne({ email }).exec();
    if (!user) {
      await registrarLog('LOGIN_FAILED', null, { email });
      return res.status(401).json({ error: { code: 'AUTH_FAILED', message: 'Credenciais inválidas' } });
    }
    const ok = await bcrypt.compare(senha, user.senhaHash);
    if (!ok) {
      await registrarLog('LOGIN_FAILED', user._id, { email });
      return res.status(401).json({ error: { code: 'AUTH_FAILED', message: 'Credenciais inválidas' } });
    }
    const token = jwt.sign({ sub: user._id.toString() }, security.jwtSecret, { expiresIn: security.tokenTTL });
    await registrarLog('LOGIN_SUCCESS', user._id, { email });
    return res.json({ token, usuario: { id: user._id, nome: user.nome } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: { code: 'INTERNAL', message: 'Erro interno' } });
  }
});

router.post('/logout', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(400).json({ error: { code: 'NO_TOKEN', message: 'Token não enviado' } });
  }
  const token = auth.split(' ')[1];
  await redisClient.set(`revoked:${token}`, '1', { EX: 60 * 60 });
  return res.json({ message: 'Logout efetuado' });
});

export default router;