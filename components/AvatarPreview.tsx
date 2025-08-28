import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import type { AvatarItem } from '../types';

interface AvatarPreviewProps {
  equippedItems: AvatarItem[];
}

const AvatarPreview: React.FC<AvatarPreviewProps> = ({ equippedItems }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const avatarRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cleanup function for Three.js resources
  const cleanup = useCallback(() => {
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Clean up scene objects
    if (sceneRef.current) {
      sceneRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Dispose geometry
          if (child.geometry) {
            child.geometry.dispose();
          }
          
          // Dispose materials
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => {
                if (material.map) material.map.dispose();
                if (material.normalMap) material.normalMap.dispose();
                if (material.roughnessMap) material.roughnessMap.dispose();
                if (material.metalnessMap) material.metalnessMap.dispose();
                material.dispose();
              });
            } else {
              if (child.material.map) child.material.map.dispose();
              if (child.material.normalMap) child.material.normalMap.dispose();
              if (child.material.roughnessMap) child.material.roughnessMap.dispose();
              if (child.material.metalnessMap) child.material.metalnessMap.dispose();
              child.material.dispose();
            }
          }
        }
      });
      
      // Clear the scene
      sceneRef.current.clear();
      sceneRef.current = null;
    }

    // Dispose renderer
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current.forceContextLoss();
      
      // Remove canvas from DOM
      if (mountRef.current && rendererRef.current.domElement.parentNode) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      rendererRef.current = null;
    }

    // Reset refs
    cameraRef.current = null;
    avatarRef.current = null;
  }, []);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
    
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1f2937); // gray-800
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 3);
      cameraRef.current = camera;

      // Renderer setup with error handling
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      
      if (!renderer.getContext()) {
        throw new Error('WebGL not supported');
      }

      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputEncoding = THREE.sRGBEncoding;
      rendererRef.current = renderer;

      mountRef.current.appendChild(renderer.domElement);

      // Lighting setup
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024; // Reduced for performance
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.camera.near = 0.1;
      directionalLight.shadow.camera.far = 50;
      scene.add(directionalLight);

      // Create basic avatar geometry
      const avatarGroup = new THREE.Group();
      avatarRef.current = avatarGroup;
      scene.add(avatarGroup);

      // Basic avatar body
      const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4f46e5 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0;
      body.castShadow = true;
      body.userData = { type: 'body' };
      avatarGroup.add(body);

      // Head
      const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const headMaterial = new THREE.MeshLambertMaterial({ color: 0xfdbcbc });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 0.85;
      head.castShadow = true;
      head.userData = { type: 'head' };
      avatarGroup.add(head);

      // Arms
      const armGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.8, 8);
      const armMaterial = new THREE.MeshLambertMaterial({ color: 0xfdbcbc });
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-0.45, 0.2, 0);
      leftArm.castShadow = true;
      avatarGroup.add(leftArm);

      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(0.45, 0.2, 0);
      rightArm.castShadow = true;
      avatarGroup.add(rightArm);

      // Legs
      const legGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.8, 8);
      const legMaterial = new THREE.MeshLambertMaterial({ color: 0x1e40af });
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.15, -1, 0);
      leftLeg.castShadow = true;
      avatarGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(0.15, -1, 0);
      rightLeg.castShadow = true;
      avatarGroup.add(rightLeg);

      // Ground plane for shadows
      const groundGeometry = new THREE.PlaneGeometry(10, 10);
      const groundMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x111827, 
        opacity: 0.5, 
        transparent: true 
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1.5;
      ground.receiveShadow = true;
      scene.add(ground);

      // Animation loop
      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate);
        
        if (avatarRef.current) {
          avatarRef.current.rotation.y += 0.01;
        }
        
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      
      animate();

      // Add resize listener
      window.addEventListener('resize', handleResize);
      
      setIsLoading(false);

    } catch (err) {
      console.error('Three.js initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize 3D preview');
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      cleanup();
    };
  }, [cleanup, handleResize]);

  // Update avatar based on equipped items
  useEffect(() => {
    if (!avatarRef.current || isLoading) return;

    try {
      // Find avatar parts
      const body = avatarRef.current.children.find(
        child => child.userData?.type === 'body'
      ) as THREE.Mesh;
      
      const head = avatarRef.current.children.find(
        child => child.userData?.type === 'head'
      ) as THREE.Mesh;

      if (body && body.material instanceof THREE.MeshLambertMaterial) {
        // Change body color based on equipped shirts
        const hasShirt = equippedItems.some(item => item.category === 'Shirts');
        body.material.color.setHex(hasShirt ? 0x059669 : 0x4f46e5);
      }

      if (head && head.material instanceof THREE.MeshLambertMaterial) {
        // Add visual indicator for hats
        const hasHat = equippedItems.some(item => item.category === 'Hats');
        head.material.color.setHex(hasHat ? 0xfbbf24 : 0xfdbcbc);
      }

      // TODO: Load actual 3D models for equipped items
      // This would involve loading GLB/GLTF files from equippedItems
      
    } catch (err) {
      console.error('Error updating avatar:', err);
    }
  }, [equippedItems, isLoading]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      equippedItems.forEach(item => {
        if (item.modelUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.modelUrl);
        }
      });
    };
  }, [equippedItems]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded-xl">
        <div className="text-center text-gray-400">
          <p className="text-lg font-semibold">3D Preview Error</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2">WebGL may not be supported</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full avatar-canvas relative" ref={mountRef}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 rounded-xl">
          <div className="text-center text-gray-400">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-indigo-500 mx-auto mb-4"></div>
            <p className="text-sm">Loading 3D Avatar...</p>
          </div>
        </div>
      )}
      
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 space-y-2">
        <button
          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
          onClick={() => {
            if (cameraRef.current) {
              cameraRef.current.position.set(0, 0, 3);
            }
          }}
          title="Reset Camera"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
        {equippedItems.length} items equipped
      </div>
    </div>
  );
};

export default React.memo(AvatarPreview);