<template>
  <div class="pl-2" :key="updateStatus">
    <div
      class="d-flex cangeIconOnHover"
      v-if="validationStatus === false"
      title="Click to check credentials"
    >
      <i class="fas fa-check-circle validateIcon"></i>
      <i class="far fa-question-circle validateIcon"></i>
    </div>
    <div
      class="d-flex"
      v-else-if="
        validationStatus === 'timedOut'
      "
    >
      <div title="Timed out">
        <i class="fas fa-clock validateIcon"></i>
      </div>
      <div v-show="true" class="ml-3 mt-1">Timed out</div>
    </div>
    <div
      class="d-flex"
      v-else-if="listOfAccountsInDeletion.includes(account.id)"
    >
      <b-spinner
        style="width: 1.8rem; height: 1.8rem"
        variant="danger"
      ></b-spinner>
      <div v-show="true" class="ml-3 mt-1 text-danger">Deleting...</div>
    </div>
    <div
      v-else
      v-bind:class="{
        'load-complete load-success':
          (validationStatus === true && 
          alerts.find(alert => alert.id === account.id).show === false),
        'load-complete load-failure':
          validationStatus === 'error',
        'load-complete load-partial-success':
          (validationStatus === true && 
          alerts.find(alert => alert.id === account.id).show === true),
      }"
      class="circle-loader"
      data-test-id="status-icon"
    >
      <div
        v-bind:class="{
          'checkmark draw':
            (validationStatus === true && 
            alerts.find(alert => alert.id === account.id).show === false),
        }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ValidateButton',
  props: {
    account: Object,
    alerts: Array,
    validationStatus: {},
    listOfAccountsInDeletion: Array,
    updateStatus: Number,
  },
};
</script>

<style scoped>
.circle-loader {
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-left-color: #228ae6;
  animation-name: loader-spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  position: relative;
  display: inline-block;
  vertical-align: top;
}
.validateIcon {
  align-content: center;
  font-size: 1.85rem;
  /* min-height: 2.5rem; */
  color: #03586d3a;
}
.cangeIconOnHover:hover .fas,
.cangeIconOnHover .far {
  display: none;
}
.cangeIconOnHover:hover .far {
  display: inline;
}
.circle-loader,
.circle-loader:after {
  border-radius: 50%;
  width: 2em;
  height: 2em;
}

.circle-loader-large {
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-left-color: #228ae6;
  animation-name: loader-spin;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  position: relative;
  display: inline-block;
  vertical-align: top;
}

.circle-loader-large,
.circle-loader-large:after {
  border-radius: 50%;
  width: 5em;
  height: 5em;
}

.checkmark.draw:after {
  animation-duration: 1.2s;
  animation-timing-function: ease;
  animation-name: checkmark;
  transform: scaleX(-1) rotate(135deg);
}
.checkmark:after {
  opacity: 1;
  height: 1em;
  width: 0.5em;
  transform-origin: left top;
  border-right: 2px solid #a30082;
  border-top: 2px solid #a30082;
  content: "";
  left: 0.4em;
  top: 1em;
  position: absolute;
}

.load-failure:before,
.load-failure:after {
  display: block;
  content: "";
  height: 3px;
  background: #ea002f;
  width: 60%;
  position: absolute;
  top: 0.8em;
  left: 0.375em;
}
.load-failure:before {
  transform: rotate(45deg);
}
.load-failure:after {
  transform: rotate(-45deg);
}

.load-partial-success:before,
.load-partial-success:after {
  display: block;
  content: "";
  height: 3px;
  background: #fc8600;
  color: #fc8600;
  width: 60%;
  position: absolute;
  top: 0.8em;
  left: 0.375em;
  transform: rotate(90deg);
}

.load-complete {
  -webkit-animation: none;
  animation: none;
  transition: border 500ms ease-out;
}
.load-complete.load-success {
  border-color: #a30082;
}
.load-complete.load-failure {
  border-color: #ea002f;
}
.load-complete.load-partial-success {
  border-color: #fc8600;
}

@keyframes loader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes checkmark {
  0% {
    height: 0;
    width: 0;
    opacity: 1;
  }
  20% {
    height: 0;
    width: 0.5em;
    opacity: 1;
  }
  40% {
    height: 1em;
    width: 0.5em;
    opacity: 1;
  }
  100% {
    height: 1em;
    width: 0.5em;
    opacity: 1;
  }
}
</style>