<template>
  <div style="text-align: left">
    <div class="field">
      <div v-if="errorMsg" class="alert alert-warning" role="alert" style="text-align: left; color: black;">
        {{ errorMsg }}
      </div>

      <br />
      <div>
        <label for="operatingSystem">Operating System</label>
      </div>
      <select
        v-model="form.iotarm.operatingSystem"
        class="custom-select d-block w-100"
        id="operatingSystem"
        :disabled="form.iotarm.account == '' || loadingOperatingSystems"
        @input="checkForIpConflicts(form.iotarm.vpcCidr)"
      >
        <option v-for="item in operatingSystems" :key="item.value" :value="item.value">{{ item.name }}</option>
      </select>

      <br />
      <div v-on:click="$v.form.iotarm.vpcCidr.$touch">
        <label for="vpcCidr">Network CIDR</label>
        <input
          readonly
          style="display: inline-block"
          class="form-control"
          :class="['input', (ipConflicts && $v.form.iotarm.vpcCidr.$dirty) ? 'is-danger' : '']"
          type="text"
          placeholder="e.g. 192.168.0.0/16"
          v-model="form.iotarm.vpcCidr"
          @input="checkForIpConflicts"
          @focus="networkCidrFocus = true"
          @blur="networkCidrFocus = false"
        />
        <p v-if="ipConflicts && $v.form.iotarm.vpcCidr.$dirty && !networkCidrFocus" class="help is-danger">
          Please enter a valid private Network that does not conflict with other providers
          Networks
        </p>
        <p v-else-if="networkCidrErrorMsg" class="help is-danger">
          Network conflict: {{networkCidrErrorMsg}}
        </p>
        <div v-else style="height: 1.35em;"></div>
      </div>
        
      <br />
      <div>
        <label for="region">Machines</label>
        <span class="btn btn-outline-success btn float-sm-right" v-on:click="addMachine">
          <i class="fas fa-plus"></i>
        </span>
      </div>
      <br />
      <div
        style="white-space: nowrap"
        v-for="(machine, index) in form.iotarm.machines"
        :key="index"
      >
      <br>
        <input
          style="display: inline-block; width: 97%; margin: 0px 10px 0px 0px;"
          v-model="form.iotarm.machines[index]"
          @input="checkMachines"
          @focus="ipFocus[index] = true"
          @blur="ipFocus[index] = false; checkMachines()"
          :id="['ip-input-' + index]"
          :disabled="ipConflicts"
          class="form-control input"
          type="text"
          value
        />

        <a v-on:click="deleteMachine(index)">
          <i style="color: red" class="fas fa-trash"></i>
        </a>

        <p
          :id="['ip-error-' + index]"
          class="help is-danger d-none"
        >
          Please enter a valid IP address
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import Vue from "vue";
import axios from "axios";

export default {
  name: "StepIotArm",
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  methods: {
    setForm() {
      let self = this;
      if (Vue.prototype.$finalModel.iotarm) {
        this.form = {
          iotarm: {
            account: Vue.prototype.$finalModel.iotarm.account,
            operatingSystem: Vue.prototype.$finalModel.iotarm.operatingSystem,
            machines: Vue.prototype.$finalModel.iotarm.machines,
            vpcCidr: Vue.prototype.$finalModel.iotarm.vpcCidr,
          },
        };

        self.getOperatingSystemsList();
      }
    },
    checkCanContinue() {
      if (
        !this.$v.$invalid &&
        this.ipConflicts == false &&
        this.invalidMachines.indexOf(true) == -1
      ) {
        Vue.prototype.$finalModel = {
          ...Vue.prototype.$finalModel,
          ...this.form,
        };
        this.$emit("can-continue", { value: true });
      } else {
        this.$emit("can-continue", { value: false });
      }
    },
    updateMsg(index, value){
      this.invalidMachines[index] = value;
      if (this.invalidMachines[index] == true && !this.ipConflicts && this.ipFocus[index] == false) {
        document.getElementById('ip-error-' + index).classList.remove("d-none")
        document.getElementById('ip-input-' + index).classList.add("is-danger")
      } else {
        document.getElementById('ip-error-' + index).classList.add("d-none")
        document.getElementById('ip-input-' + index).classList.remove("is-danger")
      }
    },
    checkMachines(){
      for (let i = 0; i < this.form.iotarm.machines.length; i++) {
        this.checkMachine(this.form.iotarm.machines[i], i)
      }
    },
    checkMachine(value, index) {
      let self = this;
      let network = self.form.iotarm.vpcCidr;

      // Check for dublicate addresses
      let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)

      let duplicate_ips = findDuplicates(this.form.iotarm.machines)

      if (duplicate_ips.includes(value)) {
        self.invalidMachines[index] = true;
        self.checkCanContinue();
        self.updateMsg(index, true)
        return false;
      }

      if (value.length > 7 && value.length < 15) {
        return new Promise((resolve) => {
          axios
            .post(
              "/server/checkipaddress",
              {
                network: network,
                ip: value
              },
              self.get_axiosConfig()
            )
            .then(function (response) {
              if (response.data.error == true) {
                self.invalidMachines[index] = true;
                self.checkCanContinue();
                self.updateMsg(index, true)
                resolve(false);
              } else {
                self.invalidMachines[index] = false;
                self.checkCanContinue();
                self.updateMsg(index, false)
                resolve(true);
              }
            })
            .catch(function (error) {
              self.invalidMachines[index] = true;
              self.checkCanContinue();
              self.updateMsg(index, true)
              console.log(error);
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Error while checking IP address! "+error,
              });
              self.$emit("can-continue", { value: false })
            });
        });
      } else {
        self.invalidMachines[index] = true;
        self.checkCanContinue();
        self.updateMsg(index, true)
        return false;
      }
    },
    checkForIpConflicts(value) {
      let self = this;

      let networks = [];

      if ("kubernetesConfiguration" in this.$finalModel) {
        networks.push(this.$finalModel.kubernetesConfiguration.podsSubnet);
        networks.push(this.$finalModel.kubernetesConfiguration.serviceAddresses);
      }

      if ("aws" in this.$finalModel) {
        networks.push(this.$finalModel.aws.vpcCidr);
      }

      if ("alicloud" in this.$finalModel) {
        networks.push(this.$finalModel.alicloud.vpcCidr);
      }

      if ("azure" in this.$finalModel) {
        networks.push(this.$finalModel.azure.vpcCidr);
      }

      if ("google" in this.$finalModel) {
        networks.push(this.$finalModel.google.vpcCidr);
      }

      if ("onpremise" in this.$finalModel) {
        networks.push(this.$finalModel.onpremise.vpcCidr);
      }

      networks.push(self.form.iotarm.vpcCidr);


      if (value.length > 0) {

        return new Promise((resolve) => {
          axios
            .post(
              "/server/checkforipconflicts",
              {
                networks: networks,
              },
              self.get_axiosConfig()
            )
            .then(function (response) {
              if (response.data.conflicts == true) {
                self.ipConflicts = true;
                self.networkCidrErrorMsg = response.data.message;
                self.checkCanContinue();
                resolve(false);
              } else {
                self.ipConflicts = false;
                self.networkCidrErrorMsg = "";
                self.checkCanContinue();
                self.checkMachines();
                resolve(true);
              }
            })
            .catch(function (error) {
              self.ipConflicts = true;
              self.checkCanContinue();
              console.log(error);
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Error while checking for IP conflicts! "+error,
              });
            });
        });
      } else {
        return false;
      }
    },
    getOperatingSystemsList() {
      let self = this;
      self.loadingOperatingSystems = true;
      axios        
        .get(
          "/server/getValidOperatingSystems/" + self.computed_userInfo.username + "/" + self.provider + "/" + self.form.iotarm.account + "/0/" + self.form.iotarm.account,
          this.get_axiosConfig()
        )
        .then(function(response) {
          self.operatingSystems=[];
          for (let i = 0; i < response.data.operatingSystems.length; i++) {
            self.operatingSystems.push({
              name: response.data.operatingSystems[i].os,
              value: response.data.operatingSystems[i].value
            });
          }
          self.form.iotarm.vpcCidr = response.data.operatingSystems[0].vpcCidr
          self.loadingOperatingSystems = false;
          self.checkForIpConflicts(self.form.iotarm.vpcCidr)
        })
        .catch(function(error) {
          self.errorMsg = error;
          console.log(error);
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while getting operating systems information! "+error,
          });
          self.$emit("can-continue", { value: false })
        });
    },
    checkIfDuplicateExists(w){
      return new Set(w).size !== w.length
    },
    addMachine() {
      this.form.iotarm.machines.push("");
      this.invalidMachines.push(true);
      this.checkCanContinue();
    },
    deleteMachine(index) {
      this.form.iotarm.machines.splice(index, 1);
      this.invalidMachines.splice(index, 1);
      this.checkCanContinue();
    },
  },
  data() {
    return {
      errorMsg: "",
      networkCidrFocus: false,
      networkCidrErrorMsg: "",
      ipFocus: [],
      loadingAccounts: true,
      loadingOperatingSystems: true,
      username: "",
      form: {
        iotarm: {
          account: "",
          operatingSystem: "",
          machines: [],
          vpcCidr: "",
        },
      },
      provider: "iotarm",
      accounts: [],
      ipConflicts: true,
      invalidMachines: [],
      operatingSystems: []
    };
  },
  validations: {
    form: {
      iotarm: {
        vpcCidr: {
          required,
        },
        account: {
          required,
        },
        operatingSystem: {
          required,
        },
        machines: {
          $each: {
            minLength: minLength(7),
          },
        },
      },
    },
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    let self = this;
    self.setForm();

    let cidr = { srcElement: { value: this.form.iotarm.vpcCidr } };
    this.checkForIpConflicts(cidr);
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () => self.$destroy());
    if (!this.$v.$invalid) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }
  },
  destroyed() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
#errorMsg {
  max-height: 15rem;
}
</style>
