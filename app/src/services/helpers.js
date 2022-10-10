const CLUSTER_CREATE_TEMPLATE = {
    "clusterName": "",
    "clusterDescription": "",
    "clusterContact": "test-automation@daiteap.com",
    "kubernetesConfiguration": {
        "version": "v1.19.7",
        "serviceAddresses": "10.233.0.0/18",
        "podsSubnet": "10.233.64.0/18",
        "networkPlugin": "flannel"
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
    "projectId": "697a1ee4-8469-48e9-99d5-b17fbbebb273"
}

export default {
  
    // converts save DLCMv2 template to cluster create request
    templateToClusterConfig_dlcmv2: function(template_details) {
        var request = Object.assign({}, CLUSTER_CREATE_TEMPLATE); // use shallow copy to avoid chaning the value of CLUSTER_CREATE_TEMPLATE
        request.kubernetesConfiguration = template_details.kubernetesConfiguration;
        request.load_balancer_integration = template_details.load_balancer_integration;
        request.internal_dns_zone = template_details.internal_dns_zone;
        request.name = template_details.name;
        request.clusterName = template_details.clusterName;
        request.clusterDescription = template_details.description;
        request.type = template_details.type;
        request.projectId = template_details.projectId;

        let key = '';
        if (template_details.hasOwnProperty('aws')) {
            request.awsSelected = true
            key = 'aws'
        } else if (template_details.hasOwnProperty('google')) {
            request.googleSelected = true
            key = 'google'
        } else if  (template_details.hasOwnProperty('azure')) {
            request.azureSelected = true
            key = 'azure'
        } else if  (template_details.hasOwnProperty('onpremise')) {
            request.onpremiseSelected = true
            key = 'onpremise'
        } else if  (template_details.hasOwnProperty('iotarm')) {
            request.iotarmSelected = true
            key = 'iotarm'
        } else if  (template_details.hasOwnProperty('openstack')) {
            request.openstackSelected = true
            key = 'openstack'
        }
        
        let data = template_details[key]
        request[key] = {}
        request[key]['account'] = data['account']
        request[key]['region'] = data['region']
        request[key]['nodes'] = data['nodes']
        request[key]['vpcCidr'] = data['vpcCidr']

        return request;
    },

    USER_ROLES: {
        ADMIN: "Admin",
        ACCOUNT_OWNER: "AccountOwner",
        REGULAR_USER: "RegularUser",
    }
};