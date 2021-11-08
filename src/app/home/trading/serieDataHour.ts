export class SerieData{
	x: Date;
	y: number;

	constructor(year:number, month:number, day:number, hour: number, minute: number, 
        close: number){
			
			this.x = new Date(year, month, day, hour, minute);
			this.y = close;
	}
}