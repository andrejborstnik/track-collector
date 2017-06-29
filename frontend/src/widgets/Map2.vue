<template>
    <section>
        <Popup :title="popupTitle" :content="popupContent" :coords="popupCoords" ref="popup"></Popup>
        <div ref="map" class="map"></div>
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

    import _ from 'lodash';

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




    let zoomToExtent = function() {
        this.$store.user.trackStorage.zoomToExtent();
    };

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

    let adjustVisibility = function() {
        this.$store.user.trackStorage.adjustVisibility(this.timeInterval[0], this.timeInterval[1]);
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
        // this.getData();
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
            onMapClick,
            initMap,
            // getData,
            onMapPointermove,
            zoomToExtent,
            adjustVisibility
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
            // mydata: function () {
            //     Vue.nextTick(function () {
            //         if (!this.initing) {
            //             this.initing = true;
            //             this.getData();
            //             this.initing = false;
            //             this.mydatachanged = false;
            //         }
            //         else {
            //             this.mydatachanged = true;
            //         }
            //     }.bind(this));
            // },
            // mydatachanged: function () {
            //     if (!this.mydatachanged)
            //         this.getData();
            // },
            storeChanged: function() {
                this.map.render();
            },
            timeInterval: function() {
                this.adjustVisibility();
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
            },
            timeInterval: {
                type: Array,
                default: 0
            },
            storageChanged: {
                type: Number,
                default: 0
            }
        },

        components: {
            'Popup': Popup
        }
    }
</script>
