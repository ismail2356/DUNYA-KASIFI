import { createSlice } from '@reduxjs/toolkit';

/**
 * Harita durumunun başlangıç değerleri
 */
const initialState = {
  currentRoute: null, // Mevcut uçuş rotası
  visitedCountries: [], // Ziyaret edilen ülkeler
  visitedCities: [], // Ziyaret edilen şehirler
  pointsOfInterest: [], // İlgi çekici noktalar
  currentLocation: { lat: 41.0082, lng: 28.9784 }, // Mevcut konum (varsayılan: İstanbul)
  destination: null, // Hedef konum
  mapView: {
    zoom: 1, // Harita yakınlaştırma seviyesi (1-5)
    center: { lat: 0, lng: 0 }, // Harita merkezi
    rotation: 0, // Harita dönüş açısı
    tilt: 0, // Harita eğim açısı
  },
  loading: false,
  error: null,
};

/**
 * Harita slice'ı
 */
const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    // Rota yüklemeye başlama
    fetchRouteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // Rota başarıyla yüklendi
    fetchRouteSuccess: (state, action) => {
      state.loading = false;
      state.currentRoute = action.payload.route;
      state.destination = action.payload.destination;
    },
    
    // Rota yükleme hatası
    fetchRouteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Mevcut konumu güncelleme
    updateCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    
    // Ülke ziyareti kaydetme
    visitCountry: (state, action) => {
      const country = action.payload;
      if (!state.visitedCountries.some(c => c.id === country.id)) {
        state.visitedCountries.push(country);
      }
    },
    
    // Şehir ziyareti kaydetme
    visitCity: (state, action) => {
      const city = action.payload;
      if (!state.visitedCities.some(c => c.id === city.id)) {
        state.visitedCities.push(city);
      }
    },
    
    // İlgi çekici nokta ekleme
    addPointOfInterest: (state, action) => {
      const poi = action.payload;
      if (!state.pointsOfInterest.some(p => p.id === poi.id)) {
        state.pointsOfInterest.push(poi);
      }
    },
    
    // Harita görünümünü güncelleme
    updateMapView: (state, action) => {
      state.mapView = {
        ...state.mapView,
        ...action.payload,
      };
    },
    
    // Harita yakınlaştırma
    zoomMap: (state, action) => {
      const zoomDelta = action.payload;
      const newZoom = Math.max(1, Math.min(5, state.mapView.zoom + zoomDelta));
      state.mapView.zoom = newZoom;
    },
    
    // Harita döndürme
    rotateMap: (state, action) => {
      const rotationDelta = action.payload;
      state.mapView.rotation = (state.mapView.rotation + rotationDelta) % 360;
    },
    
    // Harita eğme
    tiltMap: (state, action) => {
      const tiltDelta = action.payload;
      state.mapView.tilt = Math.max(0, Math.min(60, state.mapView.tilt + tiltDelta));
    },
    
    // Harita merkezini değiştirme
    panMap: (state, action) => {
      const { lat, lng } = action.payload;
      state.mapView.center = { lat, lng };
    },
    
    // Haritayı sıfırlama
    resetMap: (state) => {
      return {
        ...initialState,
        visitedCountries: state.visitedCountries,
        visitedCities: state.visitedCities,
        pointsOfInterest: state.pointsOfInterest,
      };
    },
  },
});

// Action'ları dışa aktar
export const {
  fetchRouteStart,
  fetchRouteSuccess,
  fetchRouteFailure,
  updateCurrentLocation,
  visitCountry,
  visitCity,
  addPointOfInterest,
  updateMapView,
  zoomMap,
  rotateMap,
  tiltMap,
  panMap,
  resetMap,
} = mapSlice.actions;

// Selector'ları dışa aktar
export const selectCurrentRoute = (state) => state.map.currentRoute;
export const selectVisitedCountries = (state) => state.map.visitedCountries;
export const selectVisitedCities = (state) => state.map.visitedCities;
export const selectPointsOfInterest = (state) => state.map.pointsOfInterest;
export const selectCurrentLocation = (state) => state.map.currentLocation;
export const selectDestination = (state) => state.map.destination;
export const selectMapView = (state) => state.map.mapView;
export const selectMapLoading = (state) => state.map.loading;
export const selectMapError = (state) => state.map.error;

export default mapSlice.reducer; 