import { EditorState } from 'draft-js';
import { Reducer } from 'redux';

export interface CodeModelState {
  edtiorState: EditorState,
}

export interface ModelType {
  namespace: string;
  state: CodeModelState,
  reducers: {
    changeEditorState: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'code',

  state: {
    edtiorState: EditorState.createEmpty(),
  },

  reducers: {
    changeEditorState(state, { payload }) {
      return {
        ...state,
        edtiorState: payload,
      };
    },
  },
};

export default Model;
