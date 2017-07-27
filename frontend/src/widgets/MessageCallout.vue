<template>
    <section>
      <div :style="{ 'position': 'relative', 'margin-left':  marginLeft + 'px', 'margin-right': marginRight + 'px'}">

      <v-card class="ml-2 mr-2 mt-2 mb-2 pa-2" :style="{'border-radius': 10 + 'px', 'background-color': cardColor}">
         <div style="display: flex; flex-direction: column; flex-grow: 1">
          <div style="display: flex; flex-direction: row; flex-grow: 1; flex-wrap: wrap;">
            <v-icon v-if="message.type=='NOTIFICATION'">stay_primary_portrait</v-icon>
            <v-icon v-if="message.type=='GROUP_NOTIFICATION'">group</v-icon>
            <v-icon v-if="message.type=='EMAIL_TEXT'">email</v-icon>
            <v-icon v-if="message.type=='MOBILE_LOG'">email</v-icon>
            <v-icon v-if="message.type=='START'">play_arrow</v-icon>
            <v-icon v-if="message.type=='END'">pause</v-icon>
            <div v-if="message.isSent">{{this.receiver}}</div>
            <div v-if="!message.isSent">{{this.sender}}</div>
            <div style="flex-grow: 1"/>
            <div style="align-self: flex-end">{{timestampText}}({{message.messageId}})</div>
          </div>
          <div v-if="message.title"><b>{{message.title}}</b></div>
          <div v-if="message.message">{{message.message}}</div>
          <div v-if="!message.message"><i>(No message text)</i></div>
          <!-- <div v-if="messageTravelOrderId">Travel Order: {{message.travelOrderId}}</div> -->
          <div v-if="message.link"><a :href="message.link" target="_blank">download here</a></div>
        </div>
      </v-card>
      <div class="triangle" :style="{ 'border-left-color': leftArrowColor, 'border-right-color': rightArrowColor, 'left': arrowLeft + 'px', 'right': arrowRight + 'px'}"></div>
    </div>

    </section>
</template>

<style lang="scss">
  .triangle {
      border: solid transparent;
      height: 0;
      width: 0;
      top: 10px;
      position: absolute;
      pointer-events: none;
      border-width: 10px;
  }
</style>


<script type="text/babel">
  import moment from 'moment-timezone';

  export default {
        name: "MessageCallout",
        data: function () {
            return {
            }
        },
        computed: {
            marginLeft: function () {
                return this.message.isSent ? 30 : 10;
            },
            marginRight: function () {
                return this.message.isSent ? 10 : 30;
            },
            leftArrowColor: function() {
                return this.message.isSent ? this.cardColor : null;
            },
            rightArrowColor: function() {
                return !this.message.isSent ? this.cardColor : null;
            },
            arrowLeft: function() {
                return this.message.isSent ? null : -12;
            },
            arrowRight: function() {
                return this.message.isSent ? -12 : null;
            },
            timestampText: function() {
                return moment(this.message.timestamp).format("DD[.]MM[.]YYYY, k:mm:ss");
            },
            receiver: function() {
                if(this.message.receiverId) return this.message.receiverId;
                if(this.message.receiverGroup) return this.message.receiverGroup;
                if(this.message.type == "EMAIL_TEXT") return this.message.sentTo;
                return null;
            },
            sender: function() {
                if(this.message.senderGroup) return this.message.senderGroup + '(' + this.message.senderId + ')';
                return this.message.senderId;
            },
            cardColor: function() {
                switch(this.message.type) {
                    case 'NOTIFICATION':
                          return 'white';
                    case 'GROUP_NOTIFICATION':
                          return '#FFCCFF';
                    case 'EMAIL_TEXT':
                          return '#E1FFFF';
                    case 'MOBILE_LOG':
                          return '#FFDDBC';
                    case 'START':
                          return '#B3FFB3';
                    case 'END':
                          return '#FFB2B3';
                    default:
                          return 'grey';
                }
            }
        },
	      props: {
            message: {
                  type: Object,
  			          default: null
  		      }
	      },
        data () {
            return {
              maxWidth: 200
            }
        }

  }
</script>
