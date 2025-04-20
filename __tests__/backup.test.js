const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const BackupManager = require('../backupManager');
const BackupScheduler = require('../backupScheduler');

// Mock do logger
jest.mock('../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

// Mock do fs
jest.mock('fs');

// Mock do child_process
jest.mock('child_process');

describe('BackupManager', () => {
  let backupManager;
  const testConfig = {
    backupDir: 'test_backups',
    retentionDays: 1
  };

  beforeEach(() => {
    backupManager = new BackupManager(testConfig);
    jest.clearAllMocks();
  });

  describe('createBackup', () => {
    it('deve criar um backup com sucesso', async () => {
      const mockBackupPath = path.join(testConfig.backupDir, 'backup_2023-01-01T00-00-00.tar.gz');
      
      fs.existsSync.mockReturnValue(true);
      fs.mkdirSync.mockImplementation(() => {});
      fs.readdirSync.mockReturnValue([]);
      
      const mockSpawn = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            callback(0);
          }
          return mockSpawn;
        })
      };
      
      spawn.mockReturnValue(mockSpawn);

      const result = await backupManager.createBackup();
      expect(result).toBeDefined();
      expect(fs.mkdirSync).toHaveBeenCalledWith(testConfig.backupDir, { recursive: true });
    });

    it('deve lançar erro se não conseguir criar o diretório de backup', async () => {
      fs.existsSync.mockReturnValue(false);
      fs.mkdirSync.mockImplementation(() => {
        throw new Error('Erro ao criar diretório');
      });

      await expect(backupManager.createBackup()).rejects.toThrow('Não foi possível criar o diretório de backup');
    });
  });

  describe('restoreBackup', () => {
    it('deve restaurar um backup com sucesso', async () => {
      const mockBackupPath = 'test_backup.tar.gz';
      
      fs.existsSync.mockReturnValue(true);
      
      const mockSpawn = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            callback(0);
          }
          return mockSpawn;
        })
      };
      
      spawn.mockReturnValue(mockSpawn);

      await expect(backupManager.restoreBackup(mockBackupPath)).resolves.not.toThrow();
    });

    it('deve lançar erro se o arquivo de backup não existir', async () => {
      fs.existsSync.mockReturnValue(false);

      await expect(backupManager.restoreBackup('nonexistent.tar.gz')).rejects.toThrow('Arquivo de backup não encontrado');
    });
  });

  describe('cleanOldBackups', () => {
    it('deve remover backups antigos', async () => {
      const oldFile = 'old_backup.tar.gz';
      const newFile = 'new_backup.tar.gz';
      
      fs.readdirSync.mockReturnValue([oldFile, newFile]);
      fs.statSync.mockImplementation((filePath) => ({
        mtime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 dias atrás
      }));

      await backupManager.cleanOldBackups();
      expect(fs.unlinkSync).toHaveBeenCalledWith(path.join(testConfig.backupDir, oldFile));
    });
  });
});

describe('BackupScheduler', () => {
  let backupScheduler;
  const testConfig = {
    backupDir: 'test_backups',
    retentionDays: 1,
    schedule: '0 0 * * *'
  };

  beforeEach(() => {
    backupScheduler = new BackupScheduler(testConfig);
    jest.clearAllMocks();
  });

  describe('start', () => {
    it('deve iniciar o agendador com sucesso', async () => {
      const mockBackupManager = {
        createBackup: jest.fn().mockResolvedValue(true)
      };
      
      backupScheduler.backupManager = mockBackupManager;

      await backupScheduler.start();
      expect(mockBackupManager.createBackup).toHaveBeenCalled();
      expect(backupScheduler.isRunning).toBe(true);
    });

    it('não deve iniciar se já estiver em execução', async () => {
      backupScheduler.isRunning = true;
      await backupScheduler.start();
      expect(require('../logger').warn).toHaveBeenCalledWith('Agendador já está em execução');
    });
  });

  describe('stop', () => {
    it('deve parar o agendador com sucesso', () => {
      backupScheduler.isRunning = true;
      backupScheduler.stop();
      expect(backupScheduler.isRunning).toBe(false);
    });

    it('não deve parar se já estiver parado', () => {
      backupScheduler.isRunning = false;
      backupScheduler.stop();
      expect(require('../logger').warn).toHaveBeenCalledWith('Agendador já está parado');
    });
  });
}); 