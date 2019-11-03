export interface Field2 {
  name: string;
}

export interface OfType3 {
  name: string;
  fields: Field2[];
}

export interface OfType2 {
  ofType: OfType3;
}

export interface OfType {
  kind: string;
  fields?: any;
  ofType: OfType2;
}

export interface Field3 {
  name: string;
}

export interface Type2 {
  ofType: OfType;
  kind: string;
  fields: Field3[];
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
