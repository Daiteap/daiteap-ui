<template>
  <b-modal centered id="bv-modal-clusteruserinfomodal" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box mb-3">
        <div class="h4 text-center">{{ clusterUserDetails.username }} details</div>
        <h6 class="text-center text-secondary">Status: {{ clusterUserDetails.status }}</h6>
        <div>
        <hr/>
        <br/>
        <div>
          <div >
            <div class="col-lg-12 pb-3">
            <label
            class="col-lg-12 control-label">
              Username:
            </label>
              <input
                readonly
                :value="this.clusterUserDetails.username "
                class="form-control"
                type="text"
              />
            </div>
            <div class="col-lg-12 pb-3">
            <label
            class="col-lg-12 control-label">
              Name:
            </label>
              <input
                readonly
                :value="this.clusterUserDetails.first_name +' '+ this.clusterUserDetails.last_name"
                class="form-control"
                type="text"
              />
            </div>
            <div class="col-lg-12 pb-3">
            <label
            class="col-lg-12 control-label">
              Type:
            </label>
              <input
                readonly
                :value="this.clusterUserDetails.type "
                class="form-control"
                type="text"
              />
            </div>
            <div class="col-lg-12 pb-3">
            <label
            class="col-lg-12 control-label">
              Public SSH Key:
            </label>
              <input
                readonly
                :value="this.clusterUserDetails.public_ssh_key "
                class="form-control"
                type="text"
              />
            </div>
          </div>
          <br />
          <hr />
          <br />
          <div class="form-group col-lg-12 text-center">
            <div class="col-lg-12">
              <input
                v-on:click="closeModal"
                type="button"
                class="btn btn-outline-success col-lg-4"
                value="Close"
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
    
  </b-modal>
</template>

<script>

export default {
  name: 'ClusterUserInfoModal',
  props: ["clusterUserDetails"],
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-clusteruserinfomodal");
    }
  }
};
</script>

<style scoped>


</style>