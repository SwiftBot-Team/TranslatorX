import glob from 'glob'
import fs from 'fs'
import { EventEmitter } from 'events'

import InternalError from './core/errors/InternalError'
import extractData from './core/extractData'
import debug from './core/debug'

interface Options {
    returnUndefined?: boolean;
    defaultLanguage: string;
    debug?: boolean
}

export default class Locale extends EventEmitter {
    private dir: string
    private languages: any
    public actualLang: string
    public options: Options

    constructor(dir: string, options: Options) {
        super()
        this.dir = dir;

        this.languages = {}
        this.actualLang = options.defaultLanguage

        this.options = options
        debug(this)
    }

    async init() {
        this.emit('init')

        const dirs = glob.sync(this.dir + '/**/*.*');

        return new Promise(async (pass) => {
            for (const file of dirs) {
                const data = fs.readFileSync(file)

                const split = file.split('/')
                const lang = split[split.length - 2];

                const $data = await extractData(data, file)

                typeof this.languages[lang] === 'undefined'
                    ? this.languages[lang] = {}
                    : null

                this.languages[lang][split[split.length - 1].split('.')[0]] = $data

                await pass(true);
            }
            this.emit('initFinished', dirs.length)
        });
    }

    async setLang(lang: string) {
        if (!this.languages[lang]) {
            this.emit('error')
            throw new InternalError('This language does not exist or not been loaded.')
        }

        this.emit('languageChanged', ({ $lang: lang, newLang: this.actualLang }))

        this.actualLang = lang;
    }

    t(locale: string, options?: {}) {
        if (!this.languages[this.actualLang]) {
            this.emit('error')
            throw new InternalError('The actual language does not exist or not been loaded.')
        }

        const props = locale.split(':');
        let res = this.languages[this.actualLang];

        for (const prop of props) {
            if (prop.includes('.')) {
                for (const $prop of prop.split('.')) {
                    if (res !== undefined) res = res[$prop];
                    else {
                        if (!this.options.returnUndefined) return 'No locale available';
                        else return undefined
                    }
                }
            } else {
                if (res !== undefined) res = res[prop];
                else {
                    if (!this.options.returnUndefined) return 'No locale available';
                    else return undefined
                }
            }
        }

        if (!this.options.returnUndefined && res == undefined) {
            return 'No locale available';
        } else {
            return this.format(res, options);
        }
    }

    format(locale: string, options?: object) {
        let response = locale;
        if (options) {
            for (const [option, value] of Object.entries(options)) {
                response = response.replace('{{' + option + '}}', value);
            }
        }
        return response;
    }
}