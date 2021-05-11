import fs from 'fs'
import cherrio from 'cheerio'
import { Analyzer } from './crowller'

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

export default class DellAnalyzer implements Analyzer {
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

  /**
   * 存储
   * @param courseInfo
   */
  generateJsonContent(courseInfo: courseResult, filePath: string) {
    let fileContent: Content = {}
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    fileContent[courseInfo.time] = courseInfo.data
    return fileContent
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html)
    const fileContent = this.generateJsonContent(courseInfo, filePath)
    return JSON.stringify(fileContent)
  }
}
