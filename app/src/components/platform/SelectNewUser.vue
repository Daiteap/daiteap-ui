<template>
  <div>
    <div class="card daiteap-content-card">
      <div class="d-flex justify-content-between cardHeaderLight">
        <CardTitle title="Users" />
      </div>
      <hr />
			<b-row class="my-1 mb-2">
				<b-col sm="12">
					<label for="search">Search:</label>
				</b-col>
				<b-col sm="12">
					<b-input
						id="search"
						v-model="search"
						placeholder="Search for user"
						@keyup="onSearchChange()"
					></b-input>
				</b-col>
			</b-row>
      <div v-if="loading" class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else>
        <UnregisteredUsersListTable
          class="mt-4"
          :users="filteredUsers"
          :clickableRows="true"
          @canContinue="changeSelectedUser"
        />
      </div>
			<b-row class="my-1">
				<b-col class="text-right">
          <div
            class="custom-button float-right ml-5"
            :class="[!canContinue ? 'deactivated' : '']"
            @click="createUser()"
          >
            Add
          </div>
          <div
            class="custom-button float-right mr-5"
            @click="onCancel()"
          >
            Cancel
          </div>
				</b-col>
			</b-row>
      <br />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CardTitle from "@/components/platform/CardTitle";
import UnregisteredUsersListTable from "@/components/platform/tables/UnregisteredUsersListTable";

export default {
  name: "SelectNewUser",
  props: {
    tenant: {
      type: Object,
      required: false
    }
  },
  components: {
    CardTitle,
    UnregisteredUsersListTable,
  },
  data() {
    return {
			search: "",
			allUsers: [],
			filteredUsers: [],
			selectedUser: "",
			canContinue: false,
      loading: true,
      interval: "",
    };
  },
  created() {
		this.getUnregisteredUsers();
  },
  mounted() {},
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    getUnregisteredUsers() {
      let self = this;
      let tenantID = this.tenant.id;
      axios
        .get(
          "/server/tenants/" + tenantID + "/unregistered-users",
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.allUsers = response.data;
					self.filteredUsers = response.data;
          self.loading = false;
        })
        .catch(function (error) {
          console.log(error);
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          }
        });
		},
		onSearchChange() {
			this.filteredUsers = [];
			for(let i=0; i < this.allUsers.length; i++){
				if(this.allUsers[i].username.includes(this.search)){
					this.filteredUsers.push(this.allUsers[i]);
				} else if(this.allUsers[i].first_name.includes(this.search)){
					this.filteredUsers.push(this.allUsers[i]);
				} else if(this.allUsers[i].last_name.includes(this.search)){
					this.filteredUsers.push(this.allUsers[i]);
				} else if(this.allUsers[i].email.includes(this.search)){
					this.filteredUsers.push(this.allUsers[i]);
				}
			}
    },
    onCancel() {
      this.$router.push("UsersList");
    },
		createUser() {
			let email = "";
			let firstName = "";
			let lastName = "";
			for(let i=0; i < this.allUsers.length; i++){
				if(this.allUsers[i].username == this.selectedUser){
					email = this.allUsers[i].email;
					firstName = this.allUsers[i].first_name;
					lastName = this.allUsers[i].last_name;
					break;
				}
			}

      this.$router.push({ 
        name: "AddNewUser",
        params: {
          username: this.selectedUser, 
          email: email,
          firstName: firstName,
          lastName: lastName
        }
      });
		},
    changeSelectedUser(user) {
      this.canContinue = true;
      this.selectedUser = user;
    },
  },
};
</script>

<style scoped>
</style>
