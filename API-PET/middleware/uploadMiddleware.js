const multer = require('multer');

// Configuração para armazenar o arquivo na memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
