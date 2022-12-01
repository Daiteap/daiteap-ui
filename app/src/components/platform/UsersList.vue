<template>
  <div>
    <DeleteManyDialog v-if="showDeleteManyDialog"></DeleteManyDialog>
    <DeleteDialog v-if="showDeleteDialog"></DeleteDialog>
    <SpecificUserInfo v-if="showSpecificUserInfo" :username="specificUserUsername" @hideUserDetails="hideUserDetails" />
    <div class="card daiteap-content-card">
      <div v-if="!isBAO" class="d-flex justify-content-between cardHeaderLight">
        <span class="fa-stack landing-page-icon">
          <i class="fas fa-square fa-stack-2x" style="line-height: 1.5;"></i>
          <i class="fas fa-user fas fa-stack-1x fa-inverse" style="line-height: 3;"></i>
        </span>
        <CardTitle title="Users" style="line-height: 2;" />
        <span class="text-right h4 ml-auto">
          <AddButton v-if="!showAllUsers" text='Add User' @onClickAddButton="goToSelectNewUser()" />
        </span>
      </div>

      <b-container v-if="isBAO" fluid class="mx-0 px-0">
        <b-row>
          <b-col lg="8" md="6" sm="4" class="my-auto">
          </b-col>
          <b-col lg="2" md="3" sm="4" class="my-auto text-right">
            <div v-if="users.length > 0">
              Remove All
              <span v-on:click.stop="deleteAllUsers()" class="btn btn-sm" data-toggle="tooltip" data-placement="bottom"
                title="Remove all users">
                <i class="fas fa-minus-circle" style="font-size: 1.8rem"></i>
              </span>
            </div>
          </b-col>
          <b-col lg="2" md="3" sm="4" class="my-auto text-right">
            <AddButton text='Add User' @onClickAddButton="goToSelectNewUser()" />
          </b-col>
        </b-row>
      </b-container>

      <hr />
      <div v-if="loading" class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else-if="users.length == 0"> No users currently. </div>
      <div v-else>
        <UsersListTable class="mt-2" :users="users" @removeUser="removeUser" @showUserDetails="showUserDetails"
          :showdelete="true" :tenantID="tenantID" :showTenant="showAllUsers" />
      </div>
      <br />
    </div>
    <GenericPopupWarning :message="`Confirm removing ${userToRemove.username} from the workspace`"
      @confirm="onUserDeleteConfirmed" :modalId="popupId" />
  </div>
</template>

<script>
import axios from "axios";
import CardTitle from "@/components/platform/CardTitle";
import UsersListTable from "@/components/platform/tables/UsersListTable";
import DeleteManyDialog from "@/components/platform/popup_modals/DeleteManyDialog";
import DeleteDialog from "./popup_modals/DeleteDialog";
import SpecificUserInfo from "./popup_modals/SpecificUserInfo";
import GenericPopupWarning from "@/components/platform/popup_modals/GenericPopupWarning";
import AddButton from "@/components/platform/AddButton"

export default {
  name: "UsersList",
  props: {
    isBAO: {
      type: Boolean,
      default: false
    },
    tenantID: {
      type: String,
      required: false
    },
    tenant: {
      type: Object,
      required: false
    }
  },
  components: {
    CardTitle,
    UsersListTable,
    DeleteManyDialog,
    DeleteDialog,
    GenericPopupWarning,
    AddButton,
    SpecificUserInfo
  },
  data() {
    return {
      errorMsg: undefined,
      loading: true,
      deleteDialogParams: {
        text: "",
        envId: "",
        endpoint: "",
        requestBody: "",
        successMessage: "",
        redirectPage: "",
        failureMessage: "",
      },
      deleteManyDialogParams: {
        requestBody: {},
        text: "",
        endpoint: "",
      },
      userToRemove: "",
      users: [],
      interval: "",
      specificUserUsername: "",
      showSpecificUserInfo: false,
      showDeleteDialog: false,
      showDeleteManyDialog: false,
      showAllUsers: false,
      popupId: "userdeletewarning",
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      this.axios.get("/server/tenants/" + this.computed_active_tenant_id, this.get_axiosConfig()).then((response) => {
        this.tenant = response.data.tenant;
      });

      this.getUsersList();
    }, 5000);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    showUserDetails(user) {
      this.specificUserUsername = user.username;
      this.showSpecificUserInfo = true;
    },
    hideUserDetails() {
      this.showSpecificUserInfo = false;
    },
    goToSelectNewUser() {
      if (this.isBAO) {
        this.$router.push({
          name: "SelectNewUser",
          params: {
            isBAO: true,
            tenant: this.tenant
          },
        });
      } else {
        this.$router.push({
          name: "SelectNewUser",
          params: {
            isBAO: false,
            tenant: this.tenant
          },
        });
      }
    },
    deleteAllUsers() {
      let token = this.$session.get("token");
      let base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      let jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      this.deleteManyDialogParams.endpoint = [];
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].username != JSON.parse(jsonPayload).username) {
          this.deleteManyDialogParams.endpoint.push(
            "/server/tenants/" +
              this.computed_active_tenant_id +
              "/projects/" +
              this.projectID +
              "/users/" +
              this.users[i].username
          );
        }
      }
      this.deleteManyDialogParams.text =
        "Are you sure you want to delete all Users";

      this.showDeleteManyDialog = true;
    },
    removeUser(user) {
      this.$bvModal.show(this.popupId);
      this.userToRemove = user;
    },
    onUserDeleteConfirmed() {
      this.$bvModal.hide(this.popupId);
      let userToDelete = this.userToRemove.username;
      let self = this;

      axios
        .delete(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/users/" +
            userToDelete,
          this.get_axiosConfig()
        )
        .then(function (response) {
          console.info(response.data.users_list);
        })
        .catch(function (error) {
          console.error("Error deleting user.");
          console.log(error.response);
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          } else {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: error.response.data.message || "Error deleting user.",
            });
          }
        });

      this.onUsersChanged();
    },
    onUsersChanged() {
      setTimeout(() => this.getUsersList(), 500);
    },
    async getUsersList() {
      let self = this;

      self.users = await self.getUsers();
      self.loading = false;
    },
  },
};
</script>

<style scoped>

</style>
