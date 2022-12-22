import { stringify         } from 'qs';
import { Injectable, NgModule        } from '@angular/core';
import { HttpClient        } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { environment       } from 'src/environments/environment';
import { catchError, map   } from 'rxjs/operators';
import { Observable        } from 'rxjs/internal/Observable';
import { throwError        } from 'rxjs';
import { Router            } from '@angular/router';
import { SnackBarService   } from './snack-bar.service';
import { QsSerializer      } from '../qs.serializer';

@Injectable()
@NgModule()
export class ApiService {

    public mostrarMensajes : boolean = true;

    constructor(
        private http     : HttpClient,
        private snackBar : SnackBarService,
        private router   : Router,
    ) {
    }

    public get(uri: string, params: any = {}): Observable<any> {
        let url = environment.apiEndpoint + uri;
        let strParams = stringify(params);
        if (strParams) {
            url += '?' + strParams;
        }

        return this.handle(this.http.get(url, {
            observe: 'body',
        }));
    }

    public getData(uri: string, params: any = {}) {
        return this.get(uri, params).pipe(map((result:any)=>result)).toPromise();
    }

    public post(uri: string, body: any, options?: any): Promise<any> {
        return this.handle(
            this.http.post(
                environment.apiEndpoint + uri,
                this.getEncodedBody(body),
                options
            )
        ).toPromise();
    }

    public put(uri: string, body: any, options?: any): Promise<any> {
        return this.handle(
            this.http.put(
                environment.apiEndpoint + uri,
                this.getEncodedBody(body),
                options
            )
        ).toPromise();
    }

    public patch(uri: string, body:any, options?:any): Promise<any> {
        return this.handle(
            this.http.patch(
                environment.apiEndpoint + uri,
                this.getEncodedBody(body),
                options
            )
        ).toPromise();
    }

    public delete(uri: string): Promise<any> {
        return this.handle(this.http.delete(environment.apiEndpoint + uri)).toPromise();
    }

    private getEncodedBody(data: any): any {
        return (new QsSerializer)
            .serialize(data)
            .filter(v => v.value instanceof File)
            .length > 0 ?
                this.getEncodedBodyWithFile(data) :
                data;
    }

    private getEncodedBodyWithFile(data: any): FormData {
        let body = new FormData();
        (new QsSerializer).serialize(data).forEach(item => {
            body.append(item.name, item.value);
        });

        return body;
    }

    private handle(o: Observable<any>): Observable<ArrayBuffer> {
        return o.pipe(catchError((e: HttpErrorResponse)=> {
            if (e.status === 422 && this.mostrarMensajes){
                this.snackBar.show(e.error.message);
            }
            if (e.status === 401 && this.mostrarMensajes) {
                this.snackBar.show(e.error.message);
                window.scroll(0,0);   
            }
            if (e.status === 403 && this.mostrarMensajes){
                this.snackBar.show(e.error.message||e.error.error);
            }
            return throwError(e);
        }));
    }

}
