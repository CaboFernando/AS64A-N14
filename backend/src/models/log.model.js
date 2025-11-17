import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  tipoEvento: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  dados: { type: Object },
  criadoEm: { type: Date, default: Date.now }
});

export const Log = mongoose.model('Log', logSchema);

export async function registrarLog(tipoEvento, usuarioId = null, dados = {}) {
  try {
    await Log.create({ tipoEvento, usuario: usuarioId, dados });
  } catch (e) {
    console.error('Falha ao registrar log', e);
  }
}