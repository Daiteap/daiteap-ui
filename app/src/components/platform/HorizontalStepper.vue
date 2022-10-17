<template>
  <div class="stepper-box" >
    <ShowErrorCreatingCluster
      v-show="showModalShowErrorCreatingCluster"
      :errorMessage="errorMsg"
      modalName='horizontalStepper'
      @backStep="backStep"
    ></ShowErrorCreatingCluster>
    <div v-show="showStepper" class="top">
      <div
        class="divider-line"
        :style="{width: `${(100/(steps.length) * (steps.length)) - 10}%`}"
      ></div>
      <div class="steps-wrapper">
        <template v-if="topButtons">
          <div class="stepper-button-top previous" :class="[currentStep.index > 0 ? '' : 'deactivated']" @click="backStep()">
            <i class="material-icons">keyboard_arrow_left</i>
          </div>
        </template>
        <template v-for="(step, index) in steps">
          <div
            :class="['step', isStepActive(index, step), 'next']"
            :key="index"
            :style="{width: `${100 / steps.length}%`}"
          >
            <div class="circle">
              <i class="material-icons md-18 daiteap-active-cluster-creation-icon">{{ (step.completed) ? 'done' : step.icon }}</i>
            </div>
            <div class="step-title">
              <h5>{{step.title}}</h5>
              <h5 class="step-subtitle">{{step.subtitle}}</h5>
            </div>
          </div>
        </template>
        <div
          v-if="topButtons"
          :class="['stepper-button-top next', !canContinue || disableNextButton ? 'deactivated' : '']"
          @click="nextStep()"
          id="rightArrow"
        >
          <i class="material-icons">keyboard_arrow_right</i>
        </div>
      </div>
    </div>
      <br>
    <div class="content">
      <transition
        :enter-active-class="enterAnimation"
        :leave-active-class="leaveAnimation"
        mode="out-in"
      >
        <!--If keep alive-->
        <keep-alive v-if="keepAliveData">
          <component
            :is="steps[currentStep.index].component"
            :clickedNext="nextButton[currentStep.name]"
            @can-continue="proceed"
            @change-next="changeNextBtnValue"
            :current-step="currentStep"
            :isInResize="isInResize"
            @changeStepperVisibility="showStepper = !showStepper"
          ></component>
        </keep-alive>
        <!--If not show component and destroy it in each step change-->
        <component
          v-else
          :is="steps[currentStep.index].component"
          :clickedNext="nextButton[currentStep.name]"
          @can-continue="proceed"
          @change-next="changeNextBtnValue"
          :current-step="currentStep"
          :isInResize="isInResize"
        ></component>
      </transition>
    </div>
    <div v-show="showStepper" :class="['bottom', (currentStep.index >= 0) ? '' : 'only-next']" style="padding: 0">
      <div v-if="currentStep.index > 0" class="stepper-button previous mr-5" @click="backStep()">
        <i class="material-icons">keyboard_arrow_left</i>
        <span class="mr-2">{{ 'back' | translate(locale) }}</span>
      </div>
      <div v-if="currentStep.index == 0" class="stepper-button previous mr-5" @click="$router.go(-1)">
        Cancel
      </div>
      <div :class="['stepper-button next', !canContinue || disableNextButton ? 'deactivated' : '']" class="ml-5" @click="nextStep()">
        <span class="ml-2">{{ (finalStep) ? 'finish' : 'next' | translate(locale) }}</span>
        <i class="material-icons">keyboard_arrow_right</i>
      </div>
    </div>
  </div>
</template>

<script>
import translations from "../../assets/js/Translations.js";
import Vue from "vue";
import ShowErrorCreatingCluster from "@/components/platform/popup_modals/ShowErrorCreatingCluster";

export default {
  name: 'HorizontalStepper',
  components:{
    ShowErrorCreatingCluster
  },
  filters: {
    translate: function (value, locale) {
      return translations[locale][value];
    }
  },

  props: {
    locale: {
      type: String,
      default: "en"
    },
    topButtons: {
      type: Boolean,
      default: false
    },
    steps: {
      type: Array,
      default: function () {
        return [
          {
            icon: "mail",
            name: "first",
            title: "Sample title 1",
            subtitle: "Subtitle sample"
          },
          {
            icon: "report_problem",
            name: "second",
            title: "Sample title 2",
            subtitle: "Subtitle sample"
          }
        ];
      }
    },
    keepAlive: {
      type: Boolean,
      default: true
    },
    reset: {
      type: Boolean,
      default: false
    },
    isInResize: {
      type: Boolean,
      default: false
    },
    disableNextButton: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      currentStep: {},
      previousStep: {},
      nextButton: {},
      canContinue: false,
      finalStep: false,
      keepAliveData: this.keepAlive,
      showModalShowErrorCreatingCluster: false,
      errorMsg:"",
      showStepper: true,
    };
  },

  computed: {
    enterAnimation() {
      if (this.currentStep.index < this.previousStep.index) {
        return "animated quick fadeInLeft";
      } else {
        return "animated quick fadeInRight";
      }
    },
    leaveAnimation() {
      if (this.currentStep.index > this.previousStep.index) {
        return "animated quick fadeOutLeft nav-link disabled";
      } else {
        return "animated quick fadeOutRight nav-link disabled";
      }
    }
  },

  methods: {
    isStepActive(index) {
      if (this.currentStep.index === index) {
        return "activated";
      } else {
        return "deactivated";
      }
    },

    activateStep(index, back = false) {
      if (this.steps[index]) {
        this.previousStep = this.currentStep;
        this.currentStep = {
          name: this.steps[index].name,
          index: index
        };

        if (index + 1 === this.steps.length) {
          this.finalStep = true;
        } else {
          this.finalStep = false;
        }

        if (!back) {
          this.$emit("completed-step", this.previousStep);
        }
      }
      this.$emit("active-step", this.currentStep);
    },

    nextStepAction() {
      this.nextButton[this.currentStep.name] = true;
      if (this.canContinue && !this.disableNextButton) {
        if (this.finalStep) {
          this.$emit("stepper-finished", this.currentStep);
        }
        let currentIndex = this.currentStep.index + 1;
        Vue.prototype.$currentIndex = currentIndex;

        this.activateStep(currentIndex);
      }
      this.canContinue = false;
      this.$forceUpdate();
    },

    nextStep() {

      if (!this.$listeners || !this.$listeners['before-next-step']) {
        this.nextStepAction()
      }

      this.$emit("before-next-step", { currentStep: this.currentStep }, (next = true) => {
        this.canContinue = true;
        if (next) {
          this.nextStepAction()
        }
      });
    },
    backStep() {
      this.$root.$emit("clicking-back-" + this.currentStep.index);

      let currentIndex = this.currentStep.index - 1;
      Vue.prototype.$currentIndex = currentIndex;
      if (currentIndex >= 0) {
        this.activateStep(currentIndex, true);
      }
      this.canContinue = true;
    },

    proceed(payload) {
      this.canContinue = payload.value;
    },

    changeNextBtnValue(payload) {
      this.nextButton[this.currentStep.name] = payload.nextBtnValue;
      this.$forceUpdate();
    },
    openShowErrorModal(errorMsg){
      this.errorMsg = errorMsg,
      this.showModalShowErrorCreatingCluster = true
      this.$bvModal.show("bv-modal-modalshowerrorcreatingcluster");
    },

    init() {
      // Initiate stepper
      this.activateStep(0);
      this.steps.forEach(step => {
        this.nextButton[step.name] = false;
      });
    }
  },

  watch: {
    reset(val) {
      if (!val) {
        return;
      }

      this.keepAliveData = false;

      this.init();
      this.previousStep = {};

      this.$nextTick(() => {
        this.keepAliveData = this.keepAlive;
        this.$emit('reset', true);
      });

    }
  },

  created() {
    this.init();
  }
};
</script>

<style src="../../assets/css/HorizontalStepper.scss" lang="scss">
</style>
<style>
/* fallback */
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: local("Material Icons"), local("MaterialIcons-Regular"),
    url(https://fonts.gstatic.com/s/materialicons/v17/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2)
      format("woff2");
}

.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}
#rightArrow{
  z-index: 0;
}
.btn {
  width: 8rem;
}
.stepper-button {
  width: 8rem;
}
</style>