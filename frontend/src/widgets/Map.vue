<template>
    <section>
        <Popup :title="popupTitle" :content="popupContent" :coords="popupCoords" ref="popup"></Popup>
        <div ref="map" class="map" :style="{ width: width, height: height }"></div>
    </section>
</template>

<style lang="scss">
    /*@import "openlayers/dist/ol.css";*/
</style>

<script type="text/babel">

    //
    // Libraries
    //

    import ol from 'openlayers';
    import fp from 'lodash/fp';
    import Vue from 'vue';

    import config from 'config';

    // Components
    import Popup from 'widgets/MapPopup.vue';


    // Import mixins.
    import {activate_mixin} from 'common/activate-mixin';

    //
    // Functions
    //

    let unHover = function(feature = this.lastHoveredFeature) {
        if (feature) {
            scaleMarker(feature);
        }
    };

    let transformCoords = function(coords) {
        return ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857');
    };

    let popupStats = function(feature, coordinate) {
        let coordinate1 = feature.getGeometry().getClosestPoint([0,0]);
        let hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate1, 'EPSG:3857', 'EPSG:4326'));

        let data = feature.getProperties();
        this.popupTitle = data.name;

        delete data.geometry;
        delete data.labelPoint;
        delete data.name;

        this.popupContent = data;
        this.popupCoords = hdms;

        this.overlay.setPosition(coordinate1);
    };

    let hideMarker = function (feature) {
        scaleMarker(feature, 0.0000000001);
    };

    let showMarker = function (feature) {
        scaleMarker(feature);
    };

    let doubleMarker = function (feature) {
        scaleMarker(feature, 0.02);
    };

    let scaleMarker = function (feature, scale = 0.01) {
        //ALEN - začasno onemogočeno, ker še ne dela prav za krogce
        // let image = feature.getStyle().getImage();
        // image.setScale(scale);
        // feature.changed();
    };

    let hideMarkers = function (vectorLayer, filterOut) {
        // filter filters by alert level (0 = red, 1 = orange, > = green, 7 = blue)
        // if none are filtered out, they are drawn with the normal size
        let features = vectorLayer.getSource().getFeatures();
        let measured_level;
        for (let feature of features) {
            measured_level = parseInt(feature.get("measured_level_planned"));
            if (filterOut(measured_level)) {
                showMarker(feature);
            }
            else {
                hideMarker(feature);
            }
        }
    };

    let addFeaturesToPlan = function (vectorLayer, filterOut) {
        let features = vectorLayer.getSource().getFeatures();
        let style;
        let measured_level;
        for (let feature of features) {
            measured_level = parseInt(feature.get("measured_level_planned"));
            if (!filterOut(measured_level)) {
                style = iconStyle("blue", 0.01); // todo if desired hide features, that do not fall into the selected truck
                feature.setStyle(style);
                this.addFeatureToPlan(feature);
            }
        }
        // todo firefox doesn't display new features unless we reload them with hovering. but cannot seem to make it work here
        // seems the img is not created yet and this is why it fails
    };

    let addFeatureToPlan = function (feature) {
        if (this.trucks[0].length == 1 && this.trucks[0][0].description == this.dummyPlanFeature.description) {
            this.trucks[0].splice(0,1);
        }
        if (!this.alreadyAdded[feature.getId()]) {
            let capacity = feature.get('capacity');
            let measured_value = feature.get('measured_value');
            let percentage;
            if (measured_value) {
                percentage = measured_value / capacity;
            }
            else {
                percentage = parseInt(feature.get('measured_level'))  * 0.2;
            }
            feature.set('measured_level_planned', 7);
            let to_fill = Math.round((1 - percentage) * capacity);
            let description = feature.get('location_description');

            feature.setStyle(iconStyle('blue'));
            // todo if we want we can set zindex to keep this feature in front
            this.alreadyAdded[feature.getId()] = true;
        }
    };

    let isValidHexColor = function (color) {
        return /^#[0-9A-F]{6}$/i.test(color);
    };

    let iconStyle = function (color, scale = 0.01) {
        // todo currently only green orange red and grey are supported
        let predefined = {'red': '#E81E25', 'green': '#79ce16', 'grey': '#808080',
            'orange': '#ffa500', 'yellow': '#ffd700', 'blue': '#01aae8', 'black': '#000000'};
        if (predefined[color]) {
            color = predefined[color];
        }
        else if (!isValidHexColor(color)) {
            color = predefined['grey']; // todo can output something
        }
        // todo move to a new component
        let markerIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="1481" height="2073"> \
            <title>Map-Marker-Small</title> \
            <g> \
                <title>Layer 1</title> \
                <g id="svg_1"> \
                <path id="svg_2" d="m730.940002,1839.629028c-38.765991,-190.301025 -107.115967,-348.665039 -189.903015,-495.439941c-61.406982,-108.87207 -132.543976,-209.363037 -198.363983,-314.937988c-21.972015,-35.24408 -40.93399,-72.477051 -62.046997,-109.054077c-42.216003,-73.136963 -76.444,-157.934998 -74.268997,-267.932007c2.125,-107.472961 33.207993,-193.68399 78.029984,-264.171997c73.719025,-115.934967 197.201019,-210.988983 362.884003,-235.968979c135.466003,-20.423996 262.475037,14.082001 352.54303,66.748001c73.600037,43.037994 130.596008,100.527008 173.919983,168.279999c45.219971,70.716003 76.359009,154.26001 78.970947,263.231995c1.337036,55.830017 -7.804932,107.531982 -20.68396,150.417969c-13.033936,43.409058 -33.995972,79.695007 -52.645996,118.454041c-36.406006,75.658997 -82.04895,144.981995 -127.85498,214.346008c-136.437012,206.605957 -264.496033,417.309937 -320.580017,706.026978z" stroke-miterlimit="10" stroke-width="37" stroke="#000000" fill="' + color + '" clip-rule="evenodd" fill-rule="evenodd"/> \
                <circle id="svg_4" r="183.333" cy="651.047" cx="729.546" clip-rule="evenodd" fill-rule="evenodd"/> \
                </g> \
            </g> \
            </svg>';

        let mysvg = new Image();
        mysvg.src = 'data:image/svg+xml,' + escape(markerIcon);

        return new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                img: mysvg,
                imgSize: [1482, 2073],
                scale: scale,
                anchor: [0.55,1]
            }))
        });
    };

    let lineStyle = function (color, scale = 0.01) {
        // todo currently only green orange red and grey are supported
        let predefined = {'red': '#E81E25', 'green': '#79ce16', 'grey': '#808080',
            'orange': '#ffa500', 'yellow': '#ffd700', 'blue': '#01aae8', 'black': '#000000'};
        if (predefined[color]) {
            color = predefined[color];
        }
        else if (!isValidHexColor(color)) {
            color = predefined['grey']; // todo can output something
        }

        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 3,
                color
            })
        });
    };

    let pointStyle = function (color, scale = 0.01) {
        // todo currently only green orange red and grey are supported
        let predefined = {'red': '#E81E25', 'green': '#79ce16', 'grey': '#808080',
            'orange': '#ffa500', 'yellow': '#ffd700', 'blue': '#01aae8', 'black': '#000000'};
        if (predefined[color]) {
            color = predefined[color];
        }
        else if (!isValidHexColor(color)) {
            color = predefined['grey']; // todo can output something
        }

        return new ol.style.Style({
            image: new ol.style.Circle({
                 radius: 6,
                 fill: new ol.style.Fill({
                   color: color
                 })
                 ,
                 stroke: new ol.style.Stroke({
                   color: "white",
                   width: 1
                 })
               })
        });
    };

    let zoomToVectorLayerExtent = function() {
        this.map.getView().fit(this.lineVectorLayer.getSource().getExtent(), this.map.getSize());
    }

    let onMapClick = function(evt) {
        // todo save clone last hovered and use it to compare
        if (!this.lastHoveredFeature) {
            // Add feature to last hovered in case our touchy friends click
            let hit = this.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                this.lastHoveredFeature = feature;
                return true;
            }.bind(this), {
                layerFilter: function (layer) {
                    return layer == this.vectorLayer;
                }.bind(this)
            });
            if (!hit)
                return;
        }

        let lastHovered = this.lastHoveredFeature.getId();
        let hit = this.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            // if (this.lastHoveredFeature) {
            //   this.$refs.popup.lastClickedFeature = this.lastHoveredFeature
            // }
            // else {
            // this.$refs.popup.lastClickedFeature = feature
            this.lastClickedFeature = this.vectorLayer.getSource().getFeatureById(lastHovered);
            return true;
        }.bind(this), {
            filterLayer: function (layer) {
                return layer == this.vectorLayer;
            }.bind(this)
        });

        if (hit) {
            this.popupStats(this.lastClickedFeature, evt.coordinate);
        }
    };

    let initMap = function () {
        let styles = [
            'Road',
            'Aerial',
            'AerialWithLabels',
            'collinsBart',
            'ordnanceSurvey'
        ];

        let source;

        if (this.source == 'Bing') {
            source = new ol.source.BingMaps({
                key: config.bing_key,
                imagerySet: styles[0]
            });
        }
        else {
            source = new ol.source.OSM();
        }


        this.map = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    source: source
                })
            ],
            target: this.$refs.map,
            controls: ol.control.defaults({
                attributionOptions: ({
                    collapsible: false
                })
            }),
            overlays: [this.overlay],
            view: new ol.View({
                center: [this.centerCoords[0], this.centerCoords[1]],
                zoom: 9,
                minZoom: 5
            })
        });

        window.onresize = function() {
            setTimeout( function() {
                this.map.updateSize();
            }.bind(this), 200);
        }.bind(this);

        this.map.on('click', this.onMapClick);
        this.map.on('touchend', this.onMapClick);
        this.map.on('pointermove', this.onMapPointermove);
    };

    let setLocationsFromData = function (rows) {
        if (!rows || !rows.length)
            return;
        let features = [];
        let iconFeature;
        // firefox needs images preloaded. quickfix is here. todo
        let firefoxPreloadBlueStyle = rows.length > 0 && rows[0].marker
                                        ? iconStyle('blue')
                                        : pointStyle('blue');
        let i = 0;
        for (let row of rows) {
            let data = fp.clone(row);
            delete data.longitude;
            delete data.latitude;
            data.labelPoint = new ol.geom.Point(transformCoords([row.longitude, row.latitude]));
            data.geometry = new ol.geom.Point(transformCoords([row.longitude, row.latitude]));
            let color = row.color || colorFromLevel(row.measured_level);
            let marker = data.marker
            delete data.circle;
            iconFeature = new ol.Feature(data);
            if(marker == "CIRCLE") {
              iconFeature.setStyle(pointStyle(color));
            } else if(marker == "MARKER"){
              iconFeature.setStyle(iconStyle(color));
            }
            i++;
            iconFeature.setId(i);
            iconFeature.getStyle().setZIndex(1);
            features.push(iconFeature);
        }

        if (!this.vectorLayer) {
            let vectorSource = new ol.source.Vector({
                features: features
            });

            let vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                minResolution: 0.001,
                maxResolution: 10
            });
            // todo add style function here. the style can change according to feature properties
            // http://openlayersbook.github.io/ch11-creating-web-map-apps/example-08.html
            this.vectorLayer = vectorLayer;
            this.map.addLayer(this.vectorLayer);
        }
        else {
            this.vectorLayer.getSource().addFeatures(features);
            this.vectorLayer.changed();
        }
    };

    let setConnectionsFromData = function (connections) {
        if (!connections || !connections.length)
            return;
        let features = [];
        let lineFeature;

        let i = 0;
        for (let connection of connections) {
            let data = fp.clone(connection);
            if (!data.A.longitude || !data.A.latitude) {
                console.log('No coords for ', data.A.name);
                continue;
            }
            if (!data.B.longitude || !data.B.latitude) {
                console.log('No coords for ', data.B.name);
                continue;
            }

            let color = connection.color || colorFromLevel(connection.measured_level);

            data.geometry = new ol.geom.LineString([transformCoords([data.A.longitude, data.A.latitude]),
                transformCoords([data.B.longitude, data.B.latitude])]);

            lineFeature = new ol.Feature(data);

            i++;
            lineFeature.setStyle(lineStyle(color));
            lineFeature.setId(i);
            features.push(lineFeature);
        }
        if (!this.lineVectorLayer) {
            let vectorSource = new ol.source.Vector({
                features: features
            });

            let lineVectorLayer = new ol.layer.Vector({
                source: vectorSource
            });
            // todo add style function here. the style can change according to feature properties
            // http://openlayersbook.github.io/ch11-creating-web-map-apps/example-08.html
            this.lineVectorLayer = lineVectorLayer;
            this.map.addLayer(this.lineVectorLayer);
        }
        else {
            this.lineVectorLayer.getSource().addFeatures(features);
            this.lineVectorLayer.changed();
        }
    };

    let getData = function() {
        // todo
        if (this.vectorLayer)
            this.vectorLayer.getSource().clear();
        if (this.lineVectorLayer)
            this.lineVectorLayer.getSource().clear();
        this.setConnectionsFromData(this.mydata['connections']);
        this.setLocationsFromData(this.mydata['points']);
    };

    let colorFromLevel = function (level) {
        let levelColors = {'0': 'red', '1': 'yellow'};
        let color = levelColors[level];
        if (!color) {
            color = 'green'
        }
        return color
    };

    let onMapPointermove = function(e) {
        //todo currently index is raising to inf. if it becomes an issue fix it
        let i;
        this.unHover();

        let hit = this.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
            if (!!this.lastHoveredFeature) {
                // module.exports.lastHoveredFeature.getStyle().setZIndex(1)
                i = this.lastHoveredFeature.getStyle().getZIndex();
                if (!i) {
                    i = 1;
                }
                scaleMarker(this.lastHoveredFeature)
            }
            this.lastHoveredFeature = feature;
            return true;
        }.bind(this), {
            layerFilter: function (layer) {
                return layer == this.vectorLayer;
            }.bind(this)
        });
        if (hit) {
            this.$refs.map.style.cursor = "pointer";
            if (i != this.maxDepth) {
                i = this.maxDepth;
                this.maxDepth = i + 1;
                this.lastHoveredFeature.getStyle().setZIndex(i + 1);
            }
            scaleMarker(this.lastHoveredFeature, 0.015);
        }
        else {
            this.$refs.map.style.cursor = "";
            this.unHover();
        }
    };

    let activate = function () {
        this.initing = true;
        this.getData();
        this.initing = false;
        this.mydatachanged = false;
    };


    //
    // Export
    //

    export default {
        name: "MyMap",

        methods: {
            unHover,
            popupStats,
            addFeaturesToPlan,
            addFeatureToPlan,
            setLocationsFromData,
            setConnectionsFromData,
            onMapClick,
            initMap,
            getData,
            onMapPointermove,
            zoomToVectorLayerExtent
        },

        mixins: [activate_mixin],

        data: function () {
            return {
                lastClickedFeature: undefined,
                overlay: undefined,
                lastHoveredFeature: undefined,
                centerCoords1: [14.5, 46],
                centerCoords: undefined,
                maxDepth: 2,
                vectorLayer: undefined,
                lineVectorLayer: undefined,
                map: undefined,
                alreadyAdded: {},
                addMode: false,
                popupTitle: '',
                popupContent: null,
                popupCoords: '',
                initing: false,
                mydatachanged: false
            }
        },

        watch: {
            mydata: function () {
                Vue.nextTick(function () {
                    if (!this.initing) {
                        this.initing = true;
                        this.getData();
                        this.initing = false;
                        this.mydatachanged = false;
                    }
                    else {
                        mydatachanged = true;
                    }
                }.bind(this));
            },
            mydatachanged: function () {
                if (!this.mydatachanged)
                    this.getData()
            }
        },

        mounted: function () {
            this.centerCoords = transformCoords(this.centerCoords1);

            let popup = this.$refs.popup.$el;
            this.overlay = new ol.Overlay(({
                element: popup,
                autoPan: true,
                autoPanAnimation: {
                    duration: 250
                }
            }));

            // todo empty map:
            // new ol.layer.Vector({
            //       source: undefined
            //     })
            // todo allow change of maps
            // source: new ol.source.OSM()

            this.initMap();
            // this.getData();
        },

        props: {
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '100%'
            },
            source: {
                type: String,
                default: 'Bing'
            },
            mydata: {
                type: Object,
                default: () => {return {'points': [], 'connections': []};}
            }
        },

        components: {
            'Popup': Popup
        }
    }
</script>
