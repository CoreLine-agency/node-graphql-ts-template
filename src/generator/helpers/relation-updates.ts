import { IRequestContext } from '../../shared/IRequestContext';

interface IUpdatable<TModel> {
  update(input, context: IRequestContext): Promise<TModel>;
}

export async function updateToOneRelation<TModel, TRelation extends IUpdatable<TRelation>>(
  model: TModel,
  RelationType: { new(): TRelation },
  relationName: keyof TModel,
  inputValue,
  context: IRequestContext,
  { isOptional },
) {
  if (inputValue === undefined) {
    return;
  }

  if (inputValue === null) {
    if (!isOptional) {
      throw new Error(`${RelationType.name}.${relationName} cannot be null`);
    }
    model[relationName] = null as any;

    return;
  }

  if (inputValue.id) {
    const foreignModel = await context.em.findOneOrFail(RelationType, inputValue.id);
    model[relationName] = await foreignModel.update(inputValue, context) as any;

    return;
  }

  model[relationName] = await new RelationType().update(inputValue, context) as any;
}
