import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { NominatimService } from '../../services/nominatim.service';
import { OsrmService } from '../../services/osrm.service';
import { Subject, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html'
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private markersLayer = L.layerGroup();
  start: any = null;
  end: any = null;
  searchFrom$ = new Subject<string>();
  searchTo$ = new Subject<string>();
  resultsFrom: any[] = [];
  resultsTo: any[] = [];
  routeLayer?: L.GeoJSON;

  constructor(private nom: NominatimService, private osrm: OsrmService) {}

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([12.9716, 77.5946], 12); // Bengaluru default
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    this.markersLayer.addTo(this.map);

    this.map.on('click', (e: any) => { this.onMapClick(e); });

    this.searchFrom$.pipe(debounceTime(300), switchMap(q => this.nom.search(q))).subscribe(res => this.resultsFrom = res);
    this.searchTo$.pipe(debounceTime(300), switchMap(q => this.nom.search(q))).subscribe(res => this.resultsTo = res);
  }

  ngOnDestroy(): void {
    this.map.remove();
  }

  onMapClick(e: any) {
    const latlng = e.latlng;
    if (!this.start) {
      this.start = { lat: latlng.lat, lon: latlng.lng, display_name: 'Selected point' };
      this.addMarker(latlng, 'Start');
    } else if (!this.end) {
      this.end = { lat: latlng.lat, lon: latlng.lng, display_name: 'Selected point' };
      this.addMarker(latlng, 'End');
      this.calcRoute();
    } else {
      this.clearRoute();
      this.start = { lat: latlng.lat, lon: latlng.lng, display_name: 'Selected point' };
      this.addMarker(latlng, 'Start');
    }
  }

  addMarker(latlng: any, label = '') {
    const m = L.marker(latlng).bindPopup(label).addTo(this.markersLayer);
    m.openPopup();
  }

  selectFrom(item: any) {
    this.start = item;
    this.markersLayer.clearLayers();
    this.addMarker([item.lat, item.lon], 'Start');
    if (this.end) this.calcRoute();
  }

  selectTo(item: any) {
    this.end = item;
    this.addMarker([item.lat, item.lon], 'End');
    if (this.start) this.calcRoute();
  }

  calcRoute() {
    if (!this.start || !this.end) return;
    const sLng = +this.start.lon, sLat = +this.start.lat, eLng = +this.end.lon, eLat = +this.end.lat;
    this.osrm.route(sLng, sLat, eLng, eLat).subscribe({
      next: (res) => {

        if (this.routeLayer) { this.map.removeLayer(this.routeLayer); }
        const geojson = res.routes?.[0]?.geometry;
        if (!geojson) { alert('No route found'); return; }
        this.routeLayer = L.geoJSON(geojson).addTo(this.map);

        const bounds = this.routeLayer.getBounds();
        this.map.fitBounds(bounds, { padding: [40, 40] });
        const distance = (res.routes[0].distance / 1000).toFixed(2);
        const duration = Math.round(res.routes[0].duration/60);
        alert(`Distance: ${distance} km, Duration: ${duration} min`);
      },
      error: () => alert('Routing failed')
    });
  }

  clearRoute(){
    this.markersLayer.clearLayers();
    if (this.routeLayer) { this.map.removeLayer(this.routeLayer); this.routeLayer = undefined; }
    this.start = null; this.end = null;
  }
}
