import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { APP_ROUTES } from './routes';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '../shared/layout/layout.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    MatIconModule,
    RouterModule.forRoot(APP_ROUTES, { relativeLinkResolution: 'legacy' }),
    NgxMapboxGLModule.withConfig({
      accessToken:
        'pk.eyJ1IjoiaGdyaWZmMG4iLCJhIjoiY2tzdGh5YmRkMDNlcjJvcXVsbmpub3JqcCJ9.UODDIMHH-Kus5_mViHTQyQ',
    }),
    LayoutModule,
  ],
  exports: [],
  providers: [],
})
export class CoreModule {}
