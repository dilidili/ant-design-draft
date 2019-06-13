module.exports = {
  form: {
    layout: 'inline',
    onSubmit: true,
  },

  formItemList: [
    // username
    {
      name: 'username',
      rules: ['required'],

      type: 'Input',
    },

    // password
    {
      name: 'password',
      rules: ['required'],

      type: 'Input',
    },
  ],
}