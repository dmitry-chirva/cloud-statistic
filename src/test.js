const AWS = require("aws-sdk");
const costExplorer = new AWS.CostExplorer();

test();
function test() {
  costExplorer.getCostAndUsage({
    "TimePeriod": {
      "Start":"2023-02-26",
      "End": "2023-02-28"
    },
    "Granularity": "DAILY",
    "GroupBy":[
      {
        "Type":"DIMENSION",
        "Key":"OPERATION"
      }
    ],
    "Metrics":["UnblendedCost"]
  }).promise()
    .then(data => console.log(data))
    .catch((err) => console.log(err));
}
