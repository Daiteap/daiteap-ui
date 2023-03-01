<template>
  <div>
    <SpecificUserInfo
      v-if="showSpecificUserInfo"
      :username="specificUserUsername"
      @hideUserDetails="hideUserDetails"
    />

    <table
      class="table table-bordered"
      id="credentialsDataTable"
      width="100%"
      cellspacing="0"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th name="credentialsHidePriority2">Description</th>
          <th name="credentialsHidePriority5">Cloud</th>
          <th name="credentialsHidePriority4">Cloud Account</th>
          <th name="credentialsHidePriority0">Created at</th>
          <th name="credentialsHidePriority1">Created by</th>
          <th name="credentialsHidePriority3">Edit</th>
          <th>Delete</th>
          <th
            name="credentialsHidePriority6"
            class="cellAsALink"
            @click="
              allAccounts.forEach((acc) => {
                acc.statusOfValidation = 'loading';
                validationStatusKeys[acc.id] += 1;
              });
              $emit('validateAllCredentials');
            "
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
        <tr
          v-for="(account, index) in allAccounts"
          :key="index"
          data-test-id="table"
        >
          <td :title="account.label">
            {{ account.label }}
          </td>
          <td name="credentialsHidePriority2" :title="account.description">
            {{ account.description }}
          </td>
          <td name="credentialsHidePriority5">
            <img
              height="25pix"
              width="auto"
              :src="
                require('../../../assets/img/' +
                  providers.filter(
                    (provider) => provider.name == account.provider
                  )[0].logo_small)
              "
            />
          </td>
          <td
            name="credentialsHidePriority4"
            :title="account.cloud_account_info"
          >
            {{ account.cloud_account_info }}
          </td>
          <td name="credentialsHidePriority0">
            {{ account.created_at_pretty | formatDate }}
          </td>
          <td
            name="credentialsHidePriority1"
            class="clickForDetails"
            v-on:click="showUserDetails(account.contact)"
            :title="account.contact"
          >
            {{ account.contact }}
          </td>
          <td name="credentialsHidePriority3">
            <div class="pl-2">
              <i
                title="Edit"
                class="fas fa-edit editIcon"
                @click="$emit('openEditPopup', account)"
              ></i>
            </div>
          </td>
          <td>
            <RemoveAccountButton
              :account="account"
              @removeAccount="goToRemoveAccountWarning"
            />
          </td>
          <td
            name="credentialsHidePriority6"
            v-if="account.type != 'ONPREM' && account.type != 'IOTARM'"
            class="cellAsALink"
            @click="
              account.statusOfValidation = 'loading';
              validationStatusKeys[account.id] += 1;
              $emit('validateCredential', account);
            "
            data-test-id="validate-button"
          >
            <ValidateButton
              :validationStatusKeys="validationStatusKeys[account.id]"
              :account="account"
              :alerts="alerts"
              :validationStatus="account.statusOfValidation"
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
import SpecificUserInfo from "@/components/platform/popup_modals/SpecificUserInfo";

export default {
  name: "CloudProfileTable",
  props: {
    allAccounts: Array,
    providers: Array,
    alerts: Array,
    listOfAccountsInDeletion: Array,
    showTenant: Boolean,
  },
  data() {
    return {
      validationStatusKeys: {},
      showSpecificUserInfo: false,
      specificUserUsername: "",
      columnsEvent: "",
    };
  },
  created() {
    let statusKeys = {};
    this.allAccounts.forEach((x) => {
      if (!(x.id in Object.keys(statusKeys))) {
        statusKeys[x.id] = 0;
      }
    });
    this.validationStatusKeys = statusKeys;
  },
  mounted() {
    setTimeout(() => {
      this.changeColumnsVisibility("credentials", 6);
      this.columnsEvent = this.changeColumnsVisibility.bind(
        null,
        "credentials",
        6
      );
      window.addEventListener("resize", this.columnsEvent);
    }, 200);
  },
  destroyed() {
    window.removeEventListener("resize", this.columnsEvent);
  },
  methods: {
    goToRemoveAccountWarning(accountToRemove) {
      this.$emit("removeAccount", accountToRemove);
    },
    showUserDetails(username) {
      this.specificUserUsername = username;
      this.showSpecificUserInfo = true;
    },
    hideUserDetails() {
      this.showSpecificUserInfo = false;
    },
  },
  components: {
    ValidateButton,
    RemoveAccountButton,
    SpecificUserInfo,
  },
  filters: {
    upperCase: function (data) {
      let upper = [];
      data.split("_").forEach((word) => {
        upper.push(word[0].toUpperCase() + word.substring(1));
      });
      return upper.join(" ");
    },
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
