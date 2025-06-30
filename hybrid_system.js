// Hybrid View System
window.HybridViewSystem = class HybridViewSystem {
  constructor() {
    console.log('🏗️ Creating HybridViewSystem instance...');

    this.is3DMode = false;
    this.threeContainer = document.getElementById('three-container');
    if (!this.threeContainer) {
      throw new Error('Three container element not found');
    }

    // Initialize advanced 3D system
    console.log('🏗️ Creating Advanced3DSystem instance...');
    if (!window.Advanced3DSystem) {
      throw new Error('Advanced3DSystem class not found');
    }
    this.advanced3D = new window.Advanced3DSystem();
    console.log('✅ Advanced3DSystem instance created');

    // Video elements for camera feed
    this.videoElement = null;
    this.videoStream = null;

    // Sistema de tracking
    this.lastPosition = { x: 0, y: 0, z: 0 };
    this.smoothingFactor = 0.8;

    // Material presets
    this.materialPresets = {
      gold: {
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.1,
        envMapIntensity: 1.0
      },
      silver: {
        color: 0xc0c0c0,
        metalness: 1.0,
        roughness: 0.1,
        envMapIntensity: 1.0
      },
      diamond: {
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.9,
        thickness: 0.5
      }
    };

    console.log('✅ HybridViewSystem instance created');
  }

  async init() {
    try {
      console.log('🚀 Initializing HybridViewSystem...');

      // Create video element for camera feed
      console.log('📹 Setting up video element...');
      this.videoElement = document.createElement('video');
      this.videoElement.id = 'camera-feed';
      this.videoElement.style.position = 'fixed';
      this.videoElement.style.top = '0';
      this.videoElement.style.left = '0';
      this.videoElement.style.width = '100%';
      this.videoElement.style.height = '100%';
      this.videoElement.style.objectFit = 'cover';
      this.videoElement.style.zIndex = '0';
      this.threeContainer.appendChild(this.videoElement);
      console.log('✅ Video element created and added to DOM');

      // Initialize 3D system
      console.log('🔄 Initializing Advanced3D system...');
      await this.advanced3D.init();
      console.log('✅ Advanced3D system initialized');

      // Setup event listeners
      console.log('🎮 Setting up event listeners...');
      this.setupEventListeners();
      console.log('✅ Event listeners set up');

      console.log('✅ HybridViewSystem initialized successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error initializing HybridViewSystem:', error);
      throw error;
    }
  }

  async startCamera() {
    try {
      console.log('📹 Starting camera...');
      // Request camera access
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      // Set video source and play
      this.videoElement.srcObject = this.videoStream;
      await this.videoElement.play();

      console.log('✅ Camera started successfully');
    } catch (error) {
      console.error('❌ Error starting camera:', error);
      showToast('Erro ao acessar câmera', 'error');
      throw error;
    }
  }

  stopCamera() {
    console.log('📹 Stopping camera...');
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
      this.videoElement.srcObject = null;
      console.log('✅ Camera stopped');
    }
  }

  setupEventListeners() {
    // View mode toggle
    const viewModeToggle = document.getElementById('viewModeToggle');
    if (!viewModeToggle) {
      throw new Error('View mode toggle button not found');
    }

    viewModeToggle.addEventListener('click', () => this.toggleViewMode());
    console.log('✅ View mode toggle button listener added');

    // Window resize
    window.addEventListener('resize', () => this.onWindowResize());
    console.log('✅ Window resize listener added');
  }

  async toggleViewMode() {
    try {
      console.log(`🔄 Toggling view mode from ${this.is3DMode ? '3D' : '2D'} to ${!this.is3DMode ? '3D' : '2D'}...`);
      this.is3DMode = !this.is3DMode;

      // Update UI with smooth transition
      if (this.is3DMode) {
        console.log('🎥 Entering 3D mode...');
        // Start camera when entering 3D mode
        await this.startCamera();

        this.threeContainer.style.opacity = '0';
        this.threeContainer.classList.remove('hidden');
        await new Promise(resolve => requestAnimationFrame(resolve));
        this.threeContainer.style.opacity = '1';
        this.threeContainer.style.transition = 'opacity 0.5s ease';

        // Activate 3D system with effects
        await this.activateAdvanced3D();
      } else {
        console.log('🖼️ Entering 2D mode...');
        // Stop camera when exiting 3D mode
        this.stopCamera();

        this.threeContainer.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 500));
        this.threeContainer.classList.add('hidden');

        // Deactivate 3D system
        await this.deactivateAdvanced3D();
      }

      // Update button text with icon
      const buttonText = this.viewModeToggle.querySelector('.button-text');
      const icon = this.viewModeToggle.querySelector('.material-icons-outlined');

      if (this.is3DMode) {
        buttonText.textContent = 'Modo 3D';
        icon.textContent = 'view_in_ar';
        this.viewModeToggle.classList.add('active');
      } else {
        buttonText.textContent = 'Modo 2D';
        icon.textContent = 'view_in_2d';
        this.viewModeToggle.classList.remove('active');
      }

      console.log(`✅ Successfully switched to ${this.is3DMode ? '3D' : '2D'} mode`);
      // Show toast with appropriate icon
      showToast(
        `✨ Modo ${this.is3DMode ? '3D Premium' : '2D'} ativado!`,
        'success'
      );
    } catch (error) {
      console.error('❌ Error toggling view mode:', error);
      showToast('Erro ao alternar modo de visualização', 'error');

      // Revert to 2D mode on error
      this.is3DMode = false;
      this.threeContainer.classList.add('hidden');
      this.stopCamera();
    }
  }

  async activateAdvanced3D() {
    try {
      console.log('🎮 Activating Advanced 3D mode...');
      // Enable physics simulation
      await this.advanced3D.setupPhysics();

      // Enable post-processing effects
      this.advanced3D.setupPostProcessing();

      // Update all active jewelry with 3D models
      for (const [id, jewelry] of appState.activeJewelry) {
        await this.advanced3D.tryOnJewelry(id, {
          x: jewelry.offset.x,
          y: jewelry.offset.y,
          z: 0
        }, {
          x: 0,
          y: 0,
          z: 0
        });
      }

      // Start animation loop
      this.advanced3D.animate();

      console.log('✨ Advanced 3D mode activated successfully!');
    } catch (error) {
      console.error('❌ Error activating 3D mode:', error);
      throw error;
    }
  }

  async deactivateAdvanced3D() {
    try {
      console.log('🔄 Deactivating Advanced 3D mode...');
      // Disable physics simulation
      if (this.advanced3D.physicsWorld) {
        // Cleanup physics objects
        this.advanced3D.models.forEach(model => {
          if (model.userData.physicsBody) {
            this.advanced3D.physicsWorld.removeRigidBody(model.userData.physicsBody);
          }
        });
      }

      // Disable post-processing
      if (this.advanced3D.postProcessing.composer) {
        this.advanced3D.postProcessing.composer.reset();
      }

      // Clear all 3D models
      this.advanced3D.models.clear();
      this.advanced3D.scene.clear();

      console.log('✨ Advanced 3D mode deactivated successfully!');
    } catch (error) {
      console.error('❌ Error deactivating 3D mode:', error);
      throw error;
    }
  }

  onWindowResize() {
    if (this.is3DMode) {
      this.advanced3D.onWindowResize();
    }
  }
}; 