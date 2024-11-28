const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String },
  age: { type: Number },
  vaccinations: [{ type: String }],
  photo: { type: String }, // Armazena a imagem em base64
}, { timestamps: true });


module.exports = mongoose.model('Pet', PetSchema);
