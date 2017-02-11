var operators = ['equals', 'like', 'in', 'contains', 'containskey', 'exists']
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

        input: 'text'
    },
        {
            id: 'location',
            label: 'location',
            type: 'string',
            operators: ['in'],
            input: 'text',
            default_value: '[Parameters(\'\myparameter' + k + '\')]'
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
      },
    {
        id: 'tags.costcenter',
        label: 'tags.costCenter',
        type: 'string',
        operators: operators
    },
    {
        id: 'tags.applicationname',
        label: 'tags.applicationName',
        type: 'string',
        operators: operators
    },
    {
        id: 'tags.environment',
        label: 'tags.environment',
        type: 'string',
        operators: operators
    }
]

for (var k in aliases) {
    filters.push({
        id: aliases[k].toLowerCase(),
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
        if (operator.value.toLowerCase().startsWith("[parameters")) {
            policyobject = jQuery.parseJSON(
               '{"field": "' + operator.id + '",\"' + operator.operator + '":"' + operator.value + '" }'
               )

        } else if (operator.value.toLowerCase().startsWith("[")) {
            policyobject = jQuery.parseJSON(
           '{"field": "' + operator.id + '",\"' + operator.operator + '":' + operator.value + ' }'
           )
        } else {
            policyobject = jQuery.parseJSON(
                '{"field": "' + operator.id + '",\"' + operator.operator + '":"' + operator.value + '" }'
                )
        }


    }
    else if (operator.rules.length == 1) {
        if (operator.rules[0].value.toLowerCase().startsWith("[parameters")) {
            policyobject = jQuery.parseJSON(
               '{"field": "' + operator.rules[0].id + '",\"' + operator.rules[0].operator + '":"' + operator.rules[0].value + '" }'
               )

        } else if (operator.rules[0].value.toLowerCase().startsWith("[")) {
            policyobject = jQuery.parseJSON(
           '{"field": "' + operator.rules[0].id + '",\"' + operator.rules[0].operator + '":' + operator.rules[0].value + ' }'
           )
        } else {
            policyobject = jQuery.parseJSON(
                '{"field": "' + operator.rules[0].id + '",\"' + operator.rules[0].operator + '":"' + operator.rules[0].value + '" }'
                )
        }

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

function convertToRules(p) {

    p = JSON.parse(JSON.stringify(p).toLowerCase())
    var parsedrule = operatorOrConditionsToRule(p.if);
    if (parsedrule.condition == null) {
        var rule = {}
        rule.condition = "AND"
        rule.not = false
        rule.rules = []
        rule.rules.push(parsedrule)
        return rule
    } else {
        return parsedrule
    }

    //return operatorOrConditionsToRule(p.if, p.if.not == null);
}

function operatorOrConditionsToRule(node) {
    var not = false
    if (node.not) {
        not = true
        node = node.not
    }

    if (node.anyof) {
        subnotes = node.anyof
        var rule = {}
        rule.condition = "OR"
        rule.not = not
        rule.rules = []
        for (k in node.anyof) {
            rule.rules.push(operatorOrConditionsToRule(node.anyof[k], false))
        }
    } else if (node.allof) {
        subnotes = node.allof
        var rule = {}
        rule.condition = "AND"
        rule.not = not
        rule.rules = []
        for (k in node.allof) {
            rule.rules.push(operatorOrConditionsToRule(node.allof[k], false))
        }
    } else {
        if (not) {
            var rule = {}
            rule.condition = "AND"

            rule.not = not
            rule.rules = []
            rule.rules.push(conditionToRule(node))
        } else {
            return conditionToRule(node)
        }

    }
    return rule
}

function getOperator(condition) {
    var operators = ['equals', 'like', 'contains', 'containskey', 'in', 'exists']
    for (p in condition) {
        if ($.inArray(p, operators) > -1) {
            return p
        }
    }
}


function getField(condition) {
    return condition.field
}
function getValue(condition) {
    return condition[getOperator(condition)]
}

function conditionToRule(condition) {
    return { id: getField(condition), operator: getOperator(condition), value: getValue(condition) }
}
var condition = { field: "location", equals: "westus" }
var operator = getOperator(condition)
if (operator != 'equals') alert("test failed")
var value = getValue(condition)
var field = getField(condition)
//alert(JSON.stringify(conditionToRule(condition)))