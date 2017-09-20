import * as config from 'config';
import moment from 'moment-timezone';
import ol from 'openlayers';
import request from 'request-promise-native';
import TrackStorage from './TrackStorage';

export default class MultiTrackStorage {
    constructor() {
        this.toStorage = new Map();
    }

    registerMap(aMap) {
        this.map = aMap;
    }

    registerUser(userId, color) {
        if(this.toStorage.has(userId)) {
           let tmpStr = this.toStorage.get(userId);
           tmpStr.setColor(color);
           return tmpStr;
        }
        // let newStorage = new TrackStorage(this.map, userId, color);
        let newStorage = new TrackStorage(this.map, userId, '#0000FF');
        this.toStorage.set(userId, newStorage);
        return newStorage;
    }

    getForUser(userId) {
        if(this.toStorage.has(userId)) return this.toStorage.get(userId);
        return null;
    }
    adjustVisibility(minTime, maxTime) {
        for(let key of this.toStorage.keys()) {
            this.toStorage.get(key).adjustVisibility(minTime, maxTime);
        }
    }

    zoomToExtent() {
      let bounds = null;
      for(let userId of this.toStorage.keys()) {
          let tmpStr = this.toStorage.get(userId);
          if(!tmpStr.visible) continue;
          let ext = tmpStr.getExtent();
          if(ext != null && ext.length == 4) {
              if(ext.indexOf(Infinity) > 0 || ext.indexOf(-Infinity) > 0) continue;
              if(bounds == null) {
                  bounds = ext;
              } else {
                  ol.extent.extend(bounds, ext);
              }
          }
      }
      if(bounds != null) {
        this.map.getView().fit(bounds, this.map.getSize());
      }
      // this.map.getView().fitExtent(bounds, map.getSize());

// if (this.lineVectorLayer == null) return;
// if (this.lineVectorLayer.getSource() != null)
//     this.map.getView().fit(this.lineVectorLayer.getSource().getExtent(), this.map.getSize());
//
//       // todo
    }

    setPointAnalysisType(type) {
        for(let key of this.toStorage.keys()) {
            this.toStorage.get(key).setPointAnalysisType(type);
        }
    }

    runAnalysis() {
        for(let key of this.toStorage.keys()) {
            this.toStorage.get(key).runAnalysis();
        }
    }
    setStartDateTime(date, time, timezone) {
        this.startDateTime = moment.tz(TrackStorage.buildTimestamp(date, time), timezone).valueOf();
        for(let key of this.toStorage.keys()) {
            this.toStorage.get(key).setStartDateTimeRaw(this.startDateTime);
        }
    }

    setEndDateTime(date, time, timezone) {
        this.endDateTime = moment.tz(TrackStorage.buildTimestamp(date, time), timezone).valueOf();
        for(let key of this.toStorage.keys()) {
            this.toStorage.get(key).setEndDateTimeRaw(this.endDateTime);
        }
    }

    getTrack (token, startCallback, endCallback, usersLive) {
        for(let userId of this.toStorage.keys()) {
            this.toStorage.get(userId).getTrack(token, startCallback, endCallback, usersLive);
        }
    }

    getTrackForUser (token, userId, startCallback, endCallback) {
            this.toStorage.get(userId).getTrack(token, startCallback, endCallback);
    }

    get pointLayers() {
        let lst = [];
        for(let key of this.toStorage.keys()) {
            lst.push(this.toStorage.get(key).pointLayer);
        }
        return lst;
    }

    get firstVisibleStorage() {
        for(let key of this.toStorage.keys()) {
            let tmpStr = this.toStorage.get(key);
            if(tmpStr.visible) return tmpStr;
        }
        return null;
    }

    setHistoryMode(mode, store) {
        for(let key of this.toStorage.keys()) {
            return this.toStorage.get(key).setHistoryMode(mode, store);
        }
    }

    emptyLinePointVectors() {
        for(let key of this.toStorage.keys()) {
            this.toStorage.get(key).emptyLinePointVectors();
        }
    }
}
