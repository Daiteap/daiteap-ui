<template style="cursor: unset">
  <b-row v-if="showProgressBar">
    <b-col class="px-3 py-0 col-12">
      <div>
        <b-card-group deck>
          <b-card
            no-body
            class="p-3 p-sm-3 p-md-3 p-lg-4 m-3 m-sm-3 m-md-3 m-lg-4 text-left"
            style="border-radius: 0.6rem"
          >
            <b-row>
              <b-col>
                <div
                  v-if="showProgressBar && !loading"
                  @click="$bvModal.show(warningId)"
                  class="float-right"
                  style="cursor: pointer; font-size: 24px"
                >
                  x&nbsp;&nbsp;&nbsp;
                </div>
              </b-col>
              <b-col class="col-1"></b-col>
            </b-row>
            <b-row>
              <b-col>
                <div v-if="showProgressBar">
                  <div v-if="loading" class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                  <div v-show="!loading">
                    <ol class="progressList">
                      <li>
                        <span class="fa fa-circle progressDot complete"></span>
                        <progress
                          max="100"
                          value="100"
                          class="custom-progress progress"
                          style="position: relative"
                        ></progress>
                      </li>
                      <li style="margin-left: -5px">
                        <span
                          class="fa fa-circle progressDot"
                          :class="{ complete: step1 == 100 }"
                        ></span>
                        <progress
                          max="100"
                          :value="step1"
                          class="custom-progress progress"
                          style="position: relative"
                        ></progress>
                      </li>
                      <li style="margin-left: -5px">
                        <span
                          class="fa fa-circle progressDot"
                          :class="{ complete: step2 == 100 }"
                        ></span>
                        <progress
                          max="100"
                          :value="step2"
                          class="custom-progress progress"
                          style="position: relative"
                        ></progress>
                      </li>
                      <li style="margin-left: -5px">
                        <span
                          class="fa fa-circle progressDot"
                          :class="{ complete: step3 == 100 }"
                        ></span>
                        <progress
                          max="100"
                          :value="step3"
                          class="custom-progress progress"
                          style="position: relative"
                        ></progress>
                      </li>
                      <li style="margin-left: -5px">
                        <span
                          class="fa fa-circle progressDot"
                          :class="{ complete: step4 == 100 }"
                        ></span>
                      </li>
                    </ol>

                    <ol class="progressList" style="font-size: 20px">
                      <li>
                        <div
                          class="custom-progress-text"
                          style="position: relative; margin-left: 2px"
                        >
                          Register Account
                        </div>
                      </li>
                      <li>
                        <div
                          class="custom-progress-text progressText"
                          style="position: relative"
                        >
                          Add Cloud Credentials
                        </div>
                      </li>
                      <li>
                        <div
                          class="custom-progress-text progressText"
                          style="position: relative"
                        >
                          Create Project
                        </div>
                      </li>
                      <li>
                        <div
                          class="custom-progress-text progressText"
                          style="position: relative"
                        >
                          Add Resources
                        </div>
                      </li>
                      <li>
                        <div
                          class="custom-progress-text progressText"
                          style="position: relative"
                        >
                          Ready
                        </div>
                      </li>
                    </ol>

                    <GenericPopupWarning
                      message="Don't show progress bar on Home page?"
                      @confirm="hideProgressBar()"
                      :modalId="warningId"
                    />
                  </div>
                </div>
              </b-col>
              <b-col class="col-1"></b-col>
            </b-row>
          </b-card>
        </b-card-group></div></b-col
  ></b-row>
</template>

<script>
import GenericPopupWarning from "@/components/platform/popup_modals/GenericPopupWarning";

export default {
  name: "ProfileProgressBar",
  components: {
    GenericPopupWarning,
  },
  props: {
    resourcesCount: Number,
  },
  data() {
    return {
      showProgressBar: false,
      warningId: "progress-bar-warning",
      interval: "",
      loading: true,
      step1: 0,
      step2: 0,
      step3: 0,
      step4: 0,
    };
  },
  created() {
    this.showProgressBar = !document.cookie.includes("ProgressBar=hidden");
  },
  mounted() {
    this.interval = setInterval(() => {
      this.showProgressBar = !document.cookie.includes("ProgressBar=hidden");
      if (this.showProgressBar) {
        setTimeout(() => {
          this.getProgress();
        }, 100);
      }
    }, 1000);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    getProgress() {
      if (this.computed_credentials.length > 0) {
        this.step1 = 100;

        if (this.computed_projects.length > 0) {
          this.step2 = 100;

          if (this.resourcesCount > 0) {
            this.step3 = 100;
            this.step4 = 100;
          } else {
            this.step3 = 0;
            this.step4 = 0;
          }
        } else {
          this.step2 = 0;
          this.step3 = 0;
          this.step4 = 0;
        }
      } else {
        this.step1 = 0;
        this.step2 = 0;
        this.step3 = 0;
        this.step4 = 0;
      }

      this.loading = false;
    },
    hideProgressBar() {
      document.cookie = "ProgressBar=hidden; expires=Fri, 31 Dec 9999 14:00:00 GMT";
      this.$bvModal.hide(this.warningId);
    },
  },
};
</script>

<style scoped>
.progressList {
  list-style: none;
  position: relative;
  display: flex;
  justify-content: left;
}

@media screen and (max-width: 640pt) {
  .custom-progress {
    width: calc(7em - 0.7vw);
  }
  .custom-progress-text {
    width: calc(4.2em - 0.7vw);
  }
}
@media screen and (min-width: 640pt) {
  .custom-progress {
    width: calc(7em + 3vw);
  }
  .custom-progress-text {
    width: calc(4.2em + 3vw);
  }
}
@media screen and (min-width: 850pt) {
  .custom-progress {
    width: calc(7em + 7.5vw);
  }
  .custom-progress-text {
    width: calc(4.2em + 7.5vw);
  }
}
@media screen and (min-width: 1000pt) {
  .custom-progress {
    width: calc(7em + 10vw);
  }
  .custom-progress-text {
    width: calc(4.2em + 10vw);
  }
}
@media screen and (min-width: 1200pt) {
  .custom-progress {
    width: 17vw;
  }
  .custom-progress-text {
    width: 17vw;
  }
}
@media screen and (min-width: 1500pt) {
  .custom-progress {
    width: 335px;
  }
  .custom-progress-text {
    width: 335px;
  }
}

.custom-progress {
  max-width: 45em;
  height: 1em;
  display: inline-block;
  margin-left: -25px;
  vertical-align: middle;
  line-height: 1px;
  margin-bottom: 7px;
}
.progress::-moz-progress-bar {
  background: #09dc7d;
}
.progress::-webkit-progress-value {
  background: #09dc7d;
}
.progress::-webkit-progress-bar {
  background: #bcbcbc;
}
.progress {
  color: #09dc7d;
  border: none;
}

.progressDot {
  color: #bcbcbc;
  font-size: 30px;
  margin-top: 25px;
  vertical-align: bottom;
  opacity: 10;
  position: relative;
}
.progressDot.complete {
  color: #09dc7d;
}

.custom-progress-text {
  max-width: 27em;
  height: 1em;
  vertical-align: middle;
  margin-bottom: 7px;
}
.progressText {
  margin-left: 0;
}
</style>