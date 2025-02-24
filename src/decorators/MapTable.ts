import { SchemaMetadataStore } from "../metadata/SchemaMetadataStore";
import { ThreadingstORMSchematic } from "./Schema";

interface TableConfig {
    schema: typeof ThreadingstORMSchematic;
    isRoot?: boolean;
    joinOn?: {
        localField: string;
        foreignField: string;
        from: string;
    };
}

export interface TableMetadata {
    schema: typeof ThreadingstORMSchematic;
    name: string;
    target: any;
    isRoot: boolean;
    joinConfig?: {
        localField: string;
        foreignField: string;
        from: string;
    };
}

export function MapTable(tableName: string, config: TableConfig) {
    return function(target: any) {
        const isRoot = target.name == 'Root' || config?.isRoot;

        const store = SchemaMetadataStore.getInstance();

        const tableMetadata: TableMetadata = {
            schema: config.schema,
            name: tableName,
            target,
            isRoot: isRoot ?? false,
            joinConfig: config?.joinOn
        };

        store.registerTable(target, tableMetadata);

        if (isRoot && config?.joinOn) {
            throw new Error('Root table cannot have join configuration');
        }

        if (!isRoot && !config?.joinOn) {
            throw new Error('Non-root table must have join configuration');
        }
    };
}