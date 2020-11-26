import chalk from 'chalk'

const TEXT = chalk.supportsColor
  ? chalk.reset.inverse.bold.redBright(` ERROR `)
  : ' ERROR ';

class InternalError extends Error {
  constructor(message: string) {
    super(message);
    
    this.name = TEXT;
  }
}

export default InternalError