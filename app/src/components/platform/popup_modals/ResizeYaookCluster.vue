<template>
  <b-modal id="bv-modal-resizeyaookcluster" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box">
        <form class="form-horizontal" role="form">
          <div class="h3 text-center">Resize YaookCAPI cluster</div>
          <hr />
          <br />

          <div class="form-group col-lg-8">
            <label for="nodes">Number of Cluster worker Nodes</label>
            <input
              class="form-control"
              :class="['input', machines.nodes.$invalid ? 'is-danger' : '']"
              type="number"
              placeholder
              v-model="machines.nodes"
            />
            <p v-if="machines.nodes.$invalid" class="help is-danger">
              Please enter Number of Nodes
            </p>
            <br />
          </div>

          <br />
          <hr />
          <br />

          <div class="form-group col-lg-8">
            <div class="col-lg-16">
              <input
                id="submit-machines"
                v-on:click="submitResizeYaookCluster"
                :disabled="$v.machines.$invalid"
                type="button"
                class="btn btn-outline-success col-lg-5 float-sm-right"
                value="Submit"
              />
              <span
                v-on:click="closeModal()"
                type="button"
                class="btn btn-outline-success col-lg-5"
                >Cancel</span
              >
            </div>
          </div>
        </form>
      </div>
    </div>
    
  </b-modal>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minValue, maxValue } from "vuelidate/lib/validators";
import axios from "axios";

export default {
  name: 'ResizeYaookCluster',
  props: {
    clusterID: String
  },
  mixins: [validationMixin],
  data() {
    return {
      machines: {
        nodes: 0,
      },
    };
  },
  validations: {
    machines: {
      nodes: {
        required,
        minValue: minValue(1),
        maxValue: maxValue(500)
      }
    }
  },
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-resizeyaookcluster");
      this.machines= {
        nodes: 1,
      }
    },
    updateMsg(index, value) {
      this.invalidMachines[index] = value;
      if (this.invalidMachines[index] == true) {
        document.getElementById(index).style.display = "block";
      } else {
        document.getElementById(index).style.display = "none";
      }
    },
    checkCanContinue() {
      let submitEl = document.getElementById("submit-machines");

      if (!this.$v.$invalid && this.invalidMachines.indexOf(true) == -1) {
        submitEl.disabled = false;
      } else {
        submitEl.disabled = true;
      }
    },
    async getClusterDetails() {
      let self = this;
      let cluster = await this.getClusterDetailsMain(self.clusterID);
      self.machines.nodes = cluster.providers.openstack.nodes - cluster.providers.openstack.masterNodes;
    },
    submitResizeYaookCluster() {
      let self = this;

      let resizeYaookClusterRequestBody = {
        nodes: parseInt(self.machines.nodes),
        clusterID: self.clusterID,
      };

      let endpoint = "/server/tenants/" + this.computed_active_tenant_id + "/clusters/" + this.clusterID + "/yaook-resize";

      axios
        .post(endpoint, resizeYaookClusterRequestBody, this.get_axiosConfig())
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly submitted cluster resize!",
          });
          self.closeModal();
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
              text: "Error while submitting cluster resize.",
            });
          }
        });
    },
  },
};
</script>

<style scoped>
.form-group {
  margin: auto;
}
.btn-primary {
  width: 100%;
}
.spinner-border{
  width: 2.125rem;
  height: 2.125rem;
}
</style>