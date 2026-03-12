import React, { useEffect, useRef, useState } from 'react';
import { X, Camera } from 'lucide-react';
import './VirtualTryOn.css';

const VirtualTryOn = ({ isOpen, onClose, product }) => {
    const [isCameraReady, setIsCameraReady] = useState(false);
    const containerRef = useRef(null);
    const arSystemRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            if (arSystemRef.current) {
                try {
                    arSystemRef.current.stop();
                    const renderer = arSystemRef.current.renderer;
                    if (renderer) {
                        renderer.setAnimationLoop(null);
                        renderer.dispose();
                    }
                } catch (e) {
                    console.error("Error stopping AR", e);
                }
            }
            setIsCameraReady(false);
            return;
        }

        let isRunning = true;

        const startAR = async () => {
            if (!containerRef.current || !isRunning) return;

            try {
                // Ensure dynamic imports to avoid SSR/build issues
                const { MindARThree } = await import('mind-ar/dist/mindar-face-three.prod.js');
                const THREE = await import('three');
                const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

                if (!isRunning) return;

                const mindarThree = new MindARThree({
                    container: containerRef.current,
                });
                arSystemRef.current = mindarThree;

                const { renderer, scene, camera } = mindarThree;

                // Lights
                const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
                scene.add(light);
                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                directionalLight.position.set(0.5, 0, 0.866);
                scene.add(directionalLight);

                // Face Anchor (168 = nose)
                const anchor = mindarThree.addAnchor(168);

                const loader = new GLTFLoader();
                loader.load('https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/glasses/scene.gltf', (gltf) => {
                    if (!isRunning) return;
                    const glasses = gltf.scene;
                    glasses.scale.set(0.008, 0.008, 0.008);
                    glasses.position.set(0, -0.05, -0.15);
                    anchor.group.add(glasses);
                });

                await mindarThree.start();
                if (!isRunning) {
                    mindarThree.stop();
                    return;
                }

                setIsCameraReady(true);

                // Render Loop
                renderer.setAnimationLoop(() => {
                    renderer.render(scene, camera);
                });

            } catch (err) {
                console.error("Error initializing AR:", err);
            }
        };

        const timeoutId = setTimeout(startAR, 200);

        return () => {
            isRunning = false;
            clearTimeout(timeoutId);
            if (arSystemRef.current) {
                try {
                    arSystemRef.current.stop();
                    const renderer = arSystemRef.current.renderer;
                    if (renderer) {
                        renderer.setAnimationLoop(null);
                        renderer.dispose();
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="vto-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="vto-container">
                <div className="vto-header">
                    <h3 className="vto-title">
                        <Camera size={20} />
                        Essayage 3D - {product?.name || "Lunettes"}
                    </h3>
                    <button className="vto-close-btn" onClick={onClose} aria-label="Fermer l'essayage">
                        <X size={24} />
                    </button>
                </div>

                <div className="vto-video-container" ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
                    {!isCameraReady && (
                        <div className="vto-loading">
                            <div className="vto-loader-spinner"></div>
                            <p>Chargement du modèle 3D et de la caméra...</p>
                        </div>
                    )}
                    {/* MindAR will inject the <video> and <canvas> here automatically */}
                </div>

                <div className="vto-controls">
                    <div className="vto-info-badge">
                        Modèle de démonstration 3D. Bougez la tête.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualTryOn;
