import {Attribute} from './Attribute'


interface VueObject{
  name: string,
  attributes: Array<Attribute>
}


class VueObject implements VueObject {
  name: string
  attributes: Array<Attribute>

  constructor() {
    this.name = '',
    this.attributes = []
  }

  addAttr(attr : Attribute) {
    this.attributes.push(attr)
  }

  assignName(name : string) {
    this.name = name
  }


}

export {VueObject};