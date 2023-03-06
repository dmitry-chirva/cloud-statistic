const AWS = require("aws-sdk");
const https = require('https');

// ---- Utils part ---- //
class DateUtils {
  static getDateIsoString(date) {
    const dateObject = new Date(date);

    if(isNaN(dateObject.valueOf())) {
      throw new TypeError(`Passed value has the wrong format.`)
    }

    return dateObject.toISOString().split('T')[0];
  }

  static addDays(days) {
    const DAY_IN_MILLISECONDS = (1000 * 60 * 60 * 24);

    if(!isFinite(days)) {
      throw new TypeError(`Passed value has the wrong type.`)
    }

    const currentDate = new Date();
    return currentDate.setTime(currentDate.getTime() + (parseInt(days) * DAY_IN_MILLISECONDS))
  }
}

class NumberUtils {
  static roundTo(n, decimals = 0) {
    return Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`);
  }
}

class ReportParamsUtils {
  static _getTimeReportParam() {
    const BUFFER_DAY = 1
    const TWO_WEEKS_IN_DAYS = 14
    const startDateTimeStamp =  DateUtils.addDays(BUFFER_DAY - TWO_WEEKS_IN_DAYS);
    const endDateTimeStamp =  DateUtils.addDays(BUFFER_DAY)

    return {
      "TimePeriod": {
        "Start": DateUtils.getDateIsoString(startDateTimeStamp),
        "End": DateUtils.getDateIsoString(endDateTimeStamp)
      }
    }
  }

  static _getBaseReportParam() {
    return {
      ...ReportParamsUtils._getTimeReportParam(),
      "Granularity": "DAILY",
      "Metrics":["UnblendedCost"]
    }
  }

  static getOperationParam() {
    return {
      ...ReportParamsUtils._getBaseReportParam(),
      "GroupBy":[
        {
          "Type":"DIMENSION",
          "Key":"OPERATION"
        }
      ]
    }
  }

  static getResourceParam(dimensionData) {
    if(!(dimensionData && Array.isArray(dimensionData["DimensionValues"]))) {
      throw new TypeError(`Passed value has the wrong format.`)
    }

    const dimensions = dimensionData["DimensionValues"].map((dimension => {
      return {
        "Dimensions": {
          "Key": "RESOURCE_ID",
          "Values": [dimension?.Value || ""]
        }
      }
    }))

    return {
      ...ReportParamsUtils._getBaseReportParam(),
      "Filter": {
        "Or": dimensions
      },
      "GroupBy":[
        {
          "Type":"DIMENSION",
          "Key":"RESOURCE_ID"
        }
      ]
    }
  }
}

async function postRequest (data, options) {
  const dataString = JSON.stringify(data)

  const requestOptions = {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length,
    },
    timeout: 2000
  }

  return new Promise((resolve, reject) => {
    const request = https.request(requestOptions, (response) => {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(
          new Error(`HTTP status code ${response.statusCode}`)
        )
      }

      const body = [];

      response.on('data', (chunk) => body.push(chunk))

      response.on('end', () => {
        const resString = Buffer.concat(body).toString()
        resolve(resString)
      })
    })

    request.on('error', (err) => {
      reject(err)
    })

    request.on('timeout', () => {
      request.destroy()
      reject(new Error('Request time out'))
    })

    request.write(dataString)
    request.end()
  })
}


// ---- Main part ---- //
(async () => {
  try {
    const costReport = await generateCostReport();
    await postRequest(costReport, {
      host: 'cloud-statistic.herokuapp.com',
      port: 443,
      path: '/aws-cost-report/sync'
    });

    console.log('\u001b[32m  Report generation was successful and sent to your server: cloud-statistic.herokuapp.com');
  } catch (error) {
    console.error(`\u001b[31m Generation report has error: ${error}`);
  }
})().catch(error => {
  console.error(`\u001b[31m Generation report has error: ${error}`);
});

// ---- Logic part ---- //
async function generateCostReport () {
  const costExplorer = new AWS.CostExplorer();

  console.log('\u001b[32m  The process of generation a cost report is starting ...');

  return Promise.allSettled([
    getCostReportWithOperations(costExplorer),
    getCostReportWithResources(costExplorer)
  ]).then(([operationReport, resourceReport]) => {
    if(!(operationReport?.value && operationReport.value.length)) {
      console.log(`\u001b[31m Unfortunately, an error appeared in the report with operations: ${resourceReport}`);
    }

    if(!(resourceReport?.value && resourceReport.value.length)) {
      console.log(`\u001b[31m Unfortunately, an error appeared in the report with resources: ${resourceReport}`);
    }

    return resourceReport?.value?.map(((resourceItem, index) => {
      if (!operationReport?.value?.length) {
        return resourceItem;
      }

      return {
        ...resourceItem,
        operations: operationReport.value[index].operations
      };
    })) || [];

  }).catch(error => {
    return error;
  })
}

async function getCostReportWithOperations (costExplorer) {
  try {
    const operationData = await costExplorer.getCostAndUsage(
      ReportParamsUtils.getOperationParam()
    ).promise();

    return normalizeDataFromReport(operationData, 'operations');
  } catch (error) {
    return error;
  }
}

async function getCostReportWithResources (costExplorer) {
  try {
    const dimensionData = await costExplorer.getDimensionValues({
      ...ReportParamsUtils._getTimeReportParam(),
      "Dimension": "RESOURCE_ID"
    }).promise()

    const resourcesData = await costExplorer.getCostAndUsageWithResources(
      ReportParamsUtils.getResourceParam(dimensionData)
    ).promise();

    return normalizeDataFromReport(resourcesData, 'resources');
  } catch (error) {
    return error;
  }
}

function normalizeDataFromReport (reportData, normalizationField) {
  if(!(reportData && normalizationField)) {
    return [];
  }

  return reportData.ResultsByTime
    .map((data) => {
      const result = {
        date: data.TimePeriod.Start
      };

      if (!data.Groups.length) {
        return {
          ...result,
          [normalizationField]: [],
        }
      }

      const dataGroups = data.Groups.map((item) => {
        const amount = item.Metrics.UnblendedCost.Amount ?
                        NumberUtils.roundTo(item.Metrics.UnblendedCost.Amount, 2) :
                        0;
        const unit = item.Metrics.UnblendedCost.Unit || 'USD';

        return {
          name: item.Keys[0],
          cost: {
            amount,
            unit
          }
        };
      });

      return {
        ...result,
        [normalizationField]: dataGroups
      }
    });
}
