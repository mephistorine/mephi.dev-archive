const markdownIt = require("markdown-it")
const markdownItTitleAnchor = require("markdown-it-anchor")
const markdownItToc = require("markdown-it-table-of-contents")
const markdownItAttrs = require("markdown-it-attrs")
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const rss = require("@11ty/eleventy-plugin-rss")
const toml = require("toml")

/**
 * Возвращает список статей
 *
 * @param {TemplateCollection} collectionApi
 */
function takeArticles(collectionApi) {
  const articles = []

  for (const item of collectionApi.getAll()) {
    if (!("type" in item.data)) {
      continue
    }

    if (item.data.type === "article" && !item.data.draft) {
      articles.push(item)
    }
  }

  return articles
}

/**
 * @param {UserConfig} config Конфигурация
 */
function eleventy(config) {
  config.addDataExtension("toml", (content) => toml.parse(content))

  config.setDataDeepMerge(true)
  config.addPassthroughCopy("static")
  config.addPassthroughCopy("src/**/*.(html|gif|jpg|jpeg|png|webp|svg|mp4|webm|zip)")
  config.addPassthroughCopy("src/humans.txt")

  config.addLayoutAlias("article", "layouts/article.njk")
  config.addLayoutAlias("talk", "layouts/talk.njk")

  config.addPlugin(syntaxHighlight)
  config.addPlugin(rss)
  config.setFrontMatterParsingOptions({
    engines: {
      toml: (content) => toml.parse(content)
    },
    language: "toml"
  })

  config.addCollection("articles", /** @param {TemplateCollection} collectionApi */(collectionApi) => {
    return collectionApi.getFilteredByGlob("src/articles/**/*.md")
  })

  config.addCollection("articlesByYear", /** @param {TemplateCollection} collectionApi */(collectionApi) => {
    const articles = collectionApi.getFilteredByGlob("src/articles/**/*.md")

    /** @type {Map<string, any[]>} */
    const articlesByYear = new Map()

    for (const article of articles) {
      const createTime = new Date(article.data.date)
      const year = createTime.getFullYear().toString()

      if (articlesByYear.has(year)) {
        articlesByYear.get(year).push(article)
      } else {
        articlesByYear.set(year, [ article ])
      }
    }

    return articlesByYear
  })

  config.addCollection("tags", /** @param {TemplateCollection} collectionApi */(collectionApi) => {
    const tags = []

    for (const item of collectionApi.getAll()) {
      if (!("tags" in item.data)) {
        continue
      }

      for (const tagName of item.data.tags) {
        const tag = tags.find((tag) => tag.name === tagName)

        if (typeof tag !== "undefined") {
          tag.articleCount = tag.articleCount + 1
          continue
        }

        tags.push({
          name: tagName,
          articleCount: 1
        })
      }
    }

    return tags
  })

  config.addCollection("talks", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/talks/**/*.md")
  })

  config.addCollection("talksByYear", /** @param {TemplateCollection} collectionApi */(collectionApi) => {
    const talks = collectionApi.getFilteredByGlob("src/talks/**/*.md")

    const talksByYear = new Map()

    for (const talk of talks) {
      const createTime = new Date(talk.data.date)
      const year = createTime.getFullYear()

      if (talksByYear.has(year)) {
        talksByYear.get(year).push(talk)
      } else {
        talksByYear.set(year, [ talk ])
      }
    }

    return talksByYear
  })

  config.addNunjucksFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n)
    }

    return array.slice(0, n)
  })

  config.addNunjucksFilter("formatDate", (date) => {
    return date.toLocaleString("ru", {
      hour12: false,
      year: "numeric",
      day: "2-digit",
      month: "short"
    })
  })

  config.addNunjucksFilter("formatInterval", (startDate, endDate) => {
    return `${ startDate.getDate() }–${ date.toLocaleString("ru", {
      hour12: false,
      year: "numeric",
      day: "2-digit",
      month: "short"
    }) }`
  })

  const markdownParser = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true
  })
    .use(markdownItAttrs)
    .use(markdownItToc, {
      includeLevel: [ 2, 3, 4, 5, 6 ],
      listType: "ol",
      containerHeaderHtml: `<h2>Содержание</h2>`,
      containerClass: `article-table-of-content`
    })
    .use(markdownItTitleAnchor, {
      permalink: true,
      permalinkClass: "title-anchor",
      permalinkSymbol: "⌗"
    })

  config.setLibrary("md", markdownParser)

  return {
    dir: {
      input: "src",
      output: "dist",
      dataTemplateEngine: "njk"
    },
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  }
}

module.exports = eleventy
