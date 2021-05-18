import { RequestHandler } from 'express'
import router from '../router'
import { Methods } from './request'

export function controller(root?: string) {
  return function (target: new (...args: any[]) => any) {
    for (let key in target.prototype) {
      const path: string = Reflect.getMetadata('path', target.prototype, key)
      const method: Methods = Reflect.getMetadata(
        'method',
        target.prototype,
        key
      )
      const middlewares: RequestHandler[] = Reflect.getMetadata(
        'middlewares',
        target.prototype,
        key
      )
      const handler = target.prototype[key]
      if (path && method) {
        let fullPath: string = ''
        if (root && root !== '/') {
          fullPath = `${root}${path}`
        } else {
          fullPath = path
        }
        if (middlewares && middlewares.length) {
          router[method](fullPath, ...middlewares, handler)
        } else {
          router[method](fullPath, handler)
        }
      }
    }
  }
}
