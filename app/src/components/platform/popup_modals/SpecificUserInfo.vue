<template>
  <b-modal centered id="bv-modal-specificuserinfopopup" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div id="specificUserInfoPopupContent">
      <div class="box mb-3">
        <div class="h4 text-center">User Details</div>
        <br/>
        <hr class="mb-4">
        <div class="col-12 mb-4">
          <div><b>User: </b> {{ user.username }} </div>
          <div><b>First Name: </b> {{ user.first_name }} </div>
          <div><b>Last Name: </b> {{ user.last_name }} </div>
        </div>
        <br/>
        <hr class="mb-4">
        <div
          class="custom-button col-sm-16 float-sm-right"
          @click="closeModal()"
        >
          Close
        </div>
      </div>
    </div>
    
  </b-modal>
</template>

<script>
export default {
  name: 'SpecificUserInfoPopup',
  props: {
    username: {
      type: String,
      required: true,
    },
    tenantId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      user: {}
    };
  },
  mounted() {
    this.$bvModal.show("bv-modal-specificuserinfopopup");
    this.showSpecificUserInfo();
  },
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-specificuserinfopopup");
      this.$emit("hideUserDetails");
    },
    showSpecificUserInfo() {
      let self = this;
      let tenantId = "";
      if (!this.tenantId) {
        tenantId = this.$store.state.activeTenantId;
      } else {
        tenantId = this.tenantId;
      }
      this.getSpecificUserInfo(tenantId, this.username).then((user) => {
        self.user = user;
      });
    }
  }
};
</script>

<style scoped>
</style>
<style scoped>
.modal-content {
  max-width: 750px;
}

#specificUserInfoPopupContent {
  width: 750px;
}
</style>