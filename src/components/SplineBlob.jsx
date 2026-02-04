import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useTheme } from '../context/ThemeContext';

const SplineBlob = () => {
    const { currentTheme } = useTheme();
    const blobRef = useRef();

    useFrame((state) => {
        if (blobRef.current) {
            // Slow rotation
            blobRef.current.rotation.x += 0.005;
            blobRef.current.rotation.y += 0.005;
        }
    });

    return (
        <Sphere ref={blobRef} args={[1, 100, 200]} scale={2}>
            <MeshDistortMaterial
                color={currentTheme.colors.primary}
                attach="material"
                distort={0.5} // Strength of distortion
                speed={2} // Speed of distortion
                roughness={0.2}
                metalness={0.9} // Shiny/metallic look like Spline
                wireframe={false}
            />
        </Sphere>
    );
};

export default SplineBlob;
