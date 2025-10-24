"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, ToneMapping } from "@react-three/postprocessing";
import Cyl from "./Cyl";

const Hero = () => {
    return (
        <>
            <Canvas flat camera={{ fov: 35 }}>
                <OrbitControls />
                <ambientLight />
                <Cyl />
                <EffectComposer>
                    <Bloom
                        mipmapBlur
                        intensity={5}
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.2}
                    />
                    <ToneMapping adaptive={0.001} />
                </EffectComposer>
            </Canvas>
            <div className="w-full h-full py-32">
                <h1 className="text-black">Welcome to my portfolio</h1>
            </div>
        </>
    );
};

export default Hero;
