// Debug commands for 3D system
window.debug3D = {
  // Test 3D model loading
  testModelLoading: async () => {
    try {
      console.log('🧪 Testing 3D model loading...');
      const hybridSystem = window.hybridSystem;

      if (!hybridSystem) {
        throw new Error('Hybrid system not initialized');
      }

      // Load test model
      await hybridSystem.advanced3D.loadModel('models/earring_001_detailed.gltf', {
        id: 'test_earring',
        physics: { mass: 0.1, restitution: 0.7 },
        material: hybridSystem.materialPresets.gold
      });

      console.log('✅ Test model loaded successfully!');
      showToast('Modelo 3D carregado com sucesso!', 'success');
    } catch (error) {
      console.error('❌ Error loading test model:', error);
      showToast('Erro ao carregar modelo 3D', 'error');
    }
  },

  // Test physics system
  testPhysics: () => {
    try {
      console.log('🧪 Testing physics system...');
      const hybridSystem = window.hybridSystem;

      if (!hybridSystem || !hybridSystem.advanced3D.physicsWorld) {
        throw new Error('Physics system not initialized');
      }

      // Add a test object with physics
      const model = hybridSystem.advanced3D.models.get('test_earring');
      if (model) {
        model.position.set(0, 5, 0); // Drop from height
        if (model.userData.physicsBody) {
          const transform = new Ammo.btTransform();
          transform.setIdentity();
          transform.setOrigin(new Ammo.btVector3(0, 5, 0));
          model.userData.physicsBody.setWorldTransform(transform);
        }
      }

      console.log('✅ Physics test started!');
      showToast('Teste de física iniciado!', 'success');
    } catch (error) {
      console.error('❌ Error testing physics:', error);
      showToast('Erro no teste de física', 'error');
    }
  },

  // Test material system
  testMaterials: () => {
    try {
      console.log('🧪 Testing material system...');
      const hybridSystem = window.hybridSystem;

      if (!hybridSystem) {
        throw new Error('Hybrid system not initialized');
      }

      // Test all material presets
      Object.entries(hybridSystem.materialPresets).forEach(([name, properties]) => {
        console.log(`Testing ${name} material:`, properties);
        const model = hybridSystem.advanced3D.models.get('test_earring');
        if (model) {
          hybridSystem.advanced3D.updateMaterialProperties('test_earring', properties);
        }
      });

      console.log('✅ Material tests complete!');
      showToast('Teste de materiais concluído!', 'success');
    } catch (error) {
      console.error('❌ Error testing materials:', error);
      showToast('Erro no teste de materiais', 'error');
    }
  },

  // Test post-processing effects
  testEffects: () => {
    try {
      console.log('🧪 Testing post-processing effects...');
      const hybridSystem = window.hybridSystem;

      if (!hybridSystem || !hybridSystem.advanced3D.postProcessing.composer) {
        throw new Error('Post-processing not initialized');
      }

      // Test each effect
      hybridSystem.advanced3D.postProcessing.effects.forEach((effect, name) => {
        console.log(`Testing ${name} effect`);
        effect.enabled = true;
      });

      console.log('✅ Effects test complete!');
      showToast('Teste de efeitos concluído!', 'success');
    } catch (error) {
      console.error('❌ Error testing effects:', error);
      showToast('Erro no teste de efeitos', 'error');
    }
  },

  // Test complete system
  testAll: async () => {
    try {
      console.log('🧪 Running complete 3D system test...');

      // Test model loading
      await window.debug3D.testModelLoading();

      // Test physics
      window.debug3D.testPhysics();

      // Test materials
      window.debug3D.testMaterials();

      // Test effects
      window.debug3D.testEffects();

      console.log('✅ Complete system test finished!');
      showToast('Teste completo do sistema 3D concluído!', 'success');
    } catch (error) {
      console.error('❌ Error in complete system test:', error);
      showToast('Erro no teste completo do sistema', 'error');
    }
  }
};

// Log available commands
console.log('🔧 3D Debug Commands:');
console.log('- window.debug3D.testModelLoading() - Test 3D model loading');
console.log('- window.debug3D.testPhysics() - Test physics system');
console.log('- window.debug3D.testMaterials() - Test material system');
console.log('- window.debug3D.testEffects() - Test post-processing effects');
console.log('- window.debug3D.testAll() - Run complete system test'); 