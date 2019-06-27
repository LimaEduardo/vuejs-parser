import * as fs from "fs";

import {Tag} from './Tag'
import {Prop} from './Prop'
import {TagDelimiterEnum} from './TagDelimiterEnum';
import { UselessCharEnum } from './UselessCharEnum';
import { TemplateString } from "./TemplateString";
import { VueObject } from './VueObject';
import { Attribute } from './Attribute' 

class Parser {
  fileName : string;
  fileContent : string;
  tags: Tag[];
  templateStrings : TemplateString[];
  vueObjects : VueObject[];
  currentLevel : number
  indexAtHTMLEnd : number

  constructor(fileName: string) {
    this.fileName = fileName
    this.fileContent = fs.readFileSync(this.fileName, 'utf-8')
    this.tags = []
    this.templateStrings = []
    this.vueObjects = []
    this.currentLevel = 0
    this.indexAtHTMLEnd = 0

  }

  public async runHTML(): Promise<void> {
    const {fileContent} = this
    var tagBuffer : string[] = []
    var templateStringBuffer : string[] = []
    var allowAddInBuffer : boolean = false
    var allowAddInTemplateStringBuffer : boolean = false;
    var possibleTemplateString : boolean = false

    for (var i : number = 0; i < fileContent.length; i++){
      const currentChar: string = fileContent[i]

      if (currentChar === TagDelimiterEnum.TAG_START){
        allowAddInBuffer = true
        continue
      }

      if (currentChar === TagDelimiterEnum.TAG_END){
        await this.bufferHandler(tagBuffer)
        allowAddInBuffer = false
        tagBuffer = []
      }

      if (currentChar === TagDelimiterEnum.OPEN_BRACES) {
        if (possibleTemplateString && !allowAddInTemplateStringBuffer) {
          allowAddInTemplateStringBuffer = true
          continue
        } else {
          possibleTemplateString = true;
          continue
        }
      }

      if (currentChar === TagDelimiterEnum.END_BRACES && allowAddInTemplateStringBuffer) {
        if (fileContent[i + 1] === TagDelimiterEnum.END_BRACES) {
          allowAddInTemplateStringBuffer = false;
          possibleTemplateString = false;
          await this.templateStringHandler(templateStringBuffer)
          templateStringBuffer = []
        }
      }

      if(allowAddInBuffer) {
        tagBuffer.push(currentChar)
      }

      if (allowAddInTemplateStringBuffer) {
        templateStringBuffer.push(currentChar)
      }

      possibleTemplateString = false;

      if(this.tags.length > 0 && this.currentLevel === 0){
        this.indexAtHTMLEnd = i + 1
        return Promise.resolve()
      }

    }

  }

  public async runScript(): Promise<void> {
    var currentIndex = this.indexAtHTMLEnd
    var hasAScriptTag : boolean = false
    var allowAddInBuffer : boolean = false
    var buffer : string[] = []
    var ignoreBuffer : boolean = false

    for (var i : number = currentIndex; i < this.fileContent.length; i++) {
      if(ignoreBuffer) continue
      var currentChar : string = this.fileContent[i]

      if (hasAScriptTag) {
        buffer.push(currentChar)
      }

      if (currentChar === TagDelimiterEnum.TAG_START) {
        allowAddInBuffer = true
        if (hasAScriptTag) {
          ignoreBuffer = true
        }
        continue
      }

      if (currentChar === TagDelimiterEnum.TAG_END){
        allowAddInBuffer = false
        if (buffer.join('') === TagDelimiterEnum.SCRIPT_STRING) {
          hasAScriptTag = true
          buffer = []
        }
      }

      if (allowAddInBuffer) {
        buffer.push(currentChar)
      }

    }

    buffer.pop()

    buffer = await this.removeUselessCharsFromBuffer(buffer)

    await this.handleScriptBuffer(buffer)

    return Promise.resolve();

  }

  private async handleScriptBuffer(buffer: string[]) : Promise<void> {
    var string = buffer.join('')

    var dataObject : VueObject =  await this.findAndRetrieve(string, 'data')
    this.vueObjects.push(dataObject)
    var propsObject : VueObject = await this.findAndRetrieve(string, 'props')
    this.vueObjects.push(propsObject)

    return Promise.resolve()
  }

  private async findAndRetrieve(scriptString: string, term : string) : Promise<any> {
    let index = scriptString.indexOf(term)

    var buffer: string[] = scriptString.split("")
    var level: number = 0;

    var name: string = ''
    var searchBuffer : string[] = []

    var isVerifyingName : boolean = true


    var vueObject: VueObject = new VueObject()

    for (var i : number = index; i < buffer.length; i++) {
      var currentChar: string = buffer[i]

      if (currentChar == TagDelimiterEnum.COLON) {
        if (isVerifyingName) {
          name = searchBuffer.join('')
          searchBuffer = []
          isVerifyingName = false
          vueObject.assignName(name)
          continue
        } 

        var attrName: string = await this.getAttrName(buffer, i)
        var attrValue : string = await this.getAttrValue(buffer,i)


        var attr : Attribute = new Attribute(attrName, attrValue)

        vueObject.addAttr(attr)

      }

      if (isVerifyingName) {
        searchBuffer.push(currentChar)
      }

      if(currentChar === TagDelimiterEnum.OPEN_BRACES) {
        level++
      }

      if (currentChar === TagDelimiterEnum.END_BRACES) {
        level--
      }

      if (currentChar === TagDelimiterEnum.END_BRACES && level === 0) {
        return Promise.resolve(vueObject)
      }

    }
  }

  private async getAttrName(buffer: string[], index: number) : Promise<any> {
    var attrName : string[] = []
    for (var i : number = index-1; i > 0; i--) {
      var currentChar: string = buffer[i]
      if (currentChar === TagDelimiterEnum.COMMA || currentChar == TagDelimiterEnum.OPEN_BRACES) {
        let attrNameString = attrName.reverse().join("").trim()
        return Promise.resolve(attrNameString)
      }
      attrName.push(currentChar)
    }
  }

  private async getAttrValue(buffer: string[], index: number) : Promise<any> {
    var attrValue : string[] = []
    var shouldIgnoreDelimeters : boolean = false
    var level : number = 0
    for (var i : number = index+1; i < buffer.length; i++) {
      var currentChar: string = buffer[i]
      
      if (currentChar === TagDelimiterEnum.OPEN_BRACES || currentChar === TagDelimiterEnum.OPEN_BRACKET) {
        shouldIgnoreDelimeters = true
        level++
      }

      if (currentChar === TagDelimiterEnum.CLOSE_BRACKET || currentChar === TagDelimiterEnum.CLOSE_BRACKET) {
        level--
        if (level === 0) {
          shouldIgnoreDelimeters = false
        }
      }

      if ((currentChar === TagDelimiterEnum.COMMA || currentChar == TagDelimiterEnum.END_BRACES) && !shouldIgnoreDelimeters) {
          let attrValueString : string = attrValue.join("").trim()
          return Promise.resolve(attrValueString)
      }
      attrValue.push(currentChar)
    }
  }

  private async removeUselessCharsFromBuffer(buffer : string[]) : Promise<any> {
    let newBuffer : string[] = []
    for (var i : number = 0; i < buffer.length; i++) {
      var currentChar = buffer[i]
      if (this.isWhiteSpace(currentChar)) {
        continue
      }

      newBuffer.push(currentChar)
    }
    return Promise.resolve(newBuffer)
  }

  private async templateStringHandler(buffer : string[]) : Promise<void> {
    return new Promise ((resolve, reject) => {
      let templateStrinContent : string = buffer.join('').trim()
      let templateStringTag : string = this.tags[this.tags.length - 1].name
      let templateStringlevel : number = this.tags[this.tags.length - 1].level
      let templateStringObj : TemplateString
      templateStringObj = new TemplateString(templateStrinContent, templateStringTag, templateStringlevel)
      this.templateStrings.push(templateStringObj)
      resolve()
    })
  }

  private async bufferHandler( buffer : string[]) : Promise<void> {
    return new Promise(async (resolve, reject) => {

      let index : number = 0;
      let tagName : string = '';

      for(; index < buffer.length; index++) {
        
        if (this.isWhiteSpace(buffer[index])) {
          break;
        }

        tagName += buffer[index]
      }
      
      let isClosingTag : boolean = await this.isClosingTag(tagName)

      if(isClosingTag) {
        this.currentLevel--;
        return resolve();
      }

      let tag : Tag;
      tag = new Tag(tagName, this.currentLevel);

      for(; index < buffer.length; index++) {
        if(buffer[index] === TagDelimiterEnum.ASSIGN_OPERATOR) {
          try {
            
            let propName : string = await this.getPropName(buffer, index-1);
            let propValue : string = await this.getPropValue(buffer, index + 1);
            let prop : Prop = new Prop(propName, propValue)
            tag.addProp(prop)

            index += propValue.length;
 
          } catch (error) {
            console.log("Tag Error")
            console.log(error)
          }
        }

        if(buffer[index] === TagDelimiterEnum.TAG_CLOSE) {
          this.tags.push(tag)
          return resolve()
        }
      }


      this.currentLevel++;

      this.tags.push(tag)
      return resolve()
    })
  }

  private isWhiteSpace(character : string) : boolean {
    return /\s/.test(character)
  }

  private async getPropName(buffer : string[], index: number) : Promise<string> {
    return new Promise((resolve, reject) => {
      let propName : string = '';
      for (; index > 0; index --) {
        if (this.isWhiteSpace(buffer[index])) {
          return resolve(propName.split("").reverse().join(""))
        }
        propName += buffer[index]
      }
      return reject("");
    })
  }

  private async getPropValue(buffer : string[], index: number) : Promise<string> {
    return new Promise((resolve, reject) => {
      let propValue : string = '';
      let closingChar : string = buffer[index]
      index++
      for (; index < buffer.length; index ++) {
        if (buffer[index] === closingChar) {
          return resolve(propValue)
        }
        propValue += buffer[index]
      }
      return resolve(propValue)
    })
  }

  private isClosingTag(tagName : string) : Promise<boolean> {
    return new Promise((resolve, reject) => {
      let length:number = tagName.length;
      let tagNameArray : string[] = tagName.split("")
      for (var i:number = 0; i < length; i++){
        if (tagNameArray[i] === TagDelimiterEnum.TAG_CLOSE) {
          return resolve(true);
        }
      }
      return resolve(false)
    })
  }

  public getTags() : Array<Tag> {
    return this.tags
  } 

  public getTemplateSyntax() : Array<TemplateString> {
    return this.templateStrings
  }

  public getVueObjects() : Array<VueObject> {
    return this.vueObjects
  }
  
  public debug() : void {
    // console.log(this.fileName)
    // console.log(this.fileContent)

    this.tags.forEach((tag) => {
      console.log(tag)
    })

    this.templateStrings.forEach((template) => {
      console.log(template)
    })

  }
}

export {Parser}







