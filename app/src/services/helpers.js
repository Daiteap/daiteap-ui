const CLUSTER_CREATE_TEMPLATE = {
  "clusterName": "",
  "clusterDescription": "",
  "clusterContact": "test-automation@daiteap.com",
  "kubernetesConfiguration": {
    "version": "v1.19.7",
    "serviceAddresses": "10.233.0.0/18",
    "podsSubnet": "10.233.64.0/18",
    "networkPlugin": "flannel",
  },
  "alicloudSelected": false,
  "awsSelected": false,
  "googleSelected": false,
  "openstackSelected": false,
  "azureSelected": false,
  "onpremiseSelected": false,
  "iotarmSelected": false,
  "load_balancer_integration": "",
  "internal_dns_zone": "daiteap.internal",
  "type": 1,
  "name": "",
  "description": "",
  "projectId": "697a1ee4-8469-48e9-99d5-b17fbbebb273",
};

export default {

  // converts save DLCMv2 template to cluster create request
  templateToClusterConfig_dlcmv2: function(templateDetails) {
    // use shallow copy to avoid chaning the value of CLUSTER_CREATE_TEMPLATE
    const request = Object.assign({}, CLUSTER_CREATE_TEMPLATE);
    request.kubernetesConfiguration = templateDetails.kubernetesConfiguration;
    request.load_balancer_integration =
      templateDetails.load_balancer_integration;
    request.internal_dns_zone = templateDetails.internal_dns_zone;
    request.name = templateDetails.name;
    request.clusterName = templateDetails.clusterName;
    request.clusterDescription = templateDetails.description;
    request.type = templateDetails.type;
    request.projectId = templateDetails.projectId;

    let key = "";
    if (Object.prototype.hasOwnProperty.call(templateDetails, "aws")) {
      request.awsSelected = true;
      key = "aws";
    } else if (
      Object.prototype.hasOwnProperty.call(templateDetails, "google")) {
      request.googleSelected = true;
      key = "google";
    } else if (
      Object.prototype.hasOwnProperty.call(templateDetails, "azure")) {
      request.azureSelected = true;
      key = "azure";
    } else if (
      Object.prototype.hasOwnProperty.call(templateDetails, "onpremise")) {
      request.onpremiseSelected = true;
      key = "onpremise";
    } else if (
      Object.prototype.hasOwnProperty.call(templateDetails, "iotarm")) {
      request.iotarmSelected = true;
      key = "iotarm";
    } else if (
      Object.prototype.hasOwnProperty.call(templateDetails, "openstack")) {
      request.openstackSelected = true;
      key = "openstack";
    }

    const data = templateDetails[key];
    request[key] = {};
    request[key]["account"] = data["account"];
    request[key]["region"] = data["region"];
    request[key]["nodes"] = data["nodes"];
    request[key]["vpcCidr"] = data["vpcCidr"];

    return request;
  },

  USER_ROLES: {
    ADMIN: "Admin",
    ACCOUNT_OWNER: "AccountOwner",
    REGULAR_USER: "RegularUser",
  },
};
