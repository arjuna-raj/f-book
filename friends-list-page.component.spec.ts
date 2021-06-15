import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsListPageComponent } from './friends-list-page.component';

describe('FriendsListPageComponent', () => {
  let component: FriendsListPageComponent;
  let fixture: ComponentFixture<FriendsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendsListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
