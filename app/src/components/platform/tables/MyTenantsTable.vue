<template>
  <div>
    <ConfirmAndRedirectDialog
      v-show="showConfirmDialog"
      :confirmAndRedirectDialogParams="confirmAndRedirectDialogParams"
    ></ConfirmAndRedirectDialog>
    <table
      class="table table-bordered"
      id="dataTable"
      width="100%"
      cellspacing="0"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Owner</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Company</th>
          <th>Created at</th>
          <th>Updated at</th>
          <th>Activate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tenantsList" :key="item.id">
          <td>
            {{ item.name }}
          </td>
          <td>
            {{ item.owner }}
          </td>
          <td>
            {{ item.email }}
          </td>
          <td>
            {{ item.phone }}
          </td>
          <td>
            {{ item.company }}
          </td>
          <td>
            {{ item.createdAt | formatDate }}
          </td>
          <td>
            {{ item.updatedAt | formatDate }}
          </td>
          <td>
            <toggle-button :value="item.selected" data-test-id="compute-option-button" @input="changeTenant(item)" :disabled="item.selected" sync />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ConfirmAndRedirectDialog from "../popup_modals/ConfirmAndRedirectDialog";

export default {
  props: {
    tenantsList: Array,
    selectedTenant: String
  },
  components: {
    ConfirmAndRedirectDialog
  },
  data() {
    return {
      showConfirmDialog: false,
      confirmAndRedirectDialogParams: {
        requestBody: {},
        text: "",
        endpoint: "",
        successMessage: "",
        failureMessage: "",
        envName: "",
        envId: "",
        action: "",
      },
    };
  },
  created() {
    this.loadingTable = true;
  },
  methods: {
    changeTenant(tenant) {
      this.confirmAndRedirectDialogParams.requestBody = {
        "selectedTenant": tenant.id
      };
      this.confirmAndRedirectDialogParams.text = "Are you sure you want to change current workspace:";
      this.confirmAndRedirectDialogParams.action = "Change";
      this.confirmAndRedirectDialogParams.envId = "";
      this.confirmAndRedirectDialogParams.envName = tenant.name;
      this.confirmAndRedirectDialogParams.endpoint = "/server/selectTenant";
      this.confirmAndRedirectDialogParams.redirect = "DaiteapWebLandingPage";
      this.confirmAndRedirectDialogParams.successMessage =
        'You have successfully submitted tenant change.';
      this.confirmAndRedirectDialogParams.failureMessage =
        'Error occured while you tried to submit tenant change.';
      this.showConfirmDialog = true;
      this.$bvModal.show("bv-modal-confirmdialog");
    },
  },
};
</script>

<style scoped>
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
::v-deep .dropDownMenuButton .btn-secondary {
  color: #1d1e22 !important;
  font-weight: bold;
  background-color: #fff !important;
  border: none;
  box-shadow: none;
  outline: none;
}
::v-deep .dropDownMenuButton .btn-secondary:hover {
  color: #034758 !important;
  background-color: #fff !important;
  border: none;
}
::v-deep .dropDownMenuButton .btn-secondary:focus {
  color: #1d1e22 !important;
  background-color: #fff !important;
  border: none;
  box-shadow: none;
}
::v-deep .dropDownMenuButton .btn-secondary.focus {
  color: #1d1e22 !important;
  background-color: #fff !important;
  border: none;
  box-shadow: none;
}
::v-deep .dropDownMenuButton #createDropdown:active {
  border: none;
  box-shadow: none;
}
::v-deep
  .dropDownMenuButton
  .btn-secondary:not(:disabled):not(.disabled):active:focus,
.btn-secondary:not(:disabled):not(.disabled).active:focus,
.show > .btn-secondary.dropdown-toggle:focus {
  box-shadow: none;
}
::v-deep .dropDownMenuButton .dropdown-menu {
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
