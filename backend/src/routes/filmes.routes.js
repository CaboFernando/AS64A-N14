import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { security } from '../config/security.config.js';
import { redisClient } from '../config/cache.config.js';
import { Filme } from '../models/filme.model.js';
import { registrarLog } from '../models/log.model.js';

const router = Router();

async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: { code: 'NO_AUTH', message: 'Token ausente' } });
  const token = header.split(' ')[1];
  try {
    const revoked = await redisClient.get(`revoked:${token}`);
    if (revoked) {
      return res.status(401).json({ error: { code: 'TOKEN_REVOKED', message: 'Token revogado' } });
    }
    const payload = jwt.verify(token, security.jwtSecret);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: { code: 'TOKEN_INVALID', message: 'Token inválido ou expirado' } });
  }
}

router.get('/filmes', auth, async (req, res) => {
  const { query, ano } = req.query;
  const cacheKey = `search:${query || ''}:${ano || ''}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      await registrarLog('SEARCH_CACHE_HIT', req.userId, { query, ano });
      return res.json({ origem: 'cache', resultados: JSON.parse(cached) });
    }
    const filtro = {};
    if (query) filtro.titulo = { $regex: query, $options: 'i' };
    if (ano) {
      const parsed = parseInt(ano);
      if (!isNaN(parsed)) filtro.ano = parsed;
    }
    const resultados = await Filme.find(filtro).sort({ criadoEm: -1 }).limit(50).lean().exec();
    await redisClient.set(cacheKey, JSON.stringify(resultados), { EX: 120 });
    await registrarLog('SEARCH', req.userId, { query, ano, count: resultados.length });
    return res.json({ origem: 'db', resultados });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: { code: 'INTERNAL', message: 'Erro interno' } });
  }
});

router.post('/filmes', auth, async (req, res) => {
  let { titulo, descricao, ano } = req.body;
  if (!titulo || titulo.trim().length < 2) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Título inválido' } });
  }
  titulo = titulo.trim();
  descricao = (descricao || '').trim();
  let anoNum;
  if (ano) {
    const parsed = parseInt(ano);
    if (isNaN(parsed)) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Ano inválido' } });
    }
    anoNum = parsed;
  }
  try {
    const novo = await Filme.create({
      titulo,
      descricao,
      ano: anoNum,
      criadoPor: req.userId
    });
    await registrarLog('INSERT_FILME', req.userId, { filmeId: novo._id, titulo });
    return res.status(201).json({
      id: novo._id,
      titulo: novo.titulo,
      descricao: novo.descricao,
      ano: novo.ano,
      criadoPor: novo.criadoPor,
      criadoEm: novo.criadoEm
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: { code: 'INTERNAL', message: 'Erro interno' } });
  }
});

export default router;