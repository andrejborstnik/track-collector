export default class TrackStorage {

  constructor(map, userId, color) {
      this.map = map;
      this.blankColor = "rgba(255,0,0,0)";
      this.strikeColor = color;
      this.width = 3;
      this.onStyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            width: this.width,
                            color: this.strikeColor
                        })
                    });
      this.offStyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            width: this.width,
                            color: this.blankColor
                        })
                    });
      this.startTimeIndex = null;
      this.endTimeIndex = null;
      this.lineFeatures = [];
  };

  adjustVisibility(timeInterval) {
      if(this.startTimeIndex == null) return;
      let len = this.startTimeIndex.length;
      for(let i = 0; i < len; i++) {
          let feature = this.lineFeatures[i];
          if(this.startTimeIndex[i] >= timeInterval[0] && timeInterval[1] >= this.endTimeIndex[i]) {
              feature.setStyle(this.onStyle);
          } else {
              feature.setStyle(this.offStyle);
          }
      }
  };

  setConnectionsFromData(connections) {
      if (!connections || !connections.length)
          return;
      let len = connections.length;
      // initializing integer arrays
      this.startTimeIndex = new Array(len);
      this.endTimeIndex = new Array(len);
      for(let i = 0; i < len; i++) {this.startTimeIndex[i] = 0; this.endTimeIndex[i] = 0;}

      // let features = [];
      this.lineFeatures = [];
      let lineFeature;

      let i = 0;
      for (let connection of connections) {
          let data = fp.clone(connection);
          if (!data.A.longitude || !data.A.latitude) {
              // console.log('No coords for ', data.A.name);
              console.log('No coords for a segment(A).');
              continue;
          }
          if (!data.B.longitude || !data.B.latitude) {
              // console.log('No coords for ', data.B.name);
              console.log('No coords for a segment(B).');
              continue;
          }

          // let color = connection.color || colorFromLevel(connection.measured_level);

          data.geometry = new ol.geom.LineString([transformCoords([data.A.longitude, data.A.latitude]),
              transformCoords([data.B.longitude, data.B.latitude])]);

          lineFeature = new ol.Feature(data);
          this.lineFeatures.push(lineFeature);
          lineFeature.setId(i + 1);
          lineFeature.setStyle(onStyle);
          this.startTimeIndex[i] = data.A.timestamp;
          this.endTimeIndex[i] = data.B.timestamp;
          i++;

          // i++;
          // lineFeature.setStyle(lineStyle(color));
          // lineFeature.setId(i);
          // features.push(lineFeature);
      }
      if (!this.lineVectorLayer) {
          let vectorSource = new ol.source.Vector({
              features: this.lineFeatures
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
          this.lineVectorLayer.getSource().clear();
          this.lineVectorLayer.getSource().addFeatures(this.lineFeatures);
          this.lineVectorLayer.changed();
      }
  };

};
