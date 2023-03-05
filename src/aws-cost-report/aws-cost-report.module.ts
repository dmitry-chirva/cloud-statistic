import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { AwsCostReport } from "./entity";
import { AwsCostReportController } from './aws-cost-report.controller';
import { AwsCostReportService } from './aws-cost-report.service';
import { AwsCostReportMapper } from "./mapper/aws-cost-report.mapper";


@Module({
  imports: [
    TypeOrmModule.forFeature([AwsCostReport])
  ],
  controllers: [AwsCostReportController],
  providers: [AwsCostReportService, AwsCostReportMapper],
})
export class AwsCostReportModule {}
