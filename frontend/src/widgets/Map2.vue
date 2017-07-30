<template>
    <section>
        <Popup :title="popupTitle"
            :content="popupContent"
            :coords="popupCoords"
            ref="popup"
            borderColor="white"
            :speed="popupSpeed"
            :delay="popupDelay"
            ></Popup>

        <!-- <Popup :title="previousPopupTitle"
            :content="previousPopupContent"
            :coords="previousPopupCoords"
            ref="popup2"
            borderColor="white"
            :speed="20"
            ></Popup> -->
        <div ref="map" style="flex: 1; min-height: 0"></div>

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
    import moment from 'moment-timezone';

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

    let popupStats = function(coordinate) {
        let coordinate1 = this.lastClickedFeatureData.coords.slice(0,2);
        let hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate1, 'EPSG:3857', 'EPSG:4326'));

        // let data = feature.getProperties();
        this.popupTitle = moment(this.lastClickedFeatureData.timestamp).format("D[.]M[.]YYYY k:mm:ss");
        if(this.lastClickedFeatureData.recorded) {
            this.popupDelay = moment.duration(moment(this.lastClickedFeatureData.recorded).diff(moment(this.lastClickedFeatureData.timestamp)))/1000 + "s";//.humanize();
        } else {
            this.popupDelay = null;
        }

        this.popupSpeed = Math.round(this.lastClickedFeatureData.speed*3.6);


        // delete data.geometry;
        // delete data.labelPoint;
        // delete data.time;
        // delete data.received;
        // delete data.speed;

        // this.popupContent = data;
        this.popupCoords = hdms;
        this.overlay.setPosition(coordinate1);
        // if(previousFeature != null) {
        //     let coordinateP = previousFeature.getGeometry().getClosestPoint([0,0]);
        //     let hdmsP = ol.coordinate.toStringHDMS(ol.proj.transform(coordinateP, 'EPSG:3857', 'EPSG:4326'));
        //
        //     let dataP = previousFeature.getProperties();
        //     this.previousPopupTitle = dataP.name;
        //
        //     delete dataP.geometry;
        //     delete dataP.labelPoint;
        //     delete dataP.name;
        //
        //     this.previousPopupContent = dataP;
        //     this.previousPopupCoords = hdmsP;
        //     this.previousOverlay.setPosition(coordinateP);
        //     console.log(coordinate1, coordinateP);
        // } else {
        //     console.log(coordinate1, null);
        // }
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
        // // todo save clone last hovered and use it to compare
        // if (!this.lastHoveredFeature) {
        //     // Add feature to last hovered in case our touchy friends click
            if(!this.$store.user.trackStorage.firstVisibleStorage) return;
            let hit = this.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                this.lastClickedFeature = feature;
                let coordinate = this.map.getEventCoordinate(evt.originalEvent);
                let point = feature.getGeometry().getClosestPoint(coordinate);
                this.lastClickedFeatureData = this.$store.user.trackStorage.firstVisibleStorage.getDataForPointFeature(feature, point[2]);

                this.previousClickedFeature = this.lastClickedFeature;
                this.previousClickedFeatureData = this.lastClickedFeatureData;
                // this.lastClickedFeature = feature;
                // this.lastPointLayer = layer;
                return true;
            }.bind(this), {
                layerFilter: function (layer) {
                    return layer == this.$store.user.trackStorage.firstVisibleStorage.pointLayer;
                }.bind(this)
            });
            // if (!hit)
            //     return;
        // }

        // let lastHovered = this.lastHoveredFeature.getId();
        // let hit = this.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        //     // if (this.lastHoveredFeature) {
        //     //   this.$refs.popup.lastClickedFeature = this.lastHoveredFeature
        //     // }
        //     // else {
        //     // this.$refs.popup.lastClickedFeature = feature
        //     this.lastClickedFeature = this.vectorLayer.getSource().getFeatureById(lastHovered);
        //     return true;
        // }.bind(this), {
        //     filterLayer: function (layer) {
        //         return layer == this.vectorLayer;
        //     }.bind(this)
        // });

        if (hit) {
            this.popupStats(evt.coordinate);
        } else {
            this.overlay.setPosition();
            // this.previousOverlay.setPosition();
            this.previousClickedFeature = null;
            this.lastClickedFeature = null;
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
            // controls: ol.control.defaults({
            //     attributionOptions: ({
            //         collapsible: false
            //     })
            // }),
            renderer: ('webgl'),
            overlays: [this.overlay], //, this.previousOverlay],
            view: new ol.View({
                center: [this.centerCoords[0], this.centerCoords[1]],
                zoom: 9,
                // minZoom: 5
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
        return;  // too slow. Maybe enable if not too many pixels
        // let hit = this.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        //     this.lastClickedFeature = feature;
        //     this.lastPointLayer = layer;
        //     return true;
        // }.bind(this), {
        //     layerFilter: function (layer) {
        //         for(let lay of this.$store.user.trackStorage.pointLayers) {
        //             if(layer == lay) return true;
        //         }
        //         return false;
        //     }.bind(this)
        // });
        //
        // if (hit) {
        //     this.popupStats(this.lastClickedFeature, e.coordinate);
        // } else {
        //     this.overlay.setPosition();
        //     this.previousOverlay.setPosition();
        // }

        // //todo currently index is raising to inf. if it becomes an issue fix it
        // let i;
        // this.unHover();
        //
        // let hit = this.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        //     if (!!this.lastHoveredFeature) {
        //         // module.exports.lastHoveredFeature.getStyle().setZIndex(1)
        //         i = this.lastHoveredFeature.getStyle().getZIndex();
        //         if (!i) {
        //             i = 1;
        //         }
        //         scaleMarker(this.lastHoveredFeature)
        //     }
        //     this.lastHoveredFeature = feature;
        //     return true;
        // }.bind(this), {
        //     layerFilter: function (layer) {
        //         return layer == this.vectorLayer;
        //     }.bind(this)
        // });
        // if (hit) {
        //     this.$refs.map.style.cursor = "pointer";
        //     if (i != this.maxDepth) {
        //         i = this.maxDepth;
        //         this.maxDepth = i + 1;
        //         this.lastHoveredFeature.getStyle().setZIndex(i + 1);
        //     }
        //     scaleMarker(this.lastHoveredFeature, 0.015);
        // }
        // else {
        //     this.$refs.map.style.cursor = "";
        //     this.unHover();
        // }
    };

    let activate = function () {
        this.initing = true;
        // this.getData();
        this.initing = false;
        this.mydatachanged = false;
        // setTimeout( function() { console.log("x"); this.map.updateSize();}.bind(this), 300);
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
                lastClickedFeatureData: undefined,
                previousClickedFeature: undefined,
                previousOverlay: undefined,
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
                popupSpeed: null,
                popupDelay: null,
                previousPopupTitle: '',
                popupContent: null,
                previousPopupContent: null,
                popupCoords: '',
                previousPopupCoords: '',
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
            // let popup2 = this.$refs.popup2.$el;
            // this.previousOverlay = new ol.Overlay(({
            //     element: popup2,
            //     autoPan: true,
            //     autoPanAnimation: {
            //         duration: 250
            //     }
            // }));

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
