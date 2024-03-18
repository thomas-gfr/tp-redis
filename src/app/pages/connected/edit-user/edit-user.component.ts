import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserApiService } from '../../../shared/services/api/user-api.service';
import { Subscription, finalize, tap } from 'rxjs';
import { IUser } from '../../../shared/interfaces/user.model';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AfterContentInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { CountryApiService } from '../../../shared/services/api/coutry-api.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    AutoCompleteModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit, OnDestroy{
    public user: IUser;
    public filteredCountries: any[] | undefined
    public countries

    public form: UntypedFormGroup;
    private _subs = new Subscription();

    public get isCreate(): boolean {
        return this._activatedRoute.snapshot.data['isCreate']
    }

    constructor(
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _userApiService: UserApiService,
        private readonly _formBuilder: FormBuilder,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly countryService: CountryApiService
    ) {}

    ngOnInit() {
        if (!this.isCreate) {
            this._subs.add(
                this._activatedRoute.params.pipe(
                    tap((params) => this._getUser(params['id']))
                ).subscribe()
            )
        } else {
            this._initForm()
        }
    }

    ngOnDestroy(): void {
        this._subs.unsubscribe()
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            age: [this.user?.age || null],
            email: [this.user?.email || null],
            firstName: [this.user?.firstName || null],
            id: [this.user?.id || null],
            job: [this.user?.job || null],
            lastName: [this.user?.lastName || null],
            adresse: [this.user?.adresse || null],
            password: [null],
        })
    }

    private _getUser(id: number): void {
        this._subs.add(
            this._userApiService.getUserById(id).pipe(
                tap((user) => {
                    this.user = user
                    this._initForm()
                })
            ).subscribe()
        )
    }

    public getCoutry(address: string): void {
        if (address.length >= 3) {
            this._subs.add(
                this.countryService.getCountryList({q: address}).pipe(
                    tap((countries) => {
                        this.countries = countries;
                    })
                ).subscribe()
            )
        }
    }

    public filterCountry(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query;

        if (query.length>3) {
            for (let i = 0; i < (this.countries?.features as any[]).length; i++) {
                let country = (this.countries?.features as any[])[i];
                filtered.push({name: country?.properties?.label});
            }
            this.filteredCountries = filtered;
        }
    }

    public onSave(): void {
        if (this.form.valid) {
            if (this.form.controls['adresse']?.value) {
                this.form.controls['adresse'].setValue(this.form.controls['adresse'].value.name)
            }

            if (this.isCreate) {
                this._subs.add(
                    this._userApiService.createUser(this.form.value).pipe(
                        finalize(() => this._router.navigate(['/']))
                    ).subscribe()
                )
            } else {
                this._subs.add(
                    this._userApiService.updateUser(this.form.value).pipe(
                        finalize(() => this._router.navigate(['/']))
                    ).subscribe()
                )
            }
        }
    }

    public onDelete(): void {
        this._subs.add(
            this._userApiService.deleteUser(this.user.id).pipe(
                finalize(() => this._router.navigate(['/']))
            ).subscribe()
        )
    }

    public onCancel(): void {
        this._router.navigate(['/'])
    }
}
