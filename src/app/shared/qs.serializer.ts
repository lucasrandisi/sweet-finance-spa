export class QsSerializer {

    protected params: any[] = [];

    public serialize(obj: any, prevKey: string = ''): any[] {
        for(let key in obj) {
            let value = obj[key];
            if ((Array.isArray(value)||this.isObject(value)) && !(value instanceof File)) {
                this.serialize(value, prevKey + this.enclose(key, prevKey));
            } else {
                this.params.push({
                    name: prevKey + this.enclose(key, prevKey),
                    value: value === null ? '' : value
                });
            }
        }

        return this.params;
    }

    private isObject(value: any) {
        let result = value !== null && typeof value === 'object';
        return result;
    }

    private enclose(value: string, prevKey: string = ''): string {
        if (!prevKey.length) {
            return value;
        }
        return `[${value}]`;
    }
}