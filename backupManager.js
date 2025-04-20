const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const logger = require('./logger');

/**
 * Classe responsável por gerenciar backups do sistema
 * @class BackupManager
 */
class BackupManager {
  /**
   * @param {Object} config - Configurações do backup
   * @param {string} config.backupDir - Diretório de backup
   * @param {number} config.retentionDays - Dias de retenção
   * @param {string} config.schedule - Schedule do cron
   */
  constructor(config = {}) {
    this.backupDir = config.backupDir || 'backups';
    this.retentionDays = config.retentionDays || 7;
    this.schedule = config.schedule || '0 0 * * *';
    this.ensureBackupDirectory();
  }

  /**
   * Garante que o diretório de backup existe
   * @throws {Error} Se não for possível criar o diretório
   */
  ensureBackupDirectory() {
    try {
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
        logger.info(`Diretório de backup criado: ${this.backupDir}`);
      }
    } catch (error) {
      logger.error('Erro ao criar diretório de backup:', error);
      throw new Error('Não foi possível criar o diretório de backup');
    }
  }

  /**
   * Cria um novo backup
   * @returns {Promise<string>} Caminho do backup criado
   * @throws {Error} Se o backup falhar
   */
  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup_${timestamp}.tar.gz`;
    const backupPath = path.join(this.backupDir, backupFileName);

    try {
      await this.backupFiles(backupPath);
      
      if (process.env.MONGODB_URI) {
        await this.backupMongoDB(backupPath);
      }

      logger.info(`Backup criado com sucesso: ${backupFileName}`);
      await this.cleanOldBackups();
      return backupPath;
    } catch (error) {
      logger.error('Erro ao criar backup:', error);
      throw error;
    }
  }

  /**
   * Faz backup dos arquivos do projeto
   * @param {string} backupPath - Caminho do arquivo de backup
   * @returns {Promise<void>}
   * @throws {Error} Se o backup falhar
   */
  async backupFiles(backupPath) {
    return new Promise((resolve, reject) => {
      const excludePatterns = [
        'node_modules',
        '.git',
        'backups',
        'logs',
        '.env'
      ].map(pattern => `--exclude='${pattern}'`).join(' ');

      const tar = spawn('tar', ['-czf', backupPath, ...excludePatterns.split(' '), '.']);
      
      tar.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Comando tar falhou com código ${code}`));
        }
      });

      tar.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Faz backup do MongoDB
   * @param {string} backupPath - Caminho do arquivo de backup
   * @returns {Promise<void>}
   * @throws {Error} Se o backup falhar
   */
  async backupMongoDB(backupPath) {
    return new Promise((resolve, reject) => {
      const mongodump = spawn('mongodump', [
        '--uri', process.env.MONGODB_URI,
        '--archive', backupPath,
        '--gzip'
      ]);
      
      mongodump.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Comando mongodump falhou com código ${code}`));
        }
      });

      mongodump.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Remove backups antigos
   * @returns {Promise<void>}
   */
  async cleanOldBackups() {
    try {
      const files = fs.readdirSync(this.backupDir);
      const now = new Date();
      
      for (const file of files) {
        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = (now - stats.mtime) / (1000 * 60 * 60 * 24);
        
        if (fileAge > this.retentionDays) {
          fs.unlinkSync(filePath);
          logger.info(`Backup antigo removido: ${file}`);
        }
      }
    } catch (error) {
      logger.error('Erro ao limpar backups antigos:', error);
      throw error;
    }
  }

  /**
   * Restaura um backup
   * @param {string} backupPath - Caminho do arquivo de backup
   * @returns {Promise<void>}
   * @throws {Error} Se a restauração falhar
   */
  async restoreBackup(backupPath) {
    try {
      if (!fs.existsSync(backupPath)) {
        throw new Error('Arquivo de backup não encontrado');
      }

      await this.restoreFiles(backupPath);
      
      if (process.env.MONGODB_URI) {
        await this.restoreMongoDB(backupPath);
      }

      logger.info('Backup restaurado com sucesso');
    } catch (error) {
      logger.error('Erro ao restaurar backup:', error);
      throw error;
    }
  }

  /**
   * Restaura arquivos do backup
   * @param {string} backupPath - Caminho do arquivo de backup
   * @returns {Promise<void>}
   * @throws {Error} Se a restauração falhar
   */
  async restoreFiles(backupPath) {
    return new Promise((resolve, reject) => {
      const tar = spawn('tar', ['-xzf', backupPath]);
      
      tar.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Comando tar falhou com código ${code}`));
        }
      });

      tar.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Restaura banco de dados do backup
   * @param {string} backupPath - Caminho do arquivo de backup
   * @returns {Promise<void>}
   * @throws {Error} Se a restauração falhar
   */
  async restoreMongoDB(backupPath) {
    return new Promise((resolve, reject) => {
      const mongorestore = spawn('mongorestore', [
        '--uri', process.env.MONGODB_URI,
        '--archive', backupPath,
        '--gzip'
      ]);
      
      mongorestore.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Comando mongorestore falhou com código ${code}`));
        }
      });

      mongorestore.on('error', (err) => {
        reject(err);
      });
    });
  }
}

module.exports = BackupManager; 