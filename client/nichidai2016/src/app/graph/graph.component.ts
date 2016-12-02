import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  @Input("varYes") varYes;
  @Input("varNo") varNo;

  // Doughnut
  public doughnutChartLabels: string[] = ['Yes', 'No'];
  public doughnutChartData: number[];
  public doughnutChartType: string = 'doughnut';

  constructor() { }

  ngOnInit() {
    this.doughnutChartData = [this.varYes, this.varNo];
  }


  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public changeLabels(labels: string[]): void {
    this.doughnutChartLabels = labels;
  }

  public changeData(data: number[]): void {
    this.doughnutChartData = data;
  }

}
