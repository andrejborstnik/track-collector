import * as config from 'config';
import moment from 'moment-timezone';
import ol from 'openlayers';
import request from 'request-promise-native';

export default class TrackStorage {

  constructor(map, userId, color) {
      this.map = map;
      this.data = [];
      this.userId = userId;
      this.blankColor = "rgba(255,0,0,0)";
      this.strikeColor = color;
      this.pointBlankColor = "rgba(255,0,0,0)";
      this.pointColor = color;
      this.pointStrokeColor = color;
      this.width = 3;
      this.radius = 8;
      this.pointStrokeWidth = 1;
      this.onLineStyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            width: this.width,
                            color: this.strikeColor
                        })
                    });
      this.offLineStyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            width: this.width,
                            color: this.blankColor
                        })
                    });

      this.onPointStyle = new ol.style.Style({
          image: new ol.style.Circle({
               radius: this.radius,
               fill: new ol.style.Fill({
                 color: this.pointColor
               })
               ,
               stroke: new ol.style.Stroke({
                 color: this.pointStrokeColor,
                 width: this.pointStrokeWidth
               })
             })
      });
      this.offPointStyle = new ol.style.Style({
          image: new ol.style.Circle({
               radius: this.radius,
               fill: new ol.style.Fill({
                 color: this.blankColor
               })
               ,
               stroke: new ol.style.Stroke({
                 color: this.blankColor,
                 width: this.pointStrokeWidth
               })
             })
      });
      this.dataLength = null;   // size of array of data samples
      this.startTimeIndex = null;
      this.endTimeIndex = null;
      this.lineFeatures = [];
      this.pointFeatures = [];
      this.lineVectorLayer = null;
      this.pointVectorLayer = null;
      this.startDateTimeChanged = false;
      this.endDateTimeChanged = false;
  };

  setColor(color) {
    if(color != null && color !== this.color) {
      this.onLineStyle.getStroke().setColor(color);
      this.onPointStyle.getImage().getFill().setColor(color);
    }
  };

  setStartDateTime(date, time, timezone) {
      this.setStartDateTimeRaw(moment.tz(TrackStorage.buildTimestamp(date, time), timezone).valueOf());
  }

  setEndDateTime(date, time, timezone) {
      this.setEndDateTimeRaw(moment.tz(TrackStorage.buildTimestamp(date, time), timezone).valueOf());
  }

  setStartDateTimeRaw(raw) {
      let oldSDT = this.startDateTime;
      this.startDateTime = raw;
      this.startDateTimeChanged = oldSDT == null ? true : (oldSDT != this.startDateTime);
  }

  setEndDateTimeRaw(raw) {
      let oldEDT = this.endDateTime;
      this.endDateTime = raw;
      this.endDateTimeChanged = oldEDT == null ? true : (oldEDT != this.endDateTime);
  }
  adjustVisibility(minTime, maxTime) {
      // let startDateTime = this.startDateTime();
      // let endDateTime = this.endDateTime();

      let minT = Math.min(Math.max(minTime, this.startDateTime), this.endDateTime);
      let maxT = Math.max(Math.min(maxTime, this.endDateTime), this.startDateTime);
      if(this.startTimeIndex == null) return;
      for(let i = 0; i < this.dataLength - 1; i++) {
          let lineFeature = this.lineFeatures[i];
          let pointFeature = this.pointFeatures[i];
          if(this.startTimeIndex[i] >= minT && maxT >= this.endTimeIndex[i]) {
              lineFeature.setStyle(this.onLineStyle);
              pointFeature.setStyle(this.onPointStyle);
              // pointFeature.getStyle().setZIndex(1);
          } else {
              lineFeature.setStyle(this.offLineStyle);
              pointFeature.setStyle(this.offPointStyle);
          }
      }
      let last = this.dataLength - 1;
      let lastPointFeature = this.pointFeatures[last];
      if(this.startTimeIndex[last] >= minT && maxT >= this.endTimeIndex[last]) {
          lastPointFeature.setStyle(this.onPointStyle);
      } else {
          lastPointFeature.setStyle(this.offPointStyle);
      }
  };

  loadForTimes(startTime, endTime, realTimeGap) {
      // load missing data
      // calculate time gaps
      // load missing data
  };

  zoomToVectorLayerExtent() {
      if (this.lineVectorLayer == null) return;
      if (this.lineVectorLayer.getSource() != null)
          this.map.getView().fit(this.lineVectorLayer.getSource().getExtent(), this.map.getSize());
  };

  getExtent() {
      if (this.lineVectorLayer == null) return null;
      let src = this.lineVectorLayer.getSource();
      if (src == null) return null;
      return src.getExtent();
  };

  getTrack (token, startCallback, endCallback) {
      if(!this.startDateTimeChanged && !this.endDateTimeChanged) return;
      let path = `/track`;
      if(startCallback != null) startCallback();
      console.log(moment(this.startDateTime).toISOString())
      request({
          method: "POST",
          uri: config.paths_api_prefix + path,
          json: {
              // startDate: moment(TrackStorage.buildTimestamp(this.startDate, this.startTime)).tz('Europe/Berlin').toISOString(),
              // endDate: moment(TrackStorage.buildTimestamp(this.endDate, this.endTime)).tz('Europe/Berlin').toISOString(),
              startDate: moment(this.startDateTime).toISOString(),
              endDate: moment(this.endDateTime).toISOString(),
              requiredAccuracy: 0,
              singlePointStops: true,
              token: token,
              userIds: [this.userId]
          }
      }).then((body) => {
          console.log(body.tracks);
          this.mergeData(body.tracks);
          this.startDateTimeChanged = false;
          this.endDateTimeChanged = false;
          if(endCallback != null) endCallback();
      });
  };

  static transformCoords (coords) {
      return ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857');
  };

  static buildTimestamp(date, time) {
      return date + " " + time
  };

  mergeData(output) {
      let len = 0;
      let j = 0;
      for (let el of output) {
          len += el.samples.length;
      }
      this.dataLength = len;
      this.data = new Array(len);
      this.startTimeIndex = new Array(len);
      this.endTimeIndex = new Array(len);
      let i = 0;
      for(let el of output) {
          for(let obj of el.samples) {
              obj.intTimestamp = moment(obj.timestamp).valueOf();
              this.data[i] = obj;
              if(i > 0) {
                  let obj0 = this.data[i - 1];
                  let line = new ol.geom.LineString([
                                  TrackStorage.transformCoords([obj0.longitude, obj0.latitude]),
                                  TrackStorage.transformCoords([obj.longitude, obj.latitude])
                                ]);
                  let lineGeo = new ol.Feature({geometry: line});
                  lineGeo.setId(i);
                  this.lineFeatures.push(lineGeo);
                  this.startTimeIndex[i] = obj0.intTimestamp;
                  this.endTimeIndex[i] = obj.intTimestamp;
              }
              let point = new ol.geom.Point(TrackStorage.transformCoords([obj.longitude, obj.latitude]));
              let pointLabel = new ol.geom.Point(TrackStorage.transformCoords([obj.longitude, obj.latitude]));
              let pointGeo = new ol.Feature({ labelPoint: point, geometry: point});
              pointGeo.setId(i);
              this.pointFeatures.push(pointGeo);
              i++;
          }
      }

      if (!this.lineVectorLayer) {
          let vectorSource = new ol.source.Vector({
              features: this.lineFeatures
          });

          this.lineVectorLayer = new ol.layer.Vector({
              source: vectorSource
          });
          this.map.addLayer(this.lineVectorLayer);
      } else {
          this.lineVectorLayer.getSource().clear();
          this.lineVectorLayer.getSource().addFeatures(this.lineFeatures);
          this.lineVectorLayer.changed();
      }
      if (!this.pointVectorLayer) {
          let vectorSource = new ol.source.Vector({
              features: this.pointFeatures
          });

          this.pointVectorLayer = new ol.layer.Vector({
              source: vectorSource,
              minResolution: 0.001,
              maxResolution: 10
          });
          this.map.addLayer(this.pointVectorLayer);
      }
      else {
          this.pointVectorLayer.getSource().clear();
          this.pointVectorLayer.getSource().addFeatures(this.pointFeatures);
          this.pointVectorLayer.changed();
      }
      // // set proper styles
      // let minT = moment(TrackStorage.buildTimestamp(this.startDate, this.startTime)).valueOf();
      // let maxT = moment(TrackStorage.buildTimestamp(this.endDate, this.endTime)).valueOf();
      this.adjustVisibility(this.startDateTime, this.endDateTime);
  };

  get pointLayerVisibility() {
      if(this.pointVectorLayer) {
          return this.pointVectorLayer.getVisible();
      }
      return false;
  };

  set pointLayerVisibility(visible) {
    if(this.pointVectorLayer) {
        this.pointVectorLayer.setVisible(visible);
    }
  };

  get lineLayerVisibility() {
    if(this.lineVectorLayer) {
        return this.lineVectorLayer.getVisible();
    }
    return false;
  };

  set lineLayerVisibility(visible) {
    if(this.lineVectorLayer) {
        this.lineVectorLayer.setVisible(visible);
    }
  };

  get visible() {
      return this.pointLayerVisibility || this.lineLayerVisibility;
  };

  set visible(value) {
      this.pointLayerVisibility = value;
      this.lineLayerVisibility = value;
  };

};
