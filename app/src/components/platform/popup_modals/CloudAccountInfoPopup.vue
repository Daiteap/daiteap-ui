<template>
  <b-modal centered id="bv-modal-cloudaccountinfo" hide-footer>
    <div v-on:click="cancelBtn()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div class="h4 text-center">Cloud Account Details</div>
          <hr />

          <div v-for="(value, key) in cloudAccountInfo" :key="key">
            <strong>{{ key | upperCase }}</strong
            >: {{ value }}
          </div>

          <hr />
          <div>
            <div>
              <div class="custom-button float-right" @click="cancelBtn()">
                Close
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "CloudAccountInfoPopup",
  props: {
    cloudAccountInfo: Object,
  },
  methods: {
    cancelBtn() {
      this.$bvModal.hide("bv-modal-cloudaccountinfo");
    },
  },
  filters: {
    upperCase: function (data) {
      let upper = [];
      data.split("_").forEach((word) => {
        upper.push(word[0].toUpperCase() + word.substring(1));
      });
      return upper.join(" ");
    },
  },
};
</script>