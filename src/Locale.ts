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
        const dirs = glob.sync(this.dir + '/**/*.json');

        return new Promise(pass => {
            for (const file of dirs) {
                const lang = file.split('/')[2];

                fs.readFile(file, async (err: any, data: any) => {
                    this.languages[lang] = {};
                    this.languages[lang][file.split('/')[3].replace('.json', '')] = JSON.parse(data.toString());

                    await pass(true);
                });
            }
        });
    }

    async setLang(lang: string) {
        this.actualLang = lang;
    }

    t(locale: string, options ? : {}) {
        const props = locale.split(':');
        let res = this.languages[this.actualLang];

        for (const prop of props) {
            if (prop.includes('.')) {
                for (const $prop of prop.split('.')) {
                    res = res[$prop];
                }
            } else {
                res = res[prop];
            }
        }

        if (!this.options.returnUndefined && res == undefined) {
            return 'No locale available';
        } else {
            return this.format(res, options);
        }
    }

    format(locale: string, options ? : object) {
        let response = locale;
        if (options) {
            for (const [option, value] of Object.entries(options)) {
                response = response.replace('{{' + option + '}}', value);
            }
        }
        return response;
    }
}