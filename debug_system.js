// Debug System
window.debugSystem = {
  // Show debug overlay
  showDebugInfo: () => {
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) {
      debugInfo.style.display = 'block';
    }
  },

  // Update debug status
  updateStatus: (type, status, isError = false) => {
    const element = document.getElementById(`${type}Status`);
    if (element) {
      element.textContent = status;
      element.style.color = isError ? '#ff4444' : '#44ff44';
    }
  },

  // Check system status
  checkSystem: async () => {
    console.log('🔍 Checking system status...');

    // Check video element
    const video = document.getElementById('cameraFeed');
    if (!video) {
      console.error('❌ Video element not found');
      window.debugSystem.updateStatus('camera', 'Not found', true);
    } else {
      console.log('✅ Video element found');
      window.debugSystem.updateStatus('camera', 'Found');
    }

    // Check WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        throw new Error('WebGL not supported');
      }
      console.log('✅ WebGL supported');
      window.debugSystem.updateStatus('webgl', 'Supported');
    } catch (error) {
      console.error('❌ WebGL error:', error);
      window.debugSystem.updateStatus('webgl', 'Not supported', true);
    }

    // Check Three.js
    if (!window.THREE) {
      console.error('❌ Three.js not loaded');
      window.debugSystem.updateStatus('threejs', 'Not loaded', true);
    } else {
      console.log('✅ Three.js loaded');
      window.debugSystem.updateStatus('threejs', 'Loaded');
    }

    // Check camera access
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      console.log('✅ Camera access granted');
      window.debugSystem.updateStatus('camera', 'Access granted');
    } catch (error) {
      console.error('❌ Camera access error:', error);
      window.debugSystem.updateStatus('camera', 'Access denied', true);
    }
  },

  // Fix common issues
  fixIssues: () => {
    console.log('🔧 Attempting to fix issues...');

    // Try to fix video element
    const video = document.getElementById('cameraFeed');
    if (!video) {
      console.log('Creating missing video element...');
      const newVideo = document.createElement('video');
      newVideo.id = 'cameraFeed';
      newVideo.autoplay = true;
      newVideo.playsinline = true;
      newVideo.style.display = 'block';
      newVideo.style.width = '100%';
      newVideo.style.height = '100%';
      newVideo.style.objectFit = 'cover';

      const wrapper = document.querySelector('.camera-feed-wrapper-react');
      if (wrapper) {
        wrapper.insertBefore(newVideo, wrapper.firstChild);
        console.log('✅ Video element created');
      }
    }

    // Try to fix canvas
    const canvas = document.getElementById('jewelryCanvas');
    if (!canvas) {
      console.log('Creating missing canvas element...');
      const newCanvas = document.createElement('canvas');
      newCanvas.id = 'jewelryCanvas';
      newCanvas.style.position = 'absolute';
      newCanvas.style.top = '0';
      newCanvas.style.left = '0';
      newCanvas.style.width = '100%';
      newCanvas.style.height = '100%';

      const wrapper = document.querySelector('.camera-feed-wrapper-react');
      if (wrapper) {
        wrapper.appendChild(newCanvas);
        console.log('✅ Canvas element created');
      }
    }

    // Reload scripts if needed
    if (!window.THREE) {
      console.log('Reloading Three.js...');
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      document.head.appendChild(script);
    }

    // Initialize debug overlay
    const debugInfo = document.getElementById('debugInfo');
    if (!debugInfo) {
      console.log('Creating debug overlay...');
      const overlay = document.createElement('div');
      overlay.id = 'debugInfo';
      overlay.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        display: none;
      `;
      overlay.innerHTML = `
        <div>Camera Status: <span id="cameraStatus">Initializing...</span></div>
        <div>WebGL Status: <span id="webglStatus">Checking...</span></div>
        <div>3D System: <span id="threejsStatus">Loading...</span></div>
      `;

      const container = document.querySelector('.camera-feed-container');
      if (container) {
        container.appendChild(overlay);
        console.log('✅ Debug overlay created');
      }
    }
  },

  // Initialize debug system
  init: async () => {
    console.log('🔧 Initializing debug system...');

    // Show debug info
    window.debugSystem.showDebugInfo();

    // Fix any missing elements
    window.debugSystem.fixIssues();

    // Check system status
    await window.debugSystem.checkSystem();

    // Add debug commands to window
    window.debug = {
      check: window.debugSystem.checkSystem,
      fix: window.debugSystem.fixIssues,
      show: window.debugSystem.showDebugInfo
    };

    console.log('🔧 Debug commands available:');
    console.log('- window.debug.check() - Check system status');
    console.log('- window.debug.fix() - Try to fix issues');
    console.log('- window.debug.show() - Show debug overlay');
  }
};

// Initialize debug system
document.addEventListener('DOMContentLoaded', () => {
  window.debugSystem.init();
}); 