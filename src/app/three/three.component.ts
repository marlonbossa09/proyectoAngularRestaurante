import { Component, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

@Component({
  selector: 'app-three',
   template: '<div id="three"></div>',
  styleUrls: ['./three.component.css']
})
export class ThreeComponent {
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

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

  // Configura las limitaciones del zoom
  this.controls.minDistance = 0.02; // Distancia mínima de acercamiento
  this.controls.maxDistance = 5;   // Distancia máxima de alejamiento
  this.controls.maxPolarAngle = Math.PI / 2;
  this.controls.minPolarAngle = Math.PI / 4;
  this.controls.minAzimuthAngle = Math.PI / 8;
this.controls.maxAzimuthAngle = Math.PI / 1.5;

    // Cargar y agregar el modelo 3D aquí
    const loader = new GLTFLoader();
    loader.load('assets/img/restaurantePlaya.glb', (gltf) => {
      const modelo: any = gltf.scene;
      modelo.position.set(0, 0, 0);
      modelo.scale.set(1, 1, 1);
      this.scene.add(modelo);
    });

    // Configurar la cámara y el renderizador
    this.camera.position.z = 1;
    this.camera.position.x = 5;
    this.camera.position.y = 2;
    const screenWidth = window.innerWidth;

    if (screenWidth <= 480) {
      this.renderer.setSize(screenWidth, screenWidth * 0.75);
    } else {
      this.renderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.7);
    }



    // Agregar el renderizador al contenedor HTML
    const contenedor = document.getElementById('three');
    contenedor!.appendChild(this.renderer.domElement);

    // Ajustar el tamaño del renderizador al contenedor
    this.renderer.setSize(contenedor!.clientWidth, contenedor!.clientHeight);

    // Agregar luz direccional
    const luzDireccional = new THREE.DirectionalLight(0xffffff, 1);
    luzDireccional.position.set(1, 1, 1).normalize();
    this.scene.add(luzDireccional);

    this.loadSkyboxHDR();
  }

  private async loadSkyboxHDR() {
    const loader = new RGBELoader();
    const texture = await loader.loadAsync("assets/skyboxes/mar.hdr");
    texture.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.background = texture;
    this.scene.environment = texture;
  }

  private animate() {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      };

      animateFn();
    });
  }
}
