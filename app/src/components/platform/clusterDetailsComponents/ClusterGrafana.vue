<template>
  <div class="row">
    <div class="card mb-4 w-100" id="grafana">
      <div class="card-header py-3 cardHeaderLight">
        <h6 class="m-0 font-weight-bold">Grafana &nbsp;</h6>
      </div>
      <div class="card-body">
        <div v-if="loading" class="d-flex justify-content-center">
          <div class="spinner-border" role="status"></div>
        </div>
        <div v-else class="table-responsive">
          <table
            class="table table-bordered"
            id="dataTable"
            width="100%"
            cellspacing="0"
          >
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>admin</td>
                <td style="display: flex">
                  <div style="flex: 1" id="pwd">
                    {{
                      "*".repeat(cluster.grafana_admin_password.length)
                    }}
                  </div>
                  <div
                    style="margin-left: auto; margin: 5px"
                    type="button"
                    id="copy"
                    class="child far fa-copy"
                    alt="copy"
                    title="Double click to copy password"
                    @click="$emit('copyGrafanaPassword')"
                  >
                    <span
                      v-if="grafanaPWCopied"
                      style="margin-left: auto; margin: 5px"
                      >Copied</span
                    >
                  </div>
                </td>
                  <td>
                      <a :href="'http://' + cluster.grafana_address" target="_blank" rel="noopener noreferrer">{{
                        cluster.grafana_address
                      }}</a>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
export default {
  name: 'ClusterGrafana',
  props: ["loading", "cluster", "grafanaPWCopied"],
  created() {},
  mounted() {},
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
.cardHeaderLight {
  background-color: #fff;
  color: #1d1e22;
  border-bottom: #1d1e22 2px solid;
  border: #d1d1d1 1px solid;
}
.card-body {
  border: #00708c10 1px solid;
}
</style>
