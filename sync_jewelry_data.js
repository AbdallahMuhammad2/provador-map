const fs = require('fs');
const path = require('path');
const https = require('https');

// URL da API externa
const EXTERNAL_API_URL = 'https://kdkpbjjeze.execute-api.ap-south-1.amazonaws.com/prod1/jewelry-data';

// Função para fazer requisição HTTP
function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
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

// Função para baixar imagem
function downloadImage(url, filePath) {
    return new Promise((resolve, reject) => {
        // Criar diretório se não existir
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const file = fs.createWriteStream(filePath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ Downloaded: ${path.basename(filePath)}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {}); // Delete the file async
            reject(err);
        });
    });
}

// Função para extrair nome do arquivo da URL
function getFileNameFromUrl(url) {
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    // Remove timestamp prefix se existir
    return fileName.replace(/^\d+_/, '');
}

// Função principal
async function syncJewelryData() {
    try {
        console.log('🚀 Iniciando sincronização dos dados das joias...');
        
        // 1. Buscar dados da API externa
        console.log('📡 Buscando dados da API externa...');
        const externalData = await fetchData(EXTERNAL_API_URL);
        
        console.log(`📦 Encontrados ${Object.keys(externalData.JEWELRY).length} itens de joias`);
        
        // 2. Processar cada item de joia mantendo a estrutura exata
        const processedJewelry = {};
        const downloadPromises = [];
        
        for (const [id, jewelry] of Object.entries(externalData.JEWELRY)) {
            console.log(`\n🔄 Processando: ${jewelry.name} (${id})`);
            
            // Manter toda a estrutura original
            const processedItem = {
                name: jewelry.name,
                type: jewelry.type,
                group: jewelry.group,
                category: jewelry.category || `${jewelry.group.charAt(0).toUpperCase() + jewelry.group.slice(1)} Jewelry`,
                offset: jewelry.offset || { x: 0.0, y: 0.0 },
                defaultScale: jewelry.defaultScale || 1.0
            };

            // Adicionar campos específicos por tipo, mantendo estrutura exata
            if (jewelry.type === 'earrings') {
                if (jewelry.left && jewelry.right) {
                    const leftFileName = getFileNameFromUrl(jewelry.left);
                    const rightFileName = getFileNameFromUrl(jewelry.right);
                    
                    processedItem.left = leftFileName;
                    processedItem.right = rightFileName;
                    
                    // Manter estrutura exata dos landmarks e gap
                    if (jewelry.landmarks) {
                        processedItem.landmarks = jewelry.landmarks;
                    }
                    processedItem.gap = jewelry.gap !== undefined ? jewelry.gap : 0.0;
                    
                    // Agendar download das imagens
                    downloadPromises.push(
                        downloadImage(jewelry.left, path.join(__dirname, leftFileName))
                    );
                    downloadPromises.push(
                        downloadImage(jewelry.right, path.join(__dirname, rightFileName))
                    );
                }
            } else if (jewelry.type === 'hand') {
                if (jewelry.image) {
                    const fileName = getFileNameFromUrl(jewelry.image);
                    processedItem.image = fileName;
                    
                    // Manter estrutura exata dos campos de mão
                    if (jewelry.landmark) {
                        processedItem.landmark = jewelry.landmark;
                    }
                    if (jewelry.subcategory) {
                        processedItem.subcategory = jewelry.subcategory;
                    }
                    if (jewelry.fingerIndex !== undefined) {
                        processedItem.fingerIndex = jewelry.fingerIndex;
                    }
                    if (jewelry.handIndex !== undefined) {
                        processedItem.handIndex = jewelry.handIndex;
                    }
                    if (jewelry.wristIndex !== undefined) {
                        processedItem.wristIndex = jewelry.wristIndex;
                    }
                    
                    // Agendar download da imagem
                    downloadPromises.push(
                        downloadImage(jewelry.image, path.join(__dirname, fileName))
                    );
                }
            } else {
                // Para necklace, single (tikka), etc.
                if (jewelry.image) {
                    const fileName = getFileNameFromUrl(jewelry.image);
                    processedItem.image = fileName;
                    
                    // Manter landmark se existir
                    if (jewelry.landmark !== undefined) {
                        processedItem.landmark = jewelry.landmark;
                    }
                    
                    // Agendar download da imagem
                    downloadPromises.push(
                        downloadImage(jewelry.image, path.join(__dirname, fileName))
                    );
                }
            }

            // Baixar thumbnail se disponível
            if (jewelry.thumbnail) {
                const thumbFileName = getFileNameFromUrl(jewelry.thumbnail);
                processedItem.thumbnail = `thumbnails/${thumbFileName}`;
                
                // Agendar download do thumbnail
                downloadPromises.push(
                    downloadImage(jewelry.thumbnail, path.join(__dirname, 'thumbnails', thumbFileName))
                );
            }

            processedJewelry[id] = processedItem;
        }

        // 3. Adicionar o Pearl Hoop local se não estiver na API externa
        if (!processedJewelry['EAR_0004']) {
            processedJewelry['EAR_0004'] = {
                "name": "Pearl Hoop Earrings",
                "type": "earrings",
                "group": "ear",
                "category": "Ear Jewelry",
                "offset": {
                    "x": -5.0,
                    "y": 0.0
                },
                "defaultScale": 1.5,
                "left": "pearl_hoop_left.png",
                "right": "pearl_hoop_right.png",
                "thumbnail": "thumbnails/pearl_hoop_thumb.png",
                "landmarks": [
                    177.0,
                    401.0
                ],
                "gap": 0.0
            };
        }

        // 4. Baixar todas as imagens
        console.log(`\n📥 Baixando ${downloadPromises.length} imagens...`);
        await Promise.all(downloadPromises);
        
        // 5. Salvar dados processados mantendo estrutura exata
        const outputData = { JEWELRY: processedJewelry };
        const outputPath = path.join(__dirname, 'API', 'jewelry-data.json');
        
        fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
        console.log(`\n💾 Dados salvos em: ${outputPath}`);
        
        // 6. Criar backup dos dados antigos
        const backupPath = path.join(__dirname, 'API', 'jewelry-data-backup.json');
        if (fs.existsSync(backupPath)) {
            fs.unlinkSync(backupPath);
        }
        
        console.log('\n✅ Sincronização concluída com sucesso!');
        console.log(`📊 Total de itens: ${Object.keys(processedJewelry).length}`);
        console.log(`🖼️  Total de imagens baixadas: ${downloadPromises.length}`);
        
    } catch (error) {
        console.error('❌ Erro durante a sincronização:', error);
        process.exit(1);
    }
}

// Executar se for chamado diretamente
if (require.main === module) {
    syncJewelryData();
}

module.exports = { syncJewelryData }; 