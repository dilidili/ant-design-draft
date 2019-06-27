import { Effect, EffectWithType } from './connect.d';
import { Reducer, Action } from 'redux';

export interface SaveModelState {
  configCode: string,
}

interface UpdateConfigCodeAction extends Action {
  payload: string;
}

export interface ModelType {
  namespace: string;
  state: SaveModelState,
  effects: {
    watchConfigEditorChange: EffectWithType;
  };
  reducers: {
    updateConfigCode: Reducer<SaveModelState, UpdateConfigCodeAction>;
  };
}

const Model: ModelType = {
  namespace: 'save',

  state: {
    configCode: '',
  },

  effects: {
    watchConfigEditorChange: [function* ({ take, put }) {
      while(true) {
        let action = yield take('code/changeEditorState');

        const configText = action.payload.getCurrentContent().getPlainText();

        yield put({
          type: 'updateConfigCode',
          payload: configText,
        });
      }
    }, {
      type: 'watcher',
    }],
  },

  reducers: {
    updateConfigCode(state, { payload }) {
      return {
        ...state,
        configCode: payload,
      };
    },
  },
};

export default Model;
