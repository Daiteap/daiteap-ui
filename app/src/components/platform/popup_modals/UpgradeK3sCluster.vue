<template>
  <b-modal centered id="bv-modal-upgradek3scluster" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div class="h4 text-center">Edit version</div>
          <hr />
          <br />

          <div class="form-group col-lg-8">
            <div v-if="kubeUpgradeStatus == -1">
              Upgrade failed
              <pre v-if="errorMsg != undefined && errorMsg != ''" id="errorMsg">{{ errorMsg }}</pre>

              <br>
            </div>

            <label for="upgradeVersion">Version</label>
            <select
              v-model="upgradeVersion"
              class="custom-select d-block w-100"
              id="upgradeVersion"
            >
              <option v-for="item in upgradeVersions" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
            <br />
            <div>
              Changing the master version can result in several minutes of control plane
              downtime. This operation starts immediately, and is not reversible.
            </div>
          </div>

          <br />
          <hr />
          <br />

          <div class="form-group col-lg-8">
            <div class="col-lg-16">
              <input
                v-on:click="upgradeK3sCluster"
                :disabled="$v.$invalid"
                type="button"
                class="btn btn-primary col-lg-5 float-sm-right"
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
import axios from "axios";

export default {
  name: 'UpgradeK3sCluster',
  mixins: [validationMixin],
  data() {
    return {
      interval:"",
      upgradeVersion: "",
      upgradeVersions: []
    };
  },
  validations: {
    upgradeVersion: {},
  },
  mounted() {
    this.getK3sAvailableUpgradeVersions();
    this.interval = setInterval(() => {
      this.getK3sAvailableUpgradeVersions();
    }, 30000);
    window.intervals.push(this.interval);
  },
  props: ["kubeUpgradeStatus", "errorMsg", "clusterID"],
  methods: {
    getK3sAvailableUpgradeVersions() {
      let self = this;
      axios
        .post(
          "/server/getK3sAvailableUpgradeVersions",
          {
            clusterID: self.clusterID,
          },
          this.get_axiosConfig()
        )
        .then(function (response) {
          let upgradeVersions = response.data["upgradeVersions"];
          self.upgradeVersions = upgradeVersions;
          if (!self.upgradeVersion) {
            self.upgradeVersion = upgradeVersions[0];
          }
          if (upgradeVersions && upgradeVersions.length != 0) {
            self.$emit('upgradeAvailable', true);
          }
          else {
            self.$emit('upgradeAvailable', false);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    upgradeK3sCluster() {
      let self = this;
      axios
        .post(
          "/server/upgradeK3sCluster",
          {
            clusterID: self.clusterID,
            version: self.upgradeVersion,
          },
          this.get_axiosConfig()
        )
        .then(function () {
          self.$emit('changeKubeUpgradeStatus', 1);
          self.closeModal();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    closeModal() {
      this.$bvModal.hide("bv-modal-upgradek3scluster");
    },
  },
  destroyed() {
    for (let i = 0; i < window.intervals.length; i++) {
      clearInterval(window.intervals[i]);
    }
    clearInterval(this.interval);
  }
};
</script>


<style scoped>

.form-group {
  margin: auto;
}
.btn-primary {
  width: 100%;
}
#errorMsg {
  max-height: 15rem;
}
</style>
