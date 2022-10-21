<template>
  <div class="table-responsive">
    <CloudAccountInfoPopup :cloudAccountInfo="cloudAccountInfo" />
    <table
      class="table table-bordered"
      id="dataTable"
      width="100%"
      cellspacing="0"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th v-if="showTenant">Workspace</th>
          <th>Description</th>
          <th>Cloud</th>
          <th>Created at</th>
          <th>Created by</th>
          <th>Edit</th>
          <th>Delete</th>
          <th
            class="cellAsALink"
            @click="$emit('validateAllCredentials')"
          >
            <div class="pl-2">
              <i
                title="Click to check ALL credentials"
                class="fas fa-tasks"
              ></i>
              Status
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(account, index) in allAccounts" :key="index" data-test-id="table">
          <td :title="account.label">
            <span
              class="clickForDetails"
              @click="showCloudAccountInfoPopup(account.id)"
            >
              {{ account.label }}
            </span>
          </td>
          <td
            v-if="showTenant"
            class="clickForDetails"
            @click="
              $router.push({
                name: 'WorkspaceDetails',
                params: {
                  tenant: account.tenant,
                },
              })
            "
          >{{ account.tenant.name }}</td>
          <td :title="account.description">
            {{ account.description }}
          </td>
          <td>
            <img
              height="25pix"
              width="auto"
              :src="
                require('../../../assets/img/' +
                  providers.filter(provider => provider.name == account.provider)[0].logo_small)
              "
            />
          </td>
          <td>
            {{ account.created_at_pretty }}
          </td>
          <td :title="account.contact">
            {{ account.contact }}
          </td>
          <td>
            <div class="pl-2">
              <i
                title="Edit"
                class="fas fa-edit editIcon"
                @click="$emit('openEditPopup', account)"
              ></i>
            </div>
          </td>
          <td>
            <RemoveAccountButton :account=account @removeAccount="goToRemoveAccountWarning"/>
          </td>
          <td
            v-if="account.type != 'ONPREM' && account.type != 'IOTARM'"
            class="cellAsALink"
            @click="$emit('validateCredential', account.id)"
            data-test-id="validate-button"
          >
            <ValidateButton
              :account="account"
              :alerts="alerts"
              :validationStatus="returnCurrentStatusOfValidation(account.label)"
              :listOfAccountsInDeletion="listOfAccountsInDeletion"
            />
          </td>
          <td v-else>
            <div
              class="d-flex"
              v-if="listOfAccountsInDeletion.includes(account.id)"
            >
              <b-spinner
                style="width: 1.8rem; height: 1.8rem"
                variant="danger"
              ></b-spinner>
              <div v-show="true" class="ml-3 mt-1 text-danger">Deleting...</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ValidateButton from "@/components/platform/ValidateButton";
import RemoveAccountButton from "@/components/platform/RemoveAccountButton";
import CloudAccountInfoPopup from "@/components/platform/popup_modals/CloudAccountInfoPopup";

export default {
  name: 'CloudProfileTable',
  props: {
    allAccounts: Array,
    providers: Array,
    alerts: Array,
    returnCurrentStatusOfValidation: Function,
    listOfAccountsInDeletion: Array,
    showTenant: Boolean,
  },
  data() {
    return {
      allValidations: [],
      cloudAccountInfo: {},
    };
  },
  created() {
    this.loadingTable = true;
  },
  methods: {
    goToRemoveAccountWarning(accountToRemove) {
      this.$emit('removeAccount', accountToRemove)
    },
    async showCloudAccountInfoPopup(credentialID) {
      this.cloudAccountInfo = await this.getCloudAccountInfo(credentialID);
      this.$bvModal.show("bv-modal-cloudaccountinfo");
    }
  },
  components: {
    ValidateButton,
    RemoveAccountButton,
    CloudAccountInfoPopup,
  },
};
</script>

<style scoped>
#providerSettings {
  max-width: 45rem;
  margin: 0 auto;
}
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
.disabledCursor:disabled {
  cursor: not-allowed;
  pointer-events: all !important;
}
.cellAsALink {
  cursor: pointer;
  color: #1d1e22;
}

td {
  max-width: 17rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
