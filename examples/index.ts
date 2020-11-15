import Locale from '../src';

async function a() {
  let l = new Locale('examples/locales')

  await l.init()

  l.t('commands:hello2.hello3')

  l.setLang('pt')
}

a()