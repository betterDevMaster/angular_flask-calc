import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatButtonToggleModule, MatFormFieldModule, MatIconModule,MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule, MatExpansionModule, MatDatepickerModule, MatGridListModule, MatSelectModule, MatRadioModule, MatCheckboxModule,MatSlideToggleModule, MatProgressSpinnerModule, MatTabsModule, MatCardModule, MatAutocompleteModule, MatTooltipModule, MatDialogModule, MatSnackBarModule, MatProgressBarModule, MatNativeDateModule} from '@angular/material';
import { VexModule } from '../@vex/vex.module';
import { BreadcrumbsModule } from '../@vex/components/breadcrumbs/breadcrumbs.module';
import { SecondaryToolbarModule } from '../@vex/components/secondary-toolbar/secondary-toolbar.module';
import { PageLayoutModule } from '../@vex/components/page-layout/page-layout.module';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import { IconModule } from '@visurel/iconify-angular';
import { ToastrModule } from 'ngx-toastr';
import { ColorFadeModule } from '../@vex/pipes/color/color-fade.module';
import { ContentDetailComponent } from 'src/app/pages/content-provider/content-detail/content-detail.component';
import { BasisDetailComponent } from 'src/app/pages/individual/basis/basis-detail/basis-detail.component';
import { DocumentsDetailComponent } from 'src/app/pages/individual/documents/documents-detail/documents-detail.component';
import { HouseholdDetailComponent } from 'src/app/pages/individual/household/household-detail/household-detail.component';
import { IndividualDetailComponent } from 'src/app/pages/individual/individual/individual-detail/individual-detail.component';
import { LivingspaceDetailComponent } from 'src/app/pages/individual/livingspace/livingspace-detail/livingspace-detail.component';
import { OverviewDetailComponent } from 'src/app/pages/individual/overview/overview-detail/overview-detail.component';
import { ProjectcostDetailComponent } from 'src/app/pages/individual/projectcost/projectcost-detail/projectcost-detail.component';
import { SpecialDetailComponent } from 'src/app/pages/individual/special/special-detail/special-detail.component';
import { ProfileAboutComponent } from 'src/app/pages/admin/users/profile/tabs/about/about.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SpinnersComponent } from 'src/@vex/components/spinner/spinners.component';
import {MatListModule} from '@angular/material/list';




@NgModule({
    declarations: [ContentDetailComponent,SpinnersComponent, BasisDetailComponent, DocumentsDetailComponent, HouseholdDetailComponent, IndividualDetailComponent, LivingspaceDetailComponent, OverviewDetailComponent, ProjectcostDetailComponent, SpecialDetailComponent, ProfileAboutComponent],
    imports  : [
        ToastrModule.forRoot(),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatListModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatIconModule,
        MatSortModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatGridListModule,
        MatSelectModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        MatTabsModule, 
        MatCardModule, 
        MatAutocompleteModule, 
        MatTooltipModule,
        CdkStepperModule,
        CdkTableModule,
        CdkTreeModule,
        MatDialogModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatNativeDateModule,
        IconModule,
        VexModule,
        BreadcrumbsModule,
        SecondaryToolbarModule,
        PageLayoutModule,
        ColorFadeModule,
        NgCircleProgressModule,
        NgxUiLoaderModule.forRoot(null),
    ],
    exports  : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatIconModule,
        MatSortModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatListModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatGridListModule,
        MatSelectModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        MatTabsModule, 
        MatCardModule, 
        MatAutocompleteModule, 
        MatTooltipModule,
        CdkStepperModule,
        CdkTableModule,
        CdkTreeModule,
        MatDialogModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatNativeDateModule,
        IconModule,
        VexModule,
        BreadcrumbsModule,
        SecondaryToolbarModule,
        PageLayoutModule,
        ColorFadeModule,
        ContentDetailComponent,
        BasisDetailComponent,
        DocumentsDetailComponent,
        HouseholdDetailComponent,
        IndividualDetailComponent,
        LivingspaceDetailComponent,
        OverviewDetailComponent,
        ProjectcostDetailComponent,
        SpecialDetailComponent,
        ProfileAboutComponent,
        NgCircleProgressModule,
        NgxUiLoaderModule,
        SpinnersComponent
    ]
})
export class SharedModule
{
}
