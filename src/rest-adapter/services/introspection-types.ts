
export interface OfType {
  name: string;
}

export interface Type2 {
  name: string;
  ofType: OfType;
}

export interface Field {
  name: string;
  type: Type2;
}

export interface Type {
  kind: string;
  name: string;
  fields: Field[];
}

export interface IntrospectionRoot {
  __type: Type;
}
