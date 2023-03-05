import { Entity, Column, ObjectIdColumn, ObjectID } from "typeorm";

import { Cost } from "../../shared/interfaces/cost.interface";

@Entity()
export class Operation {
  @ObjectIdColumn()
  id: ObjectID

  @Column()
  name: string

  @Column()
  cost: Cost
}
