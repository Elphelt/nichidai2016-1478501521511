import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnChanges {

  @Input('varYes') varYes;
  @Input('varNo') varNo;

  // Doughnut
  public doughnutChartLabels: string[] = ['Yes', 'No'];
  public doughnutChartData: number[];
  public doughnutChartType: string = 'doughnut';
  public doughnutChartColors: any[] = [{ backgroundColor: ['#5CB85C', '#d9534f'] }];
  private legend: any = { display: false, fullWidth: false };
  private doughnutChartOptions: any = {
    responsive: true,
    animation: {
      animateRotate: true,
      animateScale: true
    },
    legend: this.legend,
  };
  constructor() { }

  ngOnInit() {
    this.doughnutChartData = [this.varYes, this.varNo];
  }

  ngOnChanges() {
    this.doughnutChartData = [this.varYes, this.varNo];
  }

  public changeLabels(labels: string[]): void {
    this.doughnutChartLabels = labels;
  }

  public changeData(data: number[]): void {
    this.doughnutChartData = data;
  }

}
