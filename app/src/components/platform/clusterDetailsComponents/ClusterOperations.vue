<template>
  <div class="row" >
    <div class="row d-flex justify-content-start">
        <b-card
          title="Start Environment"
          style="width: 18rem;"
          class="mb-3 mr-3 text-center"
          :class="$parent.clusterStatus == 10 ? 'baseBlock':'disabledOperation'"
        >
          <b-card-text
            ><i class="far fa-play-circle largeIcon"></i><br /><br />
            this will start environment {{ $parent.clusterName }}<br />
            ID: {{ $parent.clusterID }}
          </b-card-text>

          <b-button
            v-if="$parent.clusterStatus == 10"
            v-on:click="
              $parent.startCluster($parent.clusterID, $parent.clusterName)
            "
            class="btn btn-outline-success mx-4"
            >Start Environment</b-button
          >
          <b-button
            v-else
            class="btn btn-outline-success mx-4 disabled"
            >Start Environment</b-button
          >
        </b-card>
        <b-card
          title="Restart Environment"
          style="width: 18rem"
          class="mb-3 mr-3 text-center"
          :class="$parent.clusterStatus == 0 ? 'baseBlock':'disabledOperation'"
        >
          <b-card-text
            ><i class="fas fa-sync-alt largeIcon"></i><br /><br />
            this will restart environment {{ $parent.clusterName }}<br />
            ID: {{ $parent.clusterID }}
          </b-card-text>

          <b-button
            v-if="$parent.clusterStatus == 0"
            v-on:click="
              $parent.restartCluster($parent.clusterID, $parent.clusterName)
            "
            class="btn btn-outline-success mx-4"
            >Restart Environment</b-button
          >
          <b-button
            v-else
            class="btn btn-outline-success mx-4 disabled"
            >Restart Environment</b-button
          >
        </b-card>
        <b-card
          title="Stop Environment"
          style="width: 18rem"
          class="mb-3 mr-3 text-center"
          :class="$parent.clusterStatus == 0 ? 'baseBlock':'disabledOperation'"
        >
          <b-card-text
            ><i class="far fa-stop-circle largeIcon"></i><br /><br />
            this will stop environment {{ $parent.clusterName }}<br />
            ID: {{ $parent.clusterID }}
          </b-card-text>

          <b-button
            v-if="$parent.clusterStatus == 0"
            v-on:click="
              $parent.stopCluster($parent.clusterID, $parent.clusterName)
            "
            class="btn btn-outline-success mx-4"
            >Stop Environment</b-button
          >
          <b-button
            v-else
            class="btn btn-outline-success mx-4 disabled"
            >Stop Environment</b-button
          >
        </b-card>
        <b-card
          title="Rename Environment"
          style="width: 18rem"
          class="mb-3 mr-3 text-center baseBlock"
        >
          <b-card-text
            ><i class="far fa-edit largeIcon"></i><br /><br />
            Rename Environment {{ $parent.clusterName }}<br />
            ID: {{ $parent.clusterID }}
          </b-card-text>

          <b-button
            v-on:click="
              $parent.renameCluster()
            "
            class="btn btn-outline-success mx-4"
            >Rename Environment</b-button
          >
        </b-card>
        <b-card
          title="Delete Environment"
          style="width: 18rem"
          class="mb-3 mr-3 text-center baseBlock"
        >
          <b-card-text
            ><i class="far fa-trash-alt largeIcon"></i><br /><br />
            this will delete environment {{ $parent.clusterName }}<br />
            ID: {{ $parent.clusterID }}
          </b-card-text>

          <b-button
            v-on:click="
              $parent.deleteCluster($parent.clusterID, $parent.clusterName)
            "
            class="btn btn-outline-success mx-4"
            >Delete Environment</b-button
          >
        </b-card>
        <b-card
          title="Add Machines"
          style="width: 18rem"
          class="mb-3 mr-3 text-center baseBlock"
        >
          <b-card-text
            ><i class="far fa-plus-square largeIcon"></i><br /><br />
            Add machines to Environment {{ $parent.clusterName }}<br />
            ID: {{ $parent.clusterID }}
          </b-card-text>

          <b-button
            v-on:click="
              $parent.addMachineToCluster()
            "
            class="btn btn-outline-success mx-4"
            >Add Machines</b-button
          >
        </b-card>
        <b-card
          v-if="$parent.clusterType == 1 || $parent.clusterType == 3"
          title="Download Kubeconfig"
          style="width: 18rem"
          class="mb-3 mr-3 text-center baseBlock"
        >
          <b-card-text
            ><i class="fa fa-download largeIcon"></i><br /><br />
            Download th kubeconfig file for {{ $parent.clusterName }}<br />
            ID: {{ $parent.clusterID }}
          </b-card-text>

          <b-button
            v-on:click="
              $parent.downloadKubeconfig($parent.clusterID)
            "
            class="btn btn-outline-success mx-4"
            >Download</b-button
          >
        </b-card>
        <b-card
          title="Save as a Template"
          style="width: 18rem"
          class="mb-3 mr-3 text-center baseBlock"
        >
          <b-card-text
            ><i class="fa fa-save largeIcon"></i><br /><br />
            Save the configuration of {{ $parent.clusterName }} as a template <br />
            ID: {{ $parent.clusterID }}
          </b-card-text>

          <b-button
            v-on:click="$bvModal.show('bv-modal-saveenvironmenttemplate');"
            class="btn btn-outline-success mx-4"
            >Save template</b-button
          >
        </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClusterOperations',
  data() {
    return {
    };
  },
  created() {},
  mounted() {
    
  },
  methods: {},
  destroyed() {},
};
</script>

<style scoped>
a:not([href]):not([tabindex]) {
  color: #4e73df;
  text-decoration: none;
  cursor: pointer;
}

a:not([href]):not([tabindex]):hover {
  color: #224abe;
  text-decoration: underline;
  cursor: pointer;
}

.fa-user-plus {
  color: #000;
}

.fa-server {
  color: #000;
}

.card-header {
  display: block;
}

.card-header > h6 {
  display: inline-block;
}
* {
  white-space: inherit;
}

.row {
  display: flex;
  width: 100%;
  align-items: stretch;
}
.sidebar {
  position: fixed;
  padding-left: 1rem;
  margin-left: 1rem;
  top: 5rem;
}
.largeIcon {
  font-size: 7rem;
}
.baseBlock {
	-moz-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
	-o-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
	transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.baseBlock:hover {
	-webkit-transform: translate(0, 2px);
	-moz-transform: translate(0, 2px);
	-ms-transform: translate(0, 2px);
	-o-transform: translate(0, 2px);
	transform: translate(0, 2px);
	box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
}
.disabledOperation{
  background-color: rgba(0, 0, 0, 0.015);
}
</style>
