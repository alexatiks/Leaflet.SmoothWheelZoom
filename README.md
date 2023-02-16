# Smooth wheel zoom plugin for leaflet

Credits :
- [mutsuyuki](https://github.com/mutsuyuki/Leaflet.SmoothWheelZoom) for the original code
- [alexatiks](https://github.com/alexatiks/Leaflet.SmoothWheelZoom) npm packaging
- [BudgieInWA](https://github.com/BudgieInWA/Leaflet.SmoothWheelZoom) for the map jumping fix

### Installation

```sh
npm i nyko28/Leaflet.SmoothWheelZoom.git
```

### Usage

```js
import { Map } from "leaflet";
import { enableSmoothZoom } 'leaflet.smoothwheelzoom';

const map = Map("map");
enableSmoothZoom(map);
```
