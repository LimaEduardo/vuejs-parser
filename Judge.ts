import {Tag} from './Tag'
import { TemplateString } from "./TemplateString";
import { VueObject } from './VueObject';
import { Attribute } from './Attribute' 

class Judge {

  tags : Array<Tag>
  templateStrings : Array<TemplateString>
  vueObjects : Array<VueObject>

  MAX_NUMBER_OF_DATA_OBJECTS : number = 10
  MAX_NUMBER_OF_CONDITIONAL_RENDERING : number = 5

  constructor(tags : Array<Tag>, templateStrings : Array<TemplateString>, vueObjects : Array<VueObject>) {
    this.tags = tags
    this.templateStrings = templateStrings
    this.vueObjects =vueObjects
  }


  public async evaluateLongData() : Promise<any> {
    try {
      let dataObject : VueObject = await this.getDataObject()
      if (dataObject.attributes.length > this.MAX_NUMBER_OF_DATA_OBJECTS) {
        console.log("Long Data encontrado!")
        return Promise.resolve(true)
      } else {
        console.log("Limpo de long data")
        return Promise.resolve(false)
      }
    } catch(e) {
      console.log(e)
      return Promise.resolve(false)
    }
  }

  public async evaluateComplexTemplateSyntax() : Promise<any> {
    var smellFound : boolean = false
    try {
      for(var i : number = 0; i < this.templateStrings.length; i++) {
        var templateString : TemplateString = this.templateStrings[i]
        const {content, tag} = templateString
        if (content.includes("??")
        || content.includes("function") 
        || content.includes(":")
        || content.includes("=>")) {
          console.log("Complex Template Syntax encontrado!")
          smellFound = true
        }
      }

      if (!smellFound) {
        console.log("Limpo de Complex Template Syntax")
        return Promise.resolve(false)
      }

      return Promise.resolve(true)
    }
    catch (e) {
      console.log("Um erro foi encontrado na avaliação do complex template syntax")
      console.log(e)
      return Promise.resolve(false)
    }
  }

  public async evaluateManyConditionalRendering() : Promise<any> {
    try {

      var vifCounter : number = 0
      for(var i : number = 0; i < this.tags.length; i++) {
        
        for (var j : number = 0; j < this.tags[i].props.length; j++) {
          var prop = this.tags[i].props[j]
          if (prop.name === "v-if" || prop.name === "v-else-if") {
            vifCounter++
          }

          if (vifCounter > this.MAX_NUMBER_OF_CONDITIONAL_RENDERING) {
            console.log("Many Conditional Rendering encontrado!")
            return Promise.resolve(true)
          }
        }
      }
      
      console.log("Limpo de Many Conditional Rendering")
      return Promise.resolve(false)

    } catch (e) {
      console.log("Um erro foi encontrado na avaliação do Many Conditional Rendering")
      console.log(e)
      return Promise.resolve(false)
    }
  }

  public async evaluatePropsWithoutDefinition() : Promise<any> {
    try {
      let propsObject : VueObject = await this.getPropsObject()
      let smellFound : boolean = false

      for(var i : number = 0; i < propsObject.attributes.length; i++) {
        const {value} = propsObject.attributes[i]

        if (!value.includes("String")
        && !value.includes("Number") 
        && !value.includes("Boolean")
        && !value.includes("Array")
        && !value.includes("Object") 
        && !value.includes("Function")
        && !value.includes("Props") 
        && !value.includes("Boolean")
        && !smellFound) {
          console.log("Props Without Definition encontrado!")
          smellFound = true
        }
      }

      if (!smellFound) {
      console.log("Limpo de Props Without Definition")
      }
      
    } catch(e) {
      console.log(e)
      return Promise.resolve(false)
    }
  }
  


  private async getDataObject() : Promise<any> {
    for(var i : number = 0; i < this.vueObjects.length; i++) {
      if (this.vueObjects[i].name === "data") {
        return Promise.resolve(this.vueObjects[i])
      }
    }
    throw "Data não existe no componente"
  }

  private async getPropsObject() : Promise<any> {
    for(var i : number = 0; i < this.vueObjects.length; i++) {
      if (this.vueObjects[i].name === "props") {
        return Promise.resolve(this.vueObjects[i])
      }
    }
    throw "Props não existe no componente"
  }




}


export {Judge}