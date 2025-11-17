import mongoose from 'mongoose';

const filmeSchema = new mongoose.Schema({
  titulo: { type: String, required: true, index: true },
  descricao: { type: String, default: '' },
  ano: { type: Number },
  criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  criadoEm: { type: Date, default: Date.now }
});

filmeSchema.index({ titulo: 1, ano: 1 });

export const Filme = mongoose.model('Filme', filmeSchema);