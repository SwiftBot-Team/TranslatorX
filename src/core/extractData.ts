import YAML from 'yaml'
import InternalError from './errors/InternalError';

export default function extractData(file: Buffer, dir: string) {
  const $dir = dir.split('/')[dir.split('/').length-1];
  const language = $dir.split('.')[1]

  if (language === 'json') {
    return JSON.parse(file.toString())
  }
  if (language === 'yml' || language === 'yaml') {
    return YAML.parse(file.toString())
  }

  throw new InternalError('The file extension must be YAML or JSON')
}