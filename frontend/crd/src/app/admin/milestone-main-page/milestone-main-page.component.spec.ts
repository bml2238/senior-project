import { ComponentFixture, TestBed } from '@angular/core/testing';
import createSpyObj = jasmine.createSpyObj;
import { of } from "rxjs";
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { MilestoneMainPageComponent } from './milestone-main-page.component';
import { MilestoneService } from 'src/app/milestones-page/milestones/milestone.service';
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";


describe('MilestoneMainPageComponent', () => {
  let component: MilestoneMainPageComponent;
  let fixture: ComponentFixture<MilestoneMainPageComponent>;
  let milestoneServiceSpy = createSpyObj('MilestoneService', ['getMilestones']);
  milestoneServiceSpy.getMilestones.and.returnValue(of(Array(new Milestone({
    name: "name",
    yearLevel: YearLevel.Freshman,
    id: 1,
    events: [],
    tasks: [],
    description: "testing"
  }))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatGridListModule, MatTabsModule, NoopAnimationsModule],
      declarations: [MilestoneMainPageComponent],
      providers: [{provide: MilestoneService, useValue: milestoneServiceSpy}],
    });
    fixture = TestBed.createComponent(MilestoneMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});