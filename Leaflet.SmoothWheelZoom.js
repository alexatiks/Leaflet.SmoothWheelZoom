import { Map, Handler, DomEvent } from "leaflet";

const SmoothWheelZoom = Handler.extend({
  addHooks: function () {
    DomEvent.on(this._map._container, "mousewheel", this._onWheelScroll, this);
  },

  removeHooks: function () {
    DomEvent.off(this._map._container, "mousewheel", this._onWheelScroll, this);
  },

  _onWheelScroll: function (e) {
    if (!this._isWheeling) {
      this._onWheelStart(e);
    }
    this._onWheeling(e);
  },

  _onWheelStart: function (e) {
    var map = this._map;
    this._isWheeling = true;
    this._wheelMousePosition = map.mouseEventToContainerPoint(e);
    this._centerPoint = map.getSize()._divideBy(2);
    this._startLatLng = map.containerPointToLatLng(this._centerPoint);
    this._wheelMouseLatLng = map.containerPointToLatLng(
      this._wheelMousePosition
    );
    this._startZoom = map.getZoom();
    this._moved = false;
    this._zooming = true;

    map._stop();
    if (map._panAnim) map._panAnim.stop();

    this._goalZoom = map.getZoom();
    this._prevCenter = map.getCenter();
    this._prevZoom = map.getZoom();

    this._zoomAnimationId = requestAnimationFrame(
      this._updateWheelZoom.bind(this)
    );
  },

  _onWheeling: function (e) {
    var map = this._map;

    this._goalZoom =
      this._goalZoom - e.deltaY * 0.003 * map.options.smoothSensitivity;
    if (
      this._goalZoom < map.getMinZoom() ||
      this._goalZoom > map.getMaxZoom()
    ) {
      this._goalZoom = map._limitZoom(this._goalZoom);
    }
    this._wheelMousePosition = this._map.mouseEventToContainerPoint(e);
    this._wheelMouseLatLng = map.containerPointToLatLng(
      this._wheelMousePosition
    );

    clearTimeout(this._timeoutId);
    this._timeoutId = setTimeout(this._onWheelEnd.bind(this), 200);

    DomEvent.preventDefault(e);
    DomEvent.stopPropagation(e);
  },

  _onWheelEnd: function (e) {
    this._isWheeling = false;
    cancelAnimationFrame(this._zoomAnimationId);

    // fire zoomend event in order to MarkerCluster plugin rerender clusters
    this._map.fire("zoomend");
  },

  _updateWheelZoom: function () {
    var map = this._map;

    if (
      !map.getCenter().equals(this._prevCenter) ||
      map.getZoom() != this._prevZoom
    )
      return;

    this._zoom = map.getZoom() + (this._goalZoom - map.getZoom()) * 0.3;
    this._zoom = Math.floor(this._zoom * 100) / 100;

    var delta = this._wheelMousePosition.subtract(this._centerPoint);
    if (delta.x === 0 && delta.y === 0) return;

    if (map.options.smoothWheelZoom === "center") {
      this._center = this._startLatLng;
    } else {
      this._center = map.unproject(
        map.project(this._wheelMouseLatLng, this._zoom).subtract(delta),
        this._zoom
      );
    }

    if (!this._moved) {
      map._moveStart(true, false);
      this._moved = true;
    }

    map._move(this._center, this._zoom);
    this._prevCenter = map.getCenter();
    this._prevZoom = map.getZoom();

    map.fire("viewreset");

    this._zoomAnimationId = requestAnimationFrame(
      this._updateWheelZoom.bind(this)
    );
  },
});

/**
 * @param {Map} map
 * @param {number} smoothSensitivity
 */
export function enableSmoothZoom(map, smoothSensitivity = 1) {
  map.options.scrollWheelZoom = false; // disable original zoom function
  map.options.smoothWheelZoom = true;
  map.options.smoothSensitivity = smoothSensitivity;
  map.addHandler("smoothWheelZoom", SmoothWheelZoom);
}
