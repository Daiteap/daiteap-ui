#!/bin/bash

set -e

# List the Subscription ID
SUBSCRIPTION=$(az account show)
SUBSCRIPTION_ID=$(echo $SUBSCRIPTION | jq -r .id)

# List Tenant ID
TENANT_ID=$(echo $SUBSCRIPTION | jq -r .tenantId)

# Define your role JSON as a string
ROLE_JSON='{
    "Name": "DaiteapRole",
    "Description": "Needed permissions for the Cloudcluster application.",
    "Actions": [
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Compute/availabilitySets/delete",
        "Microsoft.Compute/availabilitySets/read",
        "Microsoft.Compute/availabilitySets/vmSizes/read",
        "Microsoft.Compute/availabilitySets/write",
        "Microsoft.Compute/disks/delete",
        "Microsoft.Compute/disks/read",
        "Microsoft.Compute/disks/write",
        "Microsoft.Compute/galleries/applications/delete",
        "Microsoft.Compute/galleries/applications/read",
        "Microsoft.Compute/galleries/applications/versions/delete",
        "Microsoft.Compute/galleries/applications/versions/read",
        "Microsoft.Compute/galleries/applications/versions/write",
        "Microsoft.Compute/galleries/applications/write",
        "Microsoft.Compute/galleries/delete",
        "Microsoft.Compute/galleries/images/delete",
        "Microsoft.Compute/galleries/images/read",
        "Microsoft.Compute/galleries/images/versions/delete",
        "Microsoft.Compute/galleries/images/versions/read",
        "Microsoft.Compute/galleries/images/versions/write",
        "Microsoft.Compute/galleries/images/write",
        "Microsoft.Compute/galleries/read",
        "Microsoft.Compute/galleries/share/action",
        "Microsoft.Compute/galleries/write",
        "Microsoft.Compute/virtualMachines/assessPatches/action",
        "Microsoft.Compute/virtualMachines/cancelPatchInstallation/action",
        "Microsoft.Compute/virtualMachines/capture/action",
        "Microsoft.Compute/virtualMachines/convertToManagedDisks/action",
        "Microsoft.Compute/virtualMachines/deallocate/action",
        "Microsoft.Compute/virtualMachines/delete",
        "Microsoft.Compute/virtualMachines/generalize/action",
        "Microsoft.Compute/virtualMachines/installPatches/action",
        "Microsoft.Compute/virtualMachines/performMaintenance/action",
        "Microsoft.Compute/virtualMachines/powerOff/action",
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Compute/virtualMachines/redeploy/action",
        "Microsoft.Compute/virtualMachines/reimage/action",
        "Microsoft.Compute/virtualMachines/restart/action",
        "Microsoft.Compute/virtualMachines/runCommand/action",
        "Microsoft.Compute/virtualMachines/start/action",
        "Microsoft.Compute/virtualMachines/write",
        "Microsoft.Network/connections/delete",
        "Microsoft.Network/connections/read",
        "Microsoft.Network/connections/write",
        "Microsoft.Network/loadBalancers/backendAddressPools/backendPoolAddresses/read",
        "Microsoft.Network/loadBalancers/backendAddressPools/delete",
        "Microsoft.Network/loadBalancers/backendAddressPools/health/action",
        "Microsoft.Network/loadBalancers/backendAddressPools/join/action",
        "Microsoft.Network/loadBalancers/backendAddressPools/queryInboundNatRulePortMapping/action",
        "Microsoft.Network/loadBalancers/backendAddressPools/read",
        "Microsoft.Network/loadBalancers/backendAddressPools/updateAdminState/action",
        "Microsoft.Network/loadBalancers/backendAddressPools/write",
        "Microsoft.Network/loadBalancers/delete",
        "Microsoft.Network/loadBalancers/health/action",
        "Microsoft.Network/loadBalancers/networkInterfaces/read",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/loadBalancers/write",
        "Microsoft.Network/localnetworkgateways/delete",
        "Microsoft.Network/localnetworkgateways/read",
        "Microsoft.Network/localnetworkgateways/write",
        "Microsoft.Network/networkInterfaces/delete",
        "Microsoft.Network/networkInterfaces/ipconfigurations/read",
        "Microsoft.Network/networkInterfaces/join/action",
        "Microsoft.Network/networkInterfaces/loadBalancers/read",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Network/networkInterfaces/tapConfigurations/delete",
        "Microsoft.Network/networkInterfaces/tapConfigurations/read",
        "Microsoft.Network/networkInterfaces/tapConfigurations/write",
        "Microsoft.Network/networkInterfaces/write",
        "Microsoft.Network/networkSecurityGroups/delete",
        "Microsoft.Network/networkSecurityGroups/join/action",
        "Microsoft.Network/networkSecurityGroups/read",
        "Microsoft.Network/networkSecurityGroups/write",
        "Microsoft.Network/privateDnsZones/delete",
        "Microsoft.Network/privateDnsZones/read",
        "Microsoft.Network/privateDnsZones/SOA/read",
        "Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete",
        "Microsoft.Network/privateDnsZones/virtualNetworkLinks/read",
        "Microsoft.Network/privateDnsZones/virtualNetworkLinks/write",
        "Microsoft.Network/privateDnsZones/write",
        "Microsoft.Network/publicIPAddresses/delete",
        "Microsoft.Network/publicIPAddresses/join/action",
        "Microsoft.Network/publicIPAddresses/read",
        "Microsoft.Network/publicIPAddresses/write",
        "Microsoft.Network/routeTables/delete",
        "Microsoft.Network/routeTables/join/action",
        "Microsoft.Network/routeTables/read",
        "Microsoft.Network/routeTables/routes/delete",
        "Microsoft.Network/routeTables/routes/read",
        "Microsoft.Network/routeTables/routes/write",
        "Microsoft.Network/routeTables/write",
        "Microsoft.Network/virtualNetworkGateways/delete",
        "Microsoft.Network/virtualNetworkGateways/read",
        "Microsoft.Network/virtualNetworkGateways/write",
        "Microsoft.Network/virtualNetworks/delete",
        "Microsoft.Network/virtualNetworks/join/action",
        "Microsoft.Network/virtualNetworks/joinLoadBalancer/action",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/subnets/delete",
        "Microsoft.Network/virtualNetworks/subnets/join/action",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Network/virtualNetworks/subnets/virtualMachines/read",
        "Microsoft.Network/virtualNetworks/subnets/write",
        "Microsoft.Network/virtualNetworks/write",
        "Microsoft.Resources/subscriptions/resourceGroups/delete",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/resourceGroups/write",
        "Microsoft.Storage/storageAccounts/blobServices/containers/delete",
        "Microsoft.Storage/storageAccounts/blobServices/containers/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/write",
        "Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action",
        "Microsoft.Storage/storageAccounts/delete",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Storage/storageAccounts/write"

    ],
    "NotActions": [],
    "AssignableScopes": [
        "/subscriptions/'$SUBSCRIPTION_ID'"
    ],
    "DataActions": [
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete",
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write",
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action",
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action"
    ],
    "NotDataActions": []
}'

# Create a file for the role definition
echo $ROLE_JSON > role.json

# Create a custom role from the role definition file, update if it already exists
ROLE=$(az role definition create --role-definition @role.json || true)

if [ -z "$ROLE" ]; then
    echo "Updating existing role"
    ROLE=$(az role definition update --role-definition @role.json)
else
    echo "Role created"
fi

ROLE=$(az role definition list --name DaiteapRole)

# Get role ID
ROLE_ID=$(echo $ROLE | jq -r .[0].id)

# Get the username of the logged in user
USERNAME=$(az account show --query user.name -o tsv)

# Create a service principal and capture the output

SP=$(az ad sp create-for-rbac --name daiteap-$USERNAME --role $ROLE_ID --scopes /subscriptions/$SUBSCRIPTION_ID --sdk-auth)

# Extract Client ID and Client Secret from the service principal output
CLIENT_ID=$(echo $SP | jq -r .clientId)
CLIENT_SECRET=$(echo $SP | jq -r .clientSecret)

# Add Directory.Read.All permission to the app registration
echo "Adding Directory.Read.All permission to the app registration"
az ad app permission add --id $CLIENT_ID --api 00000003-0000-0000-c000-000000000000 --api-permissions 7ab1d382-f21e-4acd-a863-ba3e13f7da61=Role

echo "Granting admin consent for Directory.Read.All permission"
az ad app permission admin-consent --id $CLIENT_ID

echo ""
echo ""
echo ""

echo "Tenant ID: $TENANT_ID"
echo "Subscription ID: $SUBSCRIPTION_ID"
echo "Client ID: $CLIENT_ID"
echo "Client Secret: $CLIENT_SECRET"

# Clean up role definition file
rm ./role.json