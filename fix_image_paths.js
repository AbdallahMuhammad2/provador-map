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

function fixImagePaths() {
    console.log('🔧 Corrigindo caminhos de imagens...\n');
    
    let updatedCount = 0;
    
    for (const [id, item] of Object.entries(jewelryData.JEWELRY)) {
        console.log(`📍 ${id}: ${item.name}`);
        
        // Corrigir imagens de brincos
        if (item.type === 'earrings') {
            if (item.left && !item.left.startsWith('images/')) {
                const oldLeft = item.left;
                item.left = `images/earring/${item.left}`;
                console.log(`   ✅ Left: ${oldLeft} → ${item.left}`);
            }
            
            if (item.right && !item.right.startsWith('images/')) {
                const oldRight = item.right;
                item.right = `images/earring/${item.right}`;
                console.log(`   ✅ Right: ${oldRight} → ${item.right}`);
            }
        }
        
        // Corrigir outras imagens
        if (item.image && !item.image.startsWith('images/')) {
            const oldImage = item.image;
            
            if (item.type === 'necklace') {
                item.image = `images/necklace/${item.image}`;
            } else if (item.type === 'single') {
                item.image = `images/tikka/${item.image}`;
            } else if (item.type === 'hand') {
                if (item.subcategory === 'bangle') {
                    item.image = `images/bangle/${item.image}`;
                } else if (item.subcategory === 'ring') {
                    item.image = `images/ring/${item.image}`;
                }
            }
            
            console.log(`   ✅ Image: ${oldImage} → ${item.image}`);
        }
        
        updatedCount++;
    }
    
    // Salvar de volta
    try {
        fs.writeFileSync(
            path.join(__dirname, 'API/jewelry-data.json'),
            JSON.stringify(jewelryData, null, 2),
            'utf8'
        );
        console.log(`\n✅ ${updatedCount} itens atualizados com sucesso!`);
    } catch (error) {
        console.error('❌ Erro ao salvar arquivo:', error);
    }
}

function verifyImagePaths() {
    console.log('🔍 Verificando se os caminhos estão corretos...\n');
    
    for (const [id, item] of Object.entries(jewelryData.JEWELRY)) {
        if (item.type === 'earrings') {
            const leftPath = path.join(__dirname, 'API/public', item.left);
            const rightPath = path.join(__dirname, 'API/public', item.right);
            
            console.log(`${id}:`);
            console.log(`   Left: ${fs.existsSync(leftPath) ? '✅' : '❌'} ${item.left}`);
            console.log(`   Right: ${fs.existsSync(rightPath) ? '✅' : '❌'} ${item.right}`);
        } else if (item.image) {
            const imagePath = path.join(__dirname, 'API/public', item.image);
            
            console.log(`${id}:`);
            console.log(`   Image: ${fs.existsSync(imagePath) ? '✅' : '❌'} ${item.image}`);
        }
    }
}

// Interface de linha de comando
const command = process.argv[2];

switch (command) {
    case 'fix':
        fixImagePaths();
        break;
    case 'verify':
        verifyImagePaths();
        break;
    default:
        console.log('📖 Uso: node fix_image_paths.js [comando]');
        console.log('');
        console.log('Comandos disponíveis:');
        console.log('  fix     - Corrigir todos os caminhos de imagens');
        console.log('  verify  - Verificar se as imagens existem');
        console.log('');
        console.log('Exemplos:');
        console.log('  node fix_image_paths.js fix');
        console.log('  node fix_image_paths.js verify');
} 