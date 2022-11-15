<template>
  <div class="card daiteap-content-card">
    <QuotaExceededModal
      v-show="showQuotaExceeded"
      :exceededResources="exceededResources"
    ></QuotaExceededModal>
    <h3 class="d-flex justify-content-left">Resize Cluster {{ clusterConfig.name }}</h3>
    <div v-if="$finalModel !== undefined && $finalModel.kubernetesConfiguration !== undefined" align="left">ClusterID: {{ clusterID }}, K8S version: {{ $finalModel.kubernetesConfiguration.version }}</div>
    <div align="left">Description: {{ clusterConfig.description }}</div>
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
          @stepper-finished="submitResizeDLCMCluster"
          :isInResize="true"
        ></horizontal-stepper>
      </div>
    </div>
  </div>
</template>

<script>
import QuotaExceededModal from "@/components/platform/popup_modals/QuotaExceededModal";
import HorizontalStepper from "./HorizontalStepper";
import StepAlicloud from "./steps/StepDLCMV2Alicloud.vue";
import StepAWS from "./steps/StepDLCMV2AWS.vue";
import StepAzure from "./steps/StepDLCMV2Azure.vue";
import StepGoogle from "./steps/StepDLCMV2Google.vue";
import StepOpenstack from "./steps/StepDLCMV2Openstack.vue";
import StepOnpremise from "./steps/StepOnpremise.vue";
import StepCAPISubmitResize from "./steps/StepCAPISubmitResize.vue";
import Vue from "vue";

export default {
  name: 'ResizeDLCMCluster',
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
          component: StepCAPISubmitResize,
          completed: false,
        },
      ],
      showQuotaExceeded: false,
      activeStep: 0,
      errorMsg: "",
      exceededResources: [],
      clusterConfig: {
        name: "",
        description: "",
        clusterID: "",
        kubernetesConfiguration: {
          version: "",
        }
      },
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
      console.log("Cluster.config", cluster.config);

      Vue.prototype.$finalModel = cluster.config;
      Vue.prototype.$finalModel.projectId = cluster.projectId;
      Vue.prototype.$finalModel.gatewayCloud = cluster.gatewayCloud;

      Vue.prototype.$existingNodesCount = 0

      for (const key in Vue.prototype.$finalModel) {
        if (Object.hasOwnProperty.call(Vue.prototype.$finalModel, key)) {
          if (Vue.prototype.$finalModel[key].hasOwnProperty('nodes')) {
            Vue.prototype.$existingNodesCount += Vue.prototype.$finalModel[key].nodes.length;
          }
        }
      }

      self.setSteps(
        !!cluster.config.alicloud,
        !!cluster.config.aws,
        !!cluster.config.azure,
        !!cluster.config.google,
        !!cluster.config.openstack,
        !!cluster.config.onpremise
      );
    });
  },
  computed: {},
  methods: {
    setSteps(alicloud, aws, azure, google, openstack, onpremise) {
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

      if (google) {
        this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
          icon: "dehaze",
          name: "google",
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
          self.clusterConfig = response.data;
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
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
    submitResizeDLCMCluster() {
      let self = this;
      this.$finalModel.clusterID = this.clusterID;

      let resizeDLCMClusterRequestBody = this.$finalModel

      let endpoint = "/server/tenants/" + this.computed_active_tenant_id + "/clusters/" + this.clusterID + "/dlcmv2-resize";

      this.axios
        .post(endpoint, resizeDLCMClusterRequestBody, this.get_axiosConfig())
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
            self.$parent.exceededResources =
              error.response.data.exceededResources;
            self.$parent.showQuotaExceeded = true;
            self.$bvModal.show("bv-modal-quotaexceeded");
          } else {
            console.log(error);
            if (error.response) {
              console.log(error.response.data);
            }
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while submitting cluster resize",
            });
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

h1,
h2 {
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
  border-right: 1px solid #cccccc;
}
</style>
