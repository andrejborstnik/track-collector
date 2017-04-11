<template>
    <section>
        <div class="ol-popup" id="test">
            <a @click="closePopup" id="popup-closer" class="ol-popup-closer"></a>
            <div>
                <p>
                    {{title}}
                </p>
            </div>
            <code>{{coords}}</code>
            <div>
                <div v-for="(val, key) of content">
                    <span>{{key}}:</span> <span>{{val}}</span>
                </div>
            </div>
        </div>
    </section>
</template>


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