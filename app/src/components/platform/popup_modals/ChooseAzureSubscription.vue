<template>
  <b-modal centered id="bv-modal-chooseazuresubscription" hide-footer>
    <div></div>
    <div>
      <div class="box mb-3">
        <div class="h4 text-center">Please select Azure subscription</div>
        <div v-for="subscription of subscriptions" v-bind:key="subscription.subscriptionId">
        <hr />
        <br />
        <span
          class="btn btn-primary btn-lg"
          v-on:click="selectedSubscription(subscription.subscriptionId)"
        >
          {{ subscription.displayName }}({{ subscription.subscriptionId }})
        </span>
        </div>
      </div>
    </div>
    
  </b-modal>
</template>

<script>
export default {
  name: 'ChooseAzureSubscription',
  props: ["subscriptions", "tenant"],
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-chooseazuresubscription");
      this.$router.push({ name: "CloudProfile" });
    },
    selectedSubscription(selectedSubscriptionId) {
      this.$bvModal.hide("bv-modal-chooseazuresubscription");
      this.$emit('createApp', this.tenant, selectedSubscriptionId);
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