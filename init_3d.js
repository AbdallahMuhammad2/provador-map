// Initialize 3D system
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🚀 Initializing 3D system...');

    // Function to check if a dependency is loaded
    function isDependencyLoaded(dependency, name) {
      const isLoaded = !!dependency;
      console.log(`🔍 Checking ${name}: ${isLoaded ? '✅' : '❌'}`);
      if (!isLoaded) {
        console.error(`${name} not loaded`);
      }
      return isLoaded;
    }

    // Function to wait for dependencies
    async function waitForDependencies(maxAttempts = 20) {
      console.log('⏳ Waiting for dependencies...');
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const threeLoaded = isDependencyLoaded(window.THREE, 'Three.js');
        const gltfLoaded = isDependencyLoaded(window.THREE?.GLTFLoader, 'GLTFLoader');
        const controlsLoaded = isDependencyLoaded(window.THREE?.OrbitControls, 'OrbitControls');
        const effectsLoaded = isDependencyLoaded(window.THREE?.EffectComposer, 'EffectComposer');
        const ammoLoaded = isDependencyLoaded(window.AmmoLib, 'Ammo.js');

        if (threeLoaded && gltfLoaded && controlsLoaded && effectsLoaded && ammoLoaded) {
          console.log('✅ All dependencies loaded successfully');
          return true;
        }
        console.log(`🔄 Attempt ${attempt + 1}/${maxAttempts} - Waiting for dependencies...`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      throw new Error('Dependencies failed to load after maximum attempts');
    }

    // Wait for all dependencies to be loaded
    await waitForDependencies();

    // Create the 3D system
    console.log('🏗️ Creating HybridViewSystem...');
    if (!window.HybridViewSystem) {
      throw new Error('HybridViewSystem class not found');
    }

    window.hybridSystem = new HybridViewSystem();
    console.log('✅ HybridViewSystem instance created');

    console.log('🔄 Initializing HybridViewSystem...');
    await window.hybridSystem.init();
    console.log('✅ HybridViewSystem initialized');

    // Verify system components
    console.log('🔍 Verifying system components...');
    if (!window.hybridSystem.advanced3D) {
      throw new Error('Advanced3D system not initialized');
    }
    if (!window.hybridSystem.threeContainer) {
      throw new Error('Three container not found');
    }
    console.log('✅ System components verified');

    // Add test commands to window
    window.test3D = {
      loadModel: async () => {
        try {
          console.log('🧪 Testing model loading...');
          if (!window.hybridSystem?.advanced3D) {
            throw new Error('3D system not initialized');
          }
          await window.hybridSystem.advanced3D.loadModel('models/test_earring.gltf', {
            id: 'test_earring',
            physics: { mass: 0.1, restitution: 0.7 },
            material: window.hybridSystem.materialPresets.gold
          });
          showToast('Modelo de teste carregado!', 'success');
        } catch (error) {
          console.error('Error loading test model:', error);
          showToast('Erro ao carregar modelo 3D', 'error');
        }
      },

      toggleMode: () => {
        try {
          console.log('🔄 Toggling 3D mode...');
          const viewModeToggle = document.getElementById('viewModeToggle');
          if (!viewModeToggle) {
            throw new Error('View mode toggle button not found');
          }
          if (!window.hybridSystem) {
            throw new Error('Hybrid system not initialized');
          }
          viewModeToggle.click();
        } catch (error) {
          console.error('Error toggling mode:', error);
          showToast('Erro ao alternar modo', 'error');
        }
      },

      status: () => {
        console.log('📊 3D System Status:');
        console.log('- Three.js loaded:', !!window.THREE);
        console.log('- GLTFLoader loaded:', !!window.THREE?.GLTFLoader);
        console.log('- OrbitControls loaded:', !!window.THREE?.OrbitControls);
        console.log('- EffectComposer loaded:', !!window.THREE?.EffectComposer);
        console.log('- Ammo.js loaded:', !!window.AmmoLib);
        console.log('- HybridSystem initialized:', !!window.hybridSystem);
        if (window.hybridSystem) {
          console.log('- 3D Mode active:', window.hybridSystem.is3DMode);
          console.log('- Advanced3D system:', !!window.hybridSystem.advanced3D);
          console.log('- Three container:', !!window.hybridSystem.threeContainer);
          if (window.hybridSystem.advanced3D) {
            console.log('- Models loaded:', Array.from(window.hybridSystem.advanced3D.models.keys()));
            console.log('- Physics enabled:', !!window.hybridSystem.advanced3D.physicsWorld);
            console.log('- Post-processing enabled:', !!window.hybridSystem.advanced3D.postProcessing.composer);
          }
        }
      }
    };

    // Log test commands
    console.log('🔧 Test commands available:');
    console.log('- window.test3D.loadModel() - Load test model');
    console.log('- window.test3D.toggleMode() - Toggle 3D mode');
    console.log('- window.test3D.status() - Show system status');

    // Run initial status check
    console.log('🔍 Running initial status check...');
    window.test3D.status();

    showToast('Sistema 3D inicializado! Use window.test3D para testar', 'success');
  } catch (error) {
    console.error('❌ Error initializing 3D system:', error);
    showToast('Erro ao inicializar sistema 3D', 'error');
  }
}); 