import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PlanRow } from '../../Entities/plan-row.entity';
import { PlanTotal, TotalRow } from '../../Entities/plan-total.entity';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.css'],
})
export class ExportExcelComponent implements OnInit, OnChanges {
  constructor() {}

  @Input() plan: PlanRow[] = [];
  @Input() planTotal: PlanTotal = new PlanTotal();

  @ViewChild('dataTable') table: ElementRef = {} as ElementRef;

  planName: string = '';

  ngOnInit() {}

  ngOnChanges() {
    this.planName = this.getExcelName();
  }

  createImg() {
    html2canvas(this.table.nativeElement).then((canvas) => {
      let dataURL = canvas.toDataURL('image/png');
      let newTab = window.open('about:blank', 'image from canvas');
      if (!newTab) return;
      newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
    });
  }

  exportToExcel(): void {
    let element = JSON.parse(JSON.stringify(this.createExcelJson()));
    let fileName = this.getExcelName();
    const EXCEL_EXTENSION = '.xlsx';
    // generate workbook and add the worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // save to file
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  createExcelJson(): object[] {
    let excelJson: object[] = [];

    this.plan.forEach((p) => {
      let excelRow = {
        Step: p.step,
        Item: p.item.name,
        Recipe: p.selectedRecipe.name,
        'Item/Min': p.itemsPerMinute,
        'Item/Machine': p.itemCraftPerMinute,
        Machine: p.machine.name,
        '#Machine': p.machinesNumber,
        Overflow: p.overflow,
      };
      excelJson.push(excelRow);
    });

    this.planTotal.inputs.forEach((i) => {
      let excelRow = {
        Item: i.name,
        Total: i.amount,
      };
      excelJson.push(excelRow);
    });

    this.planTotal.outputs.forEach((o) => {
      let excelRow = {
        Item: o.name,
        Total: o.amount,
      };
      excelJson.push(excelRow);
    });

    this.planTotal.machines.forEach((m) => {
      let excelRow = {
        Item: m.name,
        Total: m.amount,
        'Power Consumption': m.totalPower,
      };
      excelJson.push(excelRow);
    });

    excelJson.push({ 'Total Power': this.planTotal.totalPowerConsumption });

    return excelJson;
  }

  getExcelName(): string {
    let planGoals = this.plan.filter((p) => p.isGoal);
    let fileName = planGoals.reduce((acc, g, i) => {
      return acc + `${g.item.name}_`;
    }, '');
    return fileName.slice(0, -1);
  }
}
