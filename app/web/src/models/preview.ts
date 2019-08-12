import { EffectWithType, Reducer } from './connect.d';
import { UploadFile } from 'antd/lib/upload/interface'
import { Action } from 'redux';

export interface PreviewModelState {
  editLayoutFile: UploadFile | null;
}

interface UpdateEditLayoutFileAction extends Action {
  payload: {
    file: UploadFile | null;
  };
}

export interface ModelType {
  namespace: string;
  state?: PreviewModelState,
  reducers: {
    updateEditLayoutFile: Reducer<PreviewModelState, UpdateEditLayoutFileAction>;
  };
}

const Model: ModelType = {
  namespace: 'preview',

  state: {
    editLayoutFile: null,
  },

  reducers: {
    updateEditLayoutFile(state: PreviewModelState, { payload }) {
      return {
        ...state,
        editLayoutFile: payload.file,
      };
    },
  },
};

export default Model;
