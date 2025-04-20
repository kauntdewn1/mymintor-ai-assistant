const cron = require('node-cron');
const BackupManager = require('./backupManager');
const logger = require('./logger');

/**
 * Classe responsável por agendar backups automáticos
 * @class BackupScheduler
 */
class BackupScheduler {
  /**
   * @param {Object} config - Configurações do agendador
   * @param {string} config.backupDir - Diretório de backup
   * @param {number} config.retentionDays - Dias de retenção
   * @param {string} config.schedule - Schedule do cron
   */
  constructor(config = {}) {
    this.backupManager = new BackupManager(config);
    this.schedule = this.validateSchedule(config.schedule || '0 0 * * *');
    this.isRunning = false;
  }

  /**
   * Valida o formato do schedule do cron
   * @param {string} schedule - Schedule a ser validado
   * @returns {string} Schedule validado
   * @throws {Error} Se o schedule for inválido
   */
  validateSchedule(schedule) {
    if (!cron.validate(schedule)) {
      throw new Error('Schedule do cron inválido');
    }
    return schedule;
  }

  /**
   * Inicia o agendador de backups
   * @returns {Promise<void>}
   */
  async start() {
    if (this.isRunning) {
      logger.warn('Agendador já está em execução');
      return;
    }

    logger.info(`Iniciando agendador de backups com cron: ${this.schedule}`);
    
    try {
      // Executa backup inicial
      await this.backupManager.createBackup();
      logger.info('Backup inicial concluído com sucesso');

      // Agenda backups periódicos
      cron.schedule(this.schedule, async () => {
        try {
          logger.info('Iniciando backup agendado...');
          await this.backupManager.createBackup();
          logger.info('Backup agendado concluído com sucesso');
        } catch (error) {
          logger.error('Erro durante backup agendado:', error);
        }
      });

      this.isRunning = true;
    } catch (error) {
      logger.error('Erro ao iniciar agendador:', error);
      throw error;
    }
  }

  /**
   * Para o agendador de backups
   * @returns {void}
   */
  stop() {
    if (!this.isRunning) {
      logger.warn('Agendador já está parado');
      return;
    }

    cron.getTasks().forEach(task => task.stop());
    this.isRunning = false;
    logger.info('Agendador de backups parado');
  }
}

module.exports = BackupScheduler; 