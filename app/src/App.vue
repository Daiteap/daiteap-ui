<template>
  <div id="app">
    <router-view :key="loadingTenant" v-if="!loadingTenant"></router-view>
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css" rel="stylesheet">
  </div>
</template>

<script>
import(/* webpackMode: "eager" */'./assets/css/apptheme_' + process.env.VUE_APP_THEME + '.css');

export default {
  name: "App",
  components: {},
  data() {
    return {
      updatingToken: false,
      usingToken: 0,
      loadingTenant: true,
    };
  },
  created() {
    if (!this.computed_single_user_mode){
      this.registerUser();
    } else {
      this.getActiveTenants();
      this.getUserInfo();
    }

    setTimeout(() => {
      this.loadingTenant = false;
    }, 1000);
  },
  mounted() {
    let self = this;

    this.interval = setInterval(() => {
      self.updatingToken = true;
      while (self.usingToken > 0) {
        self.sleep(50);
      }
    }, 5000);

    window.intervals = [];
    window.intervals.push(this.interval);
  },
  methods: {},
};
</script>

<style src="@fortawesome/fontawesome-free/css/all.css">
</style>

<style >
.card-header {
  background-color: #fff;
}

.editIcon {
  cursor: pointer;
  align-content: center;
  font-size: 1.5rem;
  padding-top: 0.2rem;
  color: #000000;
}

.checkIcon {
  align-content: center;
  font-size: 1.5rem;
  padding-top: 0.2rem;
  color: green;
}

.deleteIcon {
  cursor: pointer;
  align-content: center;
  font-size: 1.5rem;
  padding-top: 0.2rem;
  color: #ea002f;
}

.custom-button {
  width: 12rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  border: 0 solid #000;
  border-radius: 100rem;
  background-color: #fff;
  color: #000;
  -webkit-box-shadow: 0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%);
  box-shadow: 0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%);
}

.custom-button:hover {
  background-color: #000;
  color: #fff;
}

.custom-button.deactivated {
  background-color: #fff !important;
  border: 0 solid #000;
  color: #bcbcbc;
  cursor: not-allowed !important;
  pointer-events: none;
}

.customCheckbox {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  width: 25px;
  height: 25px;
  border: 1px solid rgb(119, 118, 118);
  border-radius: 2.5px;
}

.customCheckbox.checked {
  background-color: blue;
  border: 1px solid blue;
}

.customCheckbox.disabled {
  pointer-events: none;
  background-color: rgb(171, 171, 171);
  border: 1px solid rgb(119, 118, 118);
}

.checkboxCheckmark {
  color: white;
  font-size: 1.2rem;
}

.customRadio {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  width: 25px;
  height: 25px;
  border: 1px solid rgb(119, 118, 118);
  border-radius: 50%;
}

.customRadio.checked {
  background-color: blue;
  border: 1px solid blue;
  padding-top: 0.16rem;
}

.customRadio.disabled {
  pointer-events: none;
  background-color: rgb(171, 171, 171);
  border: 1px solid rgb(119, 118, 118);
}

.radioCheckmark {
  color: white;
  font-size: 1.2rem;
}
</style>
