<template>
<div class="row">
    <div class="card mb-4 w-100">
      <div class="card-header py-3 cardHeaderLight">
        <h6 class="m-0 font-weight-bold">Cloud Resources:</h6>
      </div>
      <div class="card-body">
        <div v-if="$parent.loading" class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
          <div v-else class="row p-0 m-0"
          >
            <iframe
            id="terraformVisualisationCloudResources"
            :src="$parent.cluster.terraform_graph_index_path"
            @load='resizeIFrameAndRemoveNavbar()'
            onload="this.style.opacity=1;" 
            style="height:200px;width:100%;border:none;overflow:hidden;opacity:0;"
            ></iframe>
          </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
export default {
  name: 'ClusterCloudResources',
  data() {
    return {};
  },
  created() {},
  mounted() {
  },
  methods: {
    resizeIFrameAndRemoveNavbar(){
      let embededFrame = document.getElementById("terraformVisualisationCloudResources")
      embededFrame.style.height = embededFrame.contentWindow.document.body.scrollHeight+"px";
      var allDivs = embededFrame.getElementsByTagName("div");
      for(let i=0; i < allDivs.length; i++){
        if ( allDivs[i].classList.contains("field") )
        {
            allDivs[i].style.display = "none";
        }
      }
       let navbar = embededFrame.contentWindow.document.getElementsByTagName("DIV")[1];
      navbar.style.display = "none"; 

    }
  }
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
.sidebar{
  position: fixed;
  padding-left: 1rem;
  margin-left: 1rem;
  top: 5rem;
}
.cardHeaderLight{
  background-color: #fff;
  color: #1d1e22;
  border-bottom: #1d1e22 2px solid;
  border: #d1d1d1 1px solid;
}
.card-body {
  border: #00708C10 1px solid;
}
</style>
