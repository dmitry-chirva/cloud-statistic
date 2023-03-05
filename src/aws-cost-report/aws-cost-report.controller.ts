import { Controller, Post, Body, Get, Query, ValidationPipe } from "@nestjs/common";

import classValidator from "class-validator";

import {
  SyncAwsCostReportDto,
  GetCostReportByDateDto,
  GetCostReportByResourceAndOperationDto
} from "./dto";
import { AwsCostReportService } from "./aws-cost-report.service";

@Controller('aws-cost-report')
export class AwsCostReportController {
  constructor(private readonly awsCostReportService: AwsCostReportService) {}

  @Post('/sync')
  async addProject(
    @Body(
      new ValidationPipe({
        validatorPackage: classValidator
      })
    ) syncAwsCostReportDto: SyncAwsCostReportDto[]
  ) {
    return this.awsCostReportService.sync(syncAwsCostReportDto);
  }

  @Get('/get-cost-report')
  async getCostReport() {
    return this.awsCostReportService.getReport();
  }

  @Get('/get-cost-report-by-date')
  async getCostReportByDate(@Query(
    new ValidationPipe({
      validatorPackage: classValidator
    })
  ) query: GetCostReportByDateDto) {
    return this.awsCostReportService.getReportByDate(query);
  }

  @Get('/get-cost-report-by-resource-and-operation')
  async getCostReportByResourceAndOperation(@Query(
    new ValidationPipe({
      validatorPackage: classValidator
    })
  ) query: GetCostReportByResourceAndOperationDto) {
    return this.awsCostReportService.getReportByResourceAndOperation(query);
  }
}
