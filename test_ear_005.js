#!/usr/bin/env node

/**
 * TESTE URGENTE PARA EAR_0005 - MVP READY
 * Script para verificar se o brinco 005 está configurado corretamente
 * Execute: node test_ear_005.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 TESTE URGENTE EAR_0005 - VERIFICAÇÃO MVP');
console.log('=' .repeat(50));

// 1. Verificar se os dados do EAR_0005 estão corretos
try {
    const jewelryDataPath = path.join(__dirname, 'API', 'jewelry-data.json');
    const jewelryData = JSON.parse(fs.readFileSync(jewelryDataPath, 'utf8'));
    
    const ear005 = jewelryData.JEWELRY.EAR_0005;
    
    if (!ear005) {
        console.error('❌ EAR_0005 não encontrado no JSON');
        process.exit(1);
    }
    
    console.log('✅ EAR_0005 encontrado com configurações:');
    console.log('   - Tipo:', ear005.earringType);
    console.log('   - Scale padrão:', ear005.defaultScale);
    console.log('   - Gap:', ear005.gap);
    console.log('   - Offset X:', ear005.offset.x);
    console.log('   - Offset Y:', ear005.offset.y);
    console.log('   - Landmarks:', ear005.landmarks);
    
    // Verificar se é do tipo stud
    if (ear005.earringType !== 'stud') {
        console.warn('⚠️  EAR_0005 deveria ser tipo "stud"');
    } else {
        console.log('✅ Tipo "stud" correto');
    }
    
    // Verificar scale apropriado para studs
    if (ear005.defaultScale < 1.5 || ear005.defaultScale > 3.0) {
        console.warn('⚠️  Scale pode estar inadequado para studs (recomendado: 1.5-3.0)');
    } else {
        console.log('✅ Scale adequado para studs');
    }
    
} catch (error) {
    console.error('❌ Erro ao ler jewelry-data.json:', error.message);
    process.exit(1);
}

// 2. Verificar se as imagens existem
console.log('\n📁 VERIFICANDO IMAGENS...');

const imagePaths = [
    'API/public/images/earring/simpleEarring4left.jpeg',
    'API/public/images/earring/simpleEarring4right.jpeg',
    'API/public/thumbnails/simpleEarring4-thumb.png'
];

let allImagesExist = true;

imagePaths.forEach(imagePath => {
    const fullPath = path.join(__dirname, imagePath);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        console.log(`✅ ${imagePath} (${(stats.size / 1024).toFixed(1)}KB)`);
    } else {
        console.error(`❌ MISSING: ${imagePath}`);
        allImagesExist = false;
    }
});

// 3. Verificar se o código de drawEarrings foi atualizado
console.log('\n🔍 VERIFICANDO CÓDIGO DRAWEARRINGS...');

try {
    const indexPath = path.join(__dirname, 'index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Verificar se tem o código de tratamento específico para studs
    if (indexContent.includes("case 'stud':")) {
        console.log('✅ Código de tratamento para studs encontrado');
    } else {
        console.error('❌ Código de tratamento para studs NÃO encontrado');
    }
    
    // Verificar se tem debug específico para EAR_0005
    if (indexContent.includes("id === 'EAR_0005'")) {
        console.log('✅ Debug específico para EAR_0005 encontrado');
    } else {
        console.warn('⚠️  Debug específico para EAR_0005 não encontrado');
    }
    
    // Verificar se removeu as condições problemáticas de rotação
    if (indexContent.includes('shouldDrawLeft') && indexContent.includes('shouldDrawRight')) {
        console.log('✅ Sistema de rotação melhorado encontrado');
    } else {
        console.error('❌ Sistema de rotação melhorado NÃO encontrado');
    }
    
} catch (error) {
    console.error('❌ Erro ao verificar index.html:', error.message);
}

// 4. Verificar se o servidor API está configurado
console.log('\n🌐 VERIFICANDO CONFIGURAÇÃO DO SERVIDOR...');

try {
    const serverPath = path.join(__dirname, 'API', 'server.js');
    if (fs.existsSync(serverPath)) {
        console.log('✅ Servidor API encontrado');
        
        const serverContent = fs.readFileSync(serverPath, 'utf8');
        if (serverContent.includes('process.env.PORT')) {
            console.log('✅ Configuração de porta dinâmica encontrada');
        } else {
            console.warn('⚠️  Configuração de porta dinâmica não encontrada');
        }
    } else {
        console.error('❌ Servidor API não encontrado');
    }
} catch (error) {
    console.error('❌ Erro ao verificar servidor:', error.message);
}

// 5. Sumário final
console.log('\n' + '='.repeat(50));

if (allImagesExist) {
    console.log('🎉 RESULTADO: EAR_0005 PRONTO PARA MVP!');
    console.log('');
    console.log('📋 PRÓXIMOS PASSOS PARA O MVP:');
    console.log('   1. npm start (na pasta API)');
    console.log('   2. Servir index.html via HTTP server');
    console.log('   3. Testar no dispositivo móvel');
    console.log('   4. Verificar posicionamento dos studs');
    console.log('   5. Confirmar que não saem do lugar ao rotacionar');
    console.log('');
    console.log('🚀 READY TO LAUNCH MVP!');
} else {
    console.log('❌ PROBLEMA: Imagens em falta - corrigir antes do MVP');
    process.exit(1);
}

console.log('\n✨ Teste concluído em', new Date().toLocaleString()); 