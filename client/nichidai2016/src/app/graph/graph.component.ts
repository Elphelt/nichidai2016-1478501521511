import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  @Input('varYes') varYes;
  @Input('varNo') varNo;

  // Doughnut
  public doughnutChartLabels: string[] = ['No', 'Yes'];
  public doughnutChartData: number[];
  public doughnutChartType: string = 'doughnut';
  public doughnutChartColors: any[] = [{ backgroundColor: ['#d9534f', '#5CB85C'] }];
  private legend: any = { display: false, fullWidth: false };
  private doughnutChartOptions: any = {
    responsive: true,
    animation: {
      animateRotate: true,
      duration: 2000
    },
    legend: this.legend,
  };
  constructor() { }

  ngOnInit() {
    this.doughnutChartData = [this.varNo, this.varYes];
  }

  public changeLabels(labels: string[]): void {
    this.doughnutChartLabels = labels;
  }

  public changeData(data: number[]): void {
    this.doughnutChartData = data;
  }

}
