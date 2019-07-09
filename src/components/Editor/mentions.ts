export type Mention = {
  shortname: string;
  title: string;
  name: string;
  insertAsText: boolean,
}

const mentions: Array<Mention> = [{
    shortname: 'Divider',
    title: '----- text -----',
    name: `{
        type: 'Divider',
        props: {
          children: 'Text',
        }
      },`,
    insertAsText: true,
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
        items: [{
          type: 'Input',
          name: 'inputA',
          label: 'Input A',
        }, {
          type: 'Input',
          name: 'inputB',
          label: 'Input B',
        }],
      },`,
    insertAsText: true,
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
    insertAsText: true,
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
    insertAsText: true,
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
    insertAsText: true,
  },
].sort((a, b) => a.shortname.localeCompare(b.shortname));

export default mentions;
