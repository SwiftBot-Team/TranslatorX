import Locale from '../src';

async function a() {
  let l = new Locale('examples/locales', {
    returnUndefined: true,
    defaultLanguage: 'pt',
    debug: true
  })

  await l.init()

  l.setLang('pt')
}

a()