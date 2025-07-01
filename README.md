# Provador Virtual - Eleva Labs

Sistema de provador virtual de joias com IA para detecção facial e de mãos.

## 🚀 Funcionalidades

- **Provador Virtual**: Experimente brincos, colares, anéis e pulseiras em tempo real
- **IA Avançada**: Detecção precisa de rosto, mãos e pose usando MediaPipe
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **API Sincronizada**: Dados sempre atualizados da API externa
- **Sistema de Avaliação**: Feedback integrado dos usuários

## 📦 Instalação

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd provador-map

# Instale as dependências da API
cd API
npm install
cd ..

# Sincronize os dados das joias (primeira vez)
npm run sync
```

## 🔧 Scripts Disponíveis

### API e Servidor

```bash
# Iniciar servidor local
npm start                    # Inicia na porta 3000

# Modo desenvolvimento (auto-reload)
npm run dev
```

### Sincronização de Dados

```bash
# Sincronizar dados manualmente
npm run sync                 # Baixa dados e imagens da API externa

# Sincronizar e iniciar servidor
npm run sync-and-start      # Sync + start em um comando

# Verificar atualizações (uma vez)
npm run check               # Verifica se há mudanças na API externa

# Monitoramento automático
npm run monitor             # Monitora e sincroniza automaticamente
```

## 🔄 Sistema de Sincronização

### Como Funciona

O sistema mantém uma cópia local dos dados da API externa (`https://kdkpbjjeze.execute-api.ap-south-1.amazonaws.com/prod1`) e baixa todas as imagens para garantir performance e disponibilidade.

### Arquivos Importantes

- `sync_jewelry_data.js` - Script de sincronização principal
- `monitor_api.js` - Monitor automático de atualizações
- `API/jewelry-data.json` - Dados locais das joias
- `last-sync.json` - Info da última sincronização

### Dados Sincronizados

- ✅ **16 itens de joias** (brincos, colares, anéis, pulseiras, tikkas)
- ✅ **35 imagens** (principais + thumbnails)
- ✅ **Metadados completos** (escala, posicionamento, landmarks)

## 🗂️ Estrutura dos Dados

```json
{
  "JEWELRY": {
    "EAR_0001": {
      "name": "Chandlier Earing with Pearl Drops",
      "type": "earrings",
      "group": "ear", 
      "defaultScale": 1.5,
      "left": "earing2left.png",
      "right": "earing2right.png",
      "gap": 5,
      "thumbnail": "thumbnails/earring2-thumb.png"
    }
  }
}
```

## 📱 Como Usar o Provador

1. **Abra o provador**: Acesse `index.html` no navegador
2. **Permita a câmera**: Autorize o acesso quando solicitado
3. **Escolha a categoria**: Use as pílulas no topo (Rosto, Brincos, Pescoço, Mãos)
4. **Experimente joias**: Toque nos itens no carrossel inferior
5. **Ajuste posição**: Toque duplo na joia para abrir controles
6. **Capture foto**: Use o botão da câmera para salvar

## 🎯 Controles Disponíveis

- **Tamanho**: Slider para ajustar escala (50% - 200%)
- **Opacidade**: Controle de transparência (20% - 100%)
- **Posição**: Grid 3x3 para mover a joia
- **Gestos**: 
  - Arrastar para mover
  - Pinch para redimensionar
  - Toque duplo para configurações

## 🔍 Monitoramento Automático

O sistema pode monitorar automaticamente a API externa:

```bash
# Iniciar monitoramento (verifica a cada 30 min)
npm run monitor
```

**Funcionalidades:**
- ✅ Verifica mudanças a cada 30 minutos
- ✅ Sincroniza automaticamente quando detecta alterações
- ✅ Salva log das sincronizações
- ✅ Calcula hash para detectar diferenças

## 🛠️ Configuração da API

### Servidor Local (desenvolvimento)

```javascript
const API_URL = 'http://localhost:3000';
```

### API Externa (produção)

```javascript  
const API_URL = 'https://kdkpbjjeze.execute-api.ap-south-1.amazonaws.com/prod1';
```

## 📊 Endpoints da API

```
GET /jewelry-data          # Todos os dados das joias
GET /jewelry/:id           # Joia específica por ID
```

## 🎨 Categorias de Joias

| Categoria | Tipo | Qtd | Exemplos |
|-----------|------|-----|----------|
| **Brincos** | `earrings` | 3 | Chandlier, Jhumkas, Contemporary |
| **Colares** | `necklace` | 5 | Temple, Chocker, Butterfly |
| **Anéis** | `hand/ring` | 1 | Lakshmi Design |
| **Pulseiras** | `hand/bangle` | 3 | Crystal, Rosegold, Ruby |
| **Tikka** | `single` | 4 | Traditional, Bridal, Temple |

## 🔧 Solução de Problemas

### Imagens não carregam
```bash
# Re-sincronizar dados
npm run sync
```

### API não responde
```bash
# Verificar se servidor está rodando
curl http://localhost:3000/jewelry-data

# Reiniciar servidor
npm start
```

### Dados desatualizados
```bash
# Forçar sincronização
npm run sync

# Verificar última sync
cat last-sync.json
```

## 📈 Logs e Monitoramento

O sistema gera logs detalhados:

```
🚀 Iniciando sincronização dos dados das joias...
📡 Buscando dados da API externa...
📦 Encontrados 16 itens de joias
🔄 Processando: Chandlier Earing with Pearl Drops (EAR_0001)
📥 Baixando 35 imagens...
✅ Downloaded: earing2left.png
💾 Dados salvos em: API/jewelry-data.json
✅ Sincronização concluída com sucesso!
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 🙋‍♂️ Suporte

Para dúvidas ou suporte:
- **Email**: [seu-email@eleva-labs.com]
- **Issues**: Use o sistema de issues do GitHub
- **Documentação**: Consulte este README

---

Desenvolvido com ❤️ pela **Eleva Labs** 