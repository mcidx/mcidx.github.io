import type {
  ComponentName,
  Components,
  ComponentsMap,
} from "../types/components";

export class ComponentAccessor {
  private components: Partial<ComponentsMap>;

  constructor(
    components: Components,
    private context: string,
  ) {
    this.components = components.components;
  }

  has(name: ComponentName) {
    return name in this.components;
  }

  get<Name extends ComponentName>(name: Name): ComponentsMap[Name] {
    const component = this.components[name];

    if (component !== undefined) {
      return component;
    }

    throw new Error(`Component ${name} not found in ${this.context}`);
  }

  keys() {
    return Object.keys(this.components);
  }
}
