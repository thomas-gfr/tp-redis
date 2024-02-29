import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserApiService } from '../../../shared/services/api/user-api.service';
import { finalize, tap } from 'rxjs';
import { IUser } from '../../../shared/interfaces/user.model';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AfterContentInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit{
    public user: IUser;

    public form: UntypedFormGroup;

    constructor(
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _userApiService: UserApiService,
        private readonly _formBuilder: FormBuilder,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this._activatedRoute.params.pipe(
            tap((params) => this._getUser(params['id']))
        ).subscribe()
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            age: [this.user?.age || null],
            email: [this.user?.email || null],
            firstName: [this.user?.firstName || null],
            id: [this.user?.id || null],
            job: [this.user?.job || null],
            lastName: [this.user?.lastName || null],
        })
    }

    private _getUser(id: number): void {
        this._userApiService.getUserById(id).pipe(
            tap((user) => {
                this.user = user
                this._initForm()
            })
        ).subscribe()
    }

    public onSave(): void {
        console.log(this.form)
        if (this.form.valid) {
            this._userApiService.updateUser(this.form.value).pipe(
                finalize(() => this._router.navigate(['/']))
            ).subscribe()
        }
    }

    public onCancel(): void {
    }
}
