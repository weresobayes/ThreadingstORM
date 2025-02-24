import { TableMetadata } from '../decorators/MapTable';
import { EntityFactory, SchemaConfig } from '../decorators/Schema';

interface SchemaMetadata {
    target: any;
    entityType: EntityFactory;
    context: string;
    compositeFrom: string[];
    tables: Map<string, TableMetadata>;
    computedFields: Map<string, any>;
}


export class SchemaMetadataStore {
    private static instance: SchemaMetadataStore;
    private schemas: Map<string, SchemaMetadata> = new Map();
    
    private constructor() {
    }

    public static getInstance(): SchemaMetadataStore {
        if (!SchemaMetadataStore.instance) {
            SchemaMetadataStore.instance = new SchemaMetadataStore();
        }

        return this.instance;
    }

    register(target: any, config: SchemaConfig): void {
        const metadata: SchemaMetadata = {
            target,
            entityType: config.entity,
            context: config.context,
            compositeFrom: config.compositeFrom || [],
            tables: new Map(),
            computedFields: new Map()
        };

        const key = this.generateKey(config.context, config.entity);
        this.schemas.set(key, metadata);
    }

    getMetadata(context: string, entityType: EntityFactory): SchemaMetadata | undefined {
        const key = this.generateKey(context, entityType);

        return this.schemas.get(key);
    }

    registerTable(target: any, metadata: TableMetadata): void {
        const schema = this.schemas.get(this.generateKey(
            metadata.schema.getContext(),
            metadata.schema.getEntityType(),
        ));
        
        if (!schema) {
            throw new Error(
                `Cannot register table ${metadata.name}. ` +
                'Table must be referenced in a schema class.'
            );
        }

        if (!schema.compositeFrom.includes(metadata.name)) {
            throw new Error(
                `Table ${metadata.name} is not listed in schema's compositeFrom.`
            );
        }

        schema.tables.set(metadata.name, metadata);
    }

    private generateKey(context: string, entityType: EntityFactory): string {
        return `${context}:${entityType.name}`;
    }

}