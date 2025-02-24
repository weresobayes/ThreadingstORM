import { UserSchema } from './UserSchema';

// Let's try to use it
console.log('Entity type:', UserSchema.getEntityType());
console.log('Context:', UserSchema.getContext());
console.log('Metadata:', UserSchema.getMetadata());