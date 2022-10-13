<template>
  <b-card
    @click="$router.push(redirectPage)"
    class="custom-card"
    style="border-color: darkgray; margin: 32px 20px 32px 20px"
    no-body
  >
    <span
      style="
        font-size: 17px;
        line-height: 4;
        padding-left: 15px;
        padding-right: 15px;
      "
    >
      {{ text }}
      <i class="fa fa-plus-circle float-right" style="line-height: inherit"></i>
    </span>
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