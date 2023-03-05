import { Test, TestingModule } from '@nestjs/testing';
import { AwsCostReportController } from './aws-cost-report.controller';

describe('AwsCostReportController', () => {
  let controller: AwsCostReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwsCostReportController],
    }).compile();

    controller = module.get<AwsCostReportController>(AwsCostReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
