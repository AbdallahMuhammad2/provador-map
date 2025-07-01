const { syncJewelryData } = require('./sync_jewelry_data');
const fs = require('fs');
const https = require('https');

// Configurações
const CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutos
const EXTERNAL_API_URL = 'https://kdkpbjjeze.execute-api.ap-south-1.amazonaws.com/prod1/jewelry-data';
const LOCAL_DATA_PATH = './API/jewelry-data.json';

// Função para obter hash simples dos dados
function getDataHash(data) {
    return JSON.stringify(data).length + Object.keys(data.JEWELRY || {}).length;
}

// Função para buscar dados externos
function fetchExternalData() {
    return new Promise((resolve, reject) => {
        https.get(EXTERNAL_API_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

// Função para verificar atualizações
async function checkForUpdates() {
    try {
        console.log('🔍 Verificando atualizações na API externa...');
        
        // Buscar dados externos
        const externalData = await fetchExternalData();
        const externalHash = getDataHash(externalData);
        
        // Buscar dados locais
        let localHash = 0;
        if (fs.existsSync(LOCAL_DATA_PATH)) {
            const localData = JSON.parse(fs.readFileSync(LOCAL_DATA_PATH, 'utf8'));
            localHash = getDataHash(localData);
        }
        
        console.log(`📊 Hash externo: ${externalHash}, Hash local: ${localHash}`);
        
        // Verificar se há diferenças
        if (externalHash !== localHash) {
            console.log('🆕 Mudanças detectadas! Iniciando sincronização...');
            await syncJewelryData();
            console.log('✅ Sincronização concluída!');
            
            // Salvar timestamp da última sincronização
            const syncInfo = {
                lastSync: new Date().toISOString(),
                itemCount: Object.keys(externalData.JEWELRY).length,
                hash: externalHash
            };
            fs.writeFileSync('./last-sync.json', JSON.stringify(syncInfo, null, 2));
            
        } else {
            console.log('✅ Dados já estão atualizados');
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar atualizações:', error.message);
    }
}

// Função principal
async function startMonitoring() {
    console.log('🚀 Iniciando monitoramento da API externa...');
    console.log(`⏰ Verificando a cada ${CHECK_INTERVAL / 1000 / 60} minutos`);
    
    // Verificar imediatamente
    await checkForUpdates();
    
    // Configurar verificação periódica
    setInterval(checkForUpdates, CHECK_INTERVAL);
    
    console.log('👀 Monitoramento ativo. Pressione Ctrl+C para parar.');
}

// Função para sincronização manual
async function manualSync() {
    console.log('🔄 Iniciando sincronização manual...');
    await syncJewelryData();
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);

if (args.includes('--sync') || args.includes('-s')) {
    manualSync();
} else if (args.includes('--check') || args.includes('-c')) {
    checkForUpdates();
} else {
    startMonitoring();
}

// Tratar interrupção
process.on('SIGINT', () => {
    console.log('\n👋 Parando monitoramento...');
    process.exit(0);
});

module.exports = { checkForUpdates, startMonitoring }; 