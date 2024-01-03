import { Component, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-modelo3d3',
  template: '<div id="modelo3D3"></div>',
})
export class Modelo3D3Component implements OnInit, OnDestroy {
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
    // Cargar y agregar el primer modelo 3D aquí
    const loader = new GLTFLoader();
    loader.load('assets/img/menuCarta1.glb', (gltf) => {
      const modelo: any = gltf.scene;
      modelo.position.set(-3, -1, 0);
      modelo.scale.set(0.5, 0.5, 0.5);
      this.scene.add(modelo);
    });

    // Cargar y agregar el segundo modelo 3D aquí
    loader.load('assets/img/menu_pared.glb', (gltf) => {
      const otroModelo: any = gltf.scene;
      otroModelo.position.set(4, -5, 0); // Puedes ajustar la posición según tus necesidades
      otroModelo.scale.set(5, 5, 5);
      this.scene.add(otroModelo);
    });

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Configura las limitaciones del zoom
    this.controls.minDistance = 5; // Distancia mínima de acercamiento
    this.controls.maxDistance = 10;   // Distancia máxima de alejamiento
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = Math.PI / 8;
    this.controls.minAzimuthAngle = Math.PI / -3;
   this.controls.maxAzimuthAngle = Math.PI / 3;

    // Configurar la cámara y el renderizador
    this.camera.position.z = 10;

    const screenWidth = window.innerWidth;

    if (screenWidth <= 480) {
      this.renderer.setSize(screenWidth, screenWidth * 0.75);
    } else {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }


    // Agregar el renderizador al contenedor HTML
    const contenedor = document.getElementById('modelo3D3');
    contenedor!.appendChild(this.renderer.domElement);

    // Ajustar el tamaño del renderizador al contenedor
    this.renderer.setSize(contenedor!.clientWidth, contenedor!.clientHeight);

    // Agregar luz direccional
    const luzDireccional = new THREE.DirectionalLight(0xffffff, 1);
    luzDireccional.position.set(1, 1, 1).normalize();
    this.scene.add(luzDireccional);
  }

  private animate() {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);

        // Mover la cámara horizontalmente
        const speed = 0.01; // Puedes ajustar la velocidad
        this.camera.position.x += speed;

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      };

      animateFn();
    });
  }
}
