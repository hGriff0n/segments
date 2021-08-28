import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  location: [number, number] = [0, 0];
  zoom: [number] = [9];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getLocation();
  }

  getLocation(): void{
    // Mapbox Geolocate Control?
    if (navigator.geolocation) {
      // Possible to do before load?
        navigator.geolocation.getCurrentPosition((position)=>{
          this.location = [position.coords.longitude, position.coords.latitude];
          this.zoom = [12];
        });
    } else {
       console.log("No support for geolocation")
    }
  }

  onLoad(event) {
    event.resize();
  }
}
