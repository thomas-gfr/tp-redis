import { HttpHeaders, HttpParams } from '@angular/common/http';

export const environment = {
    production: true,
    build: true,
    BASE_API: 'https://apiv2.form-dev.fr',
    httpOptions: {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        }),
        params: new HttpParams()
    },
    token: null,
};
