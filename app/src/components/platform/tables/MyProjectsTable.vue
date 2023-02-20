<template>
  <div class="table-responsive">
    <table
      class="table table-bordered"
      id="dataTable"
      width="100%"
      cellspacing="0"
    >
      <RemoveProjectWarning
        :projectToRemove="projectToRemove"
        @confirmDelete="deleteProject"
      />
      <EditProjectPopup
        v-if="showEditProjectPopup"
        :currentProject="projectToEdit"
        :oldName="projectToEditName"
        @updateProject="updateProject"
      />
      <SpecificUserInfo
        v-if="showSpecificUserInfo"
        :username="specificUserUsername"
        @hideUserDetails="hideUserDetails"
      />
      <thead>
        <tr>
          <th>Name</th>
          <th name="hidePriority2">Description</th>
          <th name="hidePriority0">Created at</th>
          <th name="hidePriority1">Created by</th>
          <th name="hidePriority3">Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in projectsList" :key="item.ID">
          <td
            class="clickForDetails"
            v-on:click="
              $router.push({
                name: 'ProjectDetails',
                params: {
                  projectID: item.ID,
                  tenantID: tenantID,
                },
              })
            "
            :title="item.Name"
          >
            {{ item.Name }}
          </td>
          <td name="hidePriority2" :title="item.Description">
            {{ item.Description }}
          </td>
          <td name="hidePriority0">
            {{ item.CreatedAt | formatDate }}
          </td>
          <td
            name="hidePriority1"
            class="clickForDetails"
            v-on:click="showUserDetails(item.Contact)"
            :title="item.Contact"
          >
            {{ item.Contact }}
          </td>
          <td name="hidePriority3">
            <div class="pl-2">
              <div
                title="Edit"
                @click="openEditPopup(item)"
                class="fas fa-edit editIcon"
              ></div>
            </div>
          </td>
          <td>
            <div class="pl-2">
              <div
                title="Delete"
                @click="goToRemoveProjectWarning(item)"
                class="far fa-trash-alt deleteIcon"
              ></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import RemoveProjectWarning from "@/components/platform/popup_modals/RemoveProjectWarning";
import EditProjectPopup from "@/components/platform/popup_modals/EditProjectPopup";
import SpecificUserInfo from "@/components/platform/popup_modals/SpecificUserInfo";

export default {
  name: "MyProjectsTable",
  props: {
    projectsList: Array,
    tenantID: String,
    showTenant: Boolean,
  },
  data() {
    return {
      projectToRemove: {},
      allValidations: [],
      allCurrentLabels: [],
      listOfProjectsInDeletion: [],
      projectToEdit: {},
      projectToEditName: "",
      showEditProjectPopup: false,
      showSpecificUserInfo: false,
      specificUserUsername: "",
    };
  },
  components: {
    RemoveProjectWarning,
    EditProjectPopup,
    SpecificUserInfo,
  },
  created() {
    this.loadingTable = true;
  },
  mounted() {
    this.changeColumnsVisibility();
    window.addEventListener("resize", this.changeColumnsVisibility);
  },
  destroyed() {
    window.removeEventListener("resize", this.changeColumnsVisibility);
  },
  methods: {
    changeColumnsVisibility() {
      let sizes = [1420, 1240, 1085, 750];
      for (let i = 0; i < sizes.length; i++) {
        let columns = document.getElementsByName("hidePriority" + i);
        if (window.innerWidth < sizes[i]) {
          for (let j = 0; j < columns.length; j++) {
            columns[j].style.display = "none";
          }
        } else {
          for (let j = 0; j < columns.length; j++) {
            columns[j].style.display = "";
          }
        }
      }
    },
    goToRemoveProjectWarning(projectToRemove) {
      this.projectToRemove = projectToRemove;
      this.$bvModal.show("bv-modal-removeprojectwarning");
    },
    markProjectAsBeingInDeletion(project) {
      let projectToDelete = this.allValidations.find(
        (labels) => labels.label === project
      );
      if (!projectToDelete) {
        this.allValidations.push({
          label: project,
          statusOfValidation: false,
        });
      }
      let projectInDeletion = this.allValidations.find(
        (labels) => labels.label === project
      );
      projectInDeletion.statusOfValidation = "deleting";
    },
    deleteProject(project) {
      this.markProjectAsBeingInDeletion(project);
      let thisLabelIndex = this.allCurrentLabels.findIndex(
        (thisLabel) => thisLabel === project
      );
      this.allCurrentLabels.splice(thisLabelIndex, 1);
      this.listOfProjectsInDeletion.push(project.type + project.id);
      let self = this;
      this.axios
        .delete(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/projects/" +
            project.ID,
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly deleted project!",
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
            if (error.response.data.error.message != undefined) {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: error.response.data.error.message,
              });
            } else {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Error while deleting project!",
              });
            }
          }
        });
    },
    showUserDetails(username) {
      this.specificUserUsername = username;
      this.showSpecificUserInfo = true;
    },
    hideUserDetails() {
      this.showSpecificUserInfo = false;
    },
    openEditPopup(project) {
      this.projectToEdit = project;
      this.projectToEditName = project.Name;
      this.showEditProjectPopup = true;
      this.$nextTick(function () {
        this.$bvModal.show("bv-modal-editproject");
      });
    },
    updateProject(project) {
      let self = this;
      this.axios
        .put(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/projects/" +
            project.id,
          {
            name: project.Name,
            description: project.Description,
          },
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly updated project!",
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
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while updating project.",
            });
          }
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
  width: 20rem !important;
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
</style>
