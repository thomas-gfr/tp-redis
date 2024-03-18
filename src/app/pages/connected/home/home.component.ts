import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { IUser } from '../../../shared/interfaces/user.model';
import { UserApiService } from '../../../shared/services/api/user-api.service';
import { Subscription, finalize, tap } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { PasswordPipe } from '../../../shared/pipe/password.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TableModule,
    HttpClientModule,
    ButtonModule,
    PasswordPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy{
    public users: IUser[]= [];
    private _subs = new Subscription();

    constructor(
        private readonly _userApiService: UserApiService,
        private readonly _router: Router,
    ) {}

    ngOnInit() {
        this.getUsers();
    }

    ngOnDestroy(): void {
        this._subs.unsubscribe()
    }

    private getUsers(): void {
        this._subs.add(
            this._userApiService.getUsersList().pipe(
                tap((users: IUser[]) => this.users = users)
            ).subscribe()
        )
    }

    public editUser(user: IUser): void{
        this._router.navigate(['/edit-user/'+ user.id])
    }

    public deleteUser(user: IUser): void{
        this._subs.add(
            this._userApiService.deleteUser(user.id).pipe(
                finalize(() => this.getUsers())
            ).subscribe()
        )
    }

    public onCreateUser(): void{
        this._router.navigate(['/create-user'])
    }
}