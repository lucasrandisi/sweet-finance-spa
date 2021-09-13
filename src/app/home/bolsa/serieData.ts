import { Inject } from '@angular/core';

export class SerieData{
	x: Date;
	y: [s1 : number, s2 : number, s3 : number, s4 : number];

	constructor(@Inject(Number) year:number, @Inject(Number) month:number, 
	@Inject(Number) day:number, @Inject(Number) open: number, @Inject(Number) high: number, 
	@Inject(Number) low:number, @Inject(Number) close: number){
			
			this.x = new Date(year, month, day);
			this.y = [open, high, low, close];
	}
}