import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


@Component({
  selector: 'app-three-scene',
  template: '<div id="three-container"></div>',
  styleUrls: ['./three-scene.component.css'],
})
export class ThreeSceneComponent implements OnInit, OnDestroy {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: any;
  private raycaster: THREE.Raycaster;
  private pointer: THREE.Vector2;
  private intersects: THREE.Intersection[];

  private objet3d: any | THREE.Object3D;
  private clips: THREE.AnimationClip[];
  private mixer: THREE.AnimationMixer;
  private action: any | THREE.AnimationAction;
  private clock: THREE.Clock;

  constructor(private ngZone: NgZone) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.intersects = [];
    this.objet3d = null;
    this.clips = [];
    this.mixer = new THREE.AnimationMixer(this.objet3d || null);
    this.action = undefined;
    this.clock = new THREE.Clock();
  }

  ngOnInit() {
    this.init();
    this.animate();
  }

  ngOnDestroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private init() {
    // Dentro del método init()
    this.camera.position.set(0, 0, 0.5); // Ajusta la posición de la cámara

    this.camera.fov = 90;
    this.camera.updateProjectionMatrix();
    window.addEventListener('resize', this.onWindowResize.bind(this));

    this.renderer.setSize(window.innerWidth * 0.8, window.innerHeight);

    document
      .getElementById('three-container')!
      .appendChild(this.renderer.domElement);

    const light = new THREE.AmbientLight();
    this.scene.add(light);

    // orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

  // Configura las limitaciones del zoom
  this.controls.maxPolarAngle = Math.PI / 2; // Evita que la cámara se voltee hacia arriba
  this.controls.minPolarAngle = Math.PI / 2; // Evita que la cámara se voltee hacia abajo
  this.controls.minDistance = 0; // Distancia mínima de acercamiento
  this.controls.maxDistance = 1;   // Distancia máxima de alejamiento
  this.controls.enableDamping = true;
    // Raycaster
    document
      .getElementById('three-container')!
      .addEventListener('pointermove', this.onPointerMove.bind(this));
    document
      .getElementById('three-container')!
      .addEventListener('click', this.onClickObject.bind(this));

    this.loadGLB('assets/img/restaurante.glb').then((gltf2) => {
      const estatua: any = gltf2.scene;
      estatua.position.set(0, 0, 0);

      // Imprime las animaciones disponibles
      console.log(gltf2.animations);

      this.mixer = new THREE.AnimationMixer(estatua);
      this.clips = gltf2.animations; // Asigna las animaciones al arreglo de clips
      if (this.clips.length > 0) {
        this.action = this.mixer.clipAction(this.clips[0]); // Asigna la primera animación
        this.action.play(); // Reproduce la animación
      }

      this.scene.add(estatua);
    });

    this.loadSkyboxHDR();
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onPointerMove(event: MouseEvent) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.intersects = this.raycaster.intersectObjects(this.scene.children);
  }

  private onClickObject() {
    if (this.intersects.length > 0) {
      // Aumenta la opacidad del plano cuando haces clic
      this.scene.children.forEach((object) => {
        if (object instanceof THREE.Mesh) {
          object.material.opacity = 0.8; // Ajusta la nueva opacidad
        }
      });
    }
  }

  private animate() {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);

        if (this.mixer) {
          const delta = this.clock.getDelta();
          this.mixer.update(delta);
        }

        // Verifica si controls está definido antes de llamar a update
        if (this.controls) {
          this.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
      };

      animateFn();
    });
  }

  private async loadGLB(url: string): Promise<GLTF> {
    const loader = new GLTFLoader();
    return await loader.loadAsync(url);
  }

  private async loadSkyboxHDR() {
    const loader = new THREE.TextureLoader();
    const texture = await loader.loadAsync('assets/img/Cartagena1.jpg');

    // Asigna la textura a la escena o al fondo según tus necesidades
    this.scene.background = texture;
    // O si quieres usarla para entorno:
    // this.scene.environment = texture;
  }
}
