<template>
  <div style="text-align: left">
    <div class="card daiteap-content-card my-0">
      Press submit to resize your Kubernetes Cluster. It can take up to 10
      Minutes depending on your configuration.
    </div>

    <ClusterSummary
      :cluster="clusterSummary"
      class="card daiteap-content-card"
      style="border: 1px solid lightgray; padding: 30px 30px 30px 30px; border-radius: 10px;"
    />
  </div>
</template>

<script>
/*eslint no-unused-vars:*/
import Vue from "vue";
import ClusterSummary from "@/components/platform/steps/ClusterSummary";

export default {
  name: "StepCAPISubmitResize",
  components: {
    ClusterSummary,
  },
  props: ["clickedNext", "currentStep"],
  methods: {},
  data() {
    return {
      clusterSummary: {},
    };
  },
  beforeCreate() {
    this.$emit("can-continue", { value: true });
  },
  mounted() {
    let self=this;
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () =>
      self.$destroy()
    );

    this.clusterSummary = this.$finalModel;
    this.clusterSummary.resize = true;
  },
  destroyed() {
    clearInterval(this.interval);
    for (let i = 0; i < window.intervals.length; i++) {
      clearInterval(window.intervals[i]);
    }
    this.gettaskmessageErrorCount = 0;
  },
};
</script>