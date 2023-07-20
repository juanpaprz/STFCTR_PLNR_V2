export class Machine {
  name: string = '';
  powerConsumption: number = 0;

  constructor(value?: Partial<Machine>) {
    Object.assign(this, value);
  }
}
