<template>
  <b-modal centered id="bv-modal-quotaexceeded" hide-footer>
    <div></div>
    <div>
      <div class="box mb-3">
        <div class="h4 text-center">Quota exceeded
          <!-- info link to documentation -->
          <a href="/documentation/users/#user-resource-quotas" target="_blank" rel="noopener noreferrer">
            <i class="fa fa-info-circle"></i>
          </a>

        </div>
        <br />
        <div class="fieldBox">

          <div v-for="item in exceededResources" :key="item.resource_type">
            <hr />
            <div class="d-flex">
              <div style="width: 50%">
                <label><b>{{ item.resource_type }}:</b></label>
              </div>

              <div style="width: 50%">
                <label>Requested:</label>
                <span> {{ item.requested }} </span>

                <br />

                <label>Used:</label>
                <span> {{ item.used }}/{{ item.limit }} </span>
              </div>
            </div>
          </div>

          <hr />
          <br />
        </div>
        <div>
          <span
            v-on:click="closeModal"
            type="button"
            class="btn btn-outline-success col-sm-16 float-sm-right"
            >Close</span
          >
        </div>
      </div>
    </div>
    
  </b-modal>
</template>

<script>
export default {
  name: 'QuotaExceededModal',
  props: ["exceededResources"],
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-quotaexceeded");
    },
  },
};
</script>


<style scoped>


.form-group {
  margin: auto;
}
</style>
