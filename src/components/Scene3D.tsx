import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { mountains, type Mountain } from '../data/shanhaijing';

interface Scene3DProps {
  selectedMountain: Mountain | null;
  onSelectMountain: (m: Mountain | null) => void;
  hoveredRegion: string | null;
  filterRegion: string | null;
  searchTerm: string;
}

// Jade-green mountain color palette — deep teal with dark outlines like 青绿山水
const MOUNTAIN_COLORS = {
  primary: 0x1a5c4a,   // deep jade
  mid:     0x246b54,   // mid jade
  light:   0x2d8a6a,   // lighter jade
  dark:    0x0d3328,   // shadow jade
  peak:    0x0a2218,   // near-black peak
  gold:    0xd4a42a,   // gold accent
  goldBright: 0xf0cc5a, // bright gold
};

// Per-region gold tint color for markers
const regionGold: Record<string, number> = {
  nan:   0xe8c85a,
  xi:    0xf0cc5a,
  bei:   0xc8b878,
  dong:  0xd4e890,
  zhong: 0xf0a830,
};

// Layered mountain profile: build a complex mountain shape from stacked cones
function buildMountainGroup(m: Mountain): THREE.Group {
  const group = new THREE.Group();
  const h = m.height;
  const gold = regionGold[m.regionCode] ?? 0xf0cc5a;

  // Dark rock base
  const baseGeo = new THREE.CylinderGeometry(1.8, 2.2, 0.4, 7, 1, false);
  const baseMat = new THREE.MeshStandardMaterial({ color: MOUNTAIN_COLORS.dark, roughness: 1, flatShading: true });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.2;
  group.add(base);

  // Lower body — wide dark cone
  const lowerGeo = new THREE.ConeGeometry(1.8, h * 0.45, 6, 1);
  const lowerMat = new THREE.MeshStandardMaterial({ color: MOUNTAIN_COLORS.dark, roughness: 0.95, flatShading: true });
  const lower = new THREE.Mesh(lowerGeo, lowerMat);
  lower.position.y = 0.4 + h * 0.225;
  group.add(lower);

  // Mid body — jade green main mass
  const midGeo = new THREE.ConeGeometry(1.3, h * 0.5, 6, 1);
  const midMat = new THREE.MeshStandardMaterial({ color: MOUNTAIN_COLORS.primary, roughness: 0.8, metalness: 0.05, flatShading: true });
  const mid = new THREE.Mesh(midGeo, midMat);
  mid.position.y = 0.4 + h * 0.4 + h * 0.25;
  mid.rotation.y = Math.PI / 6;
  group.add(mid);

  // Secondary peak — offset
  const peak2Geo = new THREE.ConeGeometry(0.7, h * 0.35, 5, 1);
  const peak2Mat = new THREE.MeshStandardMaterial({ color: MOUNTAIN_COLORS.mid, roughness: 0.75, flatShading: true });
  const peak2 = new THREE.Mesh(peak2Geo, peak2Mat);
  peak2.position.set(0.8, 0.4 + h * 0.3, -0.3);
  peak2.rotation.y = Math.PI / 4;
  group.add(peak2);

  // Upper peak — lighter jade
  const upperGeo = new THREE.ConeGeometry(0.9, h * 0.4, 6, 1);
  const upperMat = new THREE.MeshStandardMaterial({ color: MOUNTAIN_COLORS.mid, roughness: 0.7, metalness: 0.1, flatShading: true });
  const upper = new THREE.Mesh(upperGeo, upperMat);
  upper.position.y = 0.4 + h * 0.62 + h * 0.2;
  upper.rotation.y = Math.PI / 3;
  group.add(upper);

  // Summit — near black tip
  const tipGeo = new THREE.ConeGeometry(0.35, h * 0.22, 5, 1);
  const tipMat = new THREE.MeshStandardMaterial({ color: MOUNTAIN_COLORS.peak, roughness: 0.9, flatShading: true });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.position.y = 0.4 + h * 0.88 + h * 0.11;
  group.add(tip);

  // Gold light beacon on summit
  const beaconGeo = new THREE.SphereGeometry(0.18, 12, 12);
  const beaconMat = new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.95 });
  const beacon = new THREE.Mesh(beaconGeo, beaconMat);
  beacon.position.y = 0.4 + h + 0.5;
  beacon.userData.isBeacon = true;
  group.add(beacon); // index 6

  // Gold beam rising from peak
  const beamGeo = new THREE.CylinderGeometry(0.03, 0.18, h * 0.6, 6);
  const beamMat = new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.25 });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.y = 0.4 + h * 0.75;
  group.add(beam); // index 7

  // Subtle golden halo ring at base
  const haloGeo = new THREE.RingGeometry(2.0, 3.5, 48);
  const haloMat = new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.05;
  group.add(halo); // index 8

  group.userData = { mountainId: m.id, mountain: m, baseBeaconY: 0.4 + h + 0.5 };
  return group;
}

// Cloud puff: cluster of spheres
function buildCloud(x: number, y: number, z: number, scale: number): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xf8f5ee, roughness: 1, transparent: true, opacity: 0.82 });

  const offsets: [number, number, number, number][] = [
    [0, 0, 0, 1],
    [-1.4, -0.3, 0.3, 0.75],
    [1.3, -0.2, -0.2, 0.8],
    [0.5, 0.4, 0.8, 0.65],
    [-0.6, 0.3, -0.7, 0.6],
    [2.2, -0.4, 0.1, 0.55],
    [-2.0, -0.3, -0.2, 0.5],
  ];

  offsets.forEach(([ox, oy, oz, r]) => {
    const geo = new THREE.SphereGeometry(r * scale, 8, 6);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(ox * scale, oy * scale, oz * scale);
    group.add(mesh);
  });

  group.position.set(x, y, z);
  return group;
}

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
  const cloudGroupsRef = useRef<THREE.Group[]>([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const animationRef = useRef<number>(0);

  const [cameraTarget, setCameraTarget] = useState(new THREE.Vector3(0, 0, 0));
  const [cameraDistance, setCameraDistance] = useState(38);
  const [cameraAngleH, setCameraAngleH] = useState(Math.PI * 0.15);
  const [cameraAngleV, setCameraAngleV] = useState(Math.PI * 0.28);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredMountain, setHoveredMountain] = useState<string | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0, angleH: 0, angleV: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    // Cream-gold sky gradient via background color + fog
    scene.background = new THREE.Color(0xe8e0cc);
    scene.fog = new THREE.FogExp2(0xd4cbb8, 0.018);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      52,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      200
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.shadowMap.enabled = false;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ─── Lighting — warm golden sun from upper right ───────────────────────
    const ambient = new THREE.AmbientLight(0xfff0d0, 1.0);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xffeaa0, 2.2);
    sunLight.position.set(30, 40, -15);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xc8e8d0, 0.6);
    fillLight.position.set(-20, 8, 20);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd080, 0.8);
    rimLight.position.set(0, 20, -30);
    scene.add(rimLight);

    // ─── Sky gradient plane (distant backdrop) ─────────────────────────────
    const skyGeo = new THREE.PlaneGeometry(300, 120);
    const skyMat = new THREE.MeshBasicMaterial({ color: 0xf5eedc, side: THREE.DoubleSide });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.position.set(0, 25, -80);
    scene.add(sky);

    // ─── Ground: misty pale earth ──────────────────────────────────────────
    const groundGeo = new THREE.PlaneGeometry(100, 100, 60, 60);
    // Slight height variation for organic feel
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const d = Math.sqrt(x * x + z * z);
      pos.setZ(i, Math.sin(x * 0.3) * 0.2 + Math.cos(z * 0.25) * 0.15 - d * 0.003);
    }
    groundGeo.computeVertexNormals();
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xc8d4c0,
      roughness: 1,
      metalness: 0,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    scene.add(ground);

    // ─── Central misty lake ────────────────────────────────────────────────
    const lakeGeo = new THREE.CircleGeometry(4.5, 64);
    const lakeMat = new THREE.MeshStandardMaterial({
      color: 0x9bbcb8,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.6,
    });
    const lake = new THREE.Mesh(lakeGeo, lakeMat);
    lake.rotation.x = -Math.PI / 2;
    lake.position.y = -0.4;
    scene.add(lake);

    // ─── Mountains ────────────────────────────────────────────────────────
    mountains.forEach((m) => {
      const group = buildMountainGroup(m);
      group.position.set(m.position[0], m.position[1] - 0.5, m.position[2]);
      scene.add(group);
      mountainMeshesRef.current.set(m.id, group);
    });

    // ─── Cloud layers at multiple heights ─────────────────────────────────
    const cloudData: [number, number, number, number][] = [
      // x, y, z, scale
      [-12, 2.5, -4, 1.4],
      [8, 3, -6, 1.2],
      [-4, 2, 8, 1.6],
      [14, 2.5, 2, 1.0],
      [-8, 4, -12, 1.3],
      [2, 3.5, -14, 1.5],
      [-18, 2, 4, 1.1],
      [18, 3, -8, 1.3],
      [0, 3, 14, 1.4],
      [-6, 2.5, 16, 1.2],
      [10, 4.5, 10, 1.0],
      [-14, 3.5, 6, 1.1],
      [4, 2, -18, 1.3],
      [22, 2.5, 4, 0.9],
      [-20, 3, -6, 1.0],
      [6, 5, -10, 0.8],
      [-2, 2, -16, 1.2],
      [16, 3.5, 8, 0.9],
    ];
    cloudData.forEach(([x, y, z, s]) => {
      const cloud = buildCloud(x, y, z, s);
      scene.add(cloud);
      cloudGroupsRef.current.push(cloud);
    });

    // Floating high clouds (more ethereal, above mountains)
    const highClouds: [number, number, number, number][] = [
      [-5, 7.5, -3, 0.9],
      [7, 8, 1, 0.7],
      [-10, 9, 5, 0.8],
      [2, 10, -8, 0.6],
      [12, 7, -5, 0.75],
    ];
    highClouds.forEach(([x, y, z, s]) => {
      const cloud = buildCloud(x, y, z, s);
      // Make high clouds more transparent
      cloud.children.forEach(c => {
        ((c as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = 0.55;
      });
      scene.add(cloud);
      cloudGroupsRef.current.push(cloud);
    });

    // ─── Golden sun disc in sky ────────────────────────────────────────────
    const sunGeo = new THREE.CircleGeometry(4, 48);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(28, 30, -60);
    scene.add(sun);

    // Outer glow ring
    const sunGlow = new THREE.RingGeometry(4, 9, 48);
    const sunGlowMat = new THREE.MeshBasicMaterial({ color: 0xffd860, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
    const sunGlowMesh = new THREE.Mesh(sunGlow, sunGlowMat);
    sunGlowMesh.position.set(28, 30, -60);
    scene.add(sunGlowMesh);

    // ─── Animate ──────────────────────────────────────────────────────────
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Drift clouds slowly
      cloudGroupsRef.current.forEach((cloud, i) => {
        cloud.position.x += Math.sin(time * 0.06 + i * 1.2) * 0.003;
        cloud.position.y += Math.sin(time * 0.1 + i * 0.7) * 0.001;
      });

      // Animate beacons — float + pulse
      mountainMeshesRef.current.forEach((group) => {
        const beacon = group.children[6] as THREE.Mesh;
        if (beacon) {
          beacon.position.y = group.userData.baseBeaconY + Math.sin(time * 1.4 + group.position.x * 0.5) * 0.18;
          const mat = beacon.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.75 + Math.sin(time * 2.2 + group.position.z * 0.8) * 0.2;
        }
        // Pulse halo
        const halo = group.children[8] as THREE.Mesh;
        if (halo) {
          const mat = halo.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.08 + Math.sin(time * 1.5 + group.position.x) * 0.06;
        }
        // Pulse beam
        const beam = group.children[7] as THREE.Mesh;
        if (beam) {
          const mat = beam.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.15 + Math.sin(time * 1.8 + group.position.z) * 0.1;
        }
      });

      // Smooth camera
      const x = cameraTarget.x + cameraDistance * Math.sin(cameraAngleH) * Math.cos(cameraAngleV);
      const z = cameraTarget.z + cameraDistance * Math.cos(cameraAngleH) * Math.cos(cameraAngleV);
      const y = cameraTarget.y + cameraDistance * Math.sin(cameraAngleV);
      camera.position.lerp(new THREE.Vector3(x, y, z), 0.08);
      camera.lookAt(cameraTarget);

      renderer.render(scene, camera);
    };
    animate();

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

  // Focus camera on selected mountain
  useEffect(() => {
    if (selectedMountain) {
      setCameraTarget(new THREE.Vector3(
        selectedMountain.position[0],
        selectedMountain.position[1] + 2,
        selectedMountain.position[2]
      ));
      setCameraDistance(14);
    } else {
      setCameraTarget(new THREE.Vector3(0, 0, 0));
      setCameraDistance(38);
    }
  }, [selectedMountain]);

  // Highlight selected / hovered
  useEffect(() => {
    mountainMeshesRef.current.forEach((group, id) => {
      const isSelected = selectedMountain?.id === id;
      const isHovered = hoveredMountain === id;
      // Affect mid-body (index 2) and upper (index 4)
      [2, 4].forEach(idx => {
        const mesh = group.children[idx] as THREE.Mesh;
        if (!mesh) return;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (isSelected) {
          mat.emissive = new THREE.Color(0x4aaa80);
          mat.emissiveIntensity = 0.45;
          group.scale.setScalar(1.25);
        } else if (isHovered) {
          mat.emissive = new THREE.Color(0x3a9070);
          mat.emissiveIntensity = 0.25;
          group.scale.setScalar(1.12);
        } else {
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0;
          group.scale.setScalar(1);
        }
      });
      // Amplify beacon on select
      const beacon = group.children[6] as THREE.Mesh;
      if (beacon) {
        const mat = beacon.material as THREE.MeshBasicMaterial;
        if (isSelected) {
          mat.color = new THREE.Color(0xffffff);
        } else {
          const gold = regionGold[(group.userData.mountain as Mountain).regionCode] ?? 0xf0cc5a;
          mat.color = new THREE.Color(gold);
        }
      }
    });
  }, [selectedMountain, hoveredMountain]);

  // Filter visibility
  useEffect(() => {
    mountainMeshesRef.current.forEach((group) => {
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

  // Region hover glow
  useEffect(() => {
    mountainMeshesRef.current.forEach((group) => {
      const m = group.userData.mountain as Mountain;
      [2, 4].forEach(idx => {
        const mesh = group.children[idx] as THREE.Mesh;
        if (!mesh) return;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (hoveredRegion && m.regionCode === hoveredRegion && selectedMountain?.id !== m.id) {
          mat.emissive = new THREE.Color(0x3a9070);
          mat.emissiveIntensity = 0.18;
        } else if (!hoveredRegion && selectedMountain?.id !== m.id && hoveredMountain !== m.id) {
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0;
        }
      });
    });
  }, [hoveredRegion, selectedMountain, hoveredMountain]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, angleH: cameraAngleH, angleV: cameraAngleV };
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
      setCameraAngleV(Math.max(0.08, Math.min(Math.PI * 0.46, dragStartRef.current.angleV + dy * 0.005)));
    } else {
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const beacons: THREE.Object3D[] = [];
      mountainMeshesRef.current.forEach(g => {
        if (g.visible && g.children[6]) beacons.push(g.children[6]);
      });
      const hits = raycasterRef.current.intersectObjects(beacons);
      if (hits.length > 0) {
        const parent = hits[0].object.parent;
        if (parent?.userData.mountainId) {
          setHoveredMountain(parent.userData.mountainId);
          mountRef.current.style.cursor = 'pointer';
        }
      } else {
        setHoveredMountain(null);
        mountRef.current.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    setCameraDistance(prev => Math.max(8, Math.min(65, prev + e.deltaY * 0.025)));
  }, []);

  const handleClick = useCallback(() => {
    if (hoveredMountain) {
      const m = mountains.find(m => m.id === hoveredMountain);
      if (m) onSelectMountain(m);
    }
  }, [hoveredMountain, onSelectMountain]);

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
