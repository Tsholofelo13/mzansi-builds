import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebrationWall } from './celebration-wall';

describe('CelebrationWall', () => {
  let component: CelebrationWall;
  let fixture: ComponentFixture<CelebrationWall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CelebrationWall],
    }).compileComponents();

    fixture = TestBed.createComponent(CelebrationWall);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
