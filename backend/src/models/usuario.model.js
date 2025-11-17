import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  senhaHash: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now }
});

export const Usuario = mongoose.model('Usuario', usuarioSchema);