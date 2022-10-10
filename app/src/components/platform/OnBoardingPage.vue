<template>
  <div class="container-fluid h-100 cloudBackground" :style="{backgroundImage:'url(' + require('../../assets/img/cloud.svg')+')'}">
    <div class="row align-items-center h-100" >
    <br>
    <br>
    <br>
    <div class="col text-center">
      <h3 class="d-flex justify-content-center">You are all good to add your cloud credentials to Daiteap</h3>
      <br>
      <h6>No cloud credentials are linked at the moment</h6>
      <br>
      <button class="btn btn-primary" @click="$parent.goToAccs">Add your cloud credentials...</button>
      <br>
      <br>
      <h4>
        Wonder what to do next?
        <br>
        <a id="visit-guide" href="https://daiteap.gitbook.io/daiteap/"  target="_blank" rel="noopener noreferrer">Visit our guide</a>
      </h4>
    </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'OnBoardingPage',
};
</script>

<style scoped>
#visit-guide:link {
  color: #ea002f;
  background-color: transparent;
  text-decoration: none;
}

#visit-guide:visited {
  color: #ea002f;
  background-color: transparent;
  text-decoration: none;
}

#visit-guide:hover {
  color: #ea002f;
  background-color: transparent;
  text-decoration: underline;
}

#visit-guide:active {
  color: #ea002f;
  background-color: transparent;
  text-decoration: underline;
}

.btn-primary:hover, .btn-primary:focus {
    color: #fff;
    background-color: #7fb5cb;
    border-color: #eaebed;
}
.cloudBackground{
  background-repeat: no-repeat;
  background-size: 1400px;
  background-position: center;
  background-blend-mode: soft-light;
}
</style>
