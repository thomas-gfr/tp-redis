import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IUser } from '../../interfaces/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserApiService {
    constructor(private readonly _http: HttpClient) {
        this.getUsersList = this.getUsersList.bind(this);
    }

    public getUsersList(params?: object, customRoute?: string): Observable<IUser[]> {
        environment.httpOptions.params = new HttpParams();
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value !== null && value !== undefined) environment.httpOptions.params = environment.httpOptions.params.append(key, value);
            }
        }
        const route = customRoute || '/index.php?all=true';
        return this._http.get<IUser[]>(environment.BASE_API + route, environment.httpOptions);
    }

    public getUserById(id: number): Observable<IUser> {
        environment.httpOptions.params = new HttpParams();
        return this._http.get<IUser>(environment.BASE_API + '/index.php?uuid=' + id, environment.httpOptions);
    }

    public createUser(body: IUser): Observable<IUser> {
        environment.httpOptions.params = new HttpParams();
        return this._http.post<IUser>(environment.BASE_API + '/index.php', body, environment.httpOptions);
    }

    public updateUser(body: IUser): Observable<IUser> {
        environment.httpOptions.params = new HttpParams();
        return this._http.put<IUser>(environment.BASE_API + '/index.php?modifyUser=true', body, environment.httpOptions);
    }

    public deleteUser(id: number): Observable<void> {
        environment.httpOptions.params = new HttpParams();
        return this._http.delete<void>(environment.BASE_API + '/index.php/' + id, environment.httpOptions);
    }
}
