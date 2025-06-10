import React, { useRef, useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import {
  AmbientLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  DirectionalLight,
  BoxGeometry,
  ConeGeometry,
  MeshStandardMaterial,
  Mesh,
  Group,
} from 'three';

const SimpleEiffelTower3D = ({ rotation = { x: 0, y: 0, z: 0 }, style }) => {
  const [isLoading, setIsLoading] = useState(true);
  const sceneRef = useRef();
  const rendererRef = useRef();
  const modelRef = useRef();
  const frameId = useRef();
  const lastRotation = useRef({ x: 0, y: 0, z: 0 });

  const createEiffelTower = () => {
    const tower = new Group();
    
    // Eyfel Kulesi metalik rengi
    const ironColor = 0x8B7355;
    const darkIronColor = 0x5D4E37;
    const lightIronColor = 0xA0896B;
    
    // Base platform (Kaide)
    const basePlatformGeometry = new BoxGeometry(3, 0.2, 3);
    const basePlatformMaterial = new MeshStandardMaterial({ 
      color: 0x666666,
      metalness: 0.3,
      roughness: 0.7
    });
    const basePlatform = new Mesh(basePlatformGeometry, basePlatformMaterial);
    basePlatform.position.y = -2;
    tower.add(basePlatform);
    
    // Level 1 - Base legs (4 ayak)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const legGeometry = new BoxGeometry(0.15, 3, 0.15);
      const legMaterial = new MeshStandardMaterial({ 
        color: ironColor,
        metalness: 0.6,
        roughness: 0.4
      });
      const leg = new Mesh(legGeometry, legMaterial);
      
      const radius = 1.2;
      leg.position.x = Math.cos(angle) * radius;
      leg.position.z = Math.sin(angle) * radius;
      leg.position.y = -0.5;
      
      // Legs tilt inward
      leg.rotation.z = Math.cos(angle) * 0.2;
      leg.rotation.x = Math.sin(angle) * 0.2;
      
      tower.add(leg);
    }
    
    // Level 1 - Cross braces (Çapraz destekler)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const braceGeometry = new BoxGeometry(1.5, 0.08, 0.08);
      const braceMaterial = new MeshStandardMaterial({ 
        color: darkIronColor,
        metalness: 0.7,
        roughness: 0.3
      });
      const brace = new Mesh(braceGeometry, braceMaterial);
      
      brace.position.y = -1 + (i * 0.3);
      brace.rotation.y = angle;
      tower.add(brace);
    }
    
    // Level 1 Platform
    const platform1Geometry = new BoxGeometry(2.2, 0.15, 2.2);
    const platform1Material = new MeshStandardMaterial({ 
      color: darkIronColor,
      metalness: 0.5,
      roughness: 0.6
    });
    const platform1 = new Mesh(platform1Geometry, platform1Material);
    platform1.position.y = 1;
    tower.add(platform1);
    
    // Level 2 - Middle section
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const legGeometry = new BoxGeometry(0.12, 2.5, 0.12);
      const legMaterial = new MeshStandardMaterial({ 
        color: ironColor,
        metalness: 0.6,
        roughness: 0.4
      });
      const leg = new Mesh(legGeometry, legMaterial);
      
      const radius = 0.8;
      leg.position.x = Math.cos(angle) * radius;
      leg.position.z = Math.sin(angle) * radius;
      leg.position.y = 2.25;
      
      // Slight inward tilt
      leg.rotation.z = Math.cos(angle) * 0.15;
      leg.rotation.x = Math.sin(angle) * 0.15;
      
      tower.add(leg);
    }
    
    // Level 2 Platform
    const platform2Geometry = new BoxGeometry(1.4, 0.12, 1.4);
    const platform2Material = new MeshStandardMaterial({ 
      color: darkIronColor,
      metalness: 0.5,
      roughness: 0.6
    });
    const platform2 = new Mesh(platform2Geometry, platform2Material);
    platform2.position.y = 3.5;
    tower.add(platform2);
    
    // Level 3 - Top section
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const legGeometry = new BoxGeometry(0.08, 1.8, 0.08);
      const legMaterial = new MeshStandardMaterial({ 
        color: lightIronColor,
        metalness: 0.6,
        roughness: 0.4
      });
      const leg = new Mesh(legGeometry, legMaterial);
      
      const radius = 0.4;
      leg.position.x = Math.cos(angle) * radius;
      leg.position.z = Math.sin(angle) * radius;
      leg.position.y = 4.4;
      
      // More inward tilt
      leg.rotation.z = Math.cos(angle) * 0.25;
      leg.rotation.x = Math.sin(angle) * 0.25;
      
      tower.add(leg);
    }
    
    // Top platform
    const topPlatformGeometry = new BoxGeometry(0.6, 0.08, 0.6);
    const topPlatformMaterial = new MeshStandardMaterial({ 
      color: darkIronColor,
      metalness: 0.5,
      roughness: 0.6
    });
    const topPlatform = new Mesh(topPlatformGeometry, topPlatformMaterial);
    topPlatform.position.y = 5.3;
    tower.add(topPlatform);
    
    // Final spire (Son kısım)
    const spireGeometry = new ConeGeometry(0.15, 0.8, 8);
    const spireMaterial = new MeshStandardMaterial({ 
      color: lightIronColor,
      metalness: 0.8,
      roughness: 0.2
    });
    const spire = new Mesh(spireGeometry, spireMaterial);
    spire.position.y = 5.7;
    tower.add(spire);
    
    // Top antenna (Anten)
    const antennaGeometry = new BoxGeometry(0.02, 0.6, 0.02);
    const antennaMaterial = new MeshStandardMaterial({ 
      color: 0x333333,
      metalness: 0.9,
      roughness: 0.1
    });
    const antenna = new Mesh(antennaGeometry, antennaMaterial);
    antenna.position.y = 6.4;
    tower.add(antenna);
    
    // Add some decorative elements
    for (let level = 0; level < 3; level++) {
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const decorGeometry = new BoxGeometry(0.03, 0.3, 0.03);
        const decorMaterial = new MeshStandardMaterial({ 
          color: darkIronColor,
          metalness: 0.7,
          roughness: 0.3
        });
        const decor = new Mesh(decorGeometry, decorMaterial);
        
        const radius = 1.5 - (level * 0.4);
        decor.position.x = Math.cos(angle) * radius;
        decor.position.z = Math.sin(angle) * radius;
        decor.position.y = -1 + (level * 2.5);
        
        decor.rotation.y = angle;
        decor.rotation.z = 0.2;
        
        tower.add(decor);
      }
    }
    
    return tower;
  };

  const onContextCreate = async (gl) => {
    try {
      console.log('Creating Simple Eiffel Tower...');
      
      const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
      const sceneColor = 0x000000;

      // Renderer setup
      const renderer = new Renderer({ gl });
      renderer.setSize(width, height);
      renderer.setClearColor(sceneColor, 0);
      renderer.shadowMap.enabled = true;
      rendererRef.current = renderer;

      // Scene setup
      const scene = new Scene();
      sceneRef.current = scene;

      // Camera setup
      const camera = new PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(4, 3, 6);
      camera.lookAt(0, 1, 0);

      // Lighting setup - More dramatic for Eiffel Tower
      const ambientLight = new AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);

      // Main directional light (simulating sun)
      const directionalLight = new DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(5, 8, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      // Secondary light for depth
      const pointLight = new PointLight(0xffffcc, 0.6, 15);
      pointLight.position.set(-4, 4, 4);
      scene.add(pointLight);

      // Accent light from below (dramatic effect)
      const bottomLight = new PointLight(0xffd700, 0.3, 8);
      bottomLight.position.set(0, -1, 0);
      scene.add(bottomLight);

      // Create Eiffel Tower
      const tower = createEiffelTower();
      scene.add(tower);
      modelRef.current = tower;
      
      console.log('Simple Eiffel Tower created successfully');
      setIsLoading(false);

      // Render loop
      let lastRenderTime = 0;
      const targetFPS = 30;
      const frameInterval = 1000 / targetFPS;
      
      const render = (currentTime) => {
        if (currentTime - lastRenderTime >= frameInterval) {
          if (modelRef.current) {
            // Update rotation
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
      console.error('Error creating Simple Eiffel Tower:', error);
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
          <Text style={{ color: '#FFFFFF', marginTop: 10, fontSize: 16, fontWeight: 'bold' }}>
            🗼 Eyfel Kulesi inşa ediliyor...
          </Text>
        </View>
      )}
    </View>
  );
};

export default SimpleEiffelTower3D; 