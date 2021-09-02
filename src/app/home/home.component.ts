import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Map, Popup } from 'mapbox-gl';
import * as polyline from '@mapbox/polyline';
import { Strava, SummarySegment, DetailedSegment } from 'strava';

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
  popup: Popup;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getLocation();
    this.strava = new Strava({
      client_id: '69847',
      client_secret: 'e27db3aebb572370faf8bdc3acc1e0aae016d622',
      refresh_token: '7511a603ab56d2772550c0b11f51a80e3dc3ab33 ',
    });
    this.popup = new Popup({closeButton: false, closeOnClick: true, closeOnMove: true });
  }

  onLoad(event: Map) {
    this.map = event;
    this.map.resize();
    this.map.getCanvas().style.cursor = '';

    // Load all of the starred segments and render them on the map
    // Use `Promise.all` to parallelize the network calls
    (async () => {
      var segments = [];
      for (var starred of await this.starredSegments()) {
        segments.push(this.getSegment(starred.id).then(segment => {
          this.paintSegment(segment);
        }));
      }

      try {
        await Promise.all(segments);
      } catch (error) {
        console.log(error)
      }
    })();

    // TODO: Add "floating" markers to segments (assign to source 'markers')
    // this.map.on('mouseenter', 'markers', e => this.displayMiniPopup(e));
    // this.map.on('mouseleave', 'markers', e => this.closeMiniPopup(e));
    // this.map.on('click', 'markers', e => this.displayDetailedPopup(e));
  }

  // TODO: Could also put all segment jsons into 1 layer, would that help performance?
  // Can I modify a layer to add in items afterwards?
  // Would be potentially beneficial to use mgl-layer and mgl-geojson-source
  // but that might make some things more difficult so leaving as-is for now
  private paintSegment(segment: DetailedSegment) {
    var id = "" + segment.id

    const line: GeoJSON.LineString = polyline.toGeoJSON(segment.map.polyline);
    this.map.addSource(id, { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: line } });
    this.map.addLayer({
      id: id,
      type: 'line',
      source: id,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#EE4B2B', 'line-width': [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          0, ["*", 12, ["^", 2, -6]],
          24, ["*", 12, ["^", 2, 8]]
        ],
      }
    });

    this.map.on('mouseenter', id, (e) => {
      this.map.getCanvas().style.cursor = 'pointer';
      this.popup.setLngLat(e.lngLat).setHTML(this.formatPopup(segment)).addTo(this.map);
      console.log("Scrolled over " + id);
      console.log(e)
    });
    this.map.on('mouseleave', id, (e) => {
      this.map.getCanvas().style.cursor = '';
      this.popup.remove();
    });
  }

  // TODO: Format popup with useful information
  // TODO: Find a way to make popup "stickier"
  // TODO: Move popup to own component class (ie. automate formatting)
  private formatPopup(segment: DetailedSegment): string {
    return segment.name + " (" + segment.average_grade + "%)";
  }

  private async starredSegments(): Promise<SummarySegment[]> {
    return this.strava.segments.getLoggedInAthleteStarredSegments({});
  }

  private async getSegment(id: number): Promise<DetailedSegment> {
    return this.strava.segments.getSegmentById({ id: id });
  }

  private displayMiniPopup(e) { }
  private closeMiniPopup(e) { }
  private displayDetailedPopup(e) { }

  private getLocation(): void {
    // Mapbox Geolocate Control?
    if (navigator.geolocation) {
      // Possible to do before load?
      navigator.geolocation.getCurrentPosition((position) => {
        this.location = [position.coords.longitude, position.coords.latitude];
        this.zoom = [12];
      });
    } else {
      console.log("No support for geolocation")
    }
  }
}
