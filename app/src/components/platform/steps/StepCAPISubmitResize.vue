<template>
  <div style="text-align: left">
    <div class="card daiteap-content-card my-0">
      Press submit to resize your Kubernetes Cluster. It can take up to 10
      Minutes depending on your configuration.
    </div>

    <ClusterSummary
      :cluster="clusterSummary"
      class="card daiteap-content-card"
      style="
        border: 1px solid lightgray;
        padding: 30px 30px 30px 30px;
        border-radius: 10px;
      "
    />

    <br />

    <div
      class="card daiteap-content-card"
      style="
        border: 1px solid lightgray;
        padding: 30px 30px 30px 30px;
        border-radius: 10px;
        white-space: pre-wrap;
      "
    >
      <CardTitle title="Terraform Plan" />
      <br />
      <div v-if="loadingPlan" class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else>
        Newly created resources:
        <span v-if="tf_plan.created.length == 0"
          ><br />
          -</span
        >
        <ul style="list-style: none">
          <li v-for="(item, index) in tf_plan.created" :key="index">
            - {{ item }}
          </li>
        </ul>

        Deleted resources:
        <span v-if="tf_plan.deleted.length == 0"
          ><br />
          -</span
        >
        <ul style="list-style: none">
          <li v-for="(item, index) in tf_plan.deleted" :key="index">
            - {{ item }}
          </li>
        </ul>

        Changed resources:
        <span v-if="tf_plan.changed.length == 0"
          ><br />
          -</span
        >
        <ul style="list-style: none">
          <li v-for="(item, index) in tf_plan.changed" :key="index">
            - {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint no-unused-vars:*/
import Vue from "vue";
import ClusterSummary from "@/components/platform/steps/ClusterSummary";
import CardTitle from "@/components/platform/CardTitle";

export default {
  name: "StepCAPISubmitResize",
  components: {
    ClusterSummary,
    CardTitle,
  },
  props: ["clickedNext", "currentStep"],
  data() {
    return {
      clusterSummary: {},
      tf_plan: {
        created: [],
        deleted: [],
        changed: [],
      },
      loadingPlan: true,
    };
  },
  beforeCreate() {
    this.$emit("can-continue", { value: true });
  },
  mounted() {
    let self = this;
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () =>
      self.$destroy()
    );

    this.clusterSummary = this.$finalModel;
    this.clusterSummary.resize = true;

    this.getTfPlan();
  },
  methods: {
    getTfPlan() {
      let self = this;
      this.$finalModel.clusterID = this.$parent.$parent.clusterID;

      this.axios
        .post(
          "/server/getTerraformPlan",
          this.$finalModel,
          this.get_axiosConfig()
        )
        .then(function (response) {
          let taskId = response.data.taskId;
          gettaskmessage(taskId);
          function gettaskmessage(taskId) {
            self.axios
              .post(
                "/server/gettaskmessage",
                { taskId: taskId },
                self.get_axiosConfig()
              )
              .then(function (response) {
                if (response.data.status == "PENDING") {
                  setTimeout(() => {
                    gettaskmessage(taskId);
                  }, 1000);
                } else {
                  if (response.data.error) {
                    self.$notify({
                      group: "msg",
                      type: "error",
                      title: "Notification:",
                      text: "Error while getting terraform plan.",
                    });
                  } else {
                    let tf_plan = response.data.lcmStatuses[0].tf_plan;
                    for (let i = 0; i < tf_plan.resource_changes.length; i++) {
                      if (
                        tf_plan.resource_changes[i].change.actions.includes(
                          "create"
                        )
                      ) {
                        self.tf_plan.created.push(
                          tf_plan.resource_changes[i].address
                        );
                      }
                      if (
                        tf_plan.resource_changes[i].change.actions.includes(
                          "delete"
                        )
                      ) {
                        self.tf_plan.deleted.push(
                          tf_plan.resource_changes[i].address
                        );
                      }
                      if (
                        tf_plan.resource_changes[i].change.actions.includes(
                          "update"
                        )
                      ) {
                        self.tf_plan.changed.push(
                          tf_plan.resource_changes[i].address
                        );
                      }
                    }
                  }

                  self.loadingPlan = false;
                }
              })
              .catch(function (error) {
                self.loadingPlan = false;

                self.$notify({
                  group: "msg",
                  type: "error",
                  title: "Notification:",
                  text: "Error while getting terraform plan.",
                });
              });
          }
        })
        .catch(function (error) {
          self.loadingPlan = false;

          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while getting terraform plan.",
          });
        });
    },
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