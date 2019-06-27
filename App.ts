import {Parser} from './Parser'

import {Judge} from './Judge'

import * as fs from "fs";


class App {

  results : Array<Object>
  testFolder : string

  constructor() {
    this.results = []
    this.testFolder = './'
  }


  public async runParser(filename : string): Promise<void> {
    let filePath : string = this.testFolder + filename
    let p : Parser = new Parser(filePath);
    await p.runHTML()
    await p.runScript()

    var tag = p.getTags()
    var templateStrings = p.getTemplateSyntax()
    console.log(templateStrings)
    var getVueObjects = p.getVueObjects()
    let j : Judge = new Judge(tag, templateStrings, getVueObjects);


    var evaluateLongData = await j.evaluateLongData()
    var evaluateComplexTemplateSyntax = await j.evaluateComplexTemplateSyntax()
    var evaluateConditionalRendering =  await j.evaluateManyConditionalRendering()
    // var evaluatePropsWithoutDefinition =  await j.evaluatePropsWithoutDefinition()

    const result = {
      fileName : filename,
      evaluateLongData,
      evaluateComplexTemplateSyntax,
      evaluateConditionalRendering,
      // evaluatePropsWithoutDefinition
    }


    this.results.push(result)

    // console.log(result)

    return Promise.resolve()


  }

  public async writeResults() : Promise<void> {

    var jsonobj = JSON.stringify(this.results)

    fs.writeFile("./results.json", jsonobj , function(err) {
      if(err) {
          return console.log(err);
      }
  
      console.log("The file was saved!");
   }); 


    return Promise.resolve()
  }

  public async runTests() : Promise<void> {
    var folderFiles = fs.readdirSync(this.testFolder)

    for (var i : number = 0; i < folderFiles.length; i++) {
      await this.runParser(folderFiles[i])
    }

    console.log("vai escrever")
    await this.writeResults()

    await this.evaluateResults()

    return Promise.resolve()

  }

  public async evaluateResults() : Promise<void> {
    var counter = {
      evaluateLongData : 0,
      evaluateComplexTemplateSyntax : 0,
      evaluateConditionalRendering : 0,
      evaluatePropsWithoutDefinition : 0
    }

    for (var i : number = 0; i < this.results.length; i++) {
      if (this.results[i]['evaluateLongData'] === true) {
        counter.evaluateLongData++
      }

      if (this.results[i]['evaluateComplexTemplateSyntax'] === true) {
        counter.evaluateComplexTemplateSyntax++
      }

      if (this.results[i]['evaluateConditionalRendering'] === true) {
        counter.evaluateConditionalRendering++
      }

    }

    var jsonobj = JSON.stringify(counter)


    fs.writeFile("./numbers.json", jsonobj , function(err) {
      if(err) {
          return console.log(err);
      }
  
      console.log("The file was saved!");
   }); 

   return Promise.resolve()
  }
}

let app : App = new App()
app.runParser("Home.vue")
// app.runTests()



