export class PlanTotal {
  inputs: TotalRow[] = [];
  outputs: TotalRow[] = [];
  machines: TotalRow[] = [];
  totalPowerConsumption: number = 0;

  constructor(value?: Partial<PlanTotal>) {
    Object.assign(this, value);
  }
}

export class TotalRow {
  name: string = '';
  amount: number = 0;
  totalPower: number = 0;

  constructor(value?: Partial<TotalRow>) {
    Object.assign(this, value);
  }
}
