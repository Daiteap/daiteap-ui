<template>
  <b-modal centered id="bv-modal-addclusteraccount" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div class="h4 text-center">Add provider cloud credentials</div>
          <hr />
          <br />

          <div class="form-group col-lg-8">
            <label for="provider">Provider</label>
            <select v-model="account.provider" v-on:change="getProviderAccountsList" class="custom-select d-block w-100">
                <option v-for="item in providersWithoutAccounts" :key="item" :value="item">
                {{ item }}
                </option>
            </select>
            <br />
          </div>

          <div class="form-group col-lg-8">
            <label for="instanceType">Account</label>
            <select
                v-if="!loadingAccounts"
                v-model="account.accountLabel"
                class="custom-select d-block w-100"
                id="accountLabel"

            >
                <option v-for="item in accountLabels" :key="item" :value="item">
                {{ item }}
                </option>

            </select>
          <div v-if="
              loadingAccounts"
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

          <br />
          <hr />
          <br />

          <div class="form-group col-lg-8">
            <div class="col-lg-16">
              <input
                v-on:click="addAccountToCluster"
                :disabled="$v.account.$invalid"
                type="button"
                class="btn btn-primary col-lg-5"
                value="Submit"
              />
              <span
                v-on:click="closeModal()"
                type="button"
                class="btn btn-outline-success col-lg-5 float-sm-right"
              >Cancel</span>
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
  name: 'AddClusterAccount',
  mixins: [validationMixin],
  data() {
    return {
      account: {
        provider: "",
        accountLabel: ""
      },
      providers: [],
      accountLabels: [],
      loadingAccounts:false
    };
  },
  props: ["clusterID", "providersWithoutAccounts"],
  validations: {
    account: {
    }
  },
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-addclusteraccount");
    },
    getProviderAccountsList() {
      let self = this;
      this.loadingAccounts=true
      axios
        .post(
          "/server/getProviderAccounts",
          {
            provider: self.account.provider
          },
          this.get_axiosConfig()
        )
        .then(function(response) {
          for (let i = 0; i < response.data.accounts.length; i++) {
            self.accountLabels.push(response.data.accounts[i].label);
          }
          self.loadingAccounts = false;
        })
        .catch(function(error) {
          self.errorMsg = error;
          console.log(error);
        });
    },
    addAccountToCluster() {
      let self = this;
      this.axios
        .post(
          "/server/addAccountToCluster",
          {
            provider: self.account.provider,
            accountLabel: self.account.accountLabel,
            clusterID: self.clusterID
          },
          this.get_axiosConfig()
        )
        .then(function() {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly updated cluster accounts!"
          });
          self.$router.push("/app/platform/clusterdetails/" + self.clusterID);
          self.closeModal();
        })
        .catch(function(error) {
          console.log(error);
          if (error.response) {
            console.log(error.response.data);
          }
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while updating cluster accounts!"
          });
        });
    }
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
.spinner-border{
  width: 2.125rem;
  height: 2.125rem;
}
</style>