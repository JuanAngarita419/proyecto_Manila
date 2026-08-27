export interface Comida {
    // representa un plato de comida que viene de la API (TheMealDB) + el precio que le ponemos nosotros
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
  precio: number;

  // los ingredientes vienen como strIngredient1, strIngredient2... strMeasure1, strMeasure2...
  // por eso dejamos esta línea, así se pueden leer sin que TypeScript se queje
  [campo: string]: any;

    
}
