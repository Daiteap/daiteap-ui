<template>
  <b-modal centered id="bv-modal-choosegoogleprojects" hide-footer>
    <div></div>
    <div>
      <div class="box mb-3">
        <div class="h4 text-center">Please select Google project</div>
        <div v-for="project of projects" v-bind:key="project.name">
        <hr />
        <br />
        <span
          class="btn btn-primary btn-lg"
          v-on:click="selectedProject(project.projectId)"
        >
          {{ project.name }}({{ project.projectId }})
        </span>
        </div>
      </div>
    </div>
    
  </b-modal>
</template>

<script>
export default {
  name: 'ChooseGoogleProject',
  props: ["projects"],
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-choosegoogleproject");
      this.$router.push({ name: "CloudProfile" });
    },
    selectedProject(selectedProjectId) {
      this.$bvModal.hide("bv-modal-choosegoogleprojects");
      this.$emit('createServiceAccount', selectedProjectId);
    }
  }
};
</script>


<style scoped>


.form-group {
  margin: auto;
}

.btn-primary {
  width: 100%;
}
</style>