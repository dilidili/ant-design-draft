import { EditorState } from 'draft-js';

export type Mention = {
  shortname: string;
  title: string;
  name: string;
  insertAsText: boolean,
}

const mentions: Array<Mention> = [
  {
    shortname: 'Form',
    title: 'Create a form',
    name: `{
  items: [],
  props: {},
}`,
  },
  {
    shortname: 'Divider',
    title: '----- text -----',
    name: `{
  type: 'Divider',
  props: {
    children: 'Text',
  }
},`,
  },
  {
    shortname: 'Row',
    title: 'FormItem |gutter| FormItem',
    name: `{
  type: 'Row',
  props: {
    gutter: 24,
  },
  layout: [12, 12],
  items: [
    {
      type: 'Input',
      name: 'inputA',
      label: 'Input A',
    }, {
      type: 'Input',
      name: 'inputB',
      label: 'Input B',
    }
  ],
},`,
  },
  {
    shortname: 'Input',
    title: 'Form item label: |--- placeholder ---|',
    name: `{
  name: 'email',
  label: 'E-mail',
  type: 'Input',
  rules: ['required', 'email'],
},`,
  },
  {
    shortname: 'Select',
    title: 'Form item label: |--- option --- v |',
    name: `{
  name: 'attendees',
  label: 'Attendees',
  type: 'Select',
  rules: ['required'],
},`,
  },
  {
    shortname: 'DatePicker',
    title: 'Form item label: |--- YYYY-MM-DD HH:mm:ss --- v|',
    name: `{
  name: 'birthday',
  label: 'Birthday',
  type: 'DatePicker',
  rules: ['required'],
  props: {
    showTime: true,
    format: 'YYYY-MM-DD HH:mm:ss',
  }
},`,
  },
]
.sort((a, b) => a.shortname.localeCompare(b.shortname))
.map(config => {
  return {
    nameMapper: (editorState: EditorState) => (name: string) => {
      const currentSelectionState = editorState.getSelection();
      const mentionBlockText = editorState.getCurrentContent().getBlockForKey(currentSelectionState.getStartKey()).get('text');

      const search = /(\s*)\@.*$/g.exec(mentionBlockText.slice(0, currentSelectionState.getStartOffset()));
      let indent = '';
      if (search) {
        indent = ' '.repeat(search[1].length - 1);
      }

      return name.split('\n').map((line, i) => i > 0 ? indent + line : line).join('\n');
    },
    insertAsText: true,
    ...config,
  }
})

export default mentions;
