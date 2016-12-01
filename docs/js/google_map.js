var map;
function initMap() {
  map = InitNewMap(42.010439, -93.638085, document.getElementById('map'));
  var sightings = gen_sightings();
  var breadcrumbs = gen_breadcrumbs();
  sightings = LoadSightingsFromString(sightings);
  breadcrumbs = LoadBreadcrumbsFromString(breadcrumbs);
  (MapSightingsToMapAction(map.map))(sightings);
  (MapBreadcrumbsToMapAction(map.map))(breadcrumbs);
}
