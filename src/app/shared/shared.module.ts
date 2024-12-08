import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Material
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    // PrimeNG
    ButtonModule,
    TableModule,
    CardModule
  ],
  exports: [
    ReactiveFormsModule,
    // Material
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    // PrimeNG
    ButtonModule,
    TableModule,
    CardModule
  ]
})
export class SharedModule { } 