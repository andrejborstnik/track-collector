import * as config from 'config';
import moment from 'moment-timezone';
import ol from 'openlayers';
import request from 'request-promise-native';
import GroupsStorage from 'common/GroupsStorage'

export default class TrackStorage {

  constructor(map, userId, color) {
      this.map = map;
      this.speedLimitSmall = 130/3.6;
      this.speedLimitBig = 140/3.6;
      this.pointAnalysisType = 0; // 0-SPEED, 1-DELAY
      this.delaySmall = 60000;   // 1min
      this.delayBig = 600000;    // 10 min
      this.data = [];
      this.userId = userId;
      this.blankColor = "rgba(255,0,0,0)";
      this.strikeColor = color;
      this.pointBlankColor = "rgba(255,0,0,0)";
      this.pointColor = color;
      this.pointStrokeColor = color;
      this.alertPointColor = '#FFA500';
      this.bigAlertPointColor = '#FF0000';
      this.width = 5;
      this.radius = 8;
      this.bigRadius = 12;
      this.pointStrokeWidth = 1;
      this.onLineStyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            width: 5, //this.width,
                            color: "blue" //this.strikeColor
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
      this.onPointAlertStyle = new ol.style.Style({
          image: new ol.style.Circle({
               radius: this.radius,
               fill: new ol.style.Fill({
                 color: this.alertPointColor
               })
               ,
               stroke: new ol.style.Stroke({
                 color: this.pointStrokeColor,
                 width: this.pointStrokeWidth
               })
             })
      });
      this.onPointBigAlertStyle = new ol.style.Style({
          image: new ol.style.Circle({
               radius: this.bigRadius,
               fill: new ol.style.Fill({
                 color: this.bigAlertPointColor
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

      this.analysisPallete = [this.onPointStyle, this.onPointAlertStyle, this.onPointBigAlertStyle];
      this.dataLength = null;   // size of array of data samples
      this.startTimeIndex = null;
      this.endTimeIndex = null;
      this.lineFeatures = [];
      this.pointFeatures = [];
      this.lineVectorLayer = null;
      this.pointVectorLayer = null;
      // this.startDateTimeChanged = false;
      // this.endDateTimeChanged = false;
      this.loadedStartDateTime = null;
      this.loadedEndDateTime = null;
      this.currentExtent = [];
      //  [1301438.3041983845, 5697931.47271672, 1620677.9131304354, 5789591.817239217]
      this.historyMode = true; // HISTORY mode
      this.setDefaultZoomLivemode = true; // helper variable
      this.liveModeColorSample = '#00FF00'; // green
      this.liveModeColorLateSample = '#FF0000'; // red
      this.liveModeColorSelectedSample = color; // blue

      this.onPointStyleLiveMode = new ol.style.Style({
          image: new ol.style.Circle({
               radius: this.radius,
               fill: new ol.style.Fill({
                 color: this.liveModeColorSample
               })
               ,
               stroke: new ol.style.Stroke({
                 color: this.pointStrokeColor,
                 width: this.pointStrokeWidth
               })
             })
      });
      this.onPointStyleLateLiveMode = new ol.style.Style({
          image: new ol.style.Circle({
               radius: this.radius,
               fill: new ol.style.Fill({
                 color: this.liveModeColorLateSample
               })
               ,
               stroke: new ol.style.Stroke({
                 color: this.pointStrokeColor,
                 width: this.pointStrokeWidth
               })
             })
      });
      this.onPointStyleLiveModeSelected = new ol.style.Style({
          image: new ol.style.Circle({
               radius: this.bigRadius,
               fill: new ol.style.Fill({
                 color: this.liveModeColorSelectedSample
               })
               ,
               stroke: new ol.style.Stroke({
                 color: this.pointStrokeColor,
                 width: this.pointStrokeWidth
               })
             })
      });
      this.analysisPalleteLiveMode = [this.onPointStyleLiveMode, this.onPointStyleLateLiveMode, this.onPointStyleLiveModeSelected];
      this.oldSampleLive = 3600000; //old sample in Live mode
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
      // this.startDateTimeChanged = oldSDT == null ? true : (oldSDT != this.startDateTime);
  }

  setEndDateTimeRaw(raw) {
      let oldEDT = this.endDateTime;
      this.endDateTime = raw;
      // this.endDateTimeChanged = oldEDT == null ? true : (oldEDT != this.endDateTime);
  }

  setPointAnalysisType(type) {
      if(type == "SPEED") {
          this.pointAnalysisType = 0;
          return;
      }
      if(type == "DELAY") {
          this.pointAnalysisType = 1;
          return;
      }
      if(type == "BATTERY") {
          this.pointAnalysisType = 2;
          return;
      }
      this.pointAnalysisType = 0;   // SPEED is default
  }

  setHistoryMode(mode, store, selectedUser) {
    var grpStor = new GroupsStorage(store);
    if(mode == 'LIVE'){
      this.historyMode = false;
      this.setDefaultZoomLivemode = true;
      return grpStor.setAllVisible();
    }
    clearInterval(store.user.intervalLiveLoad);
    this.historyMode = true;
    grpStor.setSelectedUserVisibleOnly(selectedUser);
    this.emptyLinePointVectors();
  }

  emptyLinePointVectors() {
    if(this.lineVectorLayer) {
      this.lineVectorLayer.getSource().clear();
      this.map.removeLayer(this.lineVectorLayer);
      
    }
    if (this.pointVectorLayer) {
      this.pointVectorLayer.getSource().clear();
      this.map.removeLayer(this.pointVectorLayer);
    }
    
  }

  setPopupLiveMode(user) {
    for (let obj of this.data) {
      if(user && user == obj.username) {obj.analysisMode = this.pointAnalysisLiveMode(obj, true);}
      else {obj.analysisMode = this.pointAnalysisLiveMode(obj);}
    }
    this.adjustVisibilityLiveMode()
  }

  setGroupWithVisibleUser(groupId, store, historyMode, username) {
    var grpStor = new GroupsStorage(store);
    grpStor.setGroupWithVisibleUser(groupId, historyMode, username);
  }

  // analysisStyle(obj) {
  //     if(this.pointAnalysisType == null) return this.onPointStyle;
  //     if(this.pointAnalysisType == 1) {  // delay
  //         let delay = obj.intRecorded - obj.intTimestamp;
  //         if(delay <= this.delaySmall) return this.analysisPallete[0];
  //         if(delay <= this.delayBig) return this.analysisPallete[1];
  //         return this.analysisPallete[2];;
  //     }
  //     if(this.pointAnalysisType == 2) {  // battery
  //         let battery = obj.batteryLevel;
  //         console.log(battery);
  //         if(battery > 0.5) return this.analysisPallete[0];
  //         if(battery > 0.15) return this.analysisPallete[1];
  //         return this.analysisPallete[2];
  //     }
  //
  //     // pointAnalysisType == 0
  //     if(obj.speed <= this.speedLimitSmall) return this.analysisPallete[0];
  //     if(obj.speed <= this.speedLimitBig) return this.analysisPallete[1];
  //     return this.analysisPallete[2];
  // }

  pointAnalysisMode(obj) {
      if(this.pointAnalysisType == null) return 0;
      if(this.pointAnalysisType == 1) {  // delay
          let delay = obj.intRecorded - obj.intTimestamp;
          if(delay <= this.delaySmall) return 0;
          if(delay <= this.delayBig) return 1;
          return 2;
      }
      if(this.pointAnalysisType == 2) {  // battery
          let battery = obj.batteryLevel;
          if(battery > 0.5) return 0;
          if(battery > 0.15) return 1;
          return 2;
      }


      if(obj.speed <= this.speedLimitSmall) return 0;
      if(obj.speed <= this.speedLimitBig) return 1;
      return 2;
  }

  pointAnalysisLiveMode(obj, selected) {
    if(selected) return 2;
    var now = moment.tz('Europe/Berlin').valueOf();
    if((now - obj.intRecorded) < this.oldSampleLive) {
      return 0;
    } else {
      return 1;
    }    
  }

  adjustVisibility(minTime, maxTime) {
      // let startDateTime = this.startDateTime();
      // let endDateTime = this.endDateTime();
      if(this.dataLength == null) return;
      let minT = Math.min(Math.max(minTime, this.startDateTime), this.endDateTime);
      let maxT = Math.max(Math.min(maxTime, this.endDateTime), this.startDateTime);
      let minx = Infinity;
      let miny = Infinity;
      let maxx = -Infinity;
      let maxy = - Infinity;
      let linePoints = [];

      this.indexMap = new Map();
      let analysisLength = 3;
      let pointGroups = [];
      for(let j = 0; j < analysisLength; j++) {
          this.indexMap.set(j, new Map());
          pointGroups.push([]);
      }
      let i = 0;
      for(let obj of this.data) {
          let x = obj.coords[0];
          let y = obj.coords[1];

          if(obj.intTimestamp >= minT && maxT >= obj.intTimestamp) {
              // lineFeature.setStyle(this.onLineStyle);
              // pointFeature.setStyle(this.analysisStyle(this.data[i]));
              minx = x < minx ? x : minx;
              miny = y < miny ? y : miny;
              maxx = x > maxx ? x : maxx;
              maxy = y > maxy ? y : maxy;
              linePoints.push(obj.coords);
              let tmpLst = pointGroups[obj.analysisMode];
              this.indexMap.get(obj.analysisMode).set(tmpLst.length, i);
              tmpLst.push(obj.coords);
          }
          i++;
      }
      this.currentExtent = [minx, miny, maxx, maxy];
      let lineFeature = new ol.Feature({geometry: new ol.geom.LineString(linePoints)});
      lineFeature.setStyle(this.onLineStyle);
      let lineFeatures  = [lineFeature];
      let pointFeatures = [];
      for(let j = 0; j < analysisLength; j++) {
          let ptFeature = new ol.Feature({geometry: new ol.geom.MultiPoint(pointGroups[j])});
          ptFeature.setId(j);
          ptFeature.setStyle(this.analysisPallete[j]);
          pointFeatures.push(ptFeature);
      }

      if(this.lineVectorLayer) {
        this.lineVectorLayer.getSource().clear();
        this.lineVectorLayer.getSource().addFeatures(lineFeatures)
      }
      if(this.pointVectorLayer) {
        this.pointVectorLayer.getSource().clear();
        this.pointVectorLayer.getSource().addFeatures(pointFeatures);
      }

  };

  adjustVisibilityLiveMode() {
      if(this.dataLength == null) return;
      let minx = Infinity;
      let miny = Infinity;
      let maxx = -Infinity;
      let maxy = - Infinity;
      let linePoints = [];

      this.indexMap = new Map();
      let analysisLength = this.analysisPalleteLiveMode.length;
      let pointGroups = [];
      for(let j = 0; j < analysisLength; j++) {
          this.indexMap.set(j, new Map());
          pointGroups.push([]);
      }
      let i = 0;
      for(let obj of this.data) {
          let x = obj.coords[0];
          let y = obj.coords[1];

          // if(obj.intTimestamp >= minT && maxT >= obj.intTimestamp) {
              minx = x < minx ? x : minx;
              miny = y < miny ? y : miny;
              maxx = x > maxx ? x : maxx;
              maxy = y > maxy ? y : maxy;
              linePoints.push(obj.coords);
              let tmpLst = pointGroups[obj.analysisMode];
              this.indexMap.get(obj.analysisMode).set(tmpLst.length, i);
              tmpLst.push(obj.coords);
          // }
          i++;
      }
      this.currentExtent = [minx, miny, maxx, maxy];

      let pointFeatures = [];
      for(let j = 0; j < analysisLength; j++) {
          let ptFeature = new ol.Feature({geometry: new ol.geom.MultiPoint(pointGroups[j])});
          ptFeature.setId(j);
          ptFeature.setStyle(this.analysisPalleteLiveMode[j]);
          pointFeatures.push(ptFeature);
      }

      this.pointVectorLayer.getSource().clear();
      this.pointVectorLayer.getSource().addFeatures(pointFeatures);
      
      if(this.getExtent() && this.setDefaultZoomLivemode) this.map.getView().fit(this.getExtent(), this.map.getSize());
      if(this.setDefaultZoomLivemode) this.setDefaultZoomLivemode = false;
  };

  getDataForPointFeature(feature, index) {
      // debugger
      // let id = feature.getId();
      // let newId = this.indexMap.get(id).get(index);

      return this.data[index];
  }

  zoomToVectorLayerExtent() {
      if (this.lineVectorLayer == null) return;
      if (this.lineVectorLayer.getSource() != null)
          this.map.getView().fit(this.lineVectorLayer.getSource().getExtent(), this.map.getSize());
  };

  runAnalysis() {
      for(let obj of this.data) {
          obj.analysisMode = this.pointAnalysisMode(obj);
      }
      this.adjustVisibility(this.startDateTime, this.endDateTime);
  }

  getExtent() {
      // if (this.lineVectorLayer == null) return null;
      // let src = this.lineVectorLayer.getSource();
      // if (src == null) return null;
      // return src.getExtent();
      return this.currentExtent;
  };

  getTrack (token, startCallback, endCallback, usersLive, selectedUsername) {
      // if(!this.startDateTimeChanged && !this.endDateTimeChanged) return;
      let path = `/track`;
      if(startCallback != null) startCallback();
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
              userIds: (usersLive) ? usersLive : ((selectedUsername) ? [selectedUsername] : [this.userId]),
              lastPositionsOnly: !this.historyMode,
          }
      }).then((body) => {
          this.emptyLinePointVectors();
          if(this.historyMode) {this.mergeData(body.tracks);}
          else {this.mergeDataLiveMode(body.tracks, selectedUsername);}
          if(endCallback != null) endCallback();
      });
  };

  static transformCoords (coords) {
      return ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857');
  };

  static buildTimestamp(date, time) {
    let res = date.slice(0,10)
            + "T"
            + time.replace(/^(\d):/, '0$1:' )
                  .replace(/^(\d\d):(\d)([^\d]*)$/, '$1:0$2')
                  .replace(/^(\d\d):(\d\d).*$/, '$1:$2') + ":00";
    return res;
  };

  mergeData(output) {
      this.loadedStartDateTime = this.startDateTime;
      this.loadedEndDateTime = this.endDateTime;
      // this.startDateTimeChanged = false;
      // this.endDateTimeChanged = false;
      let len = 0;
      let j = 0;
      for (let el of output) {
          len += el.samples.length;
      }
      // this.dataLength = len;
      this.data = [];//new Array(len);
      // let linePoints = new Array(len);
      let linePoints = []
      let i = 0;
      for(let el of output) {
          for(let obj of el.samples) {
              obj.intTimestamp = moment(obj.timestamp).valueOf();
              obj.intRecorded = moment(obj.recorded).valueOf();
              if((obj.intRecorded - obj.intTimestamp) >= 0) {
                let tmp = TrackStorage.transformCoords([obj.longitude, obj.latitude]);
                tmp.push(i);
                obj.coords = tmp;
                obj.analysisMode = this.pointAnalysisMode(obj);
                obj.username = el.userId;
                obj.name = el.name;
                this.data[i] = obj;
                linePoints.push(tmp);
                i++;
              }
          }
      }
      this.dataLength = this.data.length;
      let vectorSource = new ol.source.Vector({
          features: []
      });
      this.lineVectorLayer = new ol.layer.Vector({
          source: vectorSource
      });
      this.map.addLayer(this.lineVectorLayer);

      let pointVectorSource = new ol.source.Vector({
          features: []
      });

      this.pointVectorLayer = new ol.layer.Vector({
          source: pointVectorSource,
      });
      this.map.addLayer(this.pointVectorLayer);
      this.adjustVisibility(this.startDateTime, this.endDateTime);
  };

  mergeDataLiveMode(output, selectedUsername) {
      let len = 0;
      let j = 0;
      for (let el of output) {
          len += el.samples.length;
      }
      this.dataLength = len;
      this.data = new Array(len);
      // let linePoints = new Array(len);
      let linePoints = []
      let i = 0;
      for(let el of output) {
          for(let obj of el.samples) {
              obj.intTimestamp = moment(obj.timestamp).valueOf();
              obj.intRecorded = moment(obj.recorded).valueOf();
              let tmp = TrackStorage.transformCoords([obj.longitude, obj.latitude]);
              tmp.push(i);
              obj.coords = tmp;
              obj.username = el.userId;
              obj.name = el.name;
              if(selectedUsername && selectedUsername == obj.username) obj.analysisMode = this.pointAnalysisLiveMode(obj, true);
              else obj.analysisMode = this.pointAnalysisLiveMode(obj);
              this.data[i] = obj;
              linePoints.push(tmp);
              i++;
          }
      }
      let pointVectorSource = new ol.source.Vector({
          features: []
      });

      this.pointVectorLayer = new ol.layer.Vector({
          source: pointVectorSource,
      });
      this.map.addLayer(this.pointVectorLayer);
      this.adjustVisibilityLiveMode();
  };

  get pointLayer() {
      return this.pointVectorLayer;
  }

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
