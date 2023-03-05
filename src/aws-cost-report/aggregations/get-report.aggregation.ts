export function normalizationDefaultReport() {
  return {
    '$project': {
      "_id": 0,
      "operations": {
        $map: {
          input: "$operations",
          as: "operation",
          in: {
            "name": "$$operation.name",
            "cost": "$$operation.cost.amount"
          }
        }
      },
      "resources": {
        $map: {
          input: "$resources",
          as: "resource",
          in: {
            "name": "$$resource.name",
            "cost": "$$resource.cost.amount"
          }
        }
      },
      "date": 1,
      "cost": "$totalCost"
    }
  }
}
