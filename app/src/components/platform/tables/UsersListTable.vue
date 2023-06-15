<template>
  <div>
    <table
      class="table table-bordered"
      id="usersDataTable"
      width="100%"
      cellspacing="0"
    >
      <EditUserPopup
        v-if="showEditUserPopup"
        :currentUser="userToEdit"
        :oldName="userToEditName"
        @updateUser="updateUser"
        :showRole="false"
      />
      <thead>
        <tr>
          <th v-if="clickableRows"></th>
          <th>User</th>
          <th name="usersHidePriority3">Role</th>
          <th name="usersHidePriority1">Projects</th>
          <th name="usersHidePriority0">Phone Number</th>
          <th name="usersHidePriority2" v-if="showEdit">Edit</th>
          <th v-if="showdelete == true">
            Remove
          </th>
        </tr>
      </thead>
    <tbody>
      <tr v-for="user in users" :key="user.username" class="users-list-table-row">
        <td v-if="clickableRows" class="text-center py-2 pt-3 users-list-table-row">
          <input
            @change="$emit('onUserSelected', selectedUsers);"
            type="checkbox"
            class="custom-checkbox-size"
            :value="user"
            v-model="selectedUsers"
          />
        </td>
        <td
          class="clickForDetails"
          v-on:click="showUserDetails(user)"
          :title="user.username"
        >
          {{ user.username }}
        </td>
        <td name="usersHidePriority3">
          {{ user.role }}
        </td>
        <td
          name="usersHidePriority1"
          :title="user.projects.toString()"
        >
          {{ user.projects.toString() }}
        </td>
        <td name="usersHidePriority0">
          {{ user.phone }}
        </td>
        <td name="usersHidePriority2" v-if="showEdit">
          <div class="pl-2">
            <div
              title="Edit"
              @click="openEditPopup(user)"
              class="fas fa-edit editIcon"
            ></div>
          </div>
        </td>
        <td v-if="showdelete == true">
          <div class="pl-2">
            <div
              title="Remove"
              @click="user.role == 'Owner' ? null : onUserDelete(user)"
              class="far fa-trash-alt removeUserIcon"
              :class="user.role == 'Owner' ? 'disabledRemoveUserIcon' : ''"
            ></div>
          </div>
        </td>
        </tr>
    </tbody>
    </table>
  </div>
</template>

<script>
import EditUserPopup from "@/components/platform/popup_modals/EditUserPopup";

export default {
  name: 'UsersListTable',
  props: {
    users: Array,
    providers: Array,
    showdelete: Boolean,
    clickableRows: Boolean,
    showEdit: {
      type: Boolean,
      default: true
    },
    tenantID: String,
  },
  data() {
    return {
      selectedUsers: [],
      allValidations: [],
      user: "",
      show_data: false,
      userToEdit: {},
      userToEditName: "",
      showEditUserPopup: false,
      columnsEvent: "",
    };
  },
  created() {
    this.loadingTable = true;
  },
  mounted() {
    setTimeout(() => {
      this.changeColumnsVisibility("users", 3);
      this.columnsEvent = this.changeColumnsVisibility.bind(null, "users", 3);
      window.addEventListener("resize", this.columnsEvent);
    }, 200);
  },
  destroyed() {
    window.removeEventListener("resize", this.columnsEvent);
  },
  methods: {
    showUserDetails(user) {
      this.$emit("showUserDetails", user);
    },
    onUserDelete(user) {
      this.$emit("removeUser",user);
    },
    onUserSelected(user) {
      this.$emit("onUserSelected",user);
    },
    openEditPopup(user) {
      this.userToEdit = user;
      this.userToEditName = user.username;
      this.showEditUserPopup = true;
      this.$nextTick(function () {
          this.$bvModal.show('bv-modal-edituser');
      });
    },
    updateUser(user) {
      let request;
      if(user.password != '') {
        request = {
          username: user.username,
          user_id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          company: user.company,
          phone: user.phone,
          password: user.password,
        }
      } else {
        request = {
          username: user.username,
          user_id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          company: user.company,
          phone: user.phone,
        }
      }

      this.editUserInfo(request);
    },
  },
  components: {
    EditUserPopup,
  },
};
</script>

<style scoped>
.removeUserIcon {
  cursor: pointer;
  align-content: center;
  font-size: 1.5rem;
  padding-top: 0.2rem;
  color: #ea002f;
}
.disabledRemoveUserIcon {
  cursor: not-allowed;
  color: #ccc;
}
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
.editAccount {
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem;
  color: #1d1e22;
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

.selectable_table_row:hover {
  cursor: pointer;
  box-shadow: 0 1px 6px 0 #a3a3a3;
  transition: 0.3s;
}
.custom-checkbox-size {
  width: 18px;
  height: 18px;
}
</style>
