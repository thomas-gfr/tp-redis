import { HttpHeaders, HttpParams } from '@angular/common/http';

export const environment = {
    production: false,
    build: true,
    BASE_API: 'https://apidev.form-dev.fr',
    httpOptions: {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        }),
        params: new HttpParams()
    },
    token: null,
};
