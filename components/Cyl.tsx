import { Html, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide, Mesh } from "three";

const Cyl = () => {
    const tex = useTexture("/hero-img.webp");
    const cyl = useRef<Mesh>(null);
    useFrame((state, delta) => {
        if (cyl.current) {
            cyl.current.rotation.y += delta;
        }
    });

    return (
        <group rotation={[0, 1.4, 0.2]}>
            <mesh ref={cyl}>
                <cylinderGeometry args={[1, 1, 1, 80, 10, true]} />
                <meshStandardMaterial transparent map={tex} side={DoubleSide} />
            </mesh>
        </group>
    );
};

export default Cyl;
