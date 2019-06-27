import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import { transform } from '@babel/standalone';
import transformSchema from '@/bin/transform';
import { Effect, EffectWithType, Reducer } from './connect.d';

const demoRawContent = `{"blocks":[{"key":"1ma6i","text":"const schema = {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2f1sa","text":"  name: 'HorizontalLoginForm',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5j6bu","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8l8vt","text":"  form: {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4llb3","text":"    props: {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4jhih","text":"      layout: 'inline',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"cl47h","text":"    },","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"c9n8k","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"edq3l","text":"    items: [","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"cojg3","text":"      // username","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2vgss","text":"      {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2l72n","text":"        name: 'username',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"21ria","text":"        rules: ['required'],","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"anpah","text":"  ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"423kn","text":"        type: 'Input',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"52fsd","text":"      },","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"aelff","text":"  ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"40p9e","text":"      // password","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"31k57","text":"      {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"ktc0","text":"        name: 'password',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"botp5","text":"        rules: ['required'],","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9sloo","text":"  ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"d9npm","text":"        type: 'Input',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9h247","text":"        props: {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"6rpb4","text":"          type: 'password',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"c6l2o","text":"        },","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7ic43","text":"      },","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"fv824","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"cbt3i","text":"      // login button","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9f4k","text":"      {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"bgd6a","text":"        type: 'Button',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2c6uj","text":"        onSubmit: true,","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"435o5","text":"        props: {","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"425ki","text":"          type: 'primary',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9f2o9","text":"          children: 'Log in',","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8jljq","text":"        } ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"6v5i0","text":"      },","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"efa9e","text":"    ],","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"422l5","text":"  },","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8rjeg","text":"}","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`;
const EMPTY_CONFIG_TEXT = `const schema = {
  name: 'DefaultForm',
  form: {
    items: [
      // form items
    ],
  },
}`

const delay = (ms: number, val: [any]) => new Promise(res => setTimeout(() => res(val), ms));

export interface CodeModelState {
  edtiorState: EditorState,
  generatedCode: EditorState,
  previewCode: string,
}

export interface ModelType {
  namespace: string;
  state: CodeModelState,
  effects: {
    changeEditorState: EffectWithType;
    resetConfigEditor: Effect;
  };
  reducers: {
    changeEditorState: Reducer<CodeModelState>;
    changeCodeEditorState: Reducer<CodeModelState>;
    updatePreviewCode: Reducer<CodeModelState>;
    updateGeneratedCode: Reducer<CodeModelState>;
  };
}

const Model: ModelType = {
  namespace: 'code',

  state: {
    edtiorState: EditorState.createWithContent(convertFromRaw(JSON.parse(demoRawContent))),
    generatedCode: EditorState.createEmpty(),
    previewCode: '',
  },

  effects: {
    *resetConfigEditor(_, { put }) {
      const editorState = EditorState.createWithContent(ContentState.createFromText(EMPTY_CONFIG_TEXT));

      yield put({
        type: 'changeEditorState',
        payload: editorState,
      });
    },

    changeEditorState: [function* ({ race, take, put }) {
      while(true) {
        let action = yield take('changeEditorState');

        while(true) {
          const { debounced, latestAction } = yield race({
            debounced: delay(1500, [true]),
            latestAction: take('changeEditorState'),
          });

          if (debounced) {
            const configText = action.payload.getCurrentContent().getPlainText();

            try {
              const configCode = transform(configText, {
                presets: ['react'],
              }).code + '; schema';

              // preview code
              const code = transform(transformSchema(eval(configCode), { env: 'browser' }), {
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

              // generated code
              const generatedCode = transformSchema(eval(configCode));
              yield put({
                type: 'updateGeneratedCode',
                payload: generatedCode,
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
  },

  reducers: {
    changeEditorState(state: CodeModelState, { payload }): CodeModelState {
      // console.log(JSON.stringify(convertToRaw(payload.getCurrentContent())));
      return {
        ...state,
        edtiorState: payload,
      };
    },
    changeCodeEditorState(state: CodeModelState, { payload }): CodeModelState {
      // console.log(JSON.stringify(convertToRaw(payload.getCurrentContent())));
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
  },
};

export default Model;
