const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const routes = require('./routes');
const BackupScheduler = require('./backupScheduler');

// Configuração de variáveis de ambiente
dotenv.config();

// Inicialização do app Express
const app = express();

// Configuração de middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Criar diretório de logs se não existir
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Inicializar sistema de backup
const backupScheduler = new BackupScheduler({
  backupDir: process.env.BACKUP_DIR || 'backups',
  retentionDays: process.env.BACKUP_RETENTION_DAYS || 7,
  schedule: process.env.BACKUP_SCHEDULE || '0 0 * * *'
});
backupScheduler.start();

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API da IA Assistente FlowOFF está funcionando!' });
});

// Configuração das rotas da API
app.use('/api', routes);

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Conexão com o MongoDB (comentada até configurarmos o MongoDB)
/*
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  logger.info('Conectado ao MongoDB');
})
.catch(err => {
  logger.error('Erro ao conectar ao MongoDB', err);
});
*/

// Inicialização do servidor
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
  logger.info(`Webhooks disponíveis em:`);
  logger.info(`- Telegram: http://localhost:${PORT}/api/telegram/webhook`);
  logger.info(`- WhatsApp: http://localhost:${PORT}/api/whatsapp/webhook`);
});

// Gerenciamento de encerramento gracioso
process.on('SIGTERM', () => {
  logger.info('Recebido sinal SIGTERM, encerrando servidor...');
  backupScheduler.stop();
  server.close(() => {
    logger.info('Servidor encerrado');
    process.exit(0);
  });
});

module.exports = app;
