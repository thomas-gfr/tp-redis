import { Routes } from '@angular/router';
import { HomeComponent } from './pages/connected/home/home.component';
import { EditUserComponent } from './pages/connected/edit-user/edit-user.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'edit-user/:id',
        component: EditUserComponent,
    },
    {
        path: 'create-user',
        component: EditUserComponent,
        data: {
            isCreate: true,
        }
    },
    {
        path: '**',
        redirectTo: '/',
    }
];
