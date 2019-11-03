export interface OfType {
  kind: string;
}

export interface Type2 {
  ofType: OfType;
  kind: string;
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
