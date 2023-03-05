import {
  IsString,
} from "class-validator";

export class GetCostReportByResourceAndOperationDto {
  @IsString()
  operation: string;

  @IsString()
  resource: string
}
