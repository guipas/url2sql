export const logger = (...args: any[]): any => process.env.DEBUG ? console.log(...args) : null;