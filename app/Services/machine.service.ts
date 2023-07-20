import { Injectable } from '@angular/core';
import { MachineJson } from '../Entities/machine-json.entity';
import { Machine } from '../Entities/machine.entity';
import * as machineJson from '../Data/machine.json';

@Injectable()
export class MachineService {
  constructor() {
    let machines: Machine[] = [];
    let machineData: MachineJson[] = Object.values(machineJson);

    machineData.forEach((m) => {
      if (!m.name) return;

      let machine: Machine = {
        name: m.name,
        powerConsumption: m.powerConsumption,
      };

      machines.push(machine);
    });

    this.machines = machines;
  }

  machines: Machine[] = [];

  getAllMachines(): Machine[] {
    return this.machines;
  }

  getMachine(machineName: string): Machine {
    let machines = this.getAllMachines();
    let machine = machines.find((m) => m.name === machineName);

    if (!machine) throw new Error('Machine not found');

    return machine;
  }
}
