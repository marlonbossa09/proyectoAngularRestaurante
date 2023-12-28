import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AmbientLight } from 'three';

@Component({
  selector: 'app-modelo3d',
  template: '<div id="modelo3D"></div>',
})
export class Modelo3DComponent implements OnInit, OnDestroy {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private modelo: any | THREE.Object3D;

  constructor(private ngZone: NgZone) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Adjust the aspect ratio
    this.renderer = new THREE.WebGLRenderer({ alpha: true }); // Set alpha to true for a transparent background
  }

  ngOnInit() {
    this.init();
    this.loadModel();
    this.animate();
  }

  ngOnDestroy() {
    // No se necesita disposición especial sin OrbitControls
  }

  private init() {
    // Configurar la cámara y el renderizador
    this.camera.position.z = 2;
    this.renderer.setSize(window.innerWidth, window.innerHeight * 0.8);

    const ambientLight = new AmbientLight(0xffffff, 0.5); // Luz ambiental
    this.scene.add(ambientLight);

    // Agregar el renderizador al contenedor HTML
    const contenedor = document.getElementById('modelo3D');
    contenedor!.appendChild(this.renderer.domElement);

    // Ajustar el tamaño del renderizador al contenedor
    this.renderer.setSize(contenedor!.clientWidth, contenedor!.clientHeight);
  }

  private loadModel() {
    // Cargar y agregar el modelo 3D aquí
    const loader = new GLTFLoader();
    loader.load('assets/img/pizza.glb', (gltf) => {
      this.modelo = gltf.scene;
      this.modelo.rotation.x = Math.PI / 3;
      this.modelo.position.set(0, 0.3, 0);
      this.modelo.scale.set(3, 3, 3);
      this.scene.add(this.modelo);
    });
  }

  private animate() {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);

        // Agregar rotación al modelo
        if (this.modelo) {
          this.modelo.rotation.y += 0.001; // Ajusta la velocidad de rotación según tus necesidades
        }

        this.renderer.render(this.scene, this.camera);
      };

      animateFn();
    });
  }
}
