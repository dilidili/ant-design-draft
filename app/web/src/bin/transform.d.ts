export type Element = {
  type: string;
  props?: {
    children?: Array<Element>;
    [propertyName: string]: any;
  };
  children?: Array<Element>;
}

export type FormSchema = {
  items: Array<FormItem | Array<FormItem>>;
  props?: FormSchemaProps;
}

export type FormSchemaProps = {

}

export type TransformSchema =  {
  name: string; // e.g. 'LoginForm'
  form: FormSchema;
  formInModal: {};
}

export type FormItem = {
  type: 'Row' | 'Divider';
  label?: string; // Form field label
  layout: any;
  items: [any];
  props: any;
}

export type TransformConfig = {
}

export type Entries = {
  componentType: string,
  antdImports: Set<string>,
}

