<template>
  <div class="modal is-active">
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="container w-100">
        <div class="row">
          <div class="col mt-3">
            <h1>Upload Your Custom YAML File</h1>
            <hr />
          </div>
        </div>
        <div class="row">
          <div v-show="!fileUploaded" class="col mt-2">
            <form action="#" method="post" id="uploadYAMLFile">
              <div class="form-group files color">
                <div class="d-flex justify-content-between">
                  <label>Custom values.yaml:</label>
                  <label>See Example</label>
                </div>
                <input
                  type="file"
                  class="form-control"
                  ref="valuesFile"
                  v-on:change="selectedValuesFile()"
                />
              </div>
            </form>
            <div class="row">
              <div
                class="col-xl-12 p-2 d-flex align-items-end justify-content-around"
                style="border-top: black solid 1 pix"
              >
                <input
                  type="button"
                  class="btn btn-outline-success col-xl-6 mx-1 px-0"
                  value="Cancel Custom Configuration"
                  @click="closeModal()"
                />
              </div>
            </div>
          </div>
          <div class="col-12" v-show="fileUploaded">
            <div class="d-flex justify-content-between pt-2">
              <label>Custom values.yaml:</label>
              <!-- <label @click="fileUploaded=false" style="cursor: pointer;" class="text-danger">Clear</label> -->
            </div>
            <textarea
              class="form-control"
              rows="17"
              v-model="$parent.form.valuesFile"
            ></textarea>

            <div class="row">
              <div
                class="col-xl-12 p-2 d-flex align-items-end justify-content-around"
                style="border-top: black solid 1 pix"
              >
                <input
                  type="button"
                  class="btn btn-outline-success col-xl-6 mx-1 px-0"
                  value="Cancel Custom Configuration"
                  @click="closeModal()"
                />
                <input
                  type="button"
                  class="btn btn-outline-success col-md-6 mx-1 px-0"
                  @click="
                    submitCustomConfiguration();
                    $parent.$parent.$parent.currentAccordion = 'submitted';
                    $parent.$parent.$parent.installStep = 4;
                  "
                  value="Install Service"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>

export default {
  name: 'YAMLUploadModal',
  data() {
    return {
      fileUploaded: false,
    };
  },
  methods: {
    closeModal() {
      this.$parent.showUploadYAML = false;
      this.$bvModal.hide("bv-modal-uploadyaml");
      this.$parent.$parent.$parent.form.configurationType = "simpleConfig";
    },
    selectedValuesFile() {
      this.$parent.$parent.$parent.form.configurationType = "advancedConfig";
      this.fileUploaded = true;
      let file = this.$refs.valuesFile.files[0];
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        this.$parent.form.valuesFile = evt.target.result;
      };
      reader.onerror = (evt) => {
        console.error(evt);
      };
    },
    submitCustomConfiguration() {
      this.$finalModel.valuesFile = this.$parent.form.valuesFile;
      this.$finalModel.configurationType = "advancedConfig";
      this.$parent.$parent.$parent.submitServiceConfiguration();
    },
  },
};
</script>

<style scoped>


.btn-success {
  margin-right: 20px;
}
</style>
<style scoped>
.icon::before {
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}

.files input {
  outline: 2px dashed #92b0b3;
  outline-offset: -10px;
  -webkit-transition: outline-offset 0.15s ease-in-out,
    background-color 0.15s linear;
  transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
  padding: 160px 0px 85px 35%;
  text-align: center !important;
  margin: 0;
  width: 100% !important;
  height: 350px;
}
.files input:focus {
  outline: 2px dashed #92b0b3;
  outline-offset: -10px;
  -webkit-transition: outline-offset 0.15s ease-in-out,
    background-color 0.15s linear;
  transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
  border: 1px solid #92b0b3;
}
.files {
  position: relative;
}
.files:after {
  pointer-events: none;
  position: absolute;
  top: 90px;
  left: 0;
  width: 50px;
  right: 0;
  height: 56px;
  content: "\f093";
  font-family: FontAwesome;
  background-image: url(../../../assets/img/uploadFile.svg);
  display: block;
  margin: 0 auto;
  background-size: 100%;
  background-repeat: no-repeat;
}
.color input {
  background-color: #f1f1f18a;
}
.files:before {
  position: absolute;
  bottom: 30px;
  left: 0;
  pointer-events: none;
  width: 100%;
  right: 0;
  height: 57px;
  content: " or drag it here. ";
  display: block;
  margin: 0 auto;
  color: #088697;
  font-weight: 600;
  text-transform: capitalize;
  text-align: center;
}
</style>