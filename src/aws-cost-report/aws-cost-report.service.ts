import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
  GetCostReportByDateDto,
  GetCostReportByResourceAndOperationDto,
  SyncAwsCostReportDto
} from "./dto";
import { AwsCostReport } from "./entity";
import { AwsCostReportMapper } from "./mapper/aws-cost-report.mapper";
import {
  filterByResourceAndOperation,
  findResourceAndOperation,
  groupByResourceAndOperation,
  normalizationResourceAndOperationGroup
} from "./aggregations/group-by-resource-operation.aggregation";
import { findReportByDate, normalizationReportGroup } from "./aggregations/group-by-date.aggregation";
import { normalizationDefaultReport } from "./aggregations/get-report.aggregation";

@Injectable()
export class AwsCostReportService {
  constructor(
    @InjectRepository(AwsCostReport)
    private readonly awsCostReportRepository: Repository<AwsCostReport>,
    private readonly awsCostReportMapper: AwsCostReportMapper
  ) {}

  async sync(syncAwsCostReportDto: SyncAwsCostReportDto[]) {
    const [existEntriesResult, newEntriesResult] = await Promise.allSettled([
      this.awsCostReportRepository.find(),
      this.awsCostReportMapper.mapToCostReport(syncAwsCostReportDto)
    ])

    const { value: existEntries } = <PromiseFulfilledResult<AwsCostReport[]>>existEntriesResult;
    const { value: newEntries } = <PromiseFulfilledResult<AwsCostReport[]>>newEntriesResult;


    const entriesToSave = existEntries?.length ?
       await this.awsCostReportMapper.updateReportModel(existEntries, newEntries) : await Promise.resolve(newEntries)

    return this.awsCostReportRepository.save(entriesToSave);
  };

  async getReport() {
    return this.awsCostReportRepository.manager.getMongoRepository(AwsCostReport).aggregate([
      normalizationDefaultReport()
    ]).toArray();
  }

  async getReportByDate({ date }: GetCostReportByDateDto) {
    return this.awsCostReportRepository.manager.getMongoRepository(AwsCostReport).aggregate([
      findReportByDate(date),
      normalizationReportGroup()
    ]).toArray();
  }

  async getReportByResourceAndOperation({resource, operation}: GetCostReportByResourceAndOperationDto) {
    return this.awsCostReportRepository.manager.getMongoRepository(AwsCostReport).aggregate([
        findResourceAndOperation(resource, operation),
        filterByResourceAndOperation(resource, operation),
        groupByResourceAndOperation(),
        normalizationResourceAndOperationGroup()
    ]).toArray();
  }
}
