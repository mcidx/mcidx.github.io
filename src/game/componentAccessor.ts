import type {
  ComponentName,
  Components,
  ComponentsMap,
} from "../types/component";

export class ComponentAccessor {
  components: Partial<ComponentsMap>;

  constructor(
    components: Components,
    private context: string,
  ) {
    this.components = components.components;
  }

  has(name: ComponentName) {
    return name in this.components;
  }

  tryGet<Name extends ComponentName>(name: Name) {
    return this.components[name];
  }

  get<Name extends ComponentName>(name: Name) {
    const component = this.tryGet(name);

    if (component !== undefined) {
      return component;
    }

    throw new Error(`Component ${name} not found in ${this.context}`);
  }

  keys() {
    return Object.keys(this.components);
  }
}
