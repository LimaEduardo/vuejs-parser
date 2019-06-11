import * as fs from "fs";

import {Tag} from './Tag'
import {Prop} from './Prop'
import {TagDelimiterEnum} from './TagDelimiterEnum';

class Parser {
  fileName : string;
  fileContent : string;
  tags: Tag[];
  currentLevel : number

  constructor(fileName: string) {
    this.fileName = fileName
    this.fileContent = fs.readFileSync(this.fileName, 'utf-8')
    this.tags = []
    this.currentLevel = 0
  }

  public async run(): Promise<void> {
    const {fileContent} = this
    var tagBuffer : string[] = []
    var allowAddInBuffer : boolean = false
    var firstTag : string;

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

      if(allowAddInBuffer) {
        tagBuffer.push(currentChar)
      }

      if(this.tags.length > 0 && this.currentLevel === 0){
        console.log("Quitting html parser")
        this.debug()
        return
      }

    }

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

  public debug() : void {
    // console.log(this.fileName)
    // console.log(this.fileContent)

    this.tags.forEach((tag) => {
      console.log(tag)
    })

  }
}


let p : Parser = new Parser("./Home.vue");
p.run()





