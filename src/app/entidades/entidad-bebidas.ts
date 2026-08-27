export interface Bebidas {
    idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory?: string;
  strAlcoholic?: string;
  strInstructions?: string;
  strVideo?: string;
  precio: number;
 
  // los ingredientes vienen como strIngredient1, strIngredient2... strMeasure1, strMeasure2...
  [campo: string]: any;
}
