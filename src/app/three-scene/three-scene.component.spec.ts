import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeSceneComponent } from './three-scene.component';

describe('ThreeSceneComponent', () => {
  let component: ThreeSceneComponent;
  let fixture: ComponentFixture<ThreeSceneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreeSceneComponent]
    });
    fixture = TestBed.createComponent(ThreeSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
