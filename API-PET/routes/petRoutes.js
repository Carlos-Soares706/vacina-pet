const express = require('express');
const Pet = require('../models/Pet');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Middleware de autenticação
router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { name, species, breed, age, vaccinations, photo } = req.body;

    // Validação de campos obrigatórios
    if (!name || !species) {
      return res.status(400).json({ error: 'Nome e espécie são obrigatórios.' });
    }

    const pet = new Pet({
      name,
      species,
      breed,
      age,
      vaccinations, // Já é um array, não precisa de split
      userId: req.user.userId,
      photo, // Verificar se é base64 ou URI
    });

    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    console.error('Erro ao salvar o pet:', error);
    res.status(400).json({ error: 'Erro ao criar pet: ' + error.message });
  }
});



// Listar todos os pets do usuário
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find({ userId: req.user.userId }); // Filtra os pets pelo usuário autenticado
    res.json(pets); // Retorna todos os campos do modelo
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar pets: ' + error.message });
  }
});


// Atualizar informações de um pet
router.put('/:id', async (req, res) => {
  try {
    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!pet) return res.status(404).json({ error: 'Pet não encontrado' });
    res.json(pet);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar pet: ' + error.message });
  }
});

// Deletar um pet
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!pet) return res.status(404).json({ error: 'Pet não encontrado' });
    res.json({ message: 'Pet removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar pet: ' + error.message });
  }
});

module.exports = router;
