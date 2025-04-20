const BackupManager = require('../backupManager');
const logger = require('../logger');

async function runRestore() {
  try {
    const backupPath = process.argv[2];
    if (!backupPath) {
      logger.error('Por favor, forneça o caminho do arquivo de backup como argumento');
      process.exit(1);
    }

    const backupManager = new BackupManager({
      backupDir: process.env.BACKUP_DIR || 'backups',
      retentionDays: process.env.BACKUP_RETENTION_DAYS || 7
    });

    await backupManager.restoreBackup(backupPath);
    logger.info('Backup restaurado com sucesso');
    process.exit(0);
  } catch (error) {
    logger.error('Erro ao restaurar backup:', error);
    process.exit(1);
  }
}

runRestore(); 