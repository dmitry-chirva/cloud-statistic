export function findReportByDate(date: string) {
  return {
    '$match': {
      'date': new Date(date)
    }
  }
}

export function normalizationReportGroup() {
  return {
    '$project': {
      '_id': 0,
      'date': {$dateToString: {format: '%Y-%m-%d', date: '$date'}},
      'cost': '$totalCost'
    }
  }
}
