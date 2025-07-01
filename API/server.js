const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000; // Usar porta do ambiente ou 3000

// Middleware
app.use(cors({
  origin: '*', // Permitir qualquer origem em produção
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Servir arquivos estáticos - CONFIGURADO PARA PRODUÇÃO
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/thumbnails', express.static(path.join(__dirname, 'public/thumbnails')));
app.use(express.static(path.join(__dirname, 'public')));

// Log para debug
app.use('/images', (req, res, next) => {
  console.log(`🔍 Tentativa de acesso à imagem: ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Provador Virtual API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Carregar dados do JSON
let jewelryData;
try {
  const rawData = fs.readFileSync(path.join(__dirname, 'jewelry-data.json'));
  jewelryData = JSON.parse(rawData);
  console.log('✅ Dados das joias carregados com sucesso!');
  console.log(`📦 Total de joias: ${Object.keys(jewelryData.JEWELRY).length}`);
} catch (error) {
  console.error('❌ Erro ao carregar dados das joias:', error);
  jewelryData = { JEWELRY: {} };
}

// Endpoint principal para dados das joias
app.get('/jewelry-data', (req, res) => {
  res.json(jewelryData);
});

// Endpoint para obter uma joia específica
app.get('/jewelry/:id', (req, res) => {
  const { id } = req.params;

  if (jewelryData.JEWELRY[id]) {
    res.json(jewelryData.JEWELRY[id]);
  } else {
    res.status(404).json({ error: 'Joia não encontrada' });
  }
});

// Rota para verificar status da API
app.get('/status', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'API do Provador Virtual está funcionando!',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    totalJewelry: Object.keys(jewelryData.JEWELRY).length
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Provador Virtual API - Eleva Labs',
    version: '1.0.0',
    endpoints: {
      status: '/status',
      health: '/health',
      jewelryData: '/jewelry-data',
      singleJewelry: '/jewelry/:id',
      images: '/images/*',
      thumbnails: '/thumbnails/*'
    }
  });
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor do Provador Virtual rodando na porta ${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 Endpoints disponíveis:`);
  console.log(`   - Status: http://localhost:${PORT}/status`);
  console.log(`   - Health: http://localhost:${PORT}/health`);
  console.log(`   - Jewelry Data: http://localhost:${PORT}/jewelry-data`);
});