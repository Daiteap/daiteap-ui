<template>
  <div>
    <div class="card daiteap-content-card">
      <div class="d-flex justify-content-between cardHeaderLight">
        <span class="fa-stack landing-page-icon">
          <i class="fas fa-square fa-stack-2x" style="line-height: 1.5;"></i>
          <i class="fas fa-project-diagram fas fa-stack-1x fa-inverse" style="line-height: 3;"></i>
        </span>
        <CardTitle title="Projects" style="line-height: 2;" />
        <span class="text-right h4 ml-auto">
          <AddButton text='Add New Project' @onClickAddButton="$router.push('addnewproject');" />
        </span>
      </div>
      <div>
        Find your active projects below - click on the project name to get detailed information for the project.
      </div>
      <hr />
      <div>
        <div v-if="loading" class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div v-else-if="projectsList.length > 0">
          <MyProjectsTable class="mt-2" :projectsList="projectsList" :tenantID="tenantID"
            :showTenant="false"
          />
        </div>
        <div v-else>
          <div> No projects currently. </div>
        </div>
      </div>
      <div v-if="!loading" class="d-flex justify-content-center"></div>
      <br />
    </div>

  </div>
</template>

<script>
import MyProjectsTable from "@/components/platform/tables/MyProjectsTable";
import CardTitle from "@/components/platform/CardTitle";
import AddButton from "@/components/platform/AddButton"

export default {
  name: "ProjectList",
  data() {
    return {
      interval: "",
      loading: false,
      projectsList: [],
      templatesList: [],
      templatesInDeletion: [],
      environmentNamesList: [],
      clusterFailureStatus: `error`,
      clusterLoadingStatus: `installing...`,
      clusterDeletingStatus: `deleting...`,
      errorMsgDelete: "",
      errorMsgResize: "",
      deleteItem: "",
    };
  },
  props: {
    tenantID: String,
  },
  components: {
    MyProjectsTable,
    CardTitle,
    AddButton,
  },
  created() {
    this.loading = true;
    this.getUsersProjectsList(this);
  },
  mounted() {
    let self = this;
    self.interval = setInterval(() => {
      self.getUsersProjectsList(self);
    }, 5000);

    window.intervals = [];
    window.intervals.push(self.interval);
  },
  methods: {
    goToCreateEnvironment(environment) {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
      if (environment == "Kubernetes") {
        this.$router.push({
          name: "CreateCluster",
        });
      } else if (environment == "K3S") {
        this.$router.push({
          name: "CreateK3s",
        });
      } else {
        this.$router.push({
          name: "CreateVMs",
        });
      }
    },
    async getUsersProjectsList(currentObject) {
      let self = currentObject;
      let projects;
      projects = await this.getProjects();
     
      self.projectsList = [];
      for (let i = 0; i < projects.length; i++) {
        self.projectsList[i] = {
          Name: "",
          Status: "",
          ID: "",
        };
        self.projectsList[i].Name = projects[i].name;
        self.projectsList[i].Description = projects[i].description;
        self.projectsList[i].Contact = projects[i].contact;
        self.projectsList[i].ID = projects[i].id;
        self.projectsList[i].CreatedAt = new Date(projects[i].created_at);

        self.environmentNamesList[i] = projects[i].name;
      }

      self.projectsList.sort(function (a, b) {
        return a.CreatedAt - b.CreatedAt;
      });

      self.loading = false;
    },
  },
  destroyed() {
    for (let i = 0; i < window.intervals.length; i++) {
      clearInterval(window.intervals[i]);
    }
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
.card-header {
  background-color: #fff;
}
</style>