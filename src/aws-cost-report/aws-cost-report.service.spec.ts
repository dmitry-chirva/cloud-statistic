import { Test, TestingModule } from '@nestjs/testing';
import { AwsCostReportService } from './aws-cost-report.service';

describe('AwsCostReportService', () => {
  let service: AwsCostReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsCostReportService],
    }).compile();

    service = module.get<AwsCostReportService>(AwsCostReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
