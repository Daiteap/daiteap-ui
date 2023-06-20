<template>
  <div>
    <ConfirmDialog
      v-show="showConfirmDialog"
      :confirmDialogParams="confirmDialogParams"
      @confirm-action="changeTenant()"
    ></ConfirmDialog>
    <table
      class="table table-bordered"
      id="tenantsDataTable"
      width="100%"
      cellspacing="0"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th name="tenantsHidePriority2">Owner</th>
          <th name="tenantsHidePriority4">Email</th>
          <th name="tenantsHidePriority3">Phone</th>
          <th name="tenantsHidePriority5">Company</th>
          <th name="tenantsHidePriority1">Created at</th>
          <th name="tenantsHidePriority0">Updated at</th>
          <th>Activate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tenantsList" :key="item.id">
          <td :title="item.name">
            {{ item.name }}
          </td>
          <td name="tenantsHidePriority2" :title="item.owner">
            {{ item.owner }}
          </td>
          <td name="tenantsHidePriority4" :title="item.email">
            {{ item.email }}
          </td>
          <td name="tenantsHidePriority3">
            {{ item.phone }}
          </td>
          <td name="tenantsHidePriority5" :title="item.company">
            {{ item.company }}
          </td>
          <td name="tenantsHidePriority1">
            {{ FormatDateFilter(item.createdAt) }}
          </td>
          <td name="tenantsHidePriority0">
            {{ FormatDateFilter(item.updatedAt) }}
          </td>
          <td>
            <Toggle
              :value="item.selected"
              data-test-id="compute-option-button"
              @change="showChangeTenantDialog(item)"
              :disabled="item.selected"
              sync
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ConfirmDialog from "../popup_modals/ConfirmDialog";
import Toggle from "@vueform/toggle";

export default {
  props: {
    tenantsList: Array,
    selectedTenant: String,
  },
  components: {
    ConfirmDialog,
    Toggle,
  },
  data() {
    return {
      showConfirmDialog: false,
      confirmDialogParams: {
        text: "",
        envName: "",
        envId: "",
        action: "",
        payload: {},
      },
      columnsEvent: "",
    };
  },
  created() {
    this.loadingTable = true;
  },
  mounted() {
    setTimeout(() => {
      this.changeColumnsVisibility("tenants", 5);
      this.columnsEvent = this.changeColumnsVisibility.bind(null, "tenants", 5);
      window.addEventListener("resize", this.columnsEvent);
    }, 200);
  },
  destroyed() {
    window.removeEventListener("resize", this.columnsEvent);
  },
  methods: {
    showChangeTenantDialog(tenant) {
      this.confirmDialogParams.text = "Are you sure you want to change current workspace:";
      this.confirmDialogParams.action = "Change";
      this.confirmDialogParams.envId = "";
      this.confirmDialogParams.envName = tenant.name;
      this.confirmDialogParams.payload = {
        "id": tenant.id,
      };
      this.showConfirmDialog = true;
      this.$bvModal.show("bv-modal-confirmdialog");
    },
    changeTenant(payload) {
      let self = this;
      const endpoint = "/server/user/select-tenant";
      const requestBody = {
        "selectedTenant": payload.id
      };
      const successMessage = 'You have successfully submitted tenant change.';
      const failureMessage = 'Error occured while you tried to submit tenant change.';

      this.axios
        .post(
          endpoint,
          requestBody,
          this.get_axiosConfig()
        )
        .then(function () {
          if (successMessage) {
            self.$notify({
              group: "msg",
              type: "success",
              title: "Notification:",
              text: self.confirmDialogParams.successMessage,
            });
          }
          self.showConfirmDialog = false;
          self.$bvModal.hide("bv-modal-confirmdialog");
          self.$router.push({
            name: "DaiteapWebLandingPage"
          });
        })
        .catch(function (error) {
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
            if (failureMessage) {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: failureMessage,
              });
            }
          }
          self.showConfirmDialog = false;
          self.$bvModal.hide("bv-modal-confirmdialog");
        });
    },
  },
};
</script>

<style scoped>
td {
  max-width: 17rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

a:not([href]):not([tabindex]) {
  color: #4e73df;
  text-decoration: none;
  cursor: pointer;
}

a:not([href]):not([tabindex]):hover {
  color: #224abe;
  text-decoration: underline;
  cursor: pointer;
}

.fa-plus {
  color: white;
}

.fa-server {
  color: #000;
}

.card-header {
  display: block;
}

.card-header > h6 {
  display: inline-block;
}

input {
  width: 10rem !important;
}
.cardHeaderLight {
  background-color: #fff;
  color: #1d1e22;
  border-bottom: #1d1e22 2px solid;
  border: #d1d1d1 1px solid;
}
.card-body {
  border: #00708c10 1px solid;
}
:deep(.dropDownMenuButton .btn-secondary) {
  color: #1d1e22 !important;
  font-weight: bold;
  background-color: #fff !important;
  border: none;
  box-shadow: none;
  outline: none;
}
:deep(.dropDownMenuButton .btn-secondary:hover) {
  color: #034758 !important;
  background-color: #fff !important;
  border: none;
}
:deep(.dropDownMenuButton .btn-secondary:focus) {
  color: #1d1e22 !important;
  background-color: #fff !important;
  border: none;
  box-shadow: none;
}
:deep(.dropDownMenuButton .btn-secondary.focus) {
  color: #1d1e22 !important;
  background-color: #fff !important;
  border: none;
  box-shadow: none;
}
:deep(.dropDownMenuButton #createDropdown:active) {
  border: none;
  box-shadow: none;
}
:deep(
  .dropDownMenuButton
  .btn-secondary:not(:disabled):not(.disabled):active:focus,
.btn-secondary:not(:disabled):not(.disabled).active:focus,
.show > .btn-secondary.dropdown-toggle:focus) {
  box-shadow: none;
}
:deep(.dropDownMenuButton .dropdown-menu) {
  background-color: #fff;
  background-clip: padding-box;
  border: 2px solid #5f737950;
  border-radius: 0.35rem;
}
kbd {
  background-color: #1d1e22;
  cursor: pointer;
}
kbd:hover {
  background-color: #00708caf;
}
.removeProjectIcon {
  color: red;
  cursor: pointer;
}
.clickForDetails.stillCreating {
  color: #000;
}
.clickForDetails.template {
  color: #1d1e22;
}
.providerLogoDiv {
  height: 100%;
  width: 100%;
}
.providerLogo {
  object-fit: cover;
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
.baseBlock {
  width: 22rem;
  height: 8rem;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  -moz-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  -o-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.baseBlock:hover {
  cursor: pointer;
  -webkit-transform: translate(0, -4px);
  -moz-transform: translate(0, -4px);
  -ms-transform: translate(0, -4px);
  -o-transform: translate(0, -4px);
  transform: translate(0, -4px);
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
}
.baseBlock.dmcv:hover {
  box-shadow: 0 10px 10px#bcbcbc;
}
.baseBlock.dke:hover {
  box-shadow: 0 10px 10px#bcbcbc;
}
.baseBlock.k3s:hover {
  box-shadow: 0 10px 10px#bcbcbc;
}
.btn-outline-success:hover {
  background-color: #ea002f;
}
</style>

<style src="@vueform/toggle/themes/default.css"></style>
