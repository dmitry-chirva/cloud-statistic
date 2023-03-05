export function findResourceAndOperation(resource: string = "", operation: string = "") {
  return {
    '$match': {
      'resources.name': resource,
      'operations.name': operation
    }
  }
}

export function filterByResourceAndOperation(resource: string = "", operation: string = "") {
  return {
    '$project': {
      'operations': {
        '$filter': {
          'input': '$operations',
          'as': 'operation',
          'cond': {
            '$eq': [
              '$$operation.name', operation
            ]
          }
        }
      },
      'resources': {
        '$filter': {
          'input': '$resources',
          'as': 'resource',
          'cond': {
            '$eq': [
              '$$resource.name', resource
            ]
          }
        }
      },
      'totalCost': {
        '$add': [
          {
            '$sum': '$resources.cost.amount'
          }, {
            '$sum': '$operations.cost.amount'
          }
        ]
      }
    }
  }
}

export function groupByResourceAndOperation() {
  return {
    '$group': {
      '_id': {
        'operations': '$operations.name',
        'resources': '$resources.name'
      },
      'cost': {
        '$sum': {
          '$sum': [
            '$totalCost'
          ]
        }
      }
    }
  }
}

export function normalizationResourceAndOperationGroup() {
  return {
    '$project': {
      '_id': 0,
      'resource': {
        '$let': {
          'vars': {
            'firstEl': {
              '$arrayElemAt': [
                '$_id.resources', 0
              ]
            }
          },
          'in': '$$firstEl'
        }
      },
      'operation': {
        '$let': {
          'vars': {
            'firstEl': {
              '$arrayElemAt': [
                '$_id.operations', 0
              ]
            }
          },
          'in': '$$firstEl'
        }
      },
      'cost': 1
    }
  }
}
