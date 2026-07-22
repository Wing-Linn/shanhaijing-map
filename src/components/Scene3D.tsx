import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { mountains, regions, type Mountain } from '../data/shanhaijing';

interface Scene3DProps {
  selectedMountain: Mountain | null;
  onSelectMountain: (m: Mountain | null) => void;
  hoveredRegion: string | null;
  filterRegion: string | null;
  searchTerm: string;
}

const regionColors: Record<string, number> = {
  nan: 0x2d8a4e,
  xi: 0xc9a227,
  bei: 0x3b6ea5,
  dong: 0x2d8a8a,
  zhong: 0xa23838,
};

export default function Scene3D({
  selectedMountain,
  onSelectMountain,
  hoveredRegion,
  filterRegion,
  searchTerm,
}: Scene3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mountainMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const animationRef = useRef<number>(0);

  const [cameraTarget, setCameraTarget] = useState(new THREE.Vector3(0, 0, 0));
  const [cameraDistance, setCameraDistance] = useState(35);
  const [cameraAngleH, setCameraAngleH] = useState(Math.PI * 0.25);
  const [cameraAngleV, setCameraAngleV] = useState(Math.PI * 0.3);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredMountain, setHoveredMountain] = useState<string | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0, angleH: 0, angleV: 0 });

  // Initialize scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a14);
    scene.fog = new THREE.FogExp2(0x0a0a14, 0.012);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      200
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambient = new THREE.AmbientLight(0x4a4a6a, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffe8c0, 1.2);
    dirLight.position.set(20, 30, 10);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x6080a0, 0.5);
    rimLight.position.set(-20, 10, -10);
    scene.add(rimLight);

    // Stars background
    const starGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 80 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Ground plane - ancient map style
    const groundGeo = new THREE.PlaneGeometry(60, 60, 80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a28,
      roughness: 0.9,
      metalness: 0.1,
      wireframe: false,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    scene.add(ground);

    // Wireframe overlay for terrain feel
    const wireGeo = new THREE.PlaneGeometry(60, 60, 40, 40);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x3a3a5a,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.rotation.x = -Math.PI / 2;
    wireMesh.position.y = 0;
    scene.add(wireMesh);

    // Central sea (circular water body)
    const seaGeo = new THREE.CircleGeometry(3, 64);
    const seaMat = new THREE.MeshStandardMaterial({
      color: 0x1a3a5a,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.7,
    });
    const sea = new THREE.Mesh(seaGeo, seaMat);
    sea.rotation.x = -Math.PI / 2;
    sea.position.y = 0.05;
    scene.add(sea);

    // Region boundary rings
    regions.forEach((region, idx) => {
      const ringGeo = new THREE.RingGeometry(8 + idx * 4, 8.05 + idx * 4, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: regionColors[region.code],
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.02;
      scene.add(ring);
    });

    // Create mountains
    mountains.forEach((m) => {
      const group = new THREE.Group();
      const color = regionColors[m.regionCode];
      const height = m.height;

      // Mountain cone
      const coneGeo = new THREE.ConeGeometry(1.2, height, 6);
      const coneMat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.3,
        flatShading: true,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.y = height / 2;
      group.add(cone);

      // Glow ring at base
      const glowGeo = new THREE.RingGeometry(1.5, 2.5, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = 0.1;
      group.add(glow);

      // Floating marker (sphere on top)
      const markerGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.y = height + 0.8;
      marker.userData.isMarker = true;
      group.add(marker);

      // Light beam
      const beamGeo = new THREE.CylinderGeometry(0.05, 0.15, height + 1, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = (height + 1) / 2;
      group.add(beam);

      group.position.set(m.position[0], m.position[1], m.position[2]);
      group.userData = { mountainId: m.id, mountain: m, baseY: m.position[1] };
      scene.add(group);
      mountainMeshesRef.current.set(m.id, group);
    });

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Rotate stars slowly
      stars.rotation.y += 0.0003;

      // Animate mountain markers (floating)
      const time = Date.now() * 0.001;
      mountainMeshesRef.current.forEach((group) => {
        const marker = group.children[2];
        if (marker) {
          marker.position.y = group.userData.baseY + (group.userData.mountain as Mountain).height + 0.8 + Math.sin(time + group.position.x) * 0.15;
        }
        // Pulse glow
        const glow = group.children[1];
        if (glow) {
          const mat = glow as THREE.Mesh;
          (mat.material as THREE.MeshBasicMaterial).opacity = 0.2 + Math.sin(time * 2 + group.position.z) * 0.1;
        }
      });

      // Update camera
      const x = cameraTarget.x + cameraDistance * Math.sin(cameraAngleH) * Math.cos(cameraAngleV);
      const z = cameraTarget.z + cameraDistance * Math.cos(cameraAngleH) * Math.cos(cameraAngleV);
      const y = cameraTarget.y + cameraDistance * Math.sin(cameraAngleV);
      camera.position.lerp(new THREE.Vector3(x, y, z), 0.1);
      camera.lookAt(cameraTarget);

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update camera target when selected mountain changes
  useEffect(() => {
    if (selectedMountain) {
      setCameraTarget(new THREE.Vector3(
        selectedMountain.position[0],
        selectedMountain.position[1] + 1,
        selectedMountain.position[2]
      ));
      setCameraDistance(12);
    } else {
      setCameraTarget(new THREE.Vector3(0, 0, 0));
      setCameraDistance(35);
    }
  }, [selectedMountain]);

  // Highlight selected/hovered mountains
  useEffect(() => {
    mountainMeshesRef.current.forEach((group, id) => {
      const isSelected = selectedMountain?.id === id;
      const isHovered = hoveredMountain === id;
      const cone = group.children[0] as THREE.Mesh;
      if (cone) {
        const mat = cone.material as THREE.MeshStandardMaterial;
        if (isSelected) {
          mat.emissive = new THREE.Color(regionColors[(group.userData.mountain as Mountain).regionCode]);
          mat.emissiveIntensity = 0.5;
          group.scale.setScalar(1.3);
        } else if (isHovered) {
          mat.emissive = new THREE.Color(regionColors[(group.userData.mountain as Mountain).regionCode]);
          mat.emissiveIntensity = 0.3;
          group.scale.setScalar(1.15);
        } else {
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0;
          group.scale.setScalar(1);
        }
      }
    });
  }, [selectedMountain, hoveredMountain]);

  // Apply region filter
  useEffect(() => {
    mountainMeshesRef.current.forEach((group, id) => {
      void id;
      const m = group.userData.mountain as Mountain;
      let visible = true;
      if (filterRegion && m.regionCode !== filterRegion) visible = false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchName = m.name.toLowerCase().includes(term);
        const matchCreature = m.creatures.some(c => c.name.toLowerCase().includes(term));
        const matchDesc = m.description.toLowerCase().includes(term);
        if (!matchName && !matchCreature && !matchDesc) visible = false;
      }
      group.visible = visible;
    });
  }, [filterRegion, searchTerm]);

  // Mouse interaction
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      angleH: cameraAngleH,
      angleV: cameraAngleV,
    };
  }, [cameraAngleH, cameraAngleV]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setCameraAngleH(dragStartRef.current.angleH - dx * 0.005);
      setCameraAngleV(Math.max(0.1, Math.min(Math.PI * 0.48, dragStartRef.current.angleV + dy * 0.005)));
    } else {
      // Raycast for hover
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const meshes: THREE.Object3D[] = [];
      mountainMeshesRef.current.forEach(g => {
        if (g.visible) meshes.push(g.children[2]); // marker
      });
      const intersects = raycasterRef.current.intersectObjects(meshes);
      if (intersects.length > 0) {
        const parent = intersects[0].object.parent;
        if (parent && parent.userData.mountainId) {
          setHoveredMountain(parent.userData.mountainId);
          mountRef.current.style.cursor = 'pointer';
        }
      } else {
        setHoveredMountain(null);
        mountRef.current.style.cursor = 'grab';
      }
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    setCameraDistance(prev => Math.max(8, Math.min(60, prev + e.deltaY * 0.02)));
  }, []);

  const handleClick = useCallback(() => {
    if (hoveredMountain) {
      const m = mountains.find(m => m.id === hoveredMountain);
      if (m) onSelectMountain(m);
    }
  }, [hoveredMountain, onSelectMountain]);

  // Region hover effect
  useEffect(() => {
    if (!hoveredRegion) return;
    mountainMeshesRef.current.forEach((group) => {
      const m = group.userData.mountain as Mountain;
      if (m.regionCode === hoveredRegion) {
        const cone = group.children[0] as THREE.Mesh;
        if (cone) {
          const mat = cone.material as THREE.MeshStandardMaterial;
          mat.emissive = new THREE.Color(regionColors[m.regionCode]);
          mat.emissiveIntensity = 0.2;
        }
      }
    });
  }, [hoveredRegion]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onClick={handleClick}
      style={{ cursor: 'grab' }}
    />
  );
}
