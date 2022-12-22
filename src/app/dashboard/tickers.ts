export class Tickers{
	ticker: string;
    company: string;
    change: string;

	constructor(ticker:string, company: string, change:string){
		this.ticker = ticker;
        this.company = company;
        this.change = change;
	}
}