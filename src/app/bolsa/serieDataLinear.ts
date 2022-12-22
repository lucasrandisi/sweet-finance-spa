export class SerieDataLinear{
	x: Date;
	y: number;

	constructor(year:number,  month:number, day:number,  volume: number){
			
			this.x = new Date(year, month, day);
			this.y = volume;
	}
}