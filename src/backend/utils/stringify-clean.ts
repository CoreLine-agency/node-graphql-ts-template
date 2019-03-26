import * as cleanDeep from 'clean-deep';
import { isEmpty } from 'lodash';

export function stringifyClean(obj: object, literals: Array<string> = [], emptyStringForEmptyObject = true): string {
  const cleaned = cleanDeep(obj);
  if (isEmpty(cleaned) && emptyStringForEmptyObject) {
    return '';
  }

  let stringified = JSON.stringify(cleaned);

  literals.forEach((literal) => {
    const value = obj[literal];
    if (value) {
      stringified = stringified.replace(`"${value}"`, value);
    }
  });

  return stringified;
}

export function asLastArgument(x: string) {
  if (x === '') {
    return x;
  }

  return `, ${x}`;
}
