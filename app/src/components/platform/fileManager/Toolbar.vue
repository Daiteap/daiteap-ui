<template>
  <v-toolbar flat dense color="blue-grey lighten-5">
    <v-toolbar-items>
      <v-menu offset-y v-if="storages.length > 1">
        <template v-slot:activator="{ on }">
          <v-btn icon class="storage-select-button mr-3" v-on="on">
            <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
          </v-btn>
        </template>
        <v-list class="storage-select-list">
          <v-list-item
            v-for="(item, index) in storages"
            :key="index"
            :disabled="item.code === storageObject.code"
            @click="changeStorage(item.code)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn text :input-value="path === '/'" @click="changePath('/')">
        <v-icon class="mr-2">{{ storageObject.icon }}</v-icon>
        {{ storageObject.name }}
      </v-btn>
      <template v-for="(segment, index) in pathSegments">
        <v-icon :key="index + '-icon'">mdi-chevron-right</v-icon>
        <v-btn
          text
          :input-value="index === pathSegments.length - 1"
          :key="index + '-btn'"
          @click="changePath(segment.path)"
          >{{ segment.name }}</v-btn
        >
      </template>
    </v-toolbar-items>
    <div class="flex-grow-1"></div>

    <template v-if="$vuetify.breakpoint.smAndUp">
      <v-tooltip bottom v-if="pathSegments.length > 0">
        <template v-slot:activator="{ on }">
          <v-btn icon @click="goUp" v-on="on">
            <v-icon>mdi-arrow-up-bold-outline</v-icon>
          </v-btn>
        </template>
        <span v-if="pathSegments.length === 1">Up to "root"</span>
        <span v-else
          >Up to "{{ pathSegments[pathSegments.length - 2].name }}"</span
        >
      </v-tooltip>
      <v-menu
        v-model="newFolderPopper"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn v-if="path" icon v-on="on" title="Create Folder">
            <v-icon>mdi-folder-plus-outline</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-text-field
              label="Name"
              v-model="newFolderName"
              hide-details
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn @click="newFolderPopper = false" depressed>Cancel</v-btn>
            &nbsp;&nbsp;&nbsp;
            <v-btn
              :disabled="!newFolderName"
              depressed
              @click="mkdir"
              >Create Folder</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-btn
        v-if="path"
        icon
        @click="$refs.inputUpload.click()"
        title="Upload File"
      >
        <v-icon>mdi-plus-circle</v-icon>
        <input
          v-show="false"
          ref="inputUpload"
          type="file"
          @change="uploadFile"
        />
      </v-btn>
    </template>
  </v-toolbar>
</template>

<script>
export default {
  name: "Toolbar",
  props: {
    storages: Array,
    storage: String,
    path: String,
    endpoints: Object,
    axios: Function,
    bucket: Object,
  },
  data() {
    return {
      newFolderPopper: false,
      newFolderName: "",
    };
  },
  computed: {
    pathSegments() {
      let path = "/",
        isFolder = this.path[this.path.length - 1] === "/",
        segments = this.path.split("/").filter((item) => item);

      segments = segments.map((item, index) => {
        path += item + (index < segments.length - 1 || isFolder ? "/" : "");
        return {
          name: item,
          path,
        };
      });

      return segments;
    },
    storageObject() {
      return this.storages.find((item) => item.code == this.storage);
    },
  },
  methods: {
    changeStorage(code) {
      if (this.storage != code) {
        this.$emit("storage-changed", code);
        this.$emit("path-changed", "");
      }
    },
    changePath(path) {
      this.$emit("path-changed", path);
    },
    goUp() {
      let segments = this.pathSegments,
        path = segments.length === 1 ? "/" : segments[segments.length - 2].path;
      this.changePath(path);
    },
    uploadFile(event) {
      let fileToUpload = event.target.files[0];
      let fileName = fileToUpload.name;
      let fileContentType = fileToUpload.type;
      
      let self = this;

      var reader = new FileReader();

      reader.onload = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
          var fileByteArray = [];
          var arrayBuffer = evt.target.result,
            array = new Uint8Array(arrayBuffer);
          for (var i = 0; i < array.length; i++) {
            fileByteArray.push(array[i]);
          }

          let request = {
            content_type: fileContentType,
            contents: fileByteArray,
          };

          if (self.path != undefined) {
            fileName = self.path + fileName;
          }
          if (fileName[0] == "/") {
            fileName = fileName.substring(1);
          }
          if (fileContentType == "") {
            request.content_type = "plain/text";
          }

          self.axios
            .post(
              "/server/tenants/" +
                self.computed_active_tenant_id +
                "/buckets/" +
                self.bucket.id +
                "/files/-" +
                fileName,
              request,
              self.get_axiosConfig()
            )
            .then(function () {
              self.$notify({
                group: "msg",
                type: "success",
                title: "Message:",
                text: "Successfully added file!",
              });

              self.$emit("file-uploaded");
            })
            .catch(function (error) {
              console.log(error);
              if (error.response && error.response.status == "403") {
                self.$notify({
                  group: "msg",
                  type: "error",
                  title: "Notification:",
                  text: "Access Denied",
                });
              } else {
                self.$notify({
                  group: "msg",
                  type: "error",
                  title: "Message:",
                  text: "Error while adding file.",
                });
              }
            });
        }
      };

      reader.readAsArrayBuffer(fileToUpload);
    },
    mkdir() {
      this.$emit("loading", true);
      let self = this;
      
      let request = {
        content_type: "folder",
        contents: "",
      };

      let fileName = this.newFolderName + "/";
      if (this.path != undefined) {
        fileName = this.path + this.newFolderName + "/";
      }
      if (fileName[0] == "/") {
        fileName = fileName.substring(1);
      }

      this.axios
        .post(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/buckets/" +
            this.bucket.id +
            "/files/-" +
            fileName,
          request,
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Message:",
            text: "Successfully created folder!",
          });

          self.$emit("folder-created", self.newFolderName);
          self.newFolderPopper = false;
          self.newFolderName = "";
        })
        .catch(function (error) {
          console.log(error);
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          } else {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Message:",
              text: "Error while creating folder.",
            });
          }
        });

      this.$emit("loading", false);
    },
  },
};
</script>

<style lang="scss" scoped>
/* Storage Menu - alternate appearance
.storage-select-button ::v-deep .v-btn__content {
    flex-wrap: wrap;
    font-size: 11px;

    .v-icon {
        width: 100%;
        font-size: 22px;
    }
}
*/

.storage-select-list .v-list-item--disabled {
  background-color: rgba(0, 0, 0, 0.25);
  color: #fff;

  .v-icon {
    color: #fff;
  }
}
</style>