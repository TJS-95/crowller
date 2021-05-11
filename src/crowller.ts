import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import DellAnalyzer from './anzlyzer'

export interface Analyzer {
  analyze: (html: string, filePaht: string) => string
}

class Crowller {
  private filePath = path.resolve(__dirname, '../data/course.json')

  async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }

  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }

  async initSpiderProcess() {
    const html = await this.getRawHtml()
    const fileContent = this.analyzer.analyze(html, this.filePath)
    this.writeFile(fileContent)
  }

  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess()
  }
}

const secret = 'x3b174jsx'
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`

const analyzer = new DellAnalyzer()
const crowller = new Crowller(url, analyzer)
