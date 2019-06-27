export type Mention = {
  shortname: string;
  title: string;
  name: string;
  insertAsText: boolean,
}

const mentions: [Mention] = [
  {
    shortname: 'Input',
    title: 'Form item label: <Input />',
    name: `{
        name: 'email',
        label: 'E-mail',
        type: 'Input',
        rules: ['required', 'email'],
      },`,
    insertAsText: true,
  },
];

export default mentions;