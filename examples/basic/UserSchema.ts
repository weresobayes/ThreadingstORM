import { MapField } from '../../src/decorators/MapField';
import { MapTable } from '../../src/decorators/MapTable';
import { Schema, ThreadingstORMSchematic } from '../../src/decorators/Schema';
import { User } from './User';

namespace UserPersistent {
    @Schema({
        entity: User,
        context: 'users',
        compositeFrom: ['users', 'user_profiles']
    })
    export class UserSchema extends ThreadingstORMSchematic {}

    @MapTable('users', { schema: UserSchema })
    export class Root {
        @MapField<User>({
            mapTo: 'email',
        })
        email: string;
    }

    @MapTable('user_profiles', {
        schema: UserSchema,
        isRoot: false,
        joinOn: { localField: 'user_id', foreignField: 'id', from: 'users' }
    })
    export class Profile {}
}

export const UserSchema = UserPersistent.UserSchema;

