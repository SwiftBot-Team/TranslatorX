import glob from 'glob'
import fs from 'fs'

interface Options {
  returnUndefined: boolean;
}

export default class Locale {
  public dir: string
  public languages: any
  public actualLang: string
  public options: Options

  constructor(dir: string) {
    this.dir = dir;

    this.languages = {}
    this.actualLang = 'pt'

    this.options = {
      returnUndefined: true
    };
  }

  async init() {
    const dirs = glob.sync(this.dir + '/**/*.json')

    const promises = dirs.map(async (file: any) => {

      return new Promise((rej, res) => {
        const lang = file.split('/')[2]
        const ns = file.split('/')[3].replace('.json', '')

        fs.readFile(file, async (err: any, data: any) => {
          this.languages[lang] = {};
          this.languages[lang][ns] = JSON.parse(data.toString());

          await rej(true);
        })
      })
    })

    await Promise.all(promises)
  }

  async setLang(lang: string) {
    this.actualLang = lang
  }

  t(locale: string, options: {}) {
    let nSeparator = locale.split(':');
    let actualLocale = [];
    actualLocale.push(this.actualLang);
    nSeparator.map(ns => {
      const lSeparator = ns.split('.');
      if (lSeparator.length !== 2) {
        actualLocale.push(ns);
      }
      else {
        actualLocale.push(lSeparator[0]);
        actualLocale.push(lSeparator[1]);
      }
    });
    let finalLocale: any = {};
    actualLocale.map((locale, index) => {
      if (index === 0) {
        finalLocale = this.languages[locale];
      }
      else {

        finalLocale = finalLocale[locale];
      }
    });
    if (!this.options.returnUndefined) {
      if (finalLocale === undefined) {
        return 'No locale available';
      }
      else {
        return this.format(finalLocale, options);
      }
    }
    else {
      return this.format(finalLocale, options);
    }
  }

  format(locale: any, options: any) {
    var formatted = locale;
    if (typeof options == 'object') {
      var vars = options;
      for (let v in vars) {
        var regexp = new RegExp('\\{{' + v + '\\}}', 'gi');
        formatted = formatted.replace(regexp, vars[v]);
      }
    }
    return formatted;
  }
}