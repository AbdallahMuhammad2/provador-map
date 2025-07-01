const fs = require('fs');
const path = require('path');

// Função para ajustar posições de joias específicas
function adjustJewelryPositions() {
    const dataPath = path.join(__dirname, 'API', 'jewelry-data.json');
    
    // Ler dados atuais
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log('🎯 Ajustando posições das joias...');
    
    // Ajustes específicos por joia
    const adjustments = {
        // Brincos - mover ligeiramente para baixo
        'EAR_0001': { x: -3.0, y: 2.0 },  // Chandlier Earing
        'EAR_0002': { x: -3.0, y: 1.0 },  // Traditional Parrot Jhumkas
        'EAR_0003': { x: -3.0, y: 1.5 },  // Contemporary Earing
        'EAR_0004': { x: -2.0, y: 1.0 },  // Pearl Hoop Earrings
        
        // Tikkas - ajustar posição na testa
        'TIK_0001': { x: 0.0, y: -5.0 },  // Lakshmi Traditional
        'TIK_0002': { x: 0.0, y: -3.0 },  // Meenakari Temple
        'TIK_0003': { x: 0.0, y: -4.0 },  // Classic Bridal
        'TIK_0004': { x: 0.0, y: -3.5 },  // Antique Pear Drops
        
        // Colares - ajustar altura no pescoço
        'NEC_0001': { x: 0.0, y: 5.0 },   // American Diamond
        'NEC_0002': { x: 0.0, y: 3.0 },   // Emerald Chocker
        'NEC_0003': { x: 0.0, y: 4.0 },   // Golden Temple
        'NEC_0004': { x: 0.0, y: 3.5 },   // Ruby Neckpiece
        'NEC_0005': { x: 0.0, y: 4.5 },   // Rosegold Butterfly
        
        // Anéis - posição no dedo
        'RNG_0001': { x: 0.0, y: 0.0 },   // Lakshmi Design Ring
        
        // Pulseiras - posição no pulso
        'BRA_0003': { x: 0.0, y: 5.0 },   // Modern Bracelet
        'BRA_0004': { x: 0.0, y: 3.0 },   // Rosegold Bracelet
        'BRA_0005': { x: 0.0, y: 4.0 }    // Ruby Stranded Bracelet
    };
    
    // Aplicar ajustes
    for (const [jewelryId, adjustment] of Object.entries(adjustments)) {
        if (data.JEWELRY[jewelryId]) {
            data.JEWELRY[jewelryId].offset = {
                x: adjustment.x,
                y: adjustment.y
            };
            console.log(`✅ ${jewelryId}: offset ajustado para (${adjustment.x}, ${adjustment.y})`);
        }
    }
    
    // Salvar dados atualizados
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('\n💾 Posições ajustadas e salvas com sucesso!');
    
    return data;
}

// Função para resetar todas as posições
function resetAllPositions() {
    const dataPath = path.join(__dirname, 'API', 'jewelry-data.json');
    
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log('🔄 Resetando todas as posições...');
    
    for (const [jewelryId, jewelry] of Object.entries(data.JEWELRY)) {
        data.JEWELRY[jewelryId].offset = { x: 0.0, y: 0.0 };
        console.log(`✅ ${jewelryId}: posição resetada`);
    }
    
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('\n💾 Todas as posições foram resetadas!');
}

// Função para ajustar uma joia específica
function adjustSingleJewelry(jewelryId, offsetX, offsetY) {
    const dataPath = path.join(__dirname, 'API', 'jewelry-data.json');
    
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    if (!data.JEWELRY[jewelryId]) {
        console.error(`❌ Joia ${jewelryId} não encontrada!`);
        return;
    }
    
    data.JEWELRY[jewelryId].offset = {
        x: parseFloat(offsetX),
        y: parseFloat(offsetY)
    };
    
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log(`✅ ${jewelryId}: offset ajustado para (${offsetX}, ${offsetY})`);
}

// Função para listar todas as joias e suas posições atuais
function listAllPositions() {
    const dataPath = path.join(__dirname, 'API', 'jewelry-data.json');
    
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log('\n📋 Posições atuais das joias:');
    console.log('=====================================');
    
    for (const [jewelryId, jewelry] of Object.entries(data.JEWELRY)) {
        const offset = jewelry.offset || { x: 0, y: 0 };
        console.log(`${jewelryId.padEnd(12)} | ${jewelry.name.padEnd(35)} | (${offset.x.toString().padStart(6)}, ${offset.y.toString().padStart(6)})`);
    }
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);

if (args[0] === 'adjust') {
    adjustJewelryPositions();
} else if (args[0] === 'reset') {
    resetAllPositions();
} else if (args[0] === 'single' && args[1] && args[2] !== undefined && args[3] !== undefined) {
    adjustSingleJewelry(args[1], args[2], args[3]);
} else if (args[0] === 'list') {
    listAllPositions();
} else {
    console.log('📋 Como usar:');
    console.log('');
    console.log('node adjust_positions.js adjust           # Aplicar ajustes predefinidos');
    console.log('node adjust_positions.js reset            # Resetar todas as posições');
    console.log('node adjust_positions.js single ID X Y    # Ajustar joia específica');
    console.log('node adjust_positions.js list             # Listar posições atuais');
    console.log('');
    console.log('Exemplos:');
    console.log('node adjust_positions.js single EAR_0001 -5.0 2.0');
    console.log('node adjust_positions.js single TIK_0001 0.0 -10.0');
}

module.exports = {
    adjustJewelryPositions,
    resetAllPositions,
    adjustSingleJewelry,
    listAllPositions
}; 