export class SerieData{
	x: Date;
	y: [s1 : number, s2 : number, s3 : number, s4 : number];

	constructor(year:number, month:number, day:number, open: number,  high: number, 
	low:number,  close: number){
			
			this.x = new Date(year, month, day);
			this.y = [open, high, low, close];
	}
}