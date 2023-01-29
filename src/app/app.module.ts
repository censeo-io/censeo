import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StyleClassModule } from 'primeng/styleclass';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, StyleClassModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
