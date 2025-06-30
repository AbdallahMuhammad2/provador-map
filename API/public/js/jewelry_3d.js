// 3D Jewelry Management
window.jewelry3D = {
  // Available 3D models
  models: {
    earring_001: {
      path: '/models/earring_3d.gltf',
      type: 'earring',
      name: 'Brinco Dourado 3D',
      material: 'gold',
      scale: 1.0
    }
  },

  // Load a 3D model
  loadModel: async (modelId) => {
    try {
      console.log('🔄 Loading 3D model:', modelId);

      const modelInfo = window.jewelry3D.models[modelId];
      if (!modelInfo) {
        throw new Error(`Model ${modelId} not found`);
      }

      // Get the hybrid system
      if (!window.hybridSystem) {
        throw new Error('3D system not initialized');
      }

      // Load the model
      const model = await window.hybridSystem.advanced3D.loadModel(
        modelInfo.path,
        {
          id: modelId,
          physics: { mass: 0.1, restitution: 0.7 },
          material: window.hybridSystem.materialPresets[modelInfo.material]
        }
      );

      console.log('✅ 3D model loaded:', modelId);
      showToast('Modelo 3D carregado!', 'success');

      return model;
    } catch (error) {
      console.error('❌ Error loading 3D model:', error);
      showToast('Erro ao carregar modelo 3D', 'error');
      throw error;
    }
  },

  // Try on a 3D jewelry
  tryOn: async (modelId) => {
    try {
      console.log('👗 Trying on 3D jewelry:', modelId);

      // Load model if not already loaded
      if (!window.hybridSystem.advanced3D.models.has(modelId)) {
        await window.jewelry3D.loadModel(modelId);
      }

      // Enable 3D mode if not already enabled
      if (!window.hybridSystem.is3DMode) {
        await window.hybridSystem.toggleViewMode();
      }

      // Update model position based on face landmarks
      if (appState.faceLandmarks) {
        const leftEar = appState.faceLandmarks[234];
        const rightEar = appState.faceLandmarks[454];

        if (leftEar && rightEar) {
          const centerX = (leftEar.x + rightEar.x) / 2;
          const centerY = (leftEar.y + rightEar.y) / 2;
          const centerZ = (leftEar.z + rightEar.z) / 2;

          await window.hybridSystem.advanced3D.tryOnJewelry(
            modelId,
            { x: centerX, y: centerY, z: centerZ },
            { x: 0, y: 0, z: 0 }
          );
        }
      }

      console.log('✅ 3D jewelry applied:', modelId);
      showToast('Joia 3D aplicada!', 'success');
    } catch (error) {
      console.error('❌ Error trying on 3D jewelry:', error);
      showToast('Erro ao aplicar joia 3D', 'error');
    }
  },

  // Remove a 3D jewelry
  remove: (modelId) => {
    try {
      console.log('🗑️ Removing 3D jewelry:', modelId);

      if (window.hybridSystem.advanced3D.models.has(modelId)) {
        const model = window.hybridSystem.advanced3D.models.get(modelId);
        window.hybridSystem.advanced3D.scene.remove(model);
        window.hybridSystem.advanced3D.models.delete(modelId);
      }

      console.log('✅ 3D jewelry removed:', modelId);
      showToast('Joia 3D removida!', 'success');
    } catch (error) {
      console.error('❌ Error removing 3D jewelry:', error);
      showToast('Erro ao remover joia 3D', 'error');
    }
  }
}; 