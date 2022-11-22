# Smooth wheel zoom plugin for leaflet

This solution is based on the [repo](https://github.com/mutsuyuki/Leaflet.SmoothWheelZoom) with some improvements 

### Usage

Installation:

`npm i alexatiks/Leaflet.SmoothWheelZoom.git`

```
import 'leaflet.smoothwheelzoom';

...

var map = L.map('map', {
  scrollWheelZoom: false, // disable original zoom function
  smoothWheelZoom: true,  // enable smooth zoom 
  smoothSensitivity: 1.5,   // zoom speed. default is 1
});
```
With Vue2Leaflet

```
import 'leaflet.smoothwheelzoom';

...

<l-map
    :zoom="zoom"
    :center="center"
    :options="{
        scrollWheelZoom: false,
        smoothWheelZoom: true,
        smoothSensitivity: 1.5,
    }"
  >
```
