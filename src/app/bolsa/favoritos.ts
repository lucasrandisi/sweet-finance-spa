export class Favoritos{
	id: number;
	ticker: string;
	change: string;
	change_status: boolean;
    price: string;

	constructor(id: number, ticker: string, change: string, change_status: boolean, 
			price: string){
		this.id = id;
		this.ticker = ticker;
		this.change = change;
		this.change_status = change_status;
		this.price = price;
	}
}