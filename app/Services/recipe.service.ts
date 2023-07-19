import { Injectable } from '@angular/core';
import { ItemRecipe, Recipe } from '../Entities/recipe.entity';
import * as recipeJson from '../Data/recipe.json';
import { RecipeJson } from '../Entities/recipe-json.entity';
import { ItemService } from '../Services/item.service';
import { Item } from '../Entities/item.entity';
import { StackSize } from '../Common/stack-size.enum';

@Injectable()
export class RecipeService {
  constructor(private itemService: ItemService) {
    let recipes: Recipe[] = [];
    let recipeData = Object.values(recipeJson) as RecipeJson[];
    let items: Item[] = this.itemService.getAllItems();

    recipeData.forEach((r) => {
      if (!r.name) return;

      let craftPerMinute = 60 / r.timeCrafting;

      let ingridients: ItemRecipe[] = [];
      r.ingridients.forEach((i) => {
        let item = items.find((t) => t.id === i.item);
        if (!item) return;

        let amount =
          item.stackSize === StackSize.SS_FLUID ? i.amount / 1000 : i.amount;

        let ingridient: ItemRecipe = {
          item: item,
          amount: amount,
          amountPerMinute: craftPerMinute * amount,
        };
        ingridients.push(ingridient);
      });

      let products: ItemRecipe[] = [];
      r.products.forEach((p) => {
        let item = items.find((t) => t.id === p.item);
        if (!item) return;

        let amount =
          item.stackSize === StackSize.SS_FLUID ? p.amount / 1000 : p.amount;

        let product: ItemRecipe = {
          item: item,
          amount: amount,
          amountPerMinute: craftPerMinute * amount,
        };
        products.push(product);
      });

      let recipe: Recipe = {
        id: r.name.replace(/\s/g, ''),
        name: r.name,
        isAlternate: r.isAlternate,
        producedIn: r.producedIn,
        timeCrafting: r.timeCrafting,
        craftsPerMinute: craftPerMinute,
        ingridients: ingridients,
        products: products,
      };

      recipes.push(recipe);
    });

    this.recipes = recipes;
  }

  recipes: Recipe[] = [];

  getAllRecipes(): Recipe[] {
    return this.recipes;
  }

  getReicpe(recipeId: string): Recipe {
    let recipe = this.recipes.find((r) => r.id === recipeId);

    if (!recipe) throw new Error('Recipe Not found');

    return recipe;
  }

  getRecipesOfItem(itemId: string): Recipe[] {
    let recipes = this.getAllRecipes();

    let recipesOfItem = recipes.filter((r) =>
      r.products.some((p) => p.item.id === itemId)
    );

    return recipesOfItem;
  }

  getDefualtRecipe(itemId: string): Recipe {
    let recipesOfItem = this.getRecipesOfItem(itemId);
    recipesOfItem = recipesOfItem.filter(
      (r) => !r.ingridients.some((i) => i.item.id === itemId)
    );

    let recipe = recipesOfItem.find((r) => !r.isAlternate);

    if (!recipe) return recipesOfItem[0];

    return recipe;
  }

  isItemCraftable(itemId: string): boolean {
    let recipesOfItem = this.getRecipesOfItem(itemId);

    if (recipesOfItem.length === 0) return false;

    return true;
  }
}
