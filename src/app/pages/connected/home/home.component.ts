import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { IUser } from '../../../shared/interfaces/user.model';
import { UserApiService } from '../../../shared/services/api/user-api.service';
import { tap } from 'rxjs';
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
export class HomeComponent implements OnInit{
    public users: IUser[]= [];

    constructor(
        private readonly userApiService: UserApiService,
        private readonly _router: Router,
    ) {}

    ngOnInit() {
        this.getUsers();
    }

    private getUsers(): void {
        this.userApiService.getUsersList().pipe(
            tap((users: IUser[]) => this.users = users)
        ).subscribe()
    }

    public editUser(user: IUser): void{
        this._router.navigate(['/edit-user/'+ user.id])
    }

    public deleteUser(user: IUser): void{

    }
    

}
