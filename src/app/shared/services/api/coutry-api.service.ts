import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CountryApiService {
    constructor(private readonly _http: HttpClient) {
        this.getCountryList = this.getCountryList.bind(this);
    }

    public getCountryList(params?: object, customRoute?: string): Observable<any[]> {
        environment.httpOptions.params = new HttpParams();
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value !== null && value !== undefined) environment.httpOptions.params = environment.httpOptions.params.append(key, value);
            }
        }
        const route = customRoute || 'https://api-adresse.data.gouv.fr/search/';
        return this._http.get<any[]>(route, environment.httpOptions);
    }
}