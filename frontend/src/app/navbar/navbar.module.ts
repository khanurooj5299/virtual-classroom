import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from "@angular/router";

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { CountdownModule } from "ngx-countdown";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { NgxPrintModule } from "ngx-print";
import { NgxStarsModule } from "ngx-stars";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatBadgeModule } from '@angular/material/badge';

import { SideNavbarComponent } from "./side-navbar/side-navbar.component";
import { TopNavbarComponent } from "./top-navbar/top-navbar.component";
import { ChangePasswordDialogComponent } from "./side-navbar/change-password-dialog/change-password-dialog.component";


@NgModule({
    declarations: [
        SideNavbarComponent,
        TopNavbarComponent,
        ChangePasswordDialogComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatExpansionModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatRadioModule,
        MatSelectModule,
        MatTableModule,
        MatDialogModule,
        MatSidenavModule,
        MatMenuModule,
        CountdownModule,
        MatListModule,
        NgxStarsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatGridListModule,
        NgxPrintModule,
        RouterModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatBadgeModule
    ],
    exports: [
        SideNavbarComponent,
        TopNavbarComponent,
        CommonModule,
        FormsModule,
        MatExpansionModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatRadioModule,
        MatSelectModule,
        MatTableModule,
        MatDialogModule,
        MatSidenavModule,
        MatMenuModule,
        CountdownModule,
        MatListModule,
        NgxStarsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatGridListModule,
        NgxPrintModule,
        MatPaginatorModule,
        MatDatepickerModule
    ]
})
export class NavbarModule {}