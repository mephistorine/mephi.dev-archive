
/**
 * @param {UserConfig} config Конфигурация
 */
function eleventy(config) {

  config.addPassthroughCopy('static');

  return {
    dir: {
      input: 'src',
      output: 'dist',
      dataTemplateEngine: 'njk'
    },
    templateFormats: [
      'md',
      'njk',
      'html',
      'liquid'
    ],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk'
  };
}

module.exports = eleventy
