import { ColProps } from 'antd/lib/grid/col'
import { Breakpoint } from 'antd/lib/_util/responsiveObserve';

export type Element = {
  type: string;
  props?: {
    children?: Element[] | string;
    [propertyName: string]: any;
  };
  children?: Element[] | string;
  render?: (indent: string) => ({
    start?: string;
    end?: string;
  });
};

export type FormSchema = {
  items: Array<FormItem | Array<FormItem>>;
  props?: FormSchemaProps;
}

export type FormInModalSchema = {
  form: FormSchema;
  buttonLabel: string;
  title?: React.ReactNode | string;
  okText?: React.ReactNode;
}

export type FormSchemaProps = {
  onSubmit?: {
    type: 'reference';
    payload: string;
  };
}

export type TransformSchema =  {
  name: string; // e.g. 'LoginForm'
  form: FormSchema;
  formInModal: FormInModalSchema;
}

export type FormItemRule = 'required' | 'email';

export type FormItem = {
  type: string;
  name?: string; // values.name
  options?: Array<{
    value: any;
    text: string;
  }>
  onSubmit?: boolean;
  label?: React.ReactNode; // Form field label
  hasFeedback?: boolean;
  gutter?: number;
  span?: number;
  wrapperCol?: ColProps;
  labelCol?: ColProps;
  rules? : Array<FormItemRule>;
  validators? : Array<string>;
  extra?: React.ReactNode;
  layout?: number[];
  offset?: number[];
  valuePropName?: string | Array<any>;
  initialValue?: string | Array<any>;
  items?: any[];
  props?: any | {
    [key: string]: any;
  };
}

export type TransformConfig = {
  reactApi?: 'Hooks' | 'Component';
  env?: 'browser';
  useTypescript?: boolean;
  source?: string; // need when env is 'browser'.
}

export type Entries = {
  componentType: string;
  template: string;
  antdImports: Set<string>;
  otherImports: string[];
  handlers: Array<string>;
  renderForm: {
    return: Array<Element>;
    declares: Array<string>;
    declareMap: {
      [propertyName: string]: string;
    };
  };
  render: {
    buttonLabel?: string;
    declares: Array<string>;
    return: Array<Element>;
    declareMap: {
      [propertyName: string]: string;
    };
  };
  formTsWrapper: () => (text: string, render: (content: string) => string) => string;
  formTsProps: string;
}
