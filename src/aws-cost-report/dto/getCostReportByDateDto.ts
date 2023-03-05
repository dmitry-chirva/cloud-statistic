import {
  IsDateString,
} from "class-validator";

export class GetCostReportByDateDto {
  @IsDateString()
  date: string;
}
