export class Favorites{
	id: number;
	ticker: string;
	change: string;
    price: string;

	constructor(id: number, ticker: string, change: string, price: string){
		this.id = id;
		this.ticker = ticker;
		this.change = change;
		this.price = price;
	}
}