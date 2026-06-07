import type {
  PageShellModuleConfig,
  PageShellModuleDefinition,
} from "./page-shell-types";

class PageShellRegistry {
  private definitions = new Map<string, PageShellModuleDefinition<any, any>>();

  register(definition: PageShellModuleDefinition<any, any>) {
    this.definitions.set(definition.type, definition);
  }

  registerMany(definitions: PageShellModuleDefinition<any, any>[]) {
    definitions.forEach((definition) => this.register(definition));
  }

  get(type: string) {
    return this.definitions.get(type);
  }

  has(type: string) {
    return this.definitions.has(type);
  }

  getAll() {
    return Array.from(this.definitions.values());
  }

  resolve(module: PageShellModuleConfig) {
    return this.get(module.type);
  }
}

export const pageShellRegistry = new PageShellRegistry();
