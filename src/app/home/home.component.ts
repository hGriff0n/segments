import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Map } from 'mapbox-gl';
import * as polyline from '@mapbox/polyline';
import { Strava, SummarySegment } from 'strava';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  location: [number, number] = [0, 0];
  zoom: [number] = [9];
  map: Map;
  strava: Strava;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getLocation();
    this.strava = new Strava({
      client_id: '69847',
      client_secret: 'e27db3aebb572370faf8bdc3acc1e0aae016d622',
      refresh_token: '7511a603ab56d2772550c0b11f51a80e3dc3ab33 ',
    });
  }

  // mgl-layer
  // mgl-geojson-source
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

  paintSegment(id: string, segment_polyline: string) {
    const line: GeoJSON.LineString = polyline.toGeoJSON(segment_polyline);
    this.map.addSource(id, { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: line } });
    this.map.addLayer({
      id: id,
      type: 'line',
      source: id,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#EE4B2B', 'line-width': 8 }
    });
  }

  onLoad(event: Map) {
    this.map = event;
    this.map.resize();

    (async () => {
      try {
        const activities = await this.strava.segments.getLoggedInAthleteStarredSegments({});
        const segment = await this.strava.segments.getSegmentById({id: 5158765});
        this.paintSegment("" + segment.id, segment.map.polyline);
        console.log(activities)
        console.log(segment);

      } catch (error) {
        console.log(error)
      }
    })();
  }
}
