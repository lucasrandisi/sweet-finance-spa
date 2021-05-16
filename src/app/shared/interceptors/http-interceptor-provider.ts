import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccessTokenInterceptor } from './access-token.interceptor';


/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AccessTokenInterceptor, multi: true },
];