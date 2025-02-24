import { SchemaMetadataStore } from '../metadata/SchemaMetadataStore';

export type EntityFactory = new (...args: any[]) => any;

export class ThreadingstORMSchematic {
    static getEntityType(): EntityFactory {
        throw new Error('Method not implemented. If you encounter this, please open an issue on GitHub.');
    }

    static getContext(): string {
        throw new Error('Method not implemented. If you encounter this, please open an issue on GitHub.');
    };

    static getMetadata(): any {
        throw new Error('Method not implemented. If you encounter this, please open an issue on GitHub.');
    };
}

export interface SchemaConfig {
    entity: EntityFactory;
    context: string;
    compositeFrom: string[];
}

export function Schema(config: SchemaConfig) {
    return function<T extends typeof ThreadingstORMSchematic>(target: T): T {
        // Register schema metadata
        const store = SchemaMetadataStore.getInstance();
        store.register(target, config);

        target.getEntityType = () => config.entity;
        target.getContext = () => config.context;
        target.getMetadata = () => 
            store.getMetadata(config.context, config.entity);

        return target;
    };
}
