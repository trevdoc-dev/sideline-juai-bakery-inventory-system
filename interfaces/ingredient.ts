export interface IngredientInterface {
  id: number | string;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  expiry_date: number;
  created_at: string;
}
