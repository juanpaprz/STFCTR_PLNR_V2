import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css'],
})
export class SimulatorComponent implements OnInit {
  constructor() {}

  minutes: number = 0;

  stopped: boolean = true;

  ngOnInit() {
    clearInterval(this.interval);
  }

  interval = setInterval(() => {
    this.minutes++;
  }, 1000);

  click() {
    if (this.stopped) {
      this.interval = setInterval(() => {
        this.minutes++;
      }, 6000);
    } else {
      clearInterval(this.interval);
    }
    this.stopped = !this.stopped;
  }
}
