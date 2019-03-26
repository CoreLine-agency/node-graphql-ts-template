/*** AUTOGENERATED FILE: you can only modify parts of the file within <keep-*> tags ***/
// tslint:disable max-line-length no-duplicate-imports
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from './Post';
import { User } from './User';

import * as auth from '../../utils/auth/auth-checkers';
import { IAuthorizable } from '../../utils/auth/IAuthorizable';
import { getInputOperationType } from '../../utils/get-input-operation-type';
import { FileAuth } from '../auth/FileAuth';
import { EntityId, EntityIdScalar } from '../EntityId';
import { FileCreateInput } from '../inputs/FileCreateInput';
import { FileEditInput } from '../inputs/FileEditInput';
import { FileNestedInput } from '../inputs/FileNestedInput';
import { IRequestContext } from '../IRequestContext';
import { updatePostRelation, updateUserRelation } from './update-operations/file-update-operations';

// <keep-imports>
import * as crypto from 'crypto';
// </keep-imports>

// <keep-decorators>
// </keep-decorators>
@Entity()
@ObjectType()
export class File implements IAuthorizable {
  @Field((type) => EntityIdScalar)
  @PrimaryGeneratedColumn()
  public id: EntityId;

  public authorizationChecker = new FileAuth(this);

  @Field(() => String)
  @Column({type: 'text',
    // <custom-column-args>
    select: false,
    // </custom-column-args>
  })
  public contentBase64: string;

  @Column({
    // <custom-column-args>
    // </custom-column-args>
  })
  public slug: string;

  @ManyToOne((type) => Post, (post) => post.images , { nullable: true, onDelete: 'SET NULL' })
  @Field((returns) => Post , { nullable: true })
  public post: Promise<Post | undefined | null>;

  @OneToOne((type) => User, (user) => user.profileImage , { nullable: true, onDelete: 'SET NULL' })
  @Field((returns) => User , { nullable: true })
  @JoinColumn()
  public user: Promise<User | undefined | null>;

  public async update(input: FileCreateInput | FileEditInput | FileNestedInput, context: IRequestContext) {
    const { post, user, ...data } = input;
    if (getInputOperationType(this, input) === 'update') {
      await auth.assertCanUpdate(this, context);
    }
    Object.assign(this, data);

    await updatePostRelation(this, post, context);

    await updateUserRelation(this, user, context);

    context.modelsToSave.push(this);

    // <keep-update-code>
    if (this.slug === undefined) {
      this.slug = crypto.randomBytes(16).toString('hex');
    }
    // </keep-update-code>
    await auth.assertCanPersist(this, context);

    return this;
  }

  // <keep-methods>
  public async getOwner() {
    const owner = await this.user;
    if (owner) {
      return owner;
    }

    const post = await this.post;

    return post && post.author;
  }
  // </keep-methods>
}
