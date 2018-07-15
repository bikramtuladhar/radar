var list = [];
var selectControl;
var map;
var popup;
var layer;

function init() {
    //les lignes suivantes pour changer le height du div map automatiquement
    document.getElementById("map").style.height = window.innerHeight + "px";

    window.addEventListener("resize", function () {
        document.getElementById("map").style.height = window.innerHeight + "px";
    });
    //----------------------------------declaration des fonts---------------------------------
    map = new OpenLayers.Map("map");
    var osm = new OpenLayers.Layer.OSM("osm");
    var gsat = new OpenLayers.Layer.Google("Google Satellite", {
        type: google.maps.MapTypeId.SATELLITE,
        numZoomLevels: 22
    });
    var gphy = new OpenLayers.Layer.Google("Google Physical", {
        type: google.maps.MapTypeId.TERRAIN,
        visibility: false
    });
    var gmap = new OpenLayers.Layer.Google(
        "Google Streets", // the default
        {numZoomLevels: 20, visibility: false}
    );

    var ghyb = new OpenLayers.Layer.Google("Google Hybrid", {
        type: google.maps.MapTypeId.HYBRID,
        numZoomLevels: 22,
        visibility: false
    });


    layer = new OpenLayers.Layer.Vector("Radar", {
        maxResolution: map.getResolutionForZoom(10)
    });
    list = [
        [-7.57734989, 33.53870642, "radar 1", "Ben M'sik Boulevard Mohammed VI", "Ben M'sik"],
        [-7.58738366, 33.54271929, "radar 2", "Ben M'sik Boulevard Qods", "Ben M'sik"],
        [-7.56384471, 33.55397704, "radar 3", "Ben M'sik Boulevard Driss harti", "Sidi Othmane"],
        [-7.53277664, 33.56328459, "radar 4", "Ben M'sik Boulevard Abdelkader Sahraoui", "sidi otmane"],
        [-7.52588983, 33.57121472, "radar 5", "Ben M'sik Boulevard Okba bnou nafii I", "-sidi othmane"],
        [-7.53397413, 33.5733531, "radar 6", "Ben M'sik Boulevard Okba bnou nafii II", "-sidi othmane"],
        [-7.51129446, 33.61270996, "radar 7", "Ben M'sik Boulevard Mouad ibn jabal", "sidi bernoussi"],
        [-7.63128, 33.56394, "radar 8", "Boulevard Ghandi", "Aîn Chock"],
        [-7.64164, 33.5678, "radar 9", "Boulevard Ghandi", "Aîn Chock"],
        [-7.60705, 33.55277, "radar 10", "Boulevard Panoramique", "Ain Chock"],
        [-7.61308, 33.55112, "radar 11", "Boulevard Panoramique", "Aîn Chock"],
        [-7.58724, 33.54263, "radar 12", "Boulevard El Qods,Aîn Chock"],
        [-7.63574, 33.52624, "radar 13", "Route d'El Jadida", "Aîn Chock"],
        [-7.63076, 33.52829, "radar 14", "Boulevard La Mecque", "Aîn Chock"],
        [-7.63075, 33.53992, "radar 15", "Boulevard La Mecque", "Aîn Chock"],
        [-7.63092, 33.55561, "radar 16", "Boulevard La Mecque", "Aîn Chock"],
        [-7.65929, 33.60413, "radar 17", "Boulevard La Corniche", "Anfa"],
        [-7.66305, 33.5937, "radar 18", "Boulevard Kennedy", "Anfa"],
        [-7.65517, 33.59065, "radar 19", "Boulevard Franklin Roosevelt", "Anfa"],
        [-7.65545, 33.58408, "radar 20", "Rue Ibnou Wahboune", "Anfa"],
        [-7.6257, 33.60835, "radar 21", "Boulevard Med Ben Abdellah", "Anfa"]
    ];
    for (var i = 0; i < list.length; i++) {

        var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(list[i][0], list[i][1]).transform(
                new OpenLayers.Projection("EPSG:4326"),
                new OpenLayers.Projection("EPSG:900913")
            ),
            {
                description: "<h2>" + list[i][2] + "</h2>" +
                "<p>" + list[i][3] + "</p>" +
                "<p>" + list[i][4] + "</p>" +
                '<p class="img-wrapper"><img src="radar3_panoramique.jpg" class="img-responsive"></p>'

            },
            {
                externalGraphic: "locate.png",
                graphicHeight: 24,
                graphicWidth: 24,
                graphicXOffset: -12,
                graphicYOffset: -25
            }
        );

        layer.addFeatures(feature);
    }
    map.addLayers([osm, gsat, gphy, gmap, ghyb]);
    map.addLayer(layer);
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.setCenter(
        new OpenLayers.LonLat(-7.57734989, 33.53870642).transform(
            new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913")
        ),
        12
    );
    selectControl = new OpenLayers.Control.SelectFeature(layer);
    map.addControl(selectControl);
    selectControl.activate();
    layer.events.on({
        'featureselected': onFeatureSelect,
        'featureunselected': onFeatureUnselect
    });
}

function onPopupClose(evt) {
    // 'this' is the popup.
    var feature = this.feature;
    if (feature.layer) { // The feature is not destroyed
        selectControl.unselect(feature);
    } else { // After "moveend" or "refresh" events on POIs layer all
        //     features have been destroyed by the Strategy.BBOX
        this.destroy();
    }
}

function onFeatureSelect(evt) {
    feature = evt.feature;
    popup = new OpenLayers.Popup.FramedCloud("featurePopup",
        feature.geometry.getBounds().getCenterLonLat(),
        new OpenLayers.Size(100, 100),
        feature.attributes.description,
        null, true, onPopupClose);
    feature.popup = popup;
    popup.feature = feature;
    map.addPopup(popup, true);
}

function onFeatureUnselect(evt) {
    feature = evt.feature;
    if (feature.popup) {
        popup.feature = null;
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
}

function recherche() {
    layer.removeAllFeatures();
    var valrecherche = document.getElementById("valrecherche").value;

    for (var i = 0; i < list.length; i++) {
        if (list[i][4] === valrecherche) {
            var feature = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(list[i][0], list[i][1]).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    new OpenLayers.Projection("EPSG:900913")
                ),
                {
                    description: "<h2>" + list[i][2] + "</h2>" +
                    "<p>" + list[i][3] + "</p>" +
                    "<p>" + list[i][4] + "</p>"
                },
                {
                    externalGraphic: "locate.png",
                    graphicHeight: 24,
                    graphicWidth: 24,
                    graphicXOffset: -12,
                    graphicYOffset: -25
                }
            );
            layer.addFeatures(feature);
        }
    }
}

function annuler() {
    layer.removeAllFeatures();

    for (var i = 0; i < list.length; i++) {

        var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(list[i][0], list[i][1]).transform(
                new OpenLayers.Projection("EPSG:4326"),
                new OpenLayers.Projection("EPSG:900913")
            ),
            {
                description: "<h2>" + list[i][2] + "</h2>" +
                "<p>" + list[i][3] + "</p>" +
                "<p>" + list[i][4] + "</p>"
            },
            {
                externalGraphic: "locate.png",
                graphicHeight: 24,
                graphicWidth: 24,
                graphicXOffset: -12,
                graphicYOffset: -25
            }
        );
        layer.addFeatures(feature);
        document.getElementById("valrecherche").value = "";
    }
}

