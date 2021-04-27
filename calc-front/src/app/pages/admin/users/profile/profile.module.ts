import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { ProfileService } from 'src/app/pages/admin/users/profile/profile.service';
import { ProfileComponent } from 'src/app/pages/admin/users/profile/profile.component';
import { IndividualComponent } from './tabs/individual/individual.component';
import { ContentComponent } from './tabs/content/content.component';

const routes = [
    {
        path     : '**',
        component: ProfileComponent,
        resolve  : {
            profile: ProfileService
        }
    }
];

@NgModule({
    declarations: [
        ProfileComponent,
        IndividualComponent,
        ContentComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        SharedModule
    ],
    providers   : [
        ProfileService
    ]
})
export class ProfileModule
{
}
