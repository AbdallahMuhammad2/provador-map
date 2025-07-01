const fs = require('fs');
const path = require('path');

// Carregar dados do JSON
let jewelryData;
try {
    const rawData = fs.readFileSync(path.join(__dirname, 'API/jewelry-data.json'));
    jewelryData = JSON.parse(rawData);
} catch (error) {
    console.error('Erro ao carregar dados das joias:', error);
    process.exit(1);
}

// Configurações por tipo de brinco
const earringTypeConfigs = {
    'hoop': {
        landmarks: [234, 454], // Orelha em vez de lóbulo
        gap: -15,
        defaultScale: 1.2,
        description: 'Argolas - ficam na orelha'
    },
    'drop': {
        landmarks: [177, 401], // Lóbulo da orelha
        gap: 0,
        defaultScale: 1.5,
        description: 'Brincos pendentes - ficam no lóbulo'
    },
    'stud': {
        landmarks: [177, 401], // Lóbulo da orelha
        gap: 0,
        defaultScale: 1.0,
        description: 'Brincos pequenos - ficam no lóbulo'
    }
};

function detectEarringType(jewelryItem) {
    const name = jewelryItem.name.toLowerCase();
    
    if (name.includes('hoop') || name.includes('argola')) {
        return 'hoop';
    } else if (name.includes('drop') || name.includes('chandelier') || name.includes('jhumka')) {
        return 'drop';
    } else {
        return 'stud'; // default
    }
}

function adjustEarringPositions() {
    console.log('🎯 Ajustando posições de brincos por tipo...\n');
    
    let updatedCount = 0;
    
    for (const [id, item] of Object.entries(jewelryData.JEWELRY)) {
        if (item.type === 'earrings') {
            const detectedType = detectEarringType(item);
            const config = earringTypeConfigs[detectedType];
            
            console.log(`📍 ${id}: ${item.name}`);
            console.log(`   Tipo detectado: ${detectedType} (${config.description})`);
            
            // Atualizar configurações baseadas no tipo
            item.earringType = detectedType;
            item.landmarks = config.landmarks;
            item.gap = config.gap;
            
            // Ajustar scale se não estiver definido
            if (!item.defaultScale) {
                item.defaultScale = config.defaultScale;
            }
            
            // Offsets específicos por tipo
            if (detectedType === 'hoop') {
                // Para argolas, centrar melhor
                item.offset = {
                    x: 0,
                    y: 0
                };
                
                // Ajustes específicos por ID
                if (id === 'EAR_0004') { // Pearl Hoop
                    item.offset.x = -2;
                    item.offset.y = 2;
                }
            }
            
            console.log(`   ✅ Landmarks: [${item.landmarks.join(', ')}]`);
            console.log(`   ✅ Gap: ${item.gap}`);
            console.log(`   ✅ Offset: (${item.offset.x}, ${item.offset.y})`);
            console.log(`   ✅ Scale: ${item.defaultScale}\n`);
            
            updatedCount++;
        }
    }
    
    // Salvar de volta
    try {
        fs.writeFileSync(
            path.join(__dirname, 'API/jewelry-data.json'),
            JSON.stringify(jewelryData, null, 2),
            'utf8'
        );
        console.log(`✅ ${updatedCount} brincos atualizados com sucesso!`);
    } catch (error) {
        console.error('❌ Erro ao salvar arquivo:', error);
    }
}

function listEarringTypes() {
    console.log('📋 Tipos de brincos disponíveis:\n');
    
    for (const [type, config] of Object.entries(earringTypeConfigs)) {
        console.log(`🔸 ${type.toUpperCase()}`);
        console.log(`   ${config.description}`);
        console.log(`   Landmarks: [${config.landmarks.join(', ')}]`);
        console.log(`   Gap padrão: ${config.gap}`);
        console.log(`   Scale padrão: ${config.defaultScale}\n`);
    }
}

// Interface de linha de comando
const command = process.argv[2];

switch (command) {
    case 'adjust':
        adjustEarringPositions();
        break;
    case 'list':
        listEarringTypes();
        break;
    case 'analyze':
        console.log('🔍 Analisando brincos atuais:\n');
        for (const [id, item] of Object.entries(jewelryData.JEWELRY)) {
            if (item.type === 'earrings') {
                const detectedType = detectEarringType(item);
                console.log(`${id}: ${item.name}`);
                console.log(`   Tipo detectado: ${detectedType}`);
                console.log(`   Tipo atual: ${item.earringType || 'não definido'}`);
                console.log(`   Landmarks: [${item.landmarks ? item.landmarks.join(', ') : 'não definido'}]`);
                console.log(`   Gap: ${item.gap !== undefined ? item.gap : 'não definido'}\n`);
            }
        }
        break;
    default:
        console.log('📖 Uso: node adjust_earrings.js [comando]');
        console.log('');
        console.log('Comandos disponíveis:');
        console.log('  adjust   - Ajustar posições de todos os brincos por tipo');
        console.log('  list     - Listar tipos de brincos e configurações');
        console.log('  analyze  - Analisar brincos atuais');
        console.log('');
        console.log('Exemplos:');
        console.log('  node adjust_earrings.js adjust');
        console.log('  node adjust_earrings.js list');
        console.log('  node adjust_earrings.js analyze');
} 