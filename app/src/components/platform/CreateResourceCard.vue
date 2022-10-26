<template>
  <b-card
    @click="$router.push(redirectPage)"
    class="custom-card"
    style="border-color: darkgray; margin: 32px 20px 32px 20px"
    no-body
  >
    <table width="100%" height="100%" style="margin: 25px 12px 25px 12px">
      <thead>
        <tr>
          <td
            style="
              font-size: 17px;
              vertical-align: middle;
              word-wrap: break-word;
              word-break: break-all;
              white-space: normal;
            "
            class="resizeText"
          >
            {{ text }}
          </td>
          <td style="vertical-align: middle">
            <i class="fa fa-plus-circle"></i>
          </td>
        </tr>
      </thead>
    </table>
  </b-card>
</template>

<script>
export default {
  name: "CreateResourceCard",
  props: {
    text: String,
    redirectPage: String,
  },
};
</script>

<style scoped>
.resizeText {
  max-width: 80px;
}

@media screen and (max-width: 800pt) {
  .resizeText {
    max-width: 27px;
  }
}
</style>