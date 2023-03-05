import { Entity, Column, ObjectIdColumn, ObjectID } from "typeorm";

import { Cost } from "../../shared/interfaces/cost.interface";

@Entity()
export class Resource {
  @ObjectIdColumn()
  id: ObjectID

  @Column()
  name: string

  @Column()
  cost: Cost
}
