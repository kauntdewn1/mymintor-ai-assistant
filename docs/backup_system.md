# Sistema de Backup Automático

## Visão Geral

O sistema de backup automático da IA Assistente FlowOFF é responsável por criar e gerenciar backups regulares do sistema, incluindo arquivos do projeto e dados do banco de dados MongoDB. O sistema é configurável e pode ser executado automaticamente ou manualmente.

## Funcionalidades

- Backup automático diário dos arquivos do projeto
- Backup do banco de dados MongoDB (quando configurado)
- Retenção configurável de backups antigos
- Restauração manual de backups
- Logs detalhados de operações de backup

## Configuração

### Variáveis de Ambiente

O sistema de backup pode ser configurado através das seguintes variáveis de ambiente:

- `BACKUP_DIR`: Diretório onde os backups serão armazenados (padrão: 'backups')
- `BACKUP_RETENTION_DAYS`: Número de dias para manter os backups (padrão: 7)
- `BACKUP_SCHEDULE`: Cron schedule para backups automáticos (padrão: '0 0 * * *' - diariamente à meia-noite)

### Exemplo de Configuração

```env
BACKUP_DIR=backups
BACKUP_RETENTION_DAYS=7
BACKUP_SCHEDULE=0 0 * * *
```

## Uso

### Backup Automático

O backup automático é iniciado junto com o servidor e executa de acordo com o schedule configurado.

### Backup Manual

Para executar um backup manualmente:

```bash
npm run backup
```

### Restauração de Backup

Para restaurar um backup:

```bash
npm run restore /caminho/para/backup.tar.gz
```

## Estrutura dos Backups

Os backups são armazenados no formato `backup_YYYY-MM-DDTHH-MM-SS.tar.gz` e incluem:

- Todos os arquivos do projeto (exceto node_modules, .git, backups, logs e .env)
- Dump do banco de dados MongoDB (quando configurado)

## Monitoramento

O sistema gera logs detalhados de todas as operações de backup, incluindo:

- Criação de backups
- Limpeza de backups antigos
- Restauração de backups
- Erros e avisos

## Segurança

- Os backups são compactados e criptografados
- Arquivos sensíveis (.env) são excluídos dos backups
- Acesso aos backups é restrito ao diretório configurado

## Manutenção

### Limpeza de Backups Antigos

O sistema automaticamente remove backups mais antigos que o período de retenção configurado.

### Monitoramento de Espaço

É recomendado monitorar regularmente o espaço em disco do diretório de backups.

## Troubleshooting

### Problemas Comuns

1. **Erro de Permissão**
   - Verifique se o usuário tem permissões de escrita no diretório de backups
   - Verifique se o usuário tem permissões para executar comandos do MongoDB

2. **Espaço em Disco Insuficiente**
   - Ajuste o período de retenção de backups
   - Limpe backups antigos manualmente

3. **Falha no Backup do MongoDB**
   - Verifique se o MongoDB está em execução
   - Verifique se as credenciais do MongoDB estão corretas

### Logs

Os logs do sistema de backup podem ser encontrados no arquivo de log principal do aplicativo.

## Contribuição

Para contribuir com o sistema de backup, siga as diretrizes de contribuição do projeto. 