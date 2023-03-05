import { Injectable } from '@nestjs/common';

import { SyncAwsCostReportDto } from "../dto";
import { AwsCostReport } from "../entity";
import { calculateEntityCost } from "../../shared/helpers/calculate-cost.helper";

@Injectable()
export class AwsCostReportMapper {
  async mapToCostReport (
    costReportDto: SyncAwsCostReportDto[]
  ) {
    return new Promise((resolve, reject) => {
      try {
        const costReportsEntity = costReportDto.map((report) => {
          const entity =  new AwsCostReport();
          const { date, operations, resources } = report;

          entity.date = new Date(date);
          entity.operations = operations;
          entity.resources = resources;

          entity.totalCost = calculateEntityCost(operations, 'cost') +
            calculateEntityCost(resources, 'cost');

          return entity;
        })
        resolve(costReportsEntity)
      } catch (error) {
        reject(error);
      }
    });
  };

  async updateReportModel(source: AwsCostReport[], target: AwsCostReport[]) {
    return new Promise((resolve, reject) => {
      try {
        const costReportsEntity = target.map((targetItem) => {
          const existItem = source.find((sourceItem) => +sourceItem.date === +targetItem.date);

          if (existItem) {
            return {...existItem, ...targetItem};
          }

          return targetItem;
        });

        resolve(costReportsEntity)
      } catch (error) {
        reject(error);
      }
    });
  }
}
