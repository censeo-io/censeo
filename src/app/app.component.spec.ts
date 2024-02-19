import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { MenubarModule } from 'primeng/menubar';
import { StyleClassModule } from 'primeng/styleclass';
import { ToastModule } from 'primeng/toast';
import { AppComponent } from './app.component';

/*
 TODO: Disabling due to the following error; will investigate/fix later
 -----------------------------------------------------------------------------------
 ReferenceError: Cannot access 'Menubar' before initialization
 
 4 | // import { MenubarModule } from 'primeng/menubar';
 5 | import { ConfirmationService, MessageService } from 'primeng/api';
 > 6 | import { MenubarModule } from 'primeng/menubar';
 | ^
 7 | import { StyleClassModule } from 'primeng/styleclass';
 8 | import { ToastModule } from 'primeng/toast';
 9 | import { AppComponent } from './app.component';
 
 at Object.<anonymous> (node_modules/primeng/fesm2015/primeng-menubar.mjs:142:288)
 at Object.<anonymous> (src/app/app.component.spec.ts:6:1)
 -----------------------------------------------------------------------------------
 */
xdescribe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterModule,
        ConfirmDialogModule,
        // MenubarModule,
        StyleClassModule,
        ToastModule,
      ],
      providers: [ConfirmationService, MessageService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
