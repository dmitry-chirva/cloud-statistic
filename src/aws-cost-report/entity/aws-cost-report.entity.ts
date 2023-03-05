import { Entity, Column, ObjectIdColumn, ObjectID } from "typeorm";

import { Operation } from "./operation.entity";
import { Resource } from "./resource.entity";

@Entity()
export class AwsCostReport {
  @ObjectIdColumn()
  id: ObjectID

  @Column({
    type: "date"
  })
  date: Date

  @Column()
  operations: Operation[]

  @Column()
  resources: Resource[]

  @Column("decimal")
  totalCost: number
}
