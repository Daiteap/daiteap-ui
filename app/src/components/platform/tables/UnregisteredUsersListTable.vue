<template>
  <div class="table-responsive">
    <table
      class="table table-bordered"
      id="dataTable"
      width="100%"
      cellspacing="0"
    >
      <thead>
        <tr>
          <th v-if="clickableRows"></th>
          <th>User</th>
          <th>First name</th>
          <th>Last name</th>
        </tr>
      </thead>
    <tbody>
      <tr v-for="user in users" :key="user.username">
        <td v-if="clickableRows" class="text-center py-2 pt-3">
          <input
            @change="changeSelectedUser()"
            type="radio"
            class="custom-checkbox-size"
            :value="user.username"
            v-model="selectedUser"
          />
        </td>
        <td>
          {{ user.username }}
        </td>
        <td>
          {{ user.first_name }}
        </td>
        <td>
          {{ user.last_name }}
        </td>
        </tr>
    </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    users: Array,
    providers: Array,
    clickableRows: Boolean
  },
  data() {
    return {
      selectedUser: "",
      allValidations: [],
      user: "",
    };
  },
  created() {
    this.loadingTable = true;
  },
  methods: {
    changeSelectedUser() {
      this.$parent.canContinue = true;
      this.$parent.selectedUser = this.selectedUser;
    },
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
