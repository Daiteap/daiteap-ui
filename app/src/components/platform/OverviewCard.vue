<template>
  <b-card
    @click="$router.push(redirectPage)"
    no-body
    class="p-3 p-sm-3 p-md-3 p-lg-4 m-3 m-sm-3 m-md-3 m-lg-4 custom-card"
  >
    <b-row no-gutters>
      <b-col class="col-8 m-auto d-flex custom-font">
        <b-row no-gutters>
          <b-col>
            <span class="fa-stack landing-page-icon">
              <i class="fas fa-circle fa-stack-2x"></i>
              <i :class="favIcon" class="fas fa-stack-1x fa-inverse"></i>
            </span>
          </b-col>
        </b-row>
        <b-card-text class="my-auto">
          <b-row>
            <b-col v-if="showCount" class="ml-3">{{ title }} ({{ count }})</b-col>
            <b-col v-else class="ml-3">{{ title }}</b-col>
          </b-row>
          <b-row>
            <b-col class="cardtext">
              <br />
              {{ cardText }}
            </b-col>
          </b-row>
        </b-card-text>
      </b-col>
      <b-col class="text-right m-auto custom-font">
        <slot> </slot>
      </b-col>
      <b-col
        v-if="videosEnabled"
        class="text-right m-auto custom-font"
      >
        <b-row>
          &nbsp;&nbsp;&nbsp;
          <i class="fa fa-video videoIcon"></i>
          &nbsp; Video &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span style="line-height: 1" v-on:click.stop="$bvModal.show(title)">x</span>
        </b-row>
        <hr width="150"/>
        <b-row>
          &nbsp;&nbsp;
          <div
            width="150"
            height="100"
            class="playIcon"
          >
            <img
              width="150"
              height="100"
              :src="'https://img.youtube.com/vi/' + videoTitle.split('=')[1] + '/hqdefault.jpg'"
              v-on:click.stop="openVideo"
              style="opacity: 0.7;"
            >
          </div>
        </b-row>
      </b-col>
    </b-row>
    <GenericPopupWarning
      message="Don't show videos on Home page?"
      @confirm="closeVideo"
      :modalId="title"
    />
  </b-card>
</template>

<script>
import GenericPopupWarning from "@/components/platform/popup_modals/GenericPopupWarning";

export default {
  name: 'OverviewCard',
  components: {
    GenericPopupWarning,
  },
  data() {
    return {
      videosEnabled: false,
    };
  },
  props: {
    redirectPage: String,
    title: String,
    showCount: Boolean,
    count: Number,
    favIcon: String,
    cardText: String,
    videoTitle: String,
  },
  mounted() {
    setInterval(() => {
      this.videosEnabled = !document.cookie.includes("Videos=disabled");
    }, 1000);
  },
  methods: {
    openVideo() {
      window.open(this.videoTitle);
    },
    closeVideo() {
      document.cookie = "Videos=disabled; expires=Fri, 31 Dec 9999 14:00:00 GMT";
      this.$bvModal.hide(this.title);
    },
  },
};
</script>

<style scoped>
.custom-font {
  font-size: 24px;
}
.cardtext {
  font-size: calc(0.6rem + 0.4vw);
  color: #5f5f5f;
}
.videoIcon {
  font-size: 15px;
  color: darkgray;
  line-height: 30px;
}
.playIcon {
  background: url(./../../assets/img/play-icon.png);
}
</style>