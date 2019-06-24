import {Parser} from './Parser'

import {Judge} from './Judge'

class App {

  public async runParsers(): Promise<void> {
    let p : Parser = new Parser("./Home.vue");
    await p.runHTML()
    await p.runScript()

    var tag = p.getTags()
    var templateStrings = p.getTemplateSyntax()
    var getVueObjects = p.getVueObjects()
    let j : Judge = new Judge(tag, templateStrings, getVueObjects);


    await j.evaluateLongData()
    await j.evaluateComplexTemplateSyntax()
    await j.evaluateManyConditionalRendering()
    await j.evaluatePropsWithoutDefinition()
  }

}

let app : App = new App()
app.runParsers()
