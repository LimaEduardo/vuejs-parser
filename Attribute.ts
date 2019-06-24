interface Attribute{
  name: string,
  value: string
}

class Attribute implements Attribute {
  name: string
  value: string

  constructor(name: string, value: string) {
    this.name = name,
    this.value = value
  }
}

export {Attribute};