<template>
  <div>
    <div class="card daiteap-content-card">
      <div class="d-flex justify-content-between cardHeaderLight">
        <CardTitle :title="`Add user to project ${projectName}`" />
      </div>
      <hr/>
      <UsersListTable
        v-if="this.filterUsers().length > 0"
        :clickableRows="true"
        class="mt-4"
        :users="this.filterUsers()"
        @onUserSelected="onUserSelected"
        :showdelete="show_delete"
        :showEdit="false"
      />
      <div v-else>
        <div class="text-center">
          <h4>No users found</h4>
        </div>
      </div>
      <br/>
      <div class="d-flex ml-auto">
        <div class="text-center mr-5">
          <div
            class="custom-button"
            @click="cancelBtn()"
          >
            Cancel
          </div>
        </div>
        <div class="text-center">
          <div
            class="custom-button ml-5"
            :class="[this.selectedUsers.length === 0 ? 'deactivated' : '']"
            @click="addUsers()"
          >
            Add
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UsersListTable from "@/components/platform/tables/UsersListTable";
import axios from "axios";
import CardTitle from "@/components/platform/CardTitle";

export default {
  name: 'AddNewProjectUser',
  components: {
    UsersListTable,
    CardTitle,
  },
  data() {
    return {
      selectedUsers: [],
      tenant_users: [],
      project_users: [],
      newuser_username: "",
      show_delete: false,
      projectName: "",
    };
  },
  created() {
    // load users which are not members of this project
  },
  mounted() {
    this.getUsersProjectsList();
    this.getUsersList();
  },
  methods: {
    addUsers() {
      this.selectedUsers.forEach((user) => {
        this.newuser_username = user.username;

        // add user to the project
        let self = this;
        axios
          .post(
            "/server/userUserToProject",
            {
              username: self.newuser_username,
              project_id: self.projectID,
            },
            this.get_axiosConfig()
          )
          .then(function () {})
          .catch(function (error) {
            console.error("Error on get_project_userlist occurred.");
            console.log(error);
          });
      });
      this.$router.push({
        name: "ProjectDetails",
        params: {
          projectID: this.projectID,
        },
      });
    },
    cancelBtn() {
      this.$router.push({
        name: "ProjectDetails",
        params: {
          projectID: this.projectID,
        },
      });
    },
    async getUsersProjectsList() {
      let projectsList = await this.getProjects();
      
      this.projectName = projectsList.filter(
        (el) => el.id == this.projectID
      )[0].name;
    },
    filterUsers() {
      return this.project_users;
    },
    onUserSelected(users) {
      this.selectedUsers = users;
    },
    getUsersList() {
      let self = this;

      axios
        .post(
          "/server/get_project_userlist",
          {
            project_id: self.projectID,
          },
          this.get_axiosConfig()
        )
        .then(async function (response) {
          let existing_users = response.data.users_list;
          let existing_users_usernames = existing_users.map(
            (el) => el.username
          );

          self.project_users = await self.getUsers();

          // filter users which are not members of this project
          self.project_users = self.project_users.filter(
            (el) => !existing_users_usernames.includes(el.username)
          );
        })
        .catch(function (error) {
          console.error("Error on get_project_userlist occurred.");
          console.log(error);
        });
    },
  },
  props: {
    projectID: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.btn {
  width: 10rem;
}
</style>