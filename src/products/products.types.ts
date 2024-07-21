export interface ICharacteristicFilter {
  characteristic: string;
  value: string;
}

export interface IFilters {
  characteristics: ICharacteristicFilter[];
  rating?: number;
  min?: number;
  max?: number;
}

export interface IMatch {
  category: string;
  characteristic?: { $elemMatch: { 0: string; 1: string } };
  price?: { $gte?: number; $lte?: number };
  rating?: { $gte: number };
}
