<template>
  <b-modal centered id="bv-modal-addclustermachines" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div class="h4 text-center">Add new machines</div>
          <hr />
          <br />

          <div class="form-group col-lg-8">
            <label>Provider</label>
            <select
              v-model="machines.provider"
              v-on:change="getRegionZonesList"
              class="custom-select d-block w-100"
              id="provider"
            >
              <option
                v-for="(item, index) in providers"
                :key="index"
                :value="item"
              >
                {{ item.provider }}
              </option>
            </select>
            <br />
          </div>

          <div
            class="form-group col-lg-8"
            v-if="
              machines.provider.provider != '' &&
              machines.provider.provider != undefined &&
              machines.provider.provider == 'onpremise' ||
              machines.provider.provider == 'iotarm' 
            "
          >
            <div
              v-if="
                machines.provider.provider != '' &&
                machines.provider.provider != undefined &&
                machines.provider.provider == 'onpremise' ||
              machines.provider.provider == 'iotarm' 
              "
            >
              <label>Network</label>
              <input
                disabled
                class="form-control"
                type="text"
                :value="(machines.provider.provider == 'onpremise') ? cluster.providers.onpremise.vpcCidr : cluster.providers.iotarm.vpcCidr"
                style="
                  display: inline-block;
                  width: 97%;
                  margin: 0px 10px 0px 0px;
                "
              />
            </div>

            <br />

            <label>Machines</label>
            <span
              class="btn btn-outline-success btn float-sm-right"
              v-on:click="addMachine"
            >
              <i class="fas fa-plus"></i>
            </span>
          </div>
          <div
            class="form-group col-lg-8"
            style="white-space: nowrap"
            v-for="(machine, index) in machines.newMachines"
            :key="index"
          >
            <br />
            <div
              v-if="
                machines.provider.provider != '' &&
                machines.provider.provider != undefined &&
                machines.provider.provider == 'onpremise' ||
                machines.provider.provider == 'iotarm' 
              "
            >
              <input
                v-model="machines.newMachines[index]"
                class="form-control"
                @input="checkMachines"
                type="text"
                style="
                  display: inline-block;
                  width: 97%;
                  margin: 0px 10px 0px 0px;
                "
                value
              />

              <a v-on:click="deleteMachine(index)">
                <i style="color: red" class="fas fa-trash"></i>
              </a>

              <p :id="[index]" class="help is-danger">
                Please enter a valid IP address
              </p>
            </div>
          </div>
          <div
            v-if="
              machines.provider.provider != '' &&
              machines.provider.provider != undefined &&
              machines.provider.provider != 'onpremise' &&
              machines.provider.provider != 'iotarm'
            "
            class="form-group col-lg-8"
          >
            <label for="zone">Zone</label>
            <select
              v-if="!loadingZones"
              v-model="machines.zone"
              v-on:change="getZoneInstancesList"
              class="custom-select d-block w-100"
              id="zone"
            >
              <option
                v-for="item in zones"
                :key="item.value"
                :value="item.value"
              >
                {{ item.name }}
              </option>
            </select>
          <div v-if="
              machines.provider.provider != '' &&
              machines.provider.provider != undefined &&
              machines.provider.provider != 'onpremise' &&
              machines.provider.provider != 'iotarm' &&
              loadingZones"
              class="text-center">
            <div
              class="spinner-border"
              style="color: #eaebed !important"
              role="status"
            >
              <span class="sr-only">Loading...</span>
            </div>
          </div>
            <br />
          </div>
          <div
            v-if="
              machines.provider.provider != '' &&
              machines.provider.provider != undefined &&
              machines.provider.provider != 'onpremise' &&
              machines.provider.provider != 'iotarm'
            "
            class="form-group col-lg-8"
          >
            <label for="instanceType">Instance type</label>
            <select
              v-if="!loadingInstances"
              v-model="machines.instanceType"
              class="custom-select d-block w-100"
              id="instanceType"
            >
              <option
                v-for="item in instanceTypes"
                :key="item.value"
                :value="item.value"
              >
                {{ item.name }}
              </option>
            </select>
          <div v-if="
              machines.provider.provider != '' &&
              machines.provider.provider != undefined &&
              machines.provider.provider != 'onpremise' &&
              machines.provider.provider != 'iotarm' &&
              loadingInstances"
              class="text-center">
            <div
              class="spinner-border"
              style="color: #eaebed !important"
              role="status"
            >
              <span class="sr-only">Loading...</span>
            </div>
          </div>
            <br />
          </div>

          <!--<div
            v-if="
              machines.provider.provider != '' &&
              machines.provider.provider != undefined &&
              machines.provider.provider != 'onpremise'
            "
            class="form-group col-lg-8"
          >
            <label for="operatingSystem">Operating System</label>
            <select
              v-model="machines.operatingSystem"
              class="custom-select d-block w-100"
              id="instanceType"
            >
              <option
                v-for="item in operatingSystems"
                :key="item.value"
                :value="item.value"
              >
                {{ item.name }}
              </option>
            </select>
            <br />
          </div>-->

          <div
            v-if="
              machines.provider.provider != '' &&
              machines.provider.provider != undefined &&
              machines.provider.provider != 'onpremise' &&
              machines.provider.provider != 'iotarm'
            "
            class="form-group col-lg-8"
          >
            <label for="nodes">Number of Nodes</label>
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
                v-on:click="submitNewMachinesToEnvironment"
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
import axios from "axios";

export default {
  name: 'AddMachinesToVMs',
  mixins: [validationMixin],
  data() {
    return {
      providers: [],
      loadingZones: false,
      loadingInstances: false,
      machines: {
        provider: {},
        instanceType: "",
        nodes: 1,
        zone: "",
        newMachines: [],
        // operatingSystem: ""
      },
      instanceTypes: [],
      zones: [],
      invalidMachines: [],
      // operatingSystems: []
    };
  },
  validations: {
    machines: {},
  },
  props: ["cluster", "clusterType", "clusterID"],
  methods: {
    updateProvidersList(providers) {
      if (providers.googleSelected) {
        this.providers.push({
          provider: "google",
          region: providers.google.region,
          zone: providers.google.zone,
          accountLabel: providers.google.account,
        });
      }
      if (providers.openstackSelected) {
        this.providers.push({
          provider: "openstack",
          region: providers.openstack.region,
          zone: providers.openstack.zone,
          accountLabel: providers.openstack.account,
        });
      }
      if (providers.awsSelected) {
        this.providers.push({
          provider: "aws",
          region: providers.aws.region,
          zone: providers.aws.zone,
          accountLabel: providers.aws.account,
        });
      }
      if (providers.azureSelected) {
        this.providers.push({
          provider: "azure",
          region: providers.azure.region,
          zone: providers.azure.zone,
          accountLabel: providers.azure.account,
        });
      }
      if (providers.onpremiseSelected) {
        this.providers.push({
          provider: "onpremise",
          accountLabel: providers.onpremise.account,
        });
      }
      if (providers.iotarmSelected) {
        this.providers.push({
          provider: "iotarm",
          accountLabel: providers.iotarm.account,
        });
      }
    },
    closeModal() {
      this.$bvModal.hide("bv-modal-addclustermachines");
      this.machines= {
        provider: {},
        instanceType: "",
        nodes: 1,
        zone: "",
        newMachines: []
      }
    },
    addMachine() {
      this.machines.newMachines.push("");
      this.invalidMachines.push(true);
      this.checkCanContinue();
    },
    deleteMachine(index) {
      this.machines.newMachines.splice(index, 1);
      this.invalidMachines.splice(index, 1);
      this.checkCanContinue();
    },
    checkMachines() {
      for (let i = 0; i < this.machines.newMachines.length; i++) {
        this.checkMachine(this.machines.newMachines[i], i);
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
    checkMachine(value, index) {
      let self = this;
      let network = ''

      if (this.machines.provider.provider == 'onpremise'){
        network = self.cluster.providers.onpremise.vpcCidr;
      }
      
      // update network address if IoT ARM provider is selected
      if (this.machines.provider.provider == 'iotarm'){
        network = self.cluster.providers.iotarm.vpcCidr;
      }

      // Check for dublicate addresses
      let findDuplicates = (arr) =>
        arr.filter((item, index) => arr.indexOf(item) != index);

      let duplicate_ips = findDuplicates(this.machines.newMachines);

      if (duplicate_ips.includes(value)) {
        self.invalidMachines[index] = true;
        self.checkCanContinue();
        self.updateMsg(index, true);
        return false;
      }

      if (value.length > 7 && value.length < 15) {
        return new Promise((resolve) => {
          axios
            .get(
              "/server/check-ip-address/" + network + "/" + value,
              self.get_axiosConfig()
            )
            .then(function (response) {
              if (response.data.error == true) {
                self.invalidMachines[index] = true;
                self.checkCanContinue();
                self.updateMsg(index, true);
                resolve(false);
              } else {
                self.invalidMachines[index] = false;
                self.checkCanContinue();
                self.updateMsg(index, false);
                resolve(true);
              }
            })
            .catch(function (error) {
              self.invalidMachines[index] = true;
              self.checkCanContinue();
              self.updateMsg(index, true);
              console.log(error);
            });
        });
      } else {
        self.invalidMachines[index] = true;
        self.checkCanContinue();
        self.updateMsg(index, true);
        return false;
      }
    },
    checkCanContinue() {
      let submitEl = document.getElementById("submit-machines");

      if (!this.$v.$invalid && this.invalidMachines.indexOf(true) == -1) {
        submitEl.disabled = false;
      } else {
        submitEl.disabled = true;
        console.log("stuff went wrong")
      }
    },
    getRegionZonesList() {
      if (this.machines.provider.provider == "onpremise" || this.machines.provider.provider == "iotarm") {
        this.machines.zone=[]
        this.machines.newMachines=[]
        this.invalidMachines=[]
        return;
      }

      let self = this;
      self.loadingZones = true;
      let selectedProvider = self.providers.filter((el) => el.provider == self.machines.provider.provider)[0]

      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/cloud-credentials/" +
            selectedProvider.accountLabel +
            "/regions/" +
            self.machines.provider.region +
            "/zones",
          this.get_axiosConfig()
        )
        .then(function(response) {
          self.zones = [];
          for (let i = 0; i < response.data.zones.length; i++) {
            self.zones.push({
              name: response.data.zones[i],
              value: response.data.zones[i]
            });
          }
          self.loadingZones = false;
        })
        .catch(function(error) {
          self.errorMsg = error;
          console.log(error);
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while getting zones information! "+error,
          });
        });
    },
    getZoneInstancesList() {
      if (this.machines.provider.provider == "onpremise" || this.machines.provider.provider == "iotarm") {
        this.machines.newMachines=[]
        this.invalidMachines=[]
        return;
      }

      let self = this;
      self.loadingInstances = true;

      let selectedProvider = self.providers.filter((el) => el.provider == self.machines.provider.provider)[0]

      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/cloud-credentials/" +
            selectedProvider.accountLabel +
            "/regions/" +
            self.machines.provider.region +
            "/zones/" +
            self.machines.zone +
            "/instances",
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.instanceTypes = [];
          for (let i = 0; i < response.data.instances.length; i++) {
            self.instanceTypes.push({
              name: response.data.instances[i].description,
              value: response.data.instances[i].name,
            });
          }
          self.loadingInstances = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getOperatingSystemsList() {
      let self = this;
      // self.loadingOperatingSystems = true;

      let selectedProvider = self.providers.filter((el) => el.provider == self.machines.provider.provider)[0]

      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/cloud-credentials/" +
            selectedProvider.accountLabel +
            "/regions/" +
            self.machines.provider.region +
            "/environment-type/2/operating-systems",
          this.get_axiosConfig()
        )
        .then(function (response) {
          for (let i = 0; i < response.data.operatingSystems.length; i++) {
            self.operatingSystems.push({
              name: response.data.operatingSystems[i].os,
              value: response.data.operatingSystems[i].value,
            });
          }
          // self.loadingOperatingSystems = false;
        })
        .catch(function (error) {
          self.errorMsg = error;
          console.log(error);
        });
    },
    submitNewMachinesToEnvironment() {
      let self = this;

      let addMachinesRequestBody = {};

      if (self.machines.provider.provider == "onpremise") {
        addMachinesRequestBody = {
          provider: self.machines.provider.provider,
          onpremiseMachines: self.machines.newMachines,
          clusterID: self.clusterID,
          nodes: self.machines.newMachines.length,
        };
      } else if (self.machines.provider.provider == "iotarm"){
        addMachinesRequestBody = {
          provider: self.machines.provider.provider,
          iotarmMachines: self.machines.newMachines,
          clusterID: self.clusterID,
          nodes: self.machines.newMachines.length,
        };
      } else if (self.machines.provider.provider == "openstack"){
        addMachinesRequestBody = {
          provider: self.machines.provider.provider,
          region: self.machines.provider.region,
          zone: self.machines.zone,
          instanceType: self.machines.instanceType,
          nodes: parseInt(self.machines.nodes),
          clusterID: self.clusterID,
        };
      } else {
        addMachinesRequestBody = {
          provider: self.machines.provider.provider,
          region: self.machines.provider.region,
          zone: self.machines.provider.zone,
          instanceType: self.machines.instanceType,
          nodes: parseInt(self.machines.nodes),
          clusterID: self.clusterID,
        };
      }

      let endpoint =
        "/server/tenants/" +
        self.computed_active_tenant_id +
        "/clusters/" +
        self.clusterID +
        "/machines/compute-add";
      if (self.clusterType == 1) {
        endpoint =
        "/server/tenants/" +
        self.computed_active_tenant_id +
        "/clusters/" +
        self.clusterID +
        "/machines/dlcm-add";
      }
      if (self.clusterType == 3) {
        endpoint =
        "/server/tenants/" +
        self.computed_active_tenant_id +
        "/clusters/" +
        self.clusterID +
        "/machines/k3s-add";
      }
      if (self.clusterType == 7) {
        endpoint =
        "/server/tenants/" +
        self.computed_active_tenant_id +
        "/clusters/" +
        self.clusterID +
        "/machines/dlcmv2-add";
      }

      this.axios
        .post(endpoint, addMachinesRequestBody, this.get_axiosConfig())
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly submitted machines creation!",
          });
          self.closeModal();
        })
        .catch(function (error) {
          if (error.response.data.authorized == false) {
            self.$emit('exceededResources', error.response.data.exceededResources);
          } else {
            console.log(error);
            if (error.response) {
              console.log(error.response.data);
            }
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while submitting the machines creation",
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