require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');

const app = express();

// Configurar o body-parser com limites maiores
app.use(bodyParser.json({ limit: '10mb' })); // Limite de 10 MB para JSON
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Limite para URL-encoded

// Caminho para o arquivo de log
const logPath = path.join(__dirname, 'access.log');
const logStream = fs.createWriteStream(logPath, { flags: 'a' });

// Middlewares
app.use(cors());
app.use(morgan(':method :url :status :response-time ms', { stream: logStream })); // Salva logs no arquivo
app.use(morgan(':method :url :status :response-time ms')); // Exibe logs no console

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);

// Rota de teste
app.get('/api/status', (req, res) => {
  res.json({ message: 'A API está funcionando corretamente!' });
});

// Verificar se a variável MONGO_URI foi carregada corretamente
if (!process.env.MONGO_URI) {
  console.error('Erro: MONGO_URI não está definido no arquivo .env.');
  process.exit(1); // Encerra o servidor se a URI não for encontrada
}

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB!');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });
