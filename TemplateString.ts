import {Prop} from './Prop'

interface TemplateString {
  content: string,
  tag : string,
  level: number
}


class TemplateString implements TemplateString {
  
  content: string
  tag: string
  level: number

  constructor(content: string, tag: string, level: number) {
    this.content = content
    this.tag = tag
    this.level = level
  }
}

export {TemplateString}