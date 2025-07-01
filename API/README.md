# Provador Virtual API - Eleva Labs

API para o sistema de provador virtual de joias com detecção de landmarks e renderização em tempo real.

## 🚀 Deploy Gratuito - Render.com

### Passo 1: Preparar o Repositório
```bash
# Já configurado! Os arquivos estão prontos para deploy
```

### Passo 2: Deploy no Render
1. Acesse: https://render.com
2. Crie conta gratuita
3. Clique em "New Web Service"
4. Conecte ao GitHub/GitLab ou use "Public Git Repository"
5. Configure:
   - **Name**: `provador-virtual-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Passo 3: Variáveis de Ambiente (opcional)
- `NODE_ENV=production`

## 📋 Endpoints Disponíveis

- `GET /` - Informações da API
- `GET /status` - Status da API
- `GET /health` - Health check
- `GET /jewelry-data` - Todos os dados das joias
- `GET /jewelry/:id` - Joia específica
- `GET /images/*` - Imagens das joias
- `GET /thumbnails/*` - Thumbnails

## 🔧 Estrutura do Projeto

```
API/
├── server.js              # Servidor Express
├── package.json           # Dependências
├── jewelry-data.json      # Base de dados das joias
├── public/
│   ├── images/           # Imagens das joias
│   │   ├── earring/      # Brincos
│   │   ├── necklace/     # Colares
│   │   ├── tikka/        # Tikkas
│   │   ├── bangle/       # Pulseiras
│   │   └── ring/         # Anéis
│   └── thumbnails/       # Miniaturas
└── README.md             # Este arquivo
```

## 🎯 Exemplo de Uso

```javascript
// Buscar todas as joias
fetch('https://sua-api.onrender.com/jewelry-data')
  .then(response => response.json())
  .then(data => console.log(data.JEWELRY));

// Buscar joia específica
fetch('https://sua-api.onrender.com/jewelry/EAR_0005')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🆓 Plataformas Gratuitas Alternativas

1. **Render.com** (Recomendado)
   - 750 horas/mês grátis
   - Deploy automático
   - SSL grátis

2. **Railway**
   - $5 crédito grátis
   - Deploy fácil

3. **Vercel**
   - Ideal para Next.js
   - Serverless functions

4. **Heroku** (Limitado)
   - 550 horas/mês
   - Hiberna após inatividade

## 🔄 Atualizar Dados

Para adicionar novas joias, edite `jewelry-data.json` e faça novo deploy.

## 📞 Suporte

Criado por Eleva Labs para demonstração executiva do MVP. 