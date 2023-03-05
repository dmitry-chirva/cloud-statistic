import {
  IsDateString,
  IsArray
} from "class-validator";

import { Operation } from "../entity/operation.entity";
import { Resource } from "../entity/resource.entity";

export class SyncAwsCostReportDto {
  @IsDateString()
  date: string;

  @IsArray()
  operations: Operation[]

  @IsArray()
  resources: Resource[]
}
