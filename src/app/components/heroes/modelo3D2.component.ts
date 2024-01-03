import { Component, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

@Component({
  selector: 'app-modelo3d2',
  template: '<div id="modelo3D2"></div>',
})
export class Modelo3D2Component implements OnInit, OnDestroy {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  constructor(private ngZone: NgZone) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  ngOnInit() {
    this.init();
    this.animate();
  }

  ngOnDestroy() {
    this.controls.dispose();
  }

  private init() {

    const light = new THREE.AmbientLight();
    this.scene.add(light);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Configura las limitaciones del zoom
    this.controls.minDistance = 200; // Distancia mínima de acercamiento
    this.controls.maxDistance = 410;   // Distancia máxima de alejamiento
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = Math.PI / 4;
    this.controls.minAzimuthAngle = Math.PI / -7;
   this.controls.maxAzimuthAngle = Math.PI / 8;

    // Cargar y agregar el modelo 3D aquí
    const loader = new GLTFLoader();
    loader.load('assets/img/barrioChino.glb', (gltf) => {
      const modelo: any = gltf.scene;
      modelo.position.set(0, -60, 0);
      modelo.scale.set(0.5, 0.5, 0.5);
    // modelo.rotation.x = Math.PI / 8;
      this.scene.add(modelo);
    });

    // Configurar la cámara y el renderizador
    this.camera.position.z = 390;
    const screenWidth = window.innerWidth;

    if (screenWidth <= 480) {
      this.renderer.setSize(screenWidth, screenWidth * 0.8);
    } else {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Agregar el renderizador al contenedor HTML
    const contenedor = document.getElementById('modelo3D2');
    contenedor!.appendChild(this.renderer.domElement);

    // Ajustar el tamaño del renderizador al contenedor
    this.renderer.setSize(contenedor!.clientWidth, contenedor!.clientHeight);

  }


  private animate() {
    this.ngZone.runOutsideAngular(() => {
      let moveDirection = 1; // Dirección inicial

      const animateFn = () => {
        requestAnimationFrame(animateFn);

        // Mueve la cámara horizontalmente en cada fotograma
        this.camera.position.x += 1 * moveDirection; // Ajusta la velocidad según tus necesidades

        // Verifica los límites y cambia la dirección si es necesario
        if (this.camera.position.x >= 100 || this.camera.position.x <= -100) {
          moveDirection *= -1;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      };

      animateFn();
    });
  }
}
