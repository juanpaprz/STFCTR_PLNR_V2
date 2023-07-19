import { Injectable } from '@angular/core';
import { Item } from '../Entities/item.entity';
import * as itemJson from '../Data/item.json';
import * as resourceJson from '../Data/resource.json';
import { StackSize } from '../Common/stack-size.enum';
import { ItemJson } from '../Entities/item-json.entity';
import { RecipeService } from '../Services/recipe.service';

@Injectable()
export class ItemService {
  constructor() {
    let items: Item[] = [];
    let itemsData = Object.values(itemJson) as ItemJson[];

    itemsData.forEach((i) => {
      if (!i.name) return;
      let stackSizeTxt: keyof typeof StackSize = i.stackSize;
      let stackSize = StackSize[stackSizeTxt];

      let item: Item = {
        id: i.id,
        name: i.name,
        stackSize: stackSize,
        isResource: false,
      };

      items.push(item);
    });

    let resourceData = Object.values(resourceJson) as ItemJson[];

    resourceData.forEach((r) => {
      if (!r.name) return;
      let stackSizeTxt: keyof typeof StackSize = r.stackSize;
      let stackSize = StackSize[stackSizeTxt];

      let resource: Item = {
        id: r.id,
        name: r.name,
        stackSize: stackSize,
        isResource: true,
      };

      items.push(resource);
    });

    this.items = items;
  }

  items: Item[] = [];

  getAllItems(): Item[] {
    return this.items;
  }

  getItem(id: string): Item {
    let item = this.items.find((i) => i.id === id);

    if(!item) throw new Error('Item Not Found')

    return item
  }
}
