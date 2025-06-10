import React, { useRef, useEffect, useState } from 'react';
import { View, Dimensions, ActivityIndicator, Text } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, loadAsync } from 'expo-three';
import {
  AmbientLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  DirectionalLight,
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
} from 'three';
import { Asset } from 'expo-asset';

const EiffelTower3D = ({ rotation = { x: 0, y: 0, z: 0 }, style }) => {
  const [isLoading, setIsLoading] = useState(true);
  const sceneRef = useRef();
  const rendererRef = useRef();
  const modelRef = useRef();
  const frameId = useRef();
  const lastRotation = useRef({ x: 0, y: 0, z: 0 });

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = 0x000000;

    // Renderer setup
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor, 0); // Transparent background
    rendererRef.current = renderer;

    // Scene setup
    const scene = new Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Lighting setup
    const ambientLight = new AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const pointLight = new PointLight(0xffffff, 0.8, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    try {
      console.log('Starting 3D model loading...');
      
      // Load the 3D model
      const asset = Asset.fromModule(require('../../assets/models/eiffel_tower.glb'));
      console.log('Asset created:', asset);
      
      await asset.downloadAsync();
      console.log('Asset downloaded, URI:', asset.uri);
      
      const gltf = await loadAsync(asset.uri);
      console.log('GLTF loaded successfully:', gltf);
      
      const model = gltf.scene;
      console.log('Model extracted from scene:', model);
      
      // Scale and position the model
      model.scale.set(0.8, 0.8, 0.8);
      model.position.set(0, -1, 0);
      
      // Center the model
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      scene.add(model);
      modelRef.current = model;
      console.log('Model added to scene successfully');
      setIsLoading(false);

      // Render loop with throttling
      let lastRenderTime = 0;
      const targetFPS = 30; // Limit to 30 FPS
      const frameInterval = 1000 / targetFPS;
      
      const render = (currentTime) => {
        if (currentTime - lastRenderTime >= frameInterval) {
          if (modelRef.current) {
            // Only update rotation if it changed significantly
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
      console.error('Error loading 3D model:', error);
      console.error('Error details:', error.message, error.stack);
      
      // Fallback: Create a simple Eiffel Tower-like structure
      console.log('Creating fallback geometry...');
      try {
        const geometry = new BoxGeometry(0.5, 3, 0.5);
        const material = new MeshStandardMaterial({ color: 0x8B4513 });
        const tower = new Mesh(geometry, material);
        
        tower.position.set(0, 0, 0);
        scene.add(tower);
        modelRef.current = tower;
        console.log('Fallback tower created successfully');
        
        setIsLoading(false);

        // Render loop with throttling
        let lastRenderTime = 0;
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;
        
        const render = (currentTime) => {
          if (currentTime - lastRenderTime >= frameInterval) {
            if (modelRef.current) {
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
        
      } catch (fallbackError) {
        console.error('Fallback creation failed:', fallbackError);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      
      // Clean up Three.js objects
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
      {isLoading && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={{ color: '#FFFFFF', marginTop: 10 }}>
            Eyfel Kulesi yükleniyor...
          </Text>
        </View>
      )}
    </View>
  );
};

export default EiffelTower3D; 