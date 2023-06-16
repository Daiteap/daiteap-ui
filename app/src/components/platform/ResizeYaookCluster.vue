<template>
  <div class="card daiteap-content-card">
    <QuotaExceededModal
      v-show="showQuotaExceeded"
      :exceededResources="exceededResources"
    ></QuotaExceededModal>
    <h3 class="d-flex justify-content-left">Resize Cluster</h3>
    <br />
    <div class="columns" v-if="clusterSteps.length > 1">
      <div class="column is-11 is-offset-0">
        <div v-if="errorMsg" class="alert alert-warning" role="alert" style="text-align: left; color: black;">
          {{ errorMsg }}
        </div>
        <horizontal-stepper
          :steps="clusterSteps"
          @completed-step="completeStep"
          :top-buttons="true"
          @active-step="isStepActive"
          @stepper-finished="submitResizeYaookCluster"
          :isInResize="true"
        ></horizontal-stepper>
      </div>
    </div>
  </div>
</template>

<script>
import QuotaExceededModal from "@/components/platform/popup_modals/QuotaExceededModal";
import HorizontalStepper from "./HorizontalStepper";
import StepAlicloud from "./steps/StepAlicloud.vue";
import StepAWS from "./steps/StepAWS.vue";
import StepAzure from "./steps/StepAzure.vue";
import StepGoogle from "./steps/StepGoogle.vue";
import StepOpenstack from "./steps/StepYaookOpenstack.vue";
import StepOnpremise from "./steps/StepOnpremise.vue";
import StepYaookSubmitResize from "./steps/StepYaookSubmitResize.vue";
import Vue from "vue";

export default {
  name: 'ResizeYaookCluster',
  components: {
    QuotaExceededModal,
    HorizontalStepper,
  },
  data() {
    return {
      clusterSteps: [
        {
          icon: "announcement",
          name: "submit",
          title: "Submit",
          subtitle: "",
          component: StepYaookSubmitResize,
          completed: false,
        },
      ],
      showQuotaExceeded: false,
      activeStep: 0,
      errorMsg: "",
      exceededResources: [],
    };
  },
  props: {
    clusterID: {
      type: String,
      required: true,
    },
  },
  beforeMount() {
    let self = this;
    this.getClusterConfig().then(function (cluster) {
      Vue.prototype.$finalModel = cluster;
      self.setSteps(
        !!cluster.alicloud,
        !!cluster.aws,
        !!cluster.azure,
        !!cluster.gcp,
        !!cluster.openstack,
        !!cluster.onpremise
      );
    });
  },
  computed: {},
  methods: {
    setSteps(alicloud, aws, azure, gcp, openstack, onpremise) {
      if (alicloud) {
        this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
          icon: "dehaze",
          name: "alicloud",
          title: "Alibaba Cloud",
          subtitle: "",
          component: StepAlicloud,
          completed: false,
        });
      }

      if (aws) {
        this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
          icon: "dehaze",
          name: "aws",
          title: "Amazon Web Services Details",
          subtitle: "",
          component: StepAWS,
          completed: false,
        });
      }

      if (azure) {
        this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
          icon: "dehaze",
          name: "azure",
          title: "Azure Details",
          subtitle: "",
          component: StepAzure,
          completed: false,
        });
      }

      if (gcp) {
        this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
          icon: "dehaze",
          name: "gcp",
          title: "Google Cloud Platform Details",
          subtitle: "",
          component: StepGoogle,
          completed: false,
        });
      }

      if (openstack) {
        if(this.computed_theme == "daiteap") {
          this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
            icon: "dehaze",
            name: "openstack",
            title: "OpenStack Details",
            subtitle: "",
            component: StepOpenstack,
            completed: false,
          });
        }
      }

      if (onpremise) {
        this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
          icon: "dehaze",
          name: "onpremise",
          title: "On-Premise Network Details",
          subtitle: "",
          component: StepOnpremise,
          completed: false,
        });
      }
    },
    getClusterConfig() {
      let self = this;
      return this.axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/clusters/" +
            self.clusterID +
            "/config",
          this.get_axiosConfig()
        )
        .then(function (response) {
          return response.data.config;
        })
        .catch(function (error) {
          console.log(error);
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          }
          return "";
        });
    },
    completeStep(payload) {
      this.clusterSteps.forEach((step) => {
        if (step.name === payload.name) {
          step.completed = true;
        }
      });
    },
    isStepActive(payload) {
      this.clusterSteps.forEach((step) => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = false;
          }
        }
      });
    },
    submitResizeYaookCluster() {
      let self = this;
      this.$finalModel.clusterID = this.clusterID;

      let resizeYaookClusterRequestBody = this.$finalModel;

      const endpoint = "/server/tenants/" + this.computed_active_tenant_id + "/clusters/" + this.clusterID + "/yaook-resize";

      this.axios
        .post(endpoint, resizeYaookClusterRequestBody, this.get_axiosConfig())
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly submitted cluster resize!",
          });
          self.$router.push({
            name: "KubernetesClusterList",
          });
        })
        .catch(function (error) {
          if (error.response.data.authorized == false) {
            self.exceededResources = error.response.data.exceededResources;
            self.showQuotaExceeded = true;
            self.$bvModal.show("bv-modal-quotaexceeded");
          } else {
            console.log(error);
            if (error.response) {
              console.log(error.response.data);
            }
            if (error.response && error.response.status == "403") {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Access Denied",
              });
            } else {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Error while submitting cluster resize.",
              });
            }
          }
        });
    },
  },
};
</script>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.pointer {
  cursor: pointer;
}
h1, h2 {
  font-weight: normal;
}
hr {
  background-color: transparent;
  border: none;
  display: block;
  height: inherit;
  margin: 1.5rem 0;
  border-top: dashed 1px;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #0b99b9;
  text-decoration: underline;
}
.text-medium-grey {
  color: #333;
}
.text-light-grey {
  color: #888;
}
.box.formated {
  position: relative;
  padding: 0;
}
.box.formated .heading {
  font-size: 1rem;
  text-transform: capitalize;
  padding: 0.8rem 1.5rem;
  background-color: #fafafa;
}
.box.formated .content {
  padding: 1rem 2rem;
}
i.top-left {
  position: absolute;
  left: 1.5rem;
  top: 0.8rem;
}
.vertical-separator {
  display: flex;
  justify-content: space-around;
}
.vertical-separator .line {
  border-right: 1px solid #ccc;
}
</style>
