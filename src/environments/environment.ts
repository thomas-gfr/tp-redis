import { HttpHeaders, HttpParams } from '@angular/common/http';

export const environment = {
    production: false,
    build: false,
    BASE_API: '/api',
    httpOptions: {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        }),
        params: new HttpParams()
    },
    token: null,
};
