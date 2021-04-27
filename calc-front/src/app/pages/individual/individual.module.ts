import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AuthGuard } from 'src/app/utils/guard/auth.guard';
// import { MatButtonModule, MatFormFieldModule, MatIconModule,MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule, MatExpansionModule, MatDatepickerModule, MatGridListModule, MatSelectModule, MatCheckboxModule, MatProgressSpinnerModule, MatTabsModule, MatCardModule} from '@angular/material';
import { OverviewComponent } from './overview/overview.component';
import { BasisComponent } from './basis/basis.component';
import { IndividualComponent } from './individual/individual.component';
import { SpecialComponent } from './special/special.component';
import { HouseholdComponent } from './household/household.component';
import { LivingspaceComponent } from './livingspace/livingspace.component';
import { ProjectcostComponent } from './projectcost/projectcost.component';
import { DocumentsComponent } from './documents/documents.component';
const routes = [
    {
        path        : '',
        redirectTo: 'basis',
        pathMatch: 'full',
    },
    {
        path        : 'basis',
        component: BasisComponent
    },
    {
        path        : 'individual',
        component: IndividualComponent
    },
    {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
            {
                path        : 'special',
                component: SpecialComponent
            },
            {
                path        : 'household',
                component: HouseholdComponent
            },
            {
                path        : 'livingspace',
                component: LivingspaceComponent
            },
            {
                path        : 'projectcost',
                component: ProjectcostComponent
            },
            {
                path        : 'documents',
                component: DocumentsComponent
            },
            {
                path        : '**',
                component: OverviewComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgCircleProgressModule.forRoot({
            // set defaults here
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: "#78C000",
            innerStrokeColor: "#C7E596",
            animationDuration: 300
        })
    ],
    declarations: [
        OverviewComponent,
        BasisComponent,
        IndividualComponent,
        SpecialComponent,
        HouseholdComponent,
        LivingspaceComponent,
        ProjectcostComponent,
        DocumentsComponent
    ]
})
export class IndividualModule
{
    
}
