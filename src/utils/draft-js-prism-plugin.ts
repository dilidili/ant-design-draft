import PrismDecorator from 'draft-js-prism';
import 'prismjs/themes/prism.css';

type Options = {
  prism: Object,
};

const prismPlugin = (options: Options) => {
  if (!options || !options.prism)
    throw new Error(
      'You must provide an instance of the prism.js library to draft-js-prism-plugin. See the documentation at https://github.com/withspectrum/draft-js-prism-plugin for more information!'
    );
  const { prism } = options;
  return {
    decorators: [
      new PrismDecorator({
        prism: prism,
        getSyntax(block) {
          const data = block.getData();
          const language = data.get('language') || data.get('syntax') || 'javascript';
          if (typeof prism.languages[language] === 'object') {
            return language;
          }
          return null;
        },
        filter: () => true,
      }),
    ],
  };
};

export default prismPlugin;
