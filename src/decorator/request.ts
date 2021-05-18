import 'reflect-metadata'
import { CrowllerController, LoginController } from '../controller'

export enum Methods {
  get = 'get',
  post = 'post',
}

function getRequestDectorator(type: Methods) {
  return function get(path: string) {
    return function (
      target: CrowllerController | LoginController,
      key: string
    ) {
      Reflect.defineMetadata('path', path, target, key)
      Reflect.defineMetadata('method', type, target, key)
    }
  }
}

export const get = getRequestDectorator(Methods.get)
export const post = getRequestDectorator(Methods.post)
