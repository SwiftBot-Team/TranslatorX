import chalk from 'chalk'
import logSymbols from 'log-symbols'

import Locale from '../../Locale'

const prefix = chalk.reset.inverse.bold.yellowBright(` DEBUG `)

export default (Loc: Locale) => {
  if (Loc.options.debug) {
    Loc.on('error', () => {
      console.log(`${prefix} ${chalk.gray('[error]')} ${logSymbols.error} An error occurred`)
    })

    Loc.on('init', () => {
      console.log(`${prefix} ${chalk.gray('[info]')} ${logSymbols.info} Starting translate system...`)

      Loc.on('initFinished', (dirs: number) => {
        console.log(`${prefix} ${chalk.gray('[info]')} ${logSymbols.success} A total of ${dirs} files was loaded`)
      })
    })

    Loc.on('languageChanged', ({ $lang, newLang }: ({ $lang: string, newLang: string })) => {
      console.log(`${prefix} ${chalk.gray('[language]')} ${logSymbols.success} The language was changed [${$lang} -> ${newLang}]`)
    })
  }
}