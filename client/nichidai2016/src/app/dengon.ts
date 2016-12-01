export class Dengon {
  private water: string[];
  private agile: string[];
  constructor(water: string[], agile: string[]) {
    this.water = water;
    this.agile = agile;
  }

  public setWater(water: string[]) {
      this.water = water;
  }

  public setAgile(agile: string[]) {
      this.agile = agile;
  }

}
