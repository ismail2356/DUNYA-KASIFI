import React, { useRef, useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import ExpoTHREE, { loadAsync } from 'expo-three';
import * as THREE from 'three';
import {
  AmbientLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  DirectionalLight,
} from 'three';

const EiffelTowerGLB = ({ rotation = { x: 0, y: 0, z: 0 }, style }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sceneRef = useRef();
  const rendererRef = useRef();
  const modelRef = useRef();
  const frameId = useRef();
  const lastRotation = useRef({ x: 0, y: 0, z: 0 });

  const onContextCreate = async (gl) => {
    try {
      console.log('🗼 Starting GLB Eiffel Tower loading...');
      
      const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

      // Renderer setup
      const renderer = new Renderer({ gl });
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      rendererRef.current = renderer;

      // Scene setup
      const scene = new Scene();
      sceneRef.current = scene;

      // Camera setup - optimized for La Tour Eiffel model
      const camera = new PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(4, 3, 6);
      camera.lookAt(0, 1, 0);

      // Enhanced Lighting
      const ambientLight = new AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(5, 8, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const pointLight = new PointLight(0xffffcc, 0.8, 15);
      pointLight.position.set(-4, 4, 4);
      scene.add(pointLight);

      // Load GLB model using different approach
      try {
        console.log('📁 Loading GLB file...');
        
        // Try loading with require directly - LA TOUR EIFFEL MODEL
        const modelUri = require('../../assets/models/free__la_tour_eiffel.glb');
        console.log('📍 La Tour Eiffel Model URI:', modelUri);
        
        const gltf = await loadAsync(modelUri);
        console.log('✅ GLTF loaded:', gltf);
        
        if (gltf && gltf.scene) {
          const model = gltf.scene;
          console.log('🎯 Model scene extracted:', model);
          
          // Auto-scale model to fit nicely (5.4MB optimized model)
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 3.5 / maxDim; // Target size of 3.5 units for optimal view
          
          model.scale.set(scale, scale, scale);
          
          // Center model
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center.multiplyScalar(scale));
          model.position.y = -1; // Optimal position for viewing
          
          // Enhance materials and optimize for high-quality model
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                // Optimize materials for mobile performance
                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => {
                    if (mat.map) mat.map.generateMipmaps = false;
                    mat.needsUpdate = true;
                  });
                } else {
                  if (child.material.map) child.material.map.generateMipmaps = false;
                  child.material.needsUpdate = true;
                }
              }
            }
          });
          
          scene.add(model);
          modelRef.current = model;
          console.log('🎉 Model added to scene successfully');
          setIsLoading(false);
          
        } else {
          throw new Error('GLTF scene is empty or invalid');
        }

      } catch (gltfError) {
        console.error('❌ GLB loading failed:', gltfError);
        setError('GLB model loading failed: ' + gltfError.message);
        setIsLoading(false);
        return;
      }

      // Render loop
      let lastRenderTime = 0;
      const targetFPS = 30;
      const frameInterval = 1000 / targetFPS;
      
      const render = (currentTime) => {
        if (currentTime - lastRenderTime >= frameInterval) {
          if (modelRef.current) {
            // Update rotation smoothly
            const rotationChanged = 
              Math.abs(rotation.x - lastRotation.current.x) > 0.01 ||
              Math.abs(rotation.y - lastRotation.current.y) > 0.01 ||
              Math.abs(rotation.z - lastRotation.current.z) > 0.01;
            
            if (rotationChanged) {
              modelRef.current.rotation.x = rotation.x;
              modelRef.current.rotation.y = rotation.y;
              modelRef.current.rotation.z = rotation.z;
              lastRotation.current = { ...rotation };
            }
          }
          
          renderer.render(scene, camera);
          gl.endFrameEXP();
          lastRenderTime = currentTime;
        }
        frameId.current = requestAnimationFrame(render);
      };
      render(performance.now());

    } catch (error) {
      console.error('💥 Context creation failed:', error);
      setError('3D Context creation failed: ' + error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        sceneRef.current.clear();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <View style={style}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={onContextCreate}
      />
      {(isLoading || error) && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}>
          {isLoading && !error && (
            <>
              <ActivityIndicator size="large" color="#3498db" />
              <Text style={{ color: '#FFFFFF', marginTop: 10, fontSize: 16, fontWeight: 'bold' }}>
                🗼 La Tour Eiffel Yükleniyor...
              </Text>
              <Text style={{ color: '#CCCCCC', marginTop: 5, fontSize: 12, textAlign: 'center' }}>
                5.4MB Optimize Edilmiş Model ⚡
              </Text>
              <Text style={{ color: '#FFD700', marginTop: 3, fontSize: 10, textAlign: 'center' }}>
                Fransız Mimarisi Hazırlanıyor 🇫🇷
              </Text>
            </>
          )}
          {error && (
            <>
              <Text style={{ color: '#FF6B6B', marginTop: 10, fontSize: 16, fontWeight: 'bold' }}>
                ⚠️ Model yüklenemedi
              </Text>
              <Text style={{ color: '#CCCCCC', marginTop: 5, fontSize: 12, textAlign: 'center' }}>
                {error}
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default EiffelTowerGLB; 