import { NgModule } from '@angular/core';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [NgxMapboxGLModule],
  exports: [HomeComponent],
})
export class HomeModule {}
