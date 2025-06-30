// Advanced 3D System for Virtual Try-On
window.Advanced3DSystem = class Advanced3DSystem {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.models = new Map();
    this.lights = new Map();
    this.animations = new Map();
    this.mixers = new Map();
    this.clock = new THREE.Clock();

    // Advanced features
    this.postProcessing = {
      composer: null,
      effects: new Map()
    };

    this.physicsWorld = null;
    this.riggedModels = new Map();
    this.envMap = null;

    // Use the initialized Ammo instance
    this.Ammo = window.AmmoLib;
    if (!this.Ammo) {
      console.error('❌ Ammo.js not properly initialized');
    } else {
      console.log('✅ Using initialized Ammo.js instance');
    }
  }

  async init() {
    try {
      console.log('🚀 Initializing Advanced3D System...');

      // Initialize Three.js scene
      this.scene = new THREE.Scene();
      this.scene.background = null; // Transparent background

      // Camera setup
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.set(0, 0, 5);

      // Renderer with advanced features
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
        precision: 'highp',
        powerPreference: 'high-performance'
      });

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

      // Add renderer to DOM
      const container = document.getElementById('three-container');
      if (container) {
        container.appendChild(this.renderer.domElement);
      }

      // Advanced lighting setup
      this.setupLighting();

      // Environment map for realistic reflections
      await this.loadEnvironmentMap();

      // Post-processing setup
      this.setupPostProcessing();

      // Physics setup
      await this.setupPhysics();

      // Controls
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxDistance = 10;
      this.controls.minDistance = 2;

      // Event listeners
      window.addEventListener('resize', () => this.onWindowResize());

      // Start animation loop
      this.animate();

      console.log('✅ Advanced3D System initialized successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error initializing Advanced3D System:', error);
      throw error;
    }
  }

  setupLighting() {
    // Main directional light (sun)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    this.scene.add(mainLight);
    this.lights.set('main', mainLight);

    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);
    this.lights.set('ambient', ambient);

    // Rim light for highlights
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(-5, 5, -5);
    this.scene.add(rimLight);
    this.lights.set('rim', rimLight);

    // Point lights for sparkle effects
    const sparkle1 = new THREE.PointLight(0xffd700, 0.5, 10);
    sparkle1.position.set(2, 2, 2);
    this.scene.add(sparkle1);
    this.lights.set('sparkle1', sparkle1);

    const sparkle2 = new THREE.PointLight(0xffd700, 0.5, 10);
    sparkle2.position.set(-2, -2, -2);
    this.scene.add(sparkle2);
    this.lights.set('sparkle2', sparkle2);
  }

  async loadEnvironmentMap() {
    try {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      pmremGenerator.compileEquirectangularShader();

      const envMapTexture = await new Promise((resolve) => {
        new THREE.TextureLoader().load('http://localhost:3000/textures/env_map.jpg', resolve);
      });

      this.envMap = pmremGenerator.fromEquirectangular(envMapTexture).texture;
      this.scene.environment = this.envMap;

      pmremGenerator.dispose();

      console.log('✅ Environment map loaded');
    } catch (error) {
      console.warn('⚠️ Error loading environment map:', error);
    }
  }

  setupPostProcessing() {
    try {
      const composer = new THREE.EffectComposer(this.renderer);

      // Render pass
      const renderPass = new THREE.RenderPass(this.scene, this.camera);
      composer.addPass(renderPass);

      // Bloom effect
      const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // Strength
        0.4, // Radius
        0.85 // Threshold
      );
      composer.addPass(bloomPass);
      this.postProcessing.effects.set('bloom', bloomPass);

      this.postProcessing.composer = composer;

      console.log('✅ Post-processing setup complete');
    } catch (error) {
      console.warn('⚠️ Error setting up post-processing:', error);
    }
  }

  async setupPhysics() {
    try {
      if (!this.Ammo) {
        console.error('❌ Ammo.js not available, skipping physics');
        return;
      }

      console.log('🎮 Setting up physics system...');

      const collisionConfiguration = new this.Ammo.btDefaultCollisionConfiguration();
      const dispatcher = new this.Ammo.btCollisionDispatcher(collisionConfiguration);
      const broadphase = new this.Ammo.btDbvtBroadphase();
      const solver = new this.Ammo.btSequentialImpulseConstraintSolver();

      this.physicsWorld = new this.Ammo.btDiscreteDynamicsWorld(
        dispatcher,
        broadphase,
        solver,
        collisionConfiguration
      );

      this.physicsWorld.setGravity(new this.Ammo.btVector3(0, -9.81, 0));

      console.log('✅ Physics system initialized');
    } catch (error) {
      console.error('❌ Error setting up physics:', error);
    }
  }

  async loadModel(modelPath, options = {}) {
    try {
      console.log('📦 Loading model:', modelPath);

      // Show loading state if UI element exists
      const loadingIndicator = document.getElementById('model-loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
      }

      const loader = new THREE.GLTFLoader();

      // Add loading manager for progress tracking
      const manager = new THREE.LoadingManager();
      manager.onProgress = (url, loaded, total) => {
        console.log(`Loading progress: ${(loaded / total * 100).toFixed(2)}%`);
      };
      loader.manager = manager;

      const gltf = await new Promise((resolve, reject) => {
        loader.load(
          modelPath,
          resolve,
          (progress) => {
            if (progress.lengthComputable) {
              const percentComplete = (progress.loaded / progress.total) * 100;
              console.log(`Loading progress: ${percentComplete.toFixed(2)}%`);
            }
          },
          reject
        );
      });

      const model = gltf.scene;

      // Apply material settings
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
            // Apply material preset if specified
            if (options.material) {
              const preset = options.material;
              child.material = new THREE.MeshStandardMaterial({
                ...preset,
                envMap: this.envMap,
                envMapIntensity: preset.envMapIntensity || 1.0
              });
            } else {
              child.material.envMap = this.envMap;
              child.material.envMapIntensity = 1.0;
            }

            // Enable transparency if needed
            if (options.transparent) {
              child.material.transparent = true;
              child.material.opacity = options.opacity || 1.0;
            }

            child.material.needsUpdate = true;
          }
        }
      });

      // Setup animations if present
      if (gltf.animations && gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        this.mixers.set(model.uuid, mixer);

        gltf.animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          this.animations.set(clip.name, action);
        });
      }

      // Add physics if enabled
      if (options.physics && this.physicsWorld) {
        this.addPhysicsToModel(model, options.physics);
      }

      // Position and scale the model if specified
      if (options.position) {
        model.position.copy(options.position);
      }
      if (options.scale) {
        model.scale.copy(options.scale);
      }
      if (options.rotation) {
        model.rotation.copy(options.rotation);
      }

      this.models.set(options.id || model.uuid, model);
      this.scene.add(model);

      // Hide loading indicator
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }

      console.log('✅ Model loaded successfully:', options.id || model.uuid);
      return model;
    } catch (error) {
      console.error('❌ Error loading model:', error);

      // Hide loading indicator on error
      const loadingIndicator = document.getElementById('model-loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }

      // Show error toast if available
      if (window.showToast) {
        window.showToast('Erro ao carregar modelo 3D', 'error');
      }

      throw error;
    }
  }

  addPhysicsToModel(model, physicsOptions) {
    if (!this.Ammo || !this.physicsWorld) {
      console.warn('⚠️ Physics system not available');
      return;
    }

    try {
      console.log('🎯 Adding physics to model:', model.uuid);

      // Calculate model dimensions for accurate physics shape
      const bbox = new THREE.Box3().setFromObject(model);
      const dimensions = bbox.getSize(new THREE.Vector3());

      // Create physics shape based on model type
      let shape;
      if (physicsOptions.shapeType === 'sphere') {
        const radius = Math.max(dimensions.x, dimensions.y, dimensions.z) / 2;
        shape = new this.Ammo.btSphereShape(radius);
      } else if (physicsOptions.shapeType === 'cylinder') {
        const radius = Math.max(dimensions.x, dimensions.z) / 2;
        shape = new this.Ammo.btCylinderShape(
          new this.Ammo.btVector3(radius, dimensions.y / 2, radius)
        );
      } else {
        shape = new this.Ammo.btBoxShape(
          new this.Ammo.btVector3(dimensions.x / 2, dimensions.y / 2, dimensions.z / 2)
        );
      }

      const transform = new this.Ammo.btTransform();
      transform.setIdentity();

      // Set initial position
      const pos = model.position;
      transform.setOrigin(new this.Ammo.btVector3(pos.x, pos.y, pos.z));

      // Set initial rotation
      const quat = model.quaternion;
      transform.setRotation(new this.Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

      const motionState = new this.Ammo.btDefaultMotionState(transform);
      const localInertia = new this.Ammo.btVector3(0, 0, 0);

      // Calculate proper inertia based on mass
      const mass = physicsOptions.mass || 0.1;
      if (mass > 0) {
        shape.calculateLocalInertia(mass, localInertia);
      }

      const rbInfo = new this.Ammo.btRigidBodyConstructionInfo(
        mass,
        motionState,
        shape,
        localInertia
      );

      const body = new this.Ammo.btRigidBody(rbInfo);

      // Set physics properties
      body.setRestitution(physicsOptions.restitution || 0.7);
      body.setFriction(physicsOptions.friction || 0.5);
      body.setDamping(
        physicsOptions.linearDamping || 0.1,
        physicsOptions.angularDamping || 0.1
      );

      // Add constraints if specified
      if (physicsOptions.constraints) {
        this.addConstraints(body, physicsOptions.constraints);
      }

      this.physicsWorld.addRigidBody(body);
      model.userData.physicsBody = body;

      // Store cleanup function
      model.userData.cleanupPhysics = () => {
        if (body) {
          this.physicsWorld.removeRigidBody(body);
          this.Ammo.destroy(body);
          this.Ammo.destroy(shape);
          this.Ammo.destroy(motionState);
          this.Ammo.destroy(rbInfo);
        }
      };

      console.log('✅ Physics added to model:', model.uuid);
    } catch (error) {
      console.error('❌ Error adding physics to model:', error);
    }
  }

  addConstraints(body, constraints) {
    try {
      constraints.forEach(constraint => {
        let constraintObj;

        switch (constraint.type) {
          case 'point':
            // Point to point constraint (e.g., for pendants)
            constraintObj = new this.Ammo.btPoint2PointConstraint(
              body,
              new this.Ammo.btVector3(constraint.pivotA.x, constraint.pivotA.y, constraint.pivotA.z)
            );
            break;

          case 'hinge':
            // Hinge constraint (e.g., for earrings)
            constraintObj = new this.Ammo.btHingeConstraint(
              body,
              new this.Ammo.btVector3(constraint.pivotA.x, constraint.pivotA.y, constraint.pivotA.z),
              new this.Ammo.btVector3(constraint.axisA.x, constraint.axisA.y, constraint.axisA.z),
              true
            );
            break;

          case 'slider':
            // Slider constraint (e.g., for adjustable necklaces)
            constraintObj = new this.Ammo.btSliderConstraint(
              body,
              new this.Ammo.btTransform(),
              true
            );
            constraintObj.setLowerLinLimit(constraint.lowerLimit || -1);
            constraintObj.setUpperLinLimit(constraint.upperLimit || 1);
            break;
        }

        if (constraintObj) {
          this.physicsWorld.addConstraint(constraintObj, true);
        }
      });
    } catch (error) {
      console.error('❌ Error adding constraints:', error);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Update physics
    if (this.physicsWorld) {
      this.physicsWorld.stepSimulation(delta, 10);

      // Update object positions based on physics
      this.models.forEach((model) => {
        if (model.userData.physicsBody) {
          const motionState = model.userData.physicsBody.getMotionState();
          if (motionState) {
            const transform = new this.Ammo.btTransform();
            motionState.getWorldTransform(transform);

            const origin = transform.getOrigin();
            const rotation = transform.getRotation();

            model.position.set(origin.x(), origin.y(), origin.z());
            model.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
          }
        }
      });
    }

    // Update animations
    this.mixers.forEach((mixer) => mixer.update(delta));

    // Update controls
    this.controls.update();

    // Render with post-processing
    if (this.postProcessing.composer) {
      this.postProcessing.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    // Update sparkle lights
    this.updateSparkleEffects(delta);
  }

  updateSparkleEffects(delta) {
    const sparkle1 = this.lights.get('sparkle1');
    const sparkle2 = this.lights.get('sparkle2');

    if (sparkle1 && sparkle2) {
      const time = Date.now() * 0.001;

      sparkle1.intensity = 0.5 + Math.sin(time * 2) * 0.3;
      sparkle2.intensity = 0.5 + Math.cos(time * 2) * 0.3;
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.postProcessing.composer) {
      this.postProcessing.composer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  // API for jewelry try-on
  async tryOnJewelry(modelPath, options = {}) {
    try {
      console.log('👗 Trying on jewelry:', options.id);

      let model = this.models.get(options.id);

      // Load model if not already loaded
      if (!model) {
        model = await this.loadModel(modelPath, {
          id: options.id,
          position: options.position,
          rotation: options.rotation,
          scale: options.scale,
          physics: options.physics,
          material: options.material
        });
      }

      if (!model) {
        throw new Error('Failed to load model');
      }

      // Apply smooth transition to new position
      const currentPos = model.position.clone();
      const targetPos = new THREE.Vector3(
        options.position.x,
        options.position.y,
        options.position.z
      );

      const currentRot = model.rotation.clone();
      const targetRot = new THREE.Euler(
        options.rotation.x,
        options.rotation.y,
        options.rotation.z
      );

      // Create animation for smooth transition
      const duration = options.duration || 1000; // ms
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easing function
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // Interpolate position
        model.position.lerpVectors(currentPos, targetPos, eased);

        // Interpolate rotation
        model.rotation.x = THREE.MathUtils.lerp(currentRot.x, targetRot.x, eased);
        model.rotation.y = THREE.MathUtils.lerp(currentRot.y, targetRot.y, eased);
        model.rotation.z = THREE.MathUtils.lerp(currentRot.z, targetRot.z, eased);

        // Update physics body position
        if (model.userData.physicsBody) {
          const transform = new this.Ammo.btTransform();
          model.userData.physicsBody.getMotionState().getWorldTransform(transform);
          transform.setOrigin(new this.Ammo.btVector3(
            model.position.x,
            model.position.y,
            model.position.z
          ));
          transform.setRotation(new this.Ammo.btQuaternion(
            model.quaternion.x,
            model.quaternion.y,
            model.quaternion.z,
            model.quaternion.w
          ));
          model.userData.physicsBody.setWorldTransform(transform);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Play sparkle animation when transition completes
          const sparkleAnimation = this.animations.get('sparkle');
          if (sparkleAnimation) {
            sparkleAnimation.play();
          }

          // Add glowing effect
          if (options.glow) {
            this.addGlowEffect(model);
          }
        }
      };

      animate();

      return model;
    } catch (error) {
      console.error('❌ Error trying on jewelry:', error);
      throw error;
    }
  }

  addGlowEffect(model) {
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        // Store original material
        child.userData.originalMaterial = child.material.clone();

        // Create glowing material
        const glowMaterial = new THREE.MeshStandardMaterial({
          ...child.material,
          emissive: new THREE.Color(0xffffcc),
          emissiveIntensity: 0.5,
          toneMapped: false
        });

        // Animate glow intensity
        const startTime = Date.now();
        const animateGlow = () => {
          const elapsed = (Date.now() - startTime) / 1000;
          glowMaterial.emissiveIntensity = 0.5 + Math.sin(elapsed * 2) * 0.3;
          requestAnimationFrame(animateGlow);
        };

        child.material = glowMaterial;
        animateGlow();
      }
    });
  }

  // Advanced material effects
  updateMaterialProperties(jewelryId, properties) {
    const model = this.models.get(jewelryId);
    if (!model) return;

    model.traverse((child) => {
      if (child.isMesh && child.material) {
        Object.assign(child.material, properties);
        child.material.needsUpdate = true;
      }
    });
  }

  removeModel(modelId) {
    try {
      const model = this.models.get(modelId);
      if (!model) {
        console.warn(`⚠️ Model ${modelId} not found`);
        return;
      }

      // Remove from scene
      this.scene.remove(model);

      // Clean up physics if present
      if (model.userData.cleanupPhysics) {
        model.userData.cleanupPhysics();
      }

      // Clean up animations if present
      const mixer = this.mixers.get(model.uuid);
      if (mixer) {
        mixer.stopAllAction();
        mixer.uncacheRoot(model);
        this.mixers.delete(model.uuid);
      }

      // Clean up materials
      model.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            // Restore original material if it exists
            if (child.userData.originalMaterial) {
              child.material.dispose();
              child.material = child.userData.originalMaterial;
            } else {
              child.material.dispose();
            }
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        }
      });

      // Remove from models map
      this.models.delete(modelId);

      console.log('✅ Model removed successfully:', modelId);
    } catch (error) {
      console.error('❌ Error removing model:', error);
    }
  }
}; 