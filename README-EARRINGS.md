# 👂 Sistema de Posicionamento Inteligente de Brincos

## Problema Resolvido
As argolas e diferentes tipos de brincos precisam de posicionamento específico na orelha para parecerem realistas. O sistema anterior usava landmarks fixos do lóbulo da orelha para todos os tipos.

## Solução Implementada

### 🎯 Detecção Automática por Tipo

O sistema agora detecta automaticamente o tipo de brinco e aplica configurações específicas:

#### **HOOP (Argolas)**
- **Landmarks**: [234, 454] - Laterais da orelha
- **Gap**: -15 (mais próximo da orelha)
- **Scale**: 1.2 (tamanho reduzido)
- **Posicionamento**: Diretamente na orelha

#### **DROP (Pendentes)**
- **Landmarks**: [177, 401] - Lóbulo da orelha
- **Gap**: 0 (posição normal)
- **Scale**: 1.5 (tamanho padrão)
- **Posicionamento**: Pendurado no lóbulo

#### **STUD (Pequenos)**
- **Landmarks**: [177, 401] - Lóbulo da orelha
- **Gap**: 0 (posição normal)
- **Scale**: 1.0 (tamanho menor)
- **Posicionamento**: Fixo no lóbulo

### 🔧 Comandos Disponíveis

```bash
# Analisar brincos atuais
npm run analyze-earrings

# Aplicar ajustes automáticos por tipo
npm run adjust-earrings

# Ver tipos disponíveis e configurações
npm run earring-types
```

### 📊 Exemplo de Configuração na API

```json
{
  "EAR_0004": {
    "name": "Pearl Hoop Earrings",
    "type": "earrings",
    "earringType": "hoop",
    "landmarks": [234, 454],
    "gap": -15,
    "offset": {
      "x": -2,
      "y": 2
    },
    "defaultScale": 1.2
  }
}
```

### 🧠 Sistema de Detecção

O sistema detecta automaticamente o tipo baseado no nome:

- **"hoop", "argola"** → HOOP
- **"drop", "chandelier", "jhumka"** → DROP  
- **Outros** → STUD (padrão)

### 💡 Landmarks do MediaPipe

- **234/454**: Laterais da orelha (para argolas)
- **177/401**: Lóbulo da orelha (para pendentes)

### ⚡ Ajustes Dinâmicos no Código

O sistema aplica offsets adicionais baseados no tipo:

```javascript
if (jewelry.earringType === 'hoop') {
    // Ajustes específicos para argolas
    extraOffsetX = -12; // Mover para dentro da orelha
    extraOffsetY = 3;   // Ajustar verticalmente
    
    // Ajustes específicos por ID
    if (id === 'EAR_0004') { // Pearl Hoop
        extraOffsetX = -15;
        extraOffsetY = 5;
    }
}
```

### 🎨 Resultados

- ✅ **Argolas**: Ficam perfeitamente posicionadas na orelha
- ✅ **Pendentes**: Mantêm o posicionamento tradicional no lóbulo
- ✅ **Detecção automática**: Não precisa configurar manualmente
- ✅ **Flexibilidade**: Pode ser ajustado por ID específico

### 🔄 Workflow de Adição

1. Adicionar novo brinco na API
2. O sistema detecta o tipo automaticamente
3. Aplica configurações apropriadas
4. Ajustes finos podem ser feitos manualmente se necessário

Este sistema resolve completamente o problema de posicionamento de argolas sem precisar migrar para 3D! 