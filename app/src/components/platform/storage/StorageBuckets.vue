<template>
  <div>
    <WarningAlert
      v-if="showAlert"
      msg="Bucket is not empty."
      color="warning"
      :key="alertKey"
    />

    <table
      class="table table-bordered"
      width="100%"
      cellspacing="0"
      v-if="buckets.length > 0"
    >
      <GenericPopupWarning
        v-if="bucketToDelete.provider == 'azure'"
        :message="`Confirm deleting ${bucketToDelete.name} Warning: This will delete all files in the container.`"
        @confirm="deleteBucket"
        :modalId="popupId"
      />
      <GenericPopupWarning
        v-else
        :message="`Confirm deleting ${bucketToDelete.name}`"
        @confirm="deleteBucket"
        :modalId="popupId"
      />
      <thead>
        <tr>
          <th>Name</th>
          <th>Cloud</th>
          <th v-if="!projectID && !showTenant">Project</th>
          <th v-if="showTenant">Workspace</th>
          <th>Credential</th>
          <th>Created At</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in buckets" :key="item.name">
          <td
          class="clickForDetails"
          v-on:click="
            $router.push({
              name: 'BucketDetails',
              params: {
                bucket: item,
              },
            })
          "
        >{{ item.name }}</td>
          <td>
            <img
              v-if="item.provider == 'aws'"
              height="25pix"
              width="auto"
              :src="require('../../../assets/img/aws_logo_small.png')"
            />
            <img
              v-if="item.provider == 'azure'"
              height="25pix"
              width="auto"
              :src="require('../../../assets/img/azure_logo_small.png')"
            />
            <img
              v-if="item.provider == 'google'"
              height="25pix"
              width="auto"
              :src="require('../../../assets/img/googleCloud_logo_small.png')"
            />
          </td>
          <td
            class="clickForDetails"
            @click="
              $router.push({
                name: 'ProjectDetails',
                params: {
                  projectID: item.project.id,
                },
              })
            "
            v-if="!projectID && !showTenant"
          >{{ item.project.name }}</td>
          <td
            v-if="showTenant"
            class="clickForDetails"
            @click="
              $router.push({
                name: 'WorkspaceDetails',
                params: {
                  tenant: item.tenant,
                },
              })
            "
          >{{ item.tenant.name }}</td>
          <td>{{ item.credential.label }}</td>
          <td>{{ item.created_at | formatDate }}</td>
          <td>
            <div class="pl-2">
              <div
                title="Delete bucket"
                @click="deleteBucketPopup(item)"
                class="far fa-trash-alt deleteIcon"
              ></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import GenericPopupWarning from "../popup_modals/GenericPopupWarning";
import WarningAlert from "@/components/platform/WarningAlert";

export default {
  name: "StorageBuckets",
  components: {
    GenericPopupWarning,
    WarningAlert,
  },
  props: {
    buckets: Array,
    projectID: String,
    showTenant: Boolean,
  },
  data() {
    return {
      bucketToDelete: "",
      showAlert: false,
      alertKey: 0,
      popupId: "bucketdeletewarning",
    };
  },
  methods: {
    deleteBucketPopup(bucket) {
      this.bucketToDelete = bucket;
      this.$bvModal.show(this.popupId);
    },
    deleteBucket() {
      this.$bvModal.hide(this.popupId);
      let self = this;

      this.axios
        .delete(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/buckets/" +
            this.bucketToDelete.id,
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Message:",
            text: "Successfully deleted bucket!",
          });
        })
        .catch(function (error) {
          if (error.response.data.error == "Bucket is not empty.") {
            self.showAlert = true;
            self.alertKey += 1;
          } else {
            self.showAlert = false;
            self.alertKey += 1;
            console.log(error);
            self.$notify({
              group: "msg",
              type: "error",
              title: "Message:",
              text: "Error while deleting bucket.",
            });
          }
        });
    },
  },
};
</script>

<style scoped>
</style>