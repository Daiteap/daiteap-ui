<template>
  <b-dropdown
    width="15rem"
    id="createDropdown"
    right
    offset="0"
    text="Add Cloud Credentials"
    float="right"
    class="custom-nav-item text-center dropDownMenuButton"
    variant="outline-success"
  >
    <div v-for="(provider, index) in providers" :key="provider + index">
      <b-dropdown-item-button v-on:click="$parent.goToAddAccount(provider.name)">
        <li class="col d-flex justify-content-between">
          <div class="mr-auto">
            <img
              margin-top="auto"
              margin-bottom="auto"
              height="20pix"
              width="auto"
              :src="require('../../assets/img/' + provider.logo)"
            />
          </div>
        </li>
      </b-dropdown-item-button>
      <b-dropdown-divider></b-dropdown-divider>
    </div>
  </b-dropdown>
</template>

<script>

export default {
  name: 'CardDropdown',
  props: {
    providers: Array
  }
}
</script>

<style scoped>

</style>