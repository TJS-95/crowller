import fs from 'fs'
import path from 'path'
import { Request, Response, NextFunction } from 'express'
import Analyzer from '../utils/anzlyzer'
import Crowller from '../utils/crowller'
import { getResponseData } from '../utils/util'
import { controller, get, use } from '../decorator'

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined }
}

const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  const isLogin = !!(req.session ? req.session.login : false)
  console.log('checkLogin')
  if (isLogin) {
    next()
  } else {
    res.json(getResponseData(null, '请先登录'))
  }
}
const test = (req: Request, res: Response, next: NextFunction): void => {
  console.log('test')
  next()
}

@controller()
export class CrowllerController {
  @get('/getData')
  @use(checkLogin)
  @use(test)
  getData(req: BodyRequest, res: Response): void {
    const secret = 'x3b174jsx'
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`
    const analyzer = Analyzer.getInstance()
    new Crowller(url, analyzer)
    res.json(getResponseData(true))
  }

  @get('/showData')
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, '../../data/course.json')
      const result = fs.readFileSync(position, 'utf8')
      res.json(getResponseData(JSON.parse(result)))
    } catch (e) {
      res.json(getResponseData(false, '数据不存在'))
    }
  }
}
