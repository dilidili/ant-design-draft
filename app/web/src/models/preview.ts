import { Reducer, Effect } from './connect.d';
import { UploadFile } from 'antd/lib/upload/interface'
import { Action } from 'redux';

export type FormLayout = {
  span: number;
  offset: number;
  offsetAbs: number;
  row: number;
  key: number;
};

export interface PreviewModelState {
  formLayout: FormLayout[];
  editLayoutFile: UploadFile | null;
}

interface UpdateFormLayoutAction extends Action {
  payload: {
    formLayout: FormLayout[];
  };
}

interface UpdateEditLayoutFileAction extends Action {
  payload: {
    file: UploadFile | null;
  };
}

interface SwitchFormItemRowAction extends Action {
  payload: {
    lastRow: number;
    row: number;
  };
}

interface ChangeFormItemOffsetAction extends Action {
  payload: {
    key: number;
    leftAbsOffset?: number;
    rightAbsOffset?: number;
  };
}

const normalize = (length: number): number => Math.round(length / 4) * 4;

export interface ModelType {
  namespace: string;
  state?: PreviewModelState,
  effects: {
    uploadImageChange: Effect,
  },
  reducers: {
    updateFormLayout: Reducer<PreviewModelState, UpdateFormLayoutAction>;
    updateEditLayoutFile: Reducer<PreviewModelState, UpdateEditLayoutFileAction>;
    switchFormItemRow: Reducer<PreviewModelState, SwitchFormItemRowAction>;
    changeFormItemOffset: Reducer<PreviewModelState, ChangeFormItemOffsetAction>;
    cancelLayout: Reducer<PreviewModelState>;
  };
}

const Model: ModelType = {
  namespace: 'preview',

  state: {
    formLayout: [],
    editLayoutFile: null,
  },

  effects: {
    *uploadImageChange({ payload }, { put }) {
      if (payload && payload.file) {
        const file = payload.file as UploadFile;

        if (file.response && file.response.code === 0) {
          const data: any = file.response.data;
          const [_, width] = data.size.map((v: number) => normalize(v));

          // get layout
          data.contours.forEach((v: any) => {
            v.center = [v.x + v.width / 2, v.y + v.height / 2];
          })
          let undeterminedBlock: any[] = data.contours.slice();
          let layout = [];
          while(undeterminedBlock.length > 0) {
            const newOne = undeterminedBlock.pop();
            const sameRowOthers = undeterminedBlock.filter((v) => {
              return Math.abs(v.center[1] - newOne.center[1]) < (v.height / 2 + newOne.height / 2);
            });
            sameRowOthers.push(newOne);
            layout.push(sameRowOthers);
            undeterminedBlock = undeterminedBlock.filter(v => !sameRowOthers.find(w => v === w));
          }

          // sort by top to bottom, left to right
          layout = layout.sort((a, b) => a[0].top  - b[0].top);
          layout.map(v => {
            v = v.sort((a, b) => a.x - b.x);
          });

          // map into 24 sections
          const sectionWidth = width / 24;
          layout.forEach((row, rowIndex) => {
            let lastX = 0;

            row.forEach((col) => {
              col.span = Math.round(col.width / sectionWidth);
              col.offset = Math.round((col.x - lastX) / sectionWidth);
              col.offsetAbs = Math.round(col.x / sectionWidth);
              col.row = rowIndex;
              lastX = col.x + col.width;
            });
          });

          let key = 0;
          const formLayout = layout.reduce((r, v) => {
            v.forEach(w => {
              w.key = key;
              key++;
              r.push(w);
            });
            return r;
          }, [])

          yield put({
            type: 'updateFormLayout',
            payload: {
              formLayout,
            },
          })
        }

        yield put({
          type: 'updateEditLayoutFile',
          payload: {
            file: payload.file,
          }
        })
      }
    },
  },

  reducers: {
    updateFormLayout(state: PreviewModelState, { payload }) {
      return {
        ...state,
        formLayout: payload.formLayout,
      };
    },
    updateEditLayoutFile(state: PreviewModelState, { payload }) {
      return {
        ...state,
        editLayoutFile: payload.file,
      };
    },
    cancelLayout(state: PreviewModelState) {
      return {
        ...state,
        editLayoutFile: null,
        formLayout: [],
      }
    },
    switchFormItemRow(state: PreviewModelState, { payload }: SwitchFormItemRowAction) {
      const { lastRow, row } = payload;
      let newLayout = state.formLayout.map(v => {
        if (v.row === lastRow) {
          v.row = row;
        } else if (v.row === row) {
          v.row = lastRow;
        }

        return v;
      });

      return {
        ...state,
        formLayout: newLayout,
      }
    },
    changeFormItemOffset(state: PreviewModelState, { payload }: ChangeFormItemOffsetAction) {
      const { key, leftAbsOffset, rightAbsOffset } = payload;
      let newLayout = state.formLayout;

      if (typeof leftAbsOffset === 'number') {
        newLayout = newLayout.map(v => {
          if (v.key === key) {
            v.span = v.span + (v.offsetAbs - leftAbsOffset);
            v.offset = v.offset + (leftAbsOffset - v.offsetAbs);
            v.offsetAbs = leftAbsOffset;
          }

          return v;
        });
      }

      if (typeof rightAbsOffset === 'number') {
        newLayout = newLayout.map(v => {
          if (v.key === key) {
            v.span = rightAbsOffset;
          }

          return v;
        });
      }

      return {
        ...state,
        formLayout: newLayout,
      }
    }
  },
};

export default Model;
