import { EffectWithType, Reducer } from './connect.d';
import { Action } from 'redux';
import { ReactAPI } from '@/models/code';

export interface SaveModelState {
  configCode: string;
  ReactAPI: ReactAPI;
  useTypescript: boolean;
}

interface UpdateConfigCodeAction extends Action {
  payload: string;
}

interface UpdateReactAPIAction extends Action {
  payload: ReactAPI;
}

interface UpdateUseTypescriptAction extends Action {
  payload: boolean;
}

export interface ModelType {
  namespace: string;
  state?: SaveModelState,
  effects: {
    watchConfigEditorChange: EffectWithType;
  };
  reducers: {
    updateConfigCode: Reducer<SaveModelState, UpdateConfigCodeAction>;
    updateReactAPI: Reducer<SaveModelState, UpdateReactAPIAction>;
    updateUseTypescript: Reducer<SaveModelState, UpdateUseTypescriptAction>;
  };
}

const Model: ModelType = {
  namespace: 'save',

  state: {
    configCode: '',
    ReactAPI: ReactAPI.Component,
    useTypescript: true,
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
    updateConfigCode(state: SaveModelState, { payload }) {
      return {
        ...state,
        configCode: payload,
      };
    },

    updateReactAPI(state: SaveModelState, { payload }: UpdateReactAPIAction) {
      return {
        ...state,
        ReactAPI: payload,
      };
    },

    updateUseTypescript(state: SaveModelState, { payload }: UpdateUseTypescriptAction) {
      return {
        ...state,
        useTypescript: payload,
      };
    },
  },
};

export default Model;
