interface Prop{
  name: string,
  value: string
}


class Prop implements Prop {
  name: string;
  value: string;

  constructor(name: string, value: string) {
    this.name = name,
    this.value = value
  }
}

export {Prop};