import React, { useRef, useEffect } from 'react';
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

  useEffect(() => {
    if (!mountRef.current) return;

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

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create basic avatar geometry (placeholder since we don't have .glb files)
    const avatarGroup = new THREE.Group();
    avatarRef.current = avatarGroup;
    scene.add(avatarGroup);

    // Basic avatar body
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4f46e5 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;
    body.castShadow = true;
    avatarGroup.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xfdbcbc });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.85;
    head.castShadow = true;
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
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x111827, opacity: 0.5, transparent: true });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (avatarRef.current) {
        avatarRef.current.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update avatar based on equipped items
  useEffect(() => {
    if (!avatarRef.current) return;

    // This is where you would load and attach 3D models for equipped items
    // For now, we'll change colors based on equipped items as a visual indicator
    
    const body = avatarRef.current.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.CylinderGeometry && (child.geometry as THREE.CylinderGeometry).parameters.radiusTop === 0.3);
    const head = avatarRef.current.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry);
    
    if (body && body instanceof THREE.Mesh && body.material instanceof THREE.MeshLambertMaterial) {
      // Change body color based on equipped shirts
      const hasShirt = equippedItems.some(item => item.category === 'Shirts');
      body.material.color.setHex(hasShirt ? 0x059669 : 0x4f46e5);
    }

    if (head && head instanceof THREE.Mesh && head.material instanceof THREE.MeshLambertMaterial) {
      // Add visual indicator for hats
      const hasHat = equippedItems.some(item => item.category === 'Hats');
      head.material.color.setHex(hasHat ? 0xfbbf24 : 0xfdbcbc);
    }

  }, [equippedItems]);

  return (
    <div className="w-full h-full avatar-canvas" ref={mountRef}>
      {/* Loading state or fallback */}
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-sm">Loading 3D Avatar...</p>
      </div>
    </div>
  );
};

export default AvatarPreview;