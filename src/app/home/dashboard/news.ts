export class News{
	title: string;
    desc: string;
    img_url: string;
    url: string;

	constructor(title: string, desc: string, img_url: string, url: string){
		this.title = title;
        this.desc = desc;
        this.img_url = img_url;
        this.url = url;
	}
}