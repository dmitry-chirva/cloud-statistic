import { Cost } from "../interfaces/cost.interface";

export function calculateEntityCost<T>(entity: T[], entityCostName: string): number {
 return entity.reduce((acc, entityItem) => acc + (<Cost>entityItem[entityCostName]).amount, 0)
}
