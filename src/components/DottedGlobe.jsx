import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import geoJsonData from './countries.geo.json';
import dotsData from './dotsData.json';
import IsuOverlay from './IsuOverlay';

// 100% Reliable dummy image
const DEMO_IMAGE = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80";

// Helper: Convert Lat/Lon to 3D Vector
const latLonToVector = (lat, lon, radius = 5) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
};

// Helper: Create Circle Texture
const createCircleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
};

// Smoothly Moving Highlight Component
const MovingHighlight = ({ targetPosition, color, size, texture }) => {
    const meshRef = useRef();
    const materialRef = useRef();
    const currentPos = useRef(new THREE.Vector3(0, 0, 0));
    const [isInitialized, setIsInitialized] = useState(false);

    useFrame((state, delta) => {
        if (!meshRef.current || !materialRef.current) return;

        // Smoothly glide towards target or fade out if target is null
        if (targetPosition) {
            if (!isInitialized) {
                currentPos.current.copy(targetPosition);
                setIsInitialized(true);
            }

            // Calibrate damping based on zoom: slower (0.8) when zoomed in (dist=5), faster (2.5) when zoomed out (dist=20)
            const dist = state.camera.position.length();
            const t = Math.min(1, Math.max(0, (dist - 5) / (20 - 5)));
            const dynamicDamping = 0.8 + (2.5 - 0.8) * t;

            // Use dynamic damping for fluid, zoom-aware motion
            currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, targetPosition.x, dynamicDamping, delta);
            currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, targetPosition.y, dynamicDamping, delta);
            currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, targetPosition.z, dynamicDamping, delta);

            meshRef.current.geometry.attributes.position.array[0] = currentPos.current.x;
            meshRef.current.geometry.attributes.position.array[1] = currentPos.current.y;
            meshRef.current.geometry.attributes.position.array[2] = currentPos.current.z;
            meshRef.current.geometry.attributes.position.needsUpdate = true;

            materialRef.current.opacity = THREE.MathUtils.damp(materialRef.current.opacity, 1.0, 15, delta);
        } else {
            materialRef.current.opacity = THREE.MathUtils.damp(materialRef.current.opacity, 0.0, 15, delta);
            if (materialRef.current.opacity < 0.01) {
                setIsInitialized(false); // Reset initialization for next appearance
            }
        }
    });

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
        return geo;
    }, []);

    return (
        <points ref={meshRef}>
            <primitive object={geometry} attach="geometry" />
            <pointsMaterial
                ref={materialRef}
                size={size}
                color={color}
                map={texture}
                sizeAttenuation={false}
                transparent={true}
                alphaTest={0.01}
                opacity={0}
                depthTest={false}
            />
        </points>
    );
};

const GlobePoints = ({ points, lightsOn, hoveredIndex, selectedIndex, onPointClick, onPointHover, onGlobeHover }) => {
    const geometryRef = useRef();
    const materialRef = useRef();
    const highlightGeometryRef = useRef();
    const highlightMaterialRef = useRef();
    const circleTexture = useMemo(() => createCircleTexture(), []);
    const mouseDownPos = useRef({ x: 0, y: 0 });

    // Standard points color logic
    useEffect(() => {
        if (!geometryRef.current || points.length === 0) return;
        const colors = new Float32Array(points.length * 3);
        const colorStandard = new THREE.Color('white'); // Active white glow
        const colorDim = new THREE.Color('#555555'); // Brighter dull state for better visibility

        for (let i = 0; i < points.length; i++) {
            const hasData = points[i].hasData;
            const color = hasData ? colorStandard : colorDim;
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        geometryRef.current.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometryRef.current.attributes.color.needsUpdate = true;
    }, [points, lightsOn]);

    // Highlight layer logic (Render only selected dots statically)
    const selectedPointGeometry = useMemo(() => {
        if (selectedIndex === null) return null;

        const p = points[selectedIndex];
        const pos = new Float32Array([p.x, p.y, p.z]);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        return geo;
    }, [points, selectedIndex]);

    const geometry = useMemo(() => {
        if (points.length === 0) return null;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(points.length * 3);
        for (let i = 0; i < points.length; i++) {
            positions[i * 3] = points[i].x;
            positions[i * 3 + 1] = points[i].y;
            positions[i * 3 + 2] = points[i].z;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, [points]);

    useFrame((state) => {
        if (!materialRef.current) return;
        const dist = state.camera.position.length();
        const minD = 15, maxD = 40, minSize = 0.05, maxSize = 0.35;
        let targetSize = minSize;
        if (dist > minD) {
            const t = Math.min(1, (dist - minD) / (maxD - minD));
            targetSize = THREE.MathUtils.lerp(minSize, maxSize, t);
        }
        materialRef.current.size = targetSize;
    });

    if (!geometry) return null;

    return (
        <group
            onPointerEnter={() => onGlobeHover(true)}
            onPointerLeave={() => onGlobeHover(false)}
        >
            <mesh
                onPointerMove={(e) => {
                    e.stopPropagation();
                    if (points.length === 0) return;

                    const contactPoint = e.point;

                    // Stickiness factor: If we're already hovering a point and the mouse is still very close, don't change it.
                    // This prevents rapid jittering in dense areas.
                    if (hoveredIndex !== null) {
                        const dSq = contactPoint.distanceSqTo(points[hoveredIndex]);
                        if (dSq < 0.005) return;
                    }

                    let minDist = Infinity;
                    let nearestIdx = -1;
                    for (let i = 0; i < points.length; i++) {
                        const d = contactPoint.distanceSqTo(points[i]);
                        if (d < minDist) {
                            minDist = d;
                            nearestIdx = i;
                        }
                    }
                    if (nearestIdx !== -1) onPointHover(nearestIdx);
                }}
            >
                <sphereGeometry args={[4.9, 32, 32]} />
                <meshBasicMaterial color="#000000" colorWrite={false} />
            </mesh>
            <points
                onPointerDown={(e) => {
                    mouseDownPos.current = { x: e.clientX, y: e.clientY };
                }}
                onPointerOver={(e) => {
                    // No stopPropagation to let group know we are still on globe
                    onPointHover(e.index);
                }}
                onPointerOut={(e) => {
                    // No stopPropagation
                    onPointHover(null);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (e.index !== undefined) {
                        // Calculate distance moved between down and up
                        const dist = Math.sqrt(
                            Math.pow(e.clientX - mouseDownPos.current.x, 2) +
                            Math.pow(e.clientY - mouseDownPos.current.y, 2)
                        );

                        // Only trigger if it's a real click (minimal movement), not a drag/rotate
                        if (dist < 5) {
                            // Use e.point for pixel-perfect intersection target
                            const precisePoint = e.point || points[e.index];
                            onPointClick(e.index, precisePoint, e);
                        }
                    }
                }}
            >
                <primitive object={geometry} attach="geometry" ref={geometryRef} />
                <pointsMaterial
                    ref={materialRef}
                    size={0.05}
                    map={circleTexture}
                    sizeAttenuation={true}
                    vertexColors={true}
                    transparent={true}
                    alphaTest={0.5}
                    opacity={1.0}
                />
            </points>

            {/* Persistent smoothly moving hover indicator */}
            <MovingHighlight
                targetPosition={hoveredIndex !== null ? points[hoveredIndex] : null}
                color="#006655"
                size={20}
                texture={circleTexture}
            />

            {/* Static selected highlight (Cyan) */}
            {selectedPointGeometry && (
                <points>
                    <primitive object={selectedPointGeometry} attach="geometry" />
                    <pointsMaterial
                        size={20}
                        color="#00ffcc"
                        map={circleTexture}
                        sizeAttenuation={false}
                        transparent={true}
                        alphaTest={0.5}
                        depthTest={false}
                    />
                </points>
            )}
        </group>
    );
};

// Camera Controller: Handles cinematic zoom to 5.05 distance
const CameraController = ({ targetPosition, isZoomed, onZoomComplete, isGlobeHovered, onProgress }) => {
    const { camera, gl } = useThree();
    const controlsRef = useRef();
    const mode = useRef('IDLE');
    const timer = useRef(0);
    const previousZoomed = useRef(isZoomed);
    const returnState = useRef({ position: new THREE.Vector3(0, 0, 20), target: new THREE.Vector3(0, 0, 0) });

    useEffect(() => {
        if (isZoomed && !previousZoomed.current) {
            // Capture exact current state before zooming
            if (controlsRef.current) {
                returnState.current.position.copy(camera.position);
                returnState.current.target.copy(controlsRef.current.target);
            }
            mode.current = 'ZOOMING';
            timer.current = 0;
        } else if (!isZoomed && previousZoomed.current) {
            mode.current = 'RESETTING';
            timer.current = 0;
        }
        previousZoomed.current = isZoomed;
    }, [isZoomed, camera]);

    useFrame((state, delta) => {
        if (!controlsRef.current) return;
        const controls = controlsRef.current;

        if (mode.current === 'ZOOMING' && targetPosition) {
            timer.current += delta;
            const damping = 1.8 * delta;
            const targetScalar = 7.5; // Restricted depth (was 5.05)
            const currentDist = camera.position.length();
            const initialDist = returnState.current.position.length();

            // Centering the target
            controls.target.lerp(targetPosition, damping);

            // Arc path: Lerp direction and distance separately
            const targetDir = targetPosition.clone().normalize();
            const currentDir = camera.position.clone().normalize();
            const nextDir = currentDir.lerp(targetDir, damping).normalize();
            const nextDist = THREE.MathUtils.lerp(currentDist, targetScalar, damping);

            camera.position.copy(nextDir.multiplyScalar(nextDist));

            const progress = Math.min(1, Math.max(0, (initialDist - nextDist) / (initialDist - targetScalar)));
            if (onProgress) onProgress(progress);

            const distToTarget = camera.position.distanceTo(targetDir.clone().multiplyScalar(targetScalar));
            const distToCenter = controls.target.distanceTo(targetPosition);

            // Snappy trigger: Use slightly looser thresholds + progress check to eliminate perceived lag
            if ((distToTarget < 0.3 && distToCenter < 0.2) || progress > 0.98 || timer.current > 2.8) {
                mode.current = 'IDLE';
                camera.position.copy(targetDir.multiplyScalar(targetScalar));
                controls.target.copy(targetPosition);
                if (onProgress) onProgress(1);
                if (onZoomComplete) onZoomComplete();
            }
        }
        else if (mode.current === 'RESETTING') {
            timer.current += delta;
            const dampingReset = 1.2 * delta; // Slower, smoother return (was 3.0)
            const { position: defaultPos, target: defaultTarget } = returnState.current;
            const currentDist = camera.position.length();
            const currentDir = camera.position.clone().normalize();
            const defaultDist = defaultPos.length();
            const defaultDir = defaultPos.clone().normalize();

            controls.target.lerp(defaultTarget, dampingReset);

            const nextDir = currentDir.lerp(defaultDir, dampingReset).normalize();
            const nextDist = THREE.MathUtils.lerp(currentDist, defaultDist, dampingReset);
            camera.position.copy(nextDir.multiplyScalar(nextDist));

            const distToDefault = camera.position.distanceTo(defaultPos);
            const progress = Math.max(0, distToDefault / 7);
            if (onProgress) onProgress(progress);

            if (distToDefault < 0.05 || timer.current > 3.5) {
                mode.current = 'IDLE';
                camera.position.copy(defaultPos);
                controls.target.copy(defaultTarget);
                if (onProgress) onProgress(0);
            }
        }
        controls.update();
    });

    return (
        <OrbitControls
            ref={controlsRef}
            enabled={mode.current === 'IDLE'}
            enablePan={false}
            enableZoom={mode.current === 'IDLE'}
            enableKeys={false}
            minDistance={6.0} // Prevent manual clipping (was 4.0)
            maxDistance={50}
            autoRotate={mode.current === 'IDLE'} // Continuous orbit whenever not animating (even if zoomed)
            autoRotateSpeed={isGlobeHovered ? 0 : 0.7}
            dampingFactor={0.1}
        />
    );
};

const DottedGlobe = () => {
    const [points, setPoints] = useState([]);
    const [lightsOn] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isGlobeHovered, setIsGlobeHovered] = useState(false);
    const [focusTarget, setFocusTarget] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [clickOrigin, setClickOrigin] = useState({ x: '50%', y: '50%' });
    const [zoomProgress, setZoomProgress] = useState(0); // 0 = home, 1 = zoomed-in
    const [selectedData, setSelectedData] = useState(null);

    const handlePointClick = (index, point, event = null) => {
        // Only trigger if the dot has data
        if (!points[index].hasData) return;

        setSelectedIndex(index);
        setFocusTarget(new THREE.Vector3(point.x, point.y, point.z));
        setSelectedData(points[index].data);

        // Capture origin for "bloom" expansion
        if (event && (event.clientX || event.nativeEvent?.clientX)) {
            const e = event.nativeEvent || event;
            setClickOrigin({ x: `${e.clientX}px`, y: `${e.clientY}px` });
        } else {
            // Default expansion from center if triggered via keyboard
            setClickOrigin({ x: '50%', y: '50%' });
        }
    };

    const handleZoomComplete = () => {
        setShowOverlay(true);
    };

    const handleCloseOverlay = () => {
        setShowOverlay(false);
        setSelectedIndex(null);
        setFocusTarget(null);
        setSelectedData(null);
    };

    // Keyboard Navigation logic
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (points.length === 0) return;

            // Activate hover mode if any navigation key is pressed
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
                setIsGlobeHovered(true);
            }

            if (e.key === 'Enter') {
                if (hoveredIndex !== null) handlePointClick(hoveredIndex, points[hoveredIndex], null);
                return;
            }

            const currentIdx = hoveredIndex !== null ? hoveredIndex : (selectedIndex !== null ? selectedIndex : 0);
            const p = points[currentIdx];
            let bestIdx = currentIdx;
            let minDist = Infinity;

            const searchDir = (other) => {
                const dLat = other.lat - p.lat;
                const dLon = ((other.lon - p.lon + 540) % 360) - 180; // Corrected lon diff for wrap-around

                if (e.key === 'ArrowUp') return dLat > 0 ? { val: dLat * 2 + Math.abs(dLon), valid: true } : { valid: false };
                if (e.key === 'ArrowDown') return dLat < 0 ? { val: Math.abs(dLat) * 2 + Math.abs(dLon), valid: true } : { valid: false };
                if (e.key === 'ArrowRight') return dLon > 0 ? { val: Math.abs(dLon) + Math.abs(dLat) * 2, valid: true } : { valid: false };
                if (e.key === 'ArrowLeft') return dLon < 0 ? { val: Math.abs(dLon) + Math.abs(dLat) * 2, valid: true } : { valid: false };
                return { valid: false };
            };

            for (let i = 0; i < points.length; i++) {
                if (i === currentIdx) continue;
                const result = searchDir(points[i]);
                if (result.valid && result.val < minDist) {
                    minDist = result.val;
                    bestIdx = i;
                }
            }

            if (bestIdx !== currentIdx) {
                e.preventDefault();
                setHoveredIndex(bestIdx);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [points, hoveredIndex, selectedIndex]);

    // Toggle body class for cursor management
    useEffect(() => {
        if (isGlobeHovered) {
            document.body.classList.add('no-cursor');
        } else {
            document.body.classList.remove('no-cursor');
            setHoveredIndex(null); // Clear hover when leaving globe
        }
    }, [isGlobeHovered]);

    // Change cursor style based on dot hover
    useEffect(() => {
        if (isGlobeHovered) {
            document.body.style.cursor = hoveredIndex !== null ? 'pointer' : 'default';
        }
        return () => { if (!isGlobeHovered) document.body.style.cursor = 'auto'; };
    }, [hoveredIndex, isGlobeHovered]);

    useEffect(() => {
        if (!geoJsonData || !geoJsonData.features) return;
        setTimeout(() => {
            const w = 1000; const h = 500;
            const offCanvas = document.createElement('canvas');
            offCanvas.width = w; offCanvas.height = h;
            const ctx = offCanvas.getContext('2d', { willReadFrequently: true });
            ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, w, h);
            geoJsonData.features.forEach(feature => {
                ctx.fillStyle = '#ffffff'; ctx.beginPath();
                const drawPoly = (coords) => {
                    coords.forEach((c, i) => {
                        const x = ((c[0] + 180) / 360) * w;
                        const y = ((90 - c[1]) / 180) * h;
                        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                    });
                    ctx.closePath();
                };
                if (feature.geometry.type === 'Polygon') { drawPoly(feature.geometry.coordinates[0]); ctx.fill(); }
                else if (feature.geometry.type === 'MultiPolygon') { feature.geometry.coordinates.forEach(poly => { drawPoly(poly[0]); ctx.fill(); }); }
            });
            const imgData = ctx.getImageData(0, 0, w, h).data;
            const newPoints = []; const step = 3.5;
            for (let y = 0; y < h; y += step) {
                const lat = 90 - (y / h) * 180;
                if (lat < -55 || lat > 87) continue;
                const circumference = Math.cos(lat * Math.PI / 180);
                const safeCirc = Math.max(0.15, circumference);
                const stepX = step / safeCirc;
                const offsetX = (y / step) % 2 === 0 ? 0 : stepX / 2;
                for (let x = 0; x < w; x += stepX) {
                    let scanX = Math.floor(x + offsetX);
                    if (scanX >= w) scanX -= w;
                    const idx = (Math.floor(y) * w + scanX) * 4;
                    if (imgData[idx] > 128) {
                        const lon = (scanX / w) * 360 - 180;
                        const vec = latLonToVector(lat, lon, 5);

                        // Check if this dot matches any entry in dotsData.json
                        const dataMatch = dotsData.find(d => {
                            const dLat = Math.abs(d.lat - lat);
                            const dLon = Math.abs(d.lon - lon);
                            return dLat < 2.0 && dLon < 2.0; // Proximity matching
                        });

                        newPoints.push({
                            x: vec.x, y: vec.y, z: vec.z,
                            lat, lon,
                            hasData: !!dataMatch,
                            data: dataMatch || null
                        });
                    }
                }
            }
            setPoints(newPoints); setIsLoading(false);
        }, 10);
    }, []);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {isLoading && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
                    <div style={{ color: 'white' }}>Loading 3D Globe...</div>
                </div>
            )}
            <Canvas
                camera={{ position: [0, 0, 20], fov: 45, near: 0.01 }}
                gl={{ antialias: true, alpha: true }}
                style={{
                    filter: `blur(${zoomProgress * 6}px) brightness(${1 - zoomProgress * 0.3})`, // Persistent cinematic blur & slight dimming
                    transition: 'filter 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                }}
                onPointerMove={(e) => {
                    // Precision handling moved to GlobePoints
                }}
                onPointerLeave={() => {
                    // Precision handling moved to GlobePoints
                }}
            >
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={0.7} />
                {!isLoading && (
                    <>
                        <GlobePoints
                            points={points}
                            lightsOn={lightsOn}
                            hoveredIndex={hoveredIndex}
                            selectedIndex={selectedIndex}
                            onPointClick={(idx, p, e) => handlePointClick(idx, p, e)}
                            onPointHover={(idx) => setHoveredIndex(idx)}
                            onGlobeHover={(val) => setIsGlobeHovered(val)}
                        />
                        <CameraController
                            targetPosition={focusTarget}
                            isZoomed={!!focusTarget}
                            onZoomComplete={handleZoomComplete}
                            isGlobeHovered={isGlobeHovered}
                            onProgress={setZoomProgress}
                        />
                    </>
                )}
            </Canvas>

            <IsuOverlay
                isOpen={showOverlay}
                onClose={handleCloseOverlay}
                title={selectedData ? selectedData.title : "SYSTEM_NODE"}
                style={{
                    '--origin-x': clickOrigin.x, '--origin-y': clickOrigin.y,
                    width: '80%', maxWidth: '900px', height: '80%', maxHeight: '600px'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    {selectedData && (
                        <div style={{
                            position: 'relative',
                            padding: '10px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(0,255,204,0.2)',
                            borderRadius: '8px'
                        }}>
                            <img
                                src={selectedData.image}
                                alt={selectedData.title}
                                style={{
                                    width: '100%',
                                    maxHeight: '400px',
                                    display: 'block',
                                    borderRadius: '4px',
                                    filter: 'contrast(1.1) saturate(1.1)'
                                }}
                            />
                            {/* Technical Overlay Tag */}
                            <div style={{
                                position: 'absolute',
                                bottom: '20px',
                                right: '20px',
                                background: 'rgba(0, 255, 204, 0.8)',
                                color: '#000',
                                padding: '4px 8px',
                                fontSize: '10px',
                                fontWeight: '900',
                                fontFamily: 'monospace',
                                borderRadius: '2px'
                            }}>
                                SOURCE: DATA_CORE_01
                            </div>
                        </div>
                    )}
                    {!selectedData && <div style={{ color: 'rgba(255,255,255,0.5)' }}>NO VISUAL DATA AVAILABLE</div>}
                </div>
            </IsuOverlay>
        </div>
    );
};

export default DottedGlobe;
