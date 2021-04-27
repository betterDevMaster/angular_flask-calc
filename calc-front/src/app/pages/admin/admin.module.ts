import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
const routes = [
    {
        path        : 'users',
        loadChildren: './users/users.module#UsersModule'
    },
    {
        path        : 'languages',
        loadChildren: './languages/languages.module#LanguagesModule'
    },
    {
        path        : 'countries',
        loadChildren: './countries/countries.module#CountriesModule'
    },
    {
        path        : '**',
        loadChildren: './users/users.module#UsersModule'
    },
];

@NgModule({
    imports     : [
        RouterModule.forChild(routes),
    ],
    declarations: []
})
export class AdminModule
{
    
}
