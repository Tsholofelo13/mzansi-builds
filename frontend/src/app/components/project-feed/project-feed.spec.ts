import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFeed } from './project-feed';

describe('ProjectFeed', () => {
  let component: ProjectFeed;
  let fixture: ComponentFixture<ProjectFeed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFeed],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectFeed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
