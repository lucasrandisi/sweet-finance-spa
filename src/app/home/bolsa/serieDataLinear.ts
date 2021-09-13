import { Inject } from '@angular/core';

export class SerieDataLinear{
	x: Date;
	y: number;

	constructor(@Inject(Number) year:number, @Inject(Number) month:number, 
	@Inject(Number) day:number, @Inject(Number) volume: number){
			
			this.x = new Date(year, month, day);
			this.y = volume;
	}
}