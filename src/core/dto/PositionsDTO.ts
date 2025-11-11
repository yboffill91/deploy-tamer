export interface PositionsDTO {
  name: string;
  description: string;
  roles?: number[];
}

export interface responsePositionsDTO extends PositionsDTO {
  id: string;
}
