export class Orders{
    id: number;
	action: string;
    action_boolean: boolean;
	amount: number;
    limit: string;
    stop: string;
    ticker: string;
    //fecha: string;

	constructor(id: number, action:string, action_boolean: boolean, ticker:string, 
        amount:number, stop: string, limit: string){
            this.id = id;
			this.action = action;
            this.action_boolean = action_boolean;
			this.ticker = ticker;
            this.amount = amount;
            this.stop = stop;
            this.limit = limit;
	}
}