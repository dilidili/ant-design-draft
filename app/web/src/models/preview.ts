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
    row: number,
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
  };
}

const Model: ModelType = {
  namespace: 'preview',

  state: {
    formLayout: JSON.parse(`[{"height":84,"width":620,"y":12,"x":16,"center":[326,54],"span":23,"offset":1,"offsetAbs":1,"key":0,"row":0},{"height":84,"width":620,"y":140,"x":16,"center":[326,182],"span":23,"offset":1,"offsetAbs":1,"key":1,"row":1},{"height":52,"width":254,"y":284,"x":16,"center":[143,310],"span":9,"offset":1,"offsetAbs":1,"key":2,"row":2},{"height":46,"width":232,"y":290,"x":402,"center":[518,313],"span":8,"offset":5,"offsetAbs":15,"key":3,"row":2},{"height":88,"width":620,"y":348,"x":16,"center":[326,392],"span":23,"offset":1,"offsetAbs":1,"key":4,"row":3},{"height":47,"width":224,"y":449,"x":17,"center":[129,472.5],"span":8,"offset":1,"offsetAbs":1,"key":5,"row":4}]`),
    // formLayout: [],
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
    }
  },
};

export default Model;
