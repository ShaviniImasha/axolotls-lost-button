/**
 * Object Model
 * Backend MVC - Model Layer
 */

export interface ObjectItem {
  id: string;
  name: string;
  type: string;
  required: boolean;
  x: number;
  y: number;
  isFound: boolean;
}

export class ObjectModel {
  private items: Map<string, ObjectItem> = new Map();

  constructor(initialItems: ObjectItem[] = []) {
    for (const item of initialItems) {
      this.items.set(item.id, { ...item });
    }
  }

  public getItems(): ObjectItem[] {
    return Array.from(this.items.values());
  }

  public markFound(id: string): boolean {
    const item = this.items.get(id);
    if (item && !item.isFound) {
      item.isFound = true;
      return true;
    }
    return false;
  }

  public areAllRequiredFound(): boolean {
    return Array.from(this.items.values())
      .filter((i) => i.required)
      .every((i) => i.isFound);
  }
}
