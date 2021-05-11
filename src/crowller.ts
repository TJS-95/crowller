import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import cherrio from 'cheerio'

interface Course {
  title: string
  count: number
}

interface courseResult {
  time: number
  data: Course[]
}

interface Content {
  [propName: number]: Course[]
}

class Crowller {
  private secret = 'x3b174jsx'
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`
  private filePath = path.resolve(__dirname, '../data/course.json')

  /**
   * 解析html
   * @param html
   * @returns
   */
  getCourseInfo(html: string) {
    const $ = cherrio.load(html)
    const courseItem = $('.course-item')
    const courseInfos: Course[] = []
    courseItem.map((index, element) => {
      const descs = $(element).find('.course-desc')
      const title = descs.eq(0).text()
      const count = parseInt(descs.eq(1).text().split('：')[1], 10)
      courseInfos.push({ title, count })
    })
    const result = {
      time: new Date().getTime(),
      data: courseInfos,
    }
    return result
  }

  async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }

  /**
   * 存储
   * @param courseInfo
   */
  generateJsonContent(courseInfo: courseResult) {
    let fileContent: Content = {}
    if (fs.existsSync(this.filePath)) {
      fileContent = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'))
    }
    fileContent[courseInfo.time] = courseInfo.data
    return fileContent
  }

  async initSpiderProcess() {
    const html = await this.getRawHtml()
    const courseInfo = this.getCourseInfo(html)
    const fileContent = this.generateJsonContent(courseInfo)
    fs.writeFileSync(this.filePath, JSON.stringify(fileContent))
  }

  constructor() {
    this.initSpiderProcess()
  }
}

const crowller = new Crowller()
