import 'reflect-metadata';

type PropertyKeyOf<T> = keyof T;

interface FieldConfig<TEntity> {
  mapTo: PropertyKeyOf<TEntity>;
  null?: boolean;
  primary?: boolean;
  unique?: boolean;
  name?: string;
}

export function MapField<T>(config: FieldConfig<T>) {
  return function (target: any, key: string) {
    const propType = Reflect.getMetadata('design:type', target, key);

    console.log('map field', propType);
    console.log('map field key', key);

    const metadataKey = `threadingstorm:${key}`;
    Reflect.defineMetadata(metadataKey, {...config, propertyType: propType}, target, key);
  };
}