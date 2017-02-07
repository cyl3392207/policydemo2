var operators = ['equals', 'like', 'in', 'contains', 'containskey', 'exist']
var aliases = [
    "Microsoft.CDN/profiles/sku.name",
    "Microsoft.Compute/virtualMachines/sku.name",
    "Microsoft.Compute/virtualMachines/imagePublisher",
    "Microsoft.Compute/virtualMachines/imageOffer",
    "Microsoft.Compute/virtualMachines/imageSku",
    "Microsoft.Compute/virtualMachines/imageVersion",
    "Microsoft.Sql/servers/version",
    "Microsoft.Sql/servers/databases/requestedServiceObjectiveId",
    "Microsoft.Sql/servers/databases/requestedServiceObjectiveName",
    "Microsoft.Sql/servers/databases/edition",
    "Microsoft.Sql/servers/databases/elasticPoolName",
    "Microsoft.Sql/servers/elasticPools/dtu",
    "Microsoft.Sql/servers/elasticPools/edition",
    "Microsoft.Storage/storageAccounts/accountType",
    "Microsoft.Storage/storageAccounts/sku.name",
    "Microsoft.Storage/storageAccounts/accessTier",
    "Microsoft.Storage/storageAccounts/enableBlobEncryption",
    "Microsoft.Web/serverfarms/sku.name"
]
var types = [
    "Microsoft.AnalysisServices\/servers",
    "Microsoft.ApiManagement\/service",
    "Microsoft.AppService\/apiapps",
    "Microsoft.AppService\/appIdentities",
    "Microsoft.AppService\/gateways",
    "Microsoft.Archive\/collections",
    "Microsoft.Automation\/automationAccounts",
    "Microsoft.Automation\/automationAccounts\/runbooks",
    "Microsoft.Automation\/automationAccounts\/configurations",
    "Microsoft.AzureActiveDirectory\/b2cDirectories",
    "Microsoft.AzureStack\/registrations",
    "Microsoft.Backup\/BackupVault",
    "Microsoft.Batch\/batchAccounts",
    "Microsoft.BingMaps\/mapApis",
    "Microsoft.BizTalkServices\/BizTalk",
    "Microsoft.Cache\/Redis",
    "Microsoft.Cdn\/profiles",
    "Microsoft.Cdn\/profiles\/endpoints",
    "Microsoft.CertificateRegistration\/certificateOrders",
    "Microsoft.ClassicCompute\/domainNames",
    "Microsoft.ClassicCompute\/virtualMachines",
    "Microsoft.ClassicNetwork\/virtualNetworks",
    "Microsoft.ClassicNetwork\/reservedIps",
    "Microsoft.ClassicNetwork\/networkSecurityGroups",
    "Microsoft.ClassicStorage\/storageAccounts",
    "Microsoft.CloudSearch\/Indexes",
    "Microsoft.CloudSearch\/Indexes\/Documents",
    "Microsoft.CloudSearch\/Indexes\/Schemas",
    "Microsoft.CloudSearch\/Indexes\/Locations",
    "Microsoft.CloudSearch\/Indexes\/Scenarios",
    "Microsoft.CloudSearch\/Indexes\/RelevanceModels",
    "Microsoft.CognitiveServices\/accounts",
    "Microsoft.Compute\/availabilitySets",
    "Microsoft.Compute\/virtualMachines",
    "Microsoft.Compute\/virtualMachines\/extensions",
    "Microsoft.Compute\/virtualMachineScaleSets",
    "Microsoft.Compute\/virtualMachineScaleSets\/extensions",
    "Microsoft.Compute\/disks",
    "Microsoft.Compute\/snapshots",
    "Microsoft.Compute\/images",
    "Microsoft.Compute\/restorePointCollections",
    "Microsoft.ContainerRegistry\/registries",
    "Microsoft.ContainerService\/containerServices",
    "Microsoft.ContentModerator\/applications",
    "Microsoft.CortanaAnalytics\/accounts",
    "Microsoft.CustomerInsights\/hubs",
    "Microsoft.DataCatalog\/catalogs",
    "Microsoft.DataConnect\/connectionManagers",
    "Microsoft.DataFactory\/dataFactories",
    "Microsoft.DataLakeAnalytics\/accounts",
    "Microsoft.DataLakeStore\/accounts",
    "Microsoft.DBforMySQL\/servers",
    "Microsoft.DBforPostgreSQL\/servers",
    "Microsoft.Devices\/IotHubs",
    "Microsoft.DevTestLab\/labcenters",
    "Microsoft.DevTestLab\/labs",
    "Microsoft.DevTestLab\/schedules",
    "Microsoft.DevTestLab\/labs\/virtualMachines",
    "Microsoft.DevTestLab\/labs\/serviceRunners",
    "microsoft.dns\/dnszones",
    "microsoft.dns\/dnszones\/A",
    "microsoft.dns\/dnszones\/AAAA",
    "microsoft.dns\/dnszones\/CNAME",
    "microsoft.dns\/dnszones\/PTR",
    "microsoft.dns\/dnszones\/MX",
    "microsoft.dns\/dnszones\/TXT",
    "microsoft.dns\/dnszones\/SRV",
    "microsoft.dns\/trafficmanagerprofiles",
    "Microsoft.DocumentDB\/databaseAccounts",
    "Microsoft.DomainRegistration\/domains",
    "Microsoft.EventHub\/namespaces",
    "Microsoft.HDInsight\/clusters",
    "Microsoft.HybridData\/dataManagers",
    "Microsoft.ImportExport\/jobs",
    "microsoft.insights\/components",
    "microsoft.insights\/webtests",
    "microsoft.insights\/alertrules",
    "microsoft.insights\/autoscalesettings",
    "microsoft.insights\/notificationgroups",
    "microsoft.insights\/notificationrules",
    "Microsoft.Kailani\/fileStores",
    "Microsoft.Kailani\/fileStores\/dataSets",
    "Microsoft.KeyVault\/vaults",
    "Microsoft.Logic\/workflows",
    "Microsoft.Logic\/integrationAccounts",
    "Microsoft.MachineLearning\/Workspaces",
    "Microsoft.MachineLearning\/webServices",
    "Microsoft.MachineLearning\/commitmentPlans",
    "Microsoft.Media\/mediaservices",
    "Microsoft.MobileEngagement\/appcollections",
    "Microsoft.MobileEngagement\/appcollections\/apps",
    "Microsoft.Network\/virtualNetworks",
    "Microsoft.Network\/publicIPAddresses",
    "Microsoft.Network\/networkInterfaces",
    "Microsoft.Network\/loadBalancers",
    "Microsoft.Network\/networkSecurityGroups",
    "Microsoft.Network\/routeTables",
    "Microsoft.Network\/networkWatchers",
    "Microsoft.Network\/virtualNetworkGateways",
    "Microsoft.Network\/localNetworkGateways",
    "Microsoft.Network\/connections",
    "Microsoft.Network\/applicationGateways",
    "Microsoft.Network\/dnszones",
    "Microsoft.Network\/trafficmanagerprofiles",
    "Microsoft.Network\/expressRouteCircuits",
    "Microsoft.NotificationHubs\/namespaces",
    "Microsoft.NotificationHubs\/namespaces\/notificationHubs",
    "Microsoft.OperationalInsights\/workspaces",
    "Microsoft.OperationsManagement\/solutions",
    "Microsoft.Portal\/dashboards",
    "Microsoft.PortalSdk\/rootResources",
    "Microsoft.PowerBI\/workspaceCollections",
    "Microsoft.ProjectOxford\/accounts",
    "Microsoft.RecoveryServices\/vaults",
    "Microsoft.Relay\/namespaces",
    "Microsoft.RemoteApp\/collections",
    "Microsoft.Scheduler\/jobcollections",
    "Microsoft.Scheduler\/flows",
    "Microsoft.Search\/searchServices",
    "Microsoft.ServerManagement\/gateways",
    "Microsoft.ServerManagement\/nodes",
    "Microsoft.ServiceBus\/namespaces",
    "Microsoft.ServiceFabric\/clusters",
    "Microsoft.SiteRecovery\/SiteRecoveryVault",
    "Microsoft.Solutions\/appliances",
    "Microsoft.Sql\/servers",
    "Microsoft.Sql\/servers\/databases",
    "Microsoft.Sql\/servers\/resourcepools",
    "Microsoft.Sql\/servers\/elasticpools",
    "Microsoft.Sql\/servers\/jobAccounts",
    "Microsoft.SqlVM\/DWVM",
    "Microsoft.Storage\/storageAccounts",
    "Microsoft.StorSimple\/managers",
    "Microsoft.StreamAnalytics\/streamingjobs",
    "Microsoft.StreamAnalyticsExplorer\/environments",
    "Microsoft.StreamAnalyticsExplorer\/environments\/eventsources",
    "microsoft.visualstudio\/account",
    "microsoft.visualstudio\/account\/project",
    "microsoft.visualstudio\/account\/extension",
    "Microsoft.Web\/certificates",
    "Microsoft.Web\/serverFarms",
    "Microsoft.Web\/sites",
    "Microsoft.Web\/sites\/slots",
    "Microsoft.Web\/sites\/premieraddons",
    "Microsoft.Web\/hostingEnvironments",
    "Microsoft.Web\/managedHostingEnvironments",
    "Microsoft.Web\/classicMobileServices",
    "Microsoft.Web\/apiManagementAccounts",
    "Microsoft.Web\/apiManagementAccounts\/apis",
    "Microsoft.Web\/connections",
    "Microsoft.Web\/connectionGateways",
    "84codes.CloudAMQP\/servers",
    "AppDynamics.APM\/services",
    "Aspera.Transfers\/services",
    "Citrix.Cloud\/accounts",
    "Cloudyn.Analytics\/accounts",
    "Conexlink.MyCloudIT\/accounts",
    "Crypteron.DataSecurity\/apps",
    "Dynatrace.DynatraceSaaS\/accounts",
    "Dynatrace.Ruxit\/accounts",
    "Hive.Streaming\/services",
    "Incapsula.Waf\/accounts",
    "LiveArena.Broadcast\/services",
    "Lombiq.DotNest\/sites",
    "Mailjet.Email\/services",
    "Myget.PackageManagement\/services",
    "NewRelic.APM\/accounts",
    "Paraleap.CloudMonix\/services",
    "Pokitdok.Platform\/services",
    "RavenHq.Db\/databases",
    "Raygun.CrashReporting\/apps",
    "RedisLabs.Memcached\/databases",
    "RedisLabs.Redis\/databases",
    "RevAPM.MobileCDN\/accounts",
    "Sendgrid.Email\/accounts",
    "Signiant.Flight\/accounts",
    "Sparkpost.Basic\/services",
    "stackify.retrace\/services",
    "SuccessBricks.ClearDB\/databases",
    "SuccessBricks.ClearDB\/clusters",
    "TrendMicro.DeepSecurity\/accounts",
    "U2uconsult.TheIdentityHub\/services"
]

var filters = [{
    id: 'field:name',
    label: 'name',
    type: 'string',
    operators: operators

},
    {
        id: 'type',
        label: 'type',
        type: 'string',
        operators: operators,
        values: types,
        input: 'select'
    },
      {
          id: 'tags',
          label: 'tags',
          type: 'tags',
          operators: operators
      },
      {
          id: 'tags.X',
          label: 'tags.X',
          type: 'string',
          operators: operators
      }
]

for (var k in aliases) {
    filters.push({
        id: aliases[k],
        label: aliases[k],
        type: 'string',
        operators: ['in'],
        input: 'text',
        default_value: '[Parameters(\'\myparameter' + k + '\')]'
    })
}



function convertToPolicyDefnitionRule(operator) {
    var policydefintion = {}
    policydefintion.if = convertToPolicyDefinition(operator)
    policydefintion.then = { effect: "deny" }
    return policydefintion
}

function convertToPolicyDefinition(operator, policydefintion) {
    if (policydefintion == null) {
        policydefintion = {}
        policydefintion.if = {}
        policydefintion.then = { effect: "deny" }
    }
    var policyobject = {}
    var condition = {}
    if (operator.condition == null) {
        policyobject = jQuery.parseJSON(
            '{"field": "' + operator.id + '",\"' + operator.operator + '":"' + operator.value + '" }'
            )

    }
    else if (operator.rules.length == 1) {

        policyobject = jQuery.parseJSON(
           '{"field": "' + operator.rules[0].id + '",\"' + operator.rules[0].operator + '":"' + operator.rules[0].value + '" }'
           )
    }
    else if (operator.condition == "AND") {
        policyobject.allof = []
        for (var rule in operator.rules) {
            policyobject.allof.push(convertToPolicyDefinition(operator.rules[rule]))
        }
    } else if (operator.condition == "OR") {
        policyobject.anyof = []
        for (var rule in operator.rules) {
            policyobject.anyof.push(convertToPolicyDefinition(operator.rules[rule]))
        }
    }

    if (operator.not == true) {
        var notobject = {}
        notobject.not = policyobject
        return notobject
    }
    return policyobject

}