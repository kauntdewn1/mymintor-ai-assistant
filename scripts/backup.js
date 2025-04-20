const BackupManager = require('../backupManager');
const logger = require('../logger');

async function runBackup() {
  try {
    const backupManager = new BackupManager({
      backupDir: process.env.BACKUP_DIR || 'backups',
      retentionDays: process.env.BACKUP_RETENTION_DAYS || 7
    });

    const backupPath = await backupManager.createBackup();
    logger.info(`Backup criado com sucesso: ${backupPath}`);
    process.exit(0);
  } catch (error) {
    logger.error('Erro ao executar backup:', error);
    process.exit(1);
  }
}

runBackup(); 