<template>
    <section>
        <div class="ol-popup" id="olpopup" >
            <a @click="closePopup" id="popup-closer" class="ol-popup-closer"></a>
            <div>
                <p>
                    {{title}}
                </p>
            </div>
            <!--
            <code>{{coords}}</code>
            <div>
                <div v-for="(val, key) of content">
                    <span>{{key}}:</span> <span>{{val}}</span>
                </div>
            </div>
          -->
        </div>
    </section>
</template>

<style lang="scss">
    .ol-popup table {
        font-family: arial, sans-serif;
        font-size: 85%;
        border-collapse: collapse;
        outline: 1px solid #adadad;
        width: 100%;
    }

    .ol-popup td, .ol-popup th {
        text-align: left;
        padding: 4px;
    }

    .ol-popup tr:nth-child(odd) {
        background-color: #adadad;
        color: white;
    }
    #olpopup {
        width: 130px;
        height: 30px;
        padding-left: 10px;
    }
    .ol-popup {
        position: absolute;
        background-color: white;
        -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        padding: 3px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
    }
    .ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    .ol-popup:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
    }
    .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
    }
    .ol-popup-closer {
        text-decoration: none;
        position: absolute;
        color: red;
        top: 2px;
        right: 8px;
    }
    .ol-popup-closer:after {
        content: "✖";
    }
    .ol-popup-add {
        text-decoration: none;
        position: absolute;
        top: 18px;
        right: 8px;
    }
    .ol-popup-add:after {
        content: "Dodaj v plan";
    }
</style>


<script type="text/babel">

  export default {
      name: "MapPopup",
	  props: {
          title: {
              type: String,
			  default: null
		  },
		  content: {
              type: Object
		  },
          coords: {
              type: String
          },
          width: {
              default: '200px'
          }
	  },

	  mounted: function() {
          $(document).keydown(function (event) {
              if (27 == event.keyCode) {
                  this.closePopup();
              }
          }.bind(this));
      },
	  methods: {
          closePopup: function() {
              this.$parent.overlay.setPosition();
              return false;
          }
	  }
  }
</script>
