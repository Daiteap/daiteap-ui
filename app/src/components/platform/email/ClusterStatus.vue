<template>
    <div style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f7f7f7;color: #000000;">
        <table
            style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f7f7f7;width:100%"
            cellpadding="0" cellspacing="0">
            <tbody>
                <tr style="vertical-align: top;" align="center">
                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;">
                        <div class="u-row-container" style="padding: 0px;background-color: transparent;">
                            <div class="u-row"
                                style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #111111;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                                    <div class="u-col u-col-100"
                                        style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                                        <div style="width: 100% !important;">
                                            <div
                                                style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                <table style="font-family:arial,helvetica,sans-serif;"
                                                    role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px;font-family:arial,helvetica,sans-serif;"
                                                                align="left">

                                                                <table width="100%" cellpadding="0" cellspacing="0"
                                                                    border="0">
                                                                    <tr>
                                                                        <td style="padding-right: 0px;padding-left: 0px;"
                                                                            align="center">

                                                                            <img align="center" border="0"
                                                                                src="@/assets/img/daiteap_logo1.png"
                                                                                alt="Logo" title="Logo"
                                                                                style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 242px;"
                                                                                width="242" />

                                                                        </td>
                                                                    </tr>
                                                                </table>

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="u-row-container" style="padding: 0px;background-color: transparent">
                            <div class="u-row"
                                style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                                    <div class="u-col u-col-100"
                                        style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                                        <div style="width: 100% !important;">
                                            <div
                                                style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                <table style="font-family:arial,helvetica,sans-serif;"
                                                    role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:arial,helvetica,sans-serif;"
                                                                align="left">

                                                                <h1
                                                                    style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: arial,helvetica,sans-serif; font-size: 26px;">
                                                                    Your Cluster is Ready&nbsp;
                                                                </h1>

                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 15px;font-family:arial,helvetica,sans-serif;"
                                                                align="left">
                                                                <p style="font-size: 14px; line-height: 140%;">
                                                                    Environment "{{ cluster.title }}" is created and
                                                                    available.
                                                                    <br>
                                                                    <br>
                                                                    User guide:

                                                                    <b-link @click="goToDocumentation">Link</b-link>
                                                                    <br>
                                                                    <br>
                                                                    Machines:
                                                                    <br>
                                                                    <span v-for="machine in cluster.machinesList"
                                                                        :key="machine.id">
                                                                        {{ machine.name }}: {{ machine.publicIP }}<br>
                                                                    </span>
                                                                    <br>

                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                <table style="font-family:arial,helvetica,sans-serif;"
                                                    role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;"
                                                                align="left">

                                                                <table height="0px" align="center" border="0"
                                                                    cellpadding="0" cellspacing="0" width="100%"
                                                                    style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #f1f1f1;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top">
                                                                            <td
                                                                                style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                                <span>&#160;</span>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="u-row-container" style="padding: 0px;background-color: transparent">
                            <div class="u-row"
                                style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                                    <div class="u-col u-col-100"
                                        style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                                        <div style="width: 100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div
                                                style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                <!--<![endif]-->

                                                <table style="font-family:arial,helvetica,sans-serif;"
                                                    role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 15px;font-family:arial,helvetica,sans-serif;"
                                                                align="left">

                                                                <div
                                                                    style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                    <p style="font-size: 14px; line-height: 140%;"><span
                                                                            style="font-size: 16px; line-height: 22.4px;"><strong>Hi
                                                                                {{
                                                                                        this.computed_userInfo.profile.first_name
                                                                                }} {{
        this.computed_userInfo.profile.last_name
}}</strong></span></p>
                                                                    <p>&nbsp;</p>
                                                                    <p style="font-size: 14px; line-height: 140%;">Find
                                                                        above your cluster information... If you have
                                                                        any request please let us know. </p>
                                                                    <p style="font-size: 14px; line-height: 140%;">
                                                                        <br /><span
                                                                            style="font-size: 16px; line-height: 22.4px;">Chris</span><br /><strong>Daiteap.com</strong><br />&nbsp;
                                                                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                                                    </p>
                                                                </div>

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="u-row-container" style="padding: 0px;background-color: transparent">
                            <div class="u-row"
                                style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                <div class="bg-img2"
                                    style="border-collapse: collapse;display: table;width: 100%;;background-repeat: no-repeat;background-position: center top;background-color: transparent;">
                                    <div class="u-col u-col-100"
                                        style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                                        <div style="width: 100% !important;">
                                            <div
                                                style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                <table style="font-family:arial,helvetica,sans-serif;"
                                                    role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;"
                                                                align="left">

                                                                <div>
                                                                    <strong>&nbsp;</strong>
                                                                </div>

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="u-row-container" style="padding: 0px;background-color: transparent">
                            <div class="u-row"
                                style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #ffffff;"><![endif]-->

                                    <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                                    <div class="u-col u-col-100"
                                        style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                                        <div style="width: 100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div
                                                style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                <!--<![endif]-->

                                                <table style="font-family:arial,helvetica,sans-serif;"
                                                    role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;"
                                                                align="left">

                                                                <table height="0px" align="center" border="0"
                                                                    cellpadding="0" cellspacing="0" width="100%"
                                                                    style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #f1f1f1;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top">
                                                                            <td
                                                                                style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                                <span>&#160;</span>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div class="u-row-container" style="padding: 0px;background-color: transparent">
                            <div class="u-row"
                                style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                                    <div class="u-col u-col-100"
                                        style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                                        <div style="width: 100% !important;">
                                            <div
                                                style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                                <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 15px;font-family:arial,helvetica,sans-serif;" align="left">

                                                                <div style="color: #888888; line-height: 180%; text-align: center; word-wrap: break-word;">
                                                                    <p style="font-size: 14px; line-height: 180%;">Want to change how you receive these emails? You can update your preferences or <span style="text-decoration: underline; font-size: 14px; line-height: 25.2px;"><b-link @click="goToUnsubscribe" style="color: #ff0000; font-size: 14px; line-height: 25.2px; text-decoration: underline;">unsubscribe</b-link></span>
                                                                        from this list.</p>
                                                                </div>

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                <table style="font-family:arial,helvetica,sans-serif;"
                                                    role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 15px;font-family:arial,helvetica,sans-serif;"
                                                                align="left">

                                                                <div
                                                                    style="color: #888888; line-height: 180%; text-align: center; word-wrap: break-word;">
                                                                    <p style="font-size: 14px; line-height: 180%;">
                                                                        &copy; 2022 DAITEAP GmbH &amp; Co KG. All Rights
                                                                        Reserved.</p>
                                                                </div>

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</template>

<script>
export default {
    props: {
        ClusterID: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            cluster: {},
        }
    },
    async mounted() {
        this.cluster = await this.getClusterDetailsMain(this.ClusterID);
    },
    methods: {
        goToClusterDetails() {
            let path = this.cluster.clusterType == 6 ? '/app/platform/computeoverviewall' : '/app/platform/clusterdetails/' + this.ClusterID + '/overview';
            this.$router.push({
                path
            });
        },
        goToDocumentation() {
            window.open("/documentation/", "_blank");
        },
        goToUnsubscribe() {
            window.open("/app/platform/email/unsubscribe", "_blank");
        },
    }
}
</script>

<style type="text/css">
@media only screen and (min-width: 570px) {
    .u-row {
        width: 550px !important;
    }

    .u-row .u-col {
        vertical-align: top;
    }

    .u-row .u-col-100 {
        width: 550px !important;
    }
}

@media (max-width: 570px) {
    .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
    }

    .u-row .u-col {
        min-width: 320px !important;
        max-width: 100% !important;
        display: block !important;
    }

    .u-row {
        width: calc(100% - 40px) !important;
    }

    .u-col {
        width: 100% !important;
    }

    .u-col>div {
        margin: 0 auto;
    }
}

body {
    margin: 0;
    padding: 0;
}

table,
tr,
td {
    vertical-align: top;
    border-collapse: collapse;
}

p {
    margin: 0;
}

.ie-container table,
.mso-container table {
    table-layout: fixed;
}

* {
    line-height: inherit;
}

a[x-apple-data-detectors='true'] {
    color: inherit !important;
    text-decoration: none !important;
}

table,
td {
    color: #000000;
}

.bg-img2 {
    background-image: url('../../../assets/img/image-2.png');
}
</style>