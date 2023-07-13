export class Machine {
  name: string = '';
  powerConsumpsion: number = 0;

  constructor(value?: Partial<Machine>) {
    Object.assign(this, value);
  }
}
