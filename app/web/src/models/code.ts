import { EditorState, convertFromRaw, ContentState, SelectionState } from 'draft-js';
import { transform } from '@babel/standalone';
import transformSchema from '@/bin/transform';
import { FormItem } from '@/bin/transform.d';
import { Effect, EffectWithType, Reducer, ConnectState } from './connect.d';
import { FormLayout } from './preview';
import { FormItemType } from '@/constant';

const demoRawContent = `{"blocks":[{"key":"1ma6i","text":"const schema = {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2f1sa","text":"  name: 'HorizontalLoginForm',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5j6bu","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8l8vt","text":"  form: {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4llb3","text":"    props: {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4jhih","text":"      layout: 'inline',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"cl47h","text":"    },","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"c9n8k","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"edq3l","text":"    items: [","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"cojg3","text":"      // username","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2vgss","text":"      {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2l72n","text":"        name: 'username',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"21ria","text":"        rules: ['required'],","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"anpah","text":"  ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"423kn","text":"        type: 'Input',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"52fsd","text":"      },","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"aelff","text":"  ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"40p9e","text":"      // password","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"31k57","text":"      {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"ktc0","text":"        name: 'password',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"botp5","text":"        rules: ['required'],","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9sloo","text":"  ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"d9npm","text":"        type: 'Input',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9h247","text":"        props: {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"6rpb4","text":"          type: 'password',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"c6l2o","text":"        },","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7ic43","text":"      },","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"fv824","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"cbt3i","text":"      // login button","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9f4k","text":"      {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"bgd6a","text":"        type: 'Button',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2c6uj","text":"        onSubmit: true,","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"435o5","text":"        props: {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"425ki","text":"          type: 'primary',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9f2o9","text":"          children: 'Log in',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8jljq","text":"        } ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"6v5i0","text":"      },","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"efa9e","text":"    ],","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"422l5","text":"  },","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8rjeg","text":"}","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`;
const EMPTY_CONFIG_TEXT = `const schema = {
  name: 'DefaultForm',
  form: {
    items: [
      // form items
    ],
  },
}`;

const EMPTY_TEMPLATE_CONFIG_TEXT = `const schema = {
  name: 'DefaultForm',
  form: {
    items: @layouts,
  },
}`;

export enum ReactAPI {
  Component = 'Component',
  Hooks = 'Hooks',
}

const delay = (ms: number, val: [any]) => new Promise(res => setTimeout(() => res(val), ms));

const mapLayoutToFormItem = (layout: FormLayout): FormItem => {
  const ret: FormItem = {
    type: FormItemType[layout.type],
    name: `item_${layout.key}`,
    label: ``,
  };

  switch(layout.type) {
    case FormItemType.Button: 
      ret.props = {
        type: 'primary',
        style: {
          width: '100%',
        },
        children: 'Button',
      }
      break;
    case FormItemType.Checkbox:
      ret.props = {
        children: 'Checkbox',
      }
  }

  return ret;
}

const mapLayoutsToFormItems = (layouts: FormLayout[]): FormItem[] => {
  let formItems = [];

  while(layouts[0]) {
    const layout = layouts[0];

    // multiple form item in same row.
    if (layouts.some(v => v.row === layout.row && v !== layout)) {
      let rowItems = layouts.filter(v => v.row === layout.row);

      formItems.push({
        type: 'Row',
        layout: rowItems.map(v => v.span),
        offset: rowItems.map(v => v.offset),
        items: rowItems.map(mapLayoutToFormItem),
      } as FormItem);

      layouts = layouts.filter(v => v.row !== layout.row);
    } else {
      formItems.push(mapLayoutToFormItem(layout));
      layouts = layouts.slice(1);
    }
  }

  return formItems;
}

export type HighlightLinesType = {
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  }
} | null

export interface CodeModelState {
  editorState: EditorState, // config editor
  generatedCode: EditorState, // user will copy this
  previewCode: string, // use to render preview components
  highlightLines: HighlightLinesType,
}

export interface ModelType {
  namespace: string;
  state: CodeModelState,
  effects: {
    changeEditorState: EffectWithType;
    changeReactApi: EffectWithType;
    prettifyConfigEditor: Effect;
    resetConfigEditor: Effect;
    loadConfigCode: Effect;
    layoutToConfig: Effect;
  };
  reducers: {
    changeEditorState: Reducer<CodeModelState>;
    changeCodeEditorState: Reducer<CodeModelState>;
    updatePreviewCode: Reducer<CodeModelState>;
    updateGeneratedCode: Reducer<CodeModelState>;
    updateHighlightLines: Reducer<CodeModelState>;
  };
}

const Model: ModelType = {
  namespace: 'code',

  state: {
    editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(demoRawContent))),
    generatedCode: EditorState.createEmpty(),
    previewCode: '',
    highlightLines: null,
  },

  effects: {
    *resetConfigEditor(_, { put, select }) {
      let editorState: EditorState = yield select(
        state => state.code.editorState,
      );
      editorState = EditorState.push(editorState, ContentState.createFromText(EMPTY_CONFIG_TEXT), 'delete-character');

      yield put({
        type: 'changeEditorState',
        payload: editorState,
      });
    },

    *loadConfigCode({ payload }, { put, select }) {
      if (payload) {
        const prevEditorState: EditorState = yield select(
          state => state.code.editorState,
        );
        const editorState = EditorState.createWithContent(ContentState.createFromText(payload), prevEditorState ? prevEditorState.getDecorator() : undefined);

        yield put({
          type: 'changeEditorState',
          payload: editorState,
        });
      }
    },

    *prettifyConfigEditor(_, { select, put }) {
      const prettier = yield import('prettier/standalone');
      const plugins = [yield import("prettier/parser-typescript")];

      let editorState: EditorState = yield select(
        state => state.code.editorState,
      );

      // remember prev selection position, recover it after formatting.
      const prevSelection = editorState.getSelection();
      const prevContentState = editorState.getCurrentContent();

      const prevLine = prevContentState.getBlocksAsArray().findIndex(v => v.getKey() === prevSelection.getStartKey());
      const prevOffeset = prevSelection.getStartOffset();

      try {
        const formattedConfig = prettier.format(editorState.getCurrentContent().getPlainText(), { parser: 'typescript', plugins: plugins, singleQuote: true, trailingComma: 'all' });
        editorState = EditorState.push(
          editorState,
          ContentState.createFromText(formattedConfig),
          'spellcheck-change'
        );

        const afterBlockArray = editorState.getCurrentContent().getBlocksAsArray();
        const targetBlock = afterBlockArray[prevLine] || afterBlockArray[0];

        if (targetBlock) {
          editorState = EditorState.forceSelection(editorState, new SelectionState({
            anchorKey: targetBlock.getKey(),
            anchorOffset: targetBlock.getCharacterList().size >= prevOffeset ? prevOffeset : 0,
            focusKey: targetBlock.getKey(),
            focusOffset: targetBlock.getCharacterList().size >= prevOffeset ? prevOffeset : 0,
            isBackward: false,
          }));
        }

        yield put({
          type: 'changeEditorState',
          payload: editorState,
        });
      } catch (err) {
        console.error(err);
      }
    },

    changeReactApi: [function* ({ take, put, select }) {
      while(true) {
        yield take('save/updateReactAPI');

        const editorState = yield select(state => state.code.editorState);
        yield put({
          type: 'changeEditorState',
          payload: editorState,
          immediately: true,
        });
      }
    }, {
      type: 'watcher',
    }],

    changeEditorState: [function* ({ race, take, put, select }) {
      while(true) {
        let action = yield take('changeEditorState');

        while(true) {
          const { debounced, latestAction } = yield race({
            debounced: delay(action.immediately ? 0 : 1500, [true]),
            latestAction: take('changeEditorState'),
          });

          if (debounced) {
            const configText = action.payload.getCurrentContent().getPlainText();
            const reactApi = yield select((state) => state.save.ReactAPI);
            const useTypescript = yield select((state) => state.save.useTypescript);

            try {
              const configCode = transform(configText, {
                presets: ['react'],
              }).code + '; schema';

              // generated code
              const generatedCode = transformSchema(eval(configCode), { reactApi, useTypescript });
              yield put({
                type: 'updateGeneratedCode',
                payload: generatedCode,
              });

              // preview code
              const code = transform(transformSchema(eval(configCode), { env: 'browser', source: configText }), {
                presets: [
                  'es2015',
                  'react',
                ],
                plugins: [
                  ["proposal-class-properties", { "loose": false }],
                ],
              }).code;

              yield put({
                type: 'updatePreviewCode',
                payload: code,
              });
            } catch(err) {
              console.error(err);
            }

            break;
          }

          action = latestAction;
        }
      }
    }, {
      type: 'watcher',
    }],

    *layoutToConfig(_, { select, put }) {
      const layouts: FormLayout[] = yield select(state => state.preview.formLayout);
      let editorState = yield select(state => state.code.editorState);

      let currentConfig = EMPTY_TEMPLATE_CONFIG_TEXT;
      const newItems = mapLayoutsToFormItems(layouts);
      currentConfig = currentConfig.replace('@layouts', JSON.stringify(newItems));

      // update config editor.
      const prettier = yield import('prettier/standalone');
      const plugins = [yield import("prettier/parser-typescript")];
      const formattedConfig = prettier.format(currentConfig, { parser: 'typescript', plugins: plugins, singleQuote: true, trailingComma: 'all' });
      editorState = EditorState.push(editorState, ContentState.createFromText(formattedConfig), 'delete-character');

      yield put({
        type: 'changeEditorState',
        payload: editorState,
      });

      yield put({
        type: 'preview/cancelEditLayout',
      });
    },
  },

  reducers: {
    changeEditorState(state: CodeModelState, { payload }): CodeModelState {
      return {
        ...state,
        editorState: payload,
      };
    },
    changeCodeEditorState(state: CodeModelState, { payload }): CodeModelState {
      return {
        ...state,
        generatedCode: payload,
      };
    },
    updatePreviewCode(state: CodeModelState, { payload }): CodeModelState {
      return {
        ...state,
        previewCode: payload,
      }
    },
    updateGeneratedCode(state: CodeModelState, { payload }): CodeModelState {
      return {
        ...state,
        generatedCode: payload ? EditorState.createWithContent(ContentState.createFromText(payload)) : EditorState.createEmpty(),
      }
    },
    updateHighlightLines(state: CodeModelState, { payload }): CodeModelState {
      return {
        ...state,
        highlightLines: payload,
      }
    }
  },
};

export default Model;
