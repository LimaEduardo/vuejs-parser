import {Prop} from './Prop'

interface Tag {
  name: string,
  props: Prop[],
  level: number
}


class Tag implements Tag {
  name: string
  props : Prop[]
  level: number

  constructor(name: string, level: number) {
    this.name = name
    this.props = []
    this.level = level
  }

  public addProp(prop : Prop) : void {
    this.props.push(prop)
  }
}

export {Tag}