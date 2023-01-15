// App libraries
//import { RouteGuard             } from '../auth/route.guard';

// App Services
import { ApiService             } from './services/api.service';
import { AccessTokenInterceptor } from './interceptors/access-token.interceptor';
import { ConfirmService         } from './services/confirm.service';
import { DeviceService          } from './services/device.service';
import { SnackBarService        } from './services/snack-bar.service';
import { SpinnerService         } from './services/spinner.service';

// Angular
// Core
import { ModuleWithProviders    } from '@angular/core';
import { NO_ERRORS_SCHEMA       } from '@angular/core';
import { NgModule               } from '@angular/core';

// Others
import { HTTP_INTERCEPTORS      } from '@angular/common/http';
import { MatPaginatorIntl       } from '@angular/material/paginator';

// Modules
import { CommonModule           } from '@angular/common';
import { FormsModule            } from '@angular/forms';
import { MatTabsModule          } from '@angular/material/tabs';
import { ReactiveFormsModule    } from '@angular/forms';
import { RouterModule           } from '@angular/router';

// Material
import { MatAutocompleteModule    } from '@angular/material/autocomplete';
import { MatButtonModule          } from '@angular/material/button';
import { MatCardModule            } from '@angular/material/card';
import { MatCheckboxModule        } from '@angular/material/checkbox';
import { MatChipsModule           } from '@angular/material/chips';
import { MatDialogModule          } from '@angular/material/dialog';
import { MatDividerModule         } from '@angular/material/divider';
import { MatFormFieldModule       } from '@angular/material/form-field';
import { MatIconModule            } from '@angular/material/icon';
import { MatInputModule           } from '@angular/material/input';
import { MatListModule            } from '@angular/material/list';
import { MatMenuModule            } from '@angular/material/menu';
import { MatPaginatorModule       } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule           } from '@angular/material/radio';
import { MatNativeDateModule, MatRippleModule          } from '@angular/material/core';
import { MatSelectModule          } from '@angular/material/select';
import { MatSidenavModule         } from '@angular/material/sidenav';
import { MatSnackBarModule        } from '@angular/material/snack-bar';
import { MatSlideToggleModule     } from '@angular/material/slide-toggle';
import { MatTableModule           } from '@angular/material/table';
import { MatToolbarModule         } from '@angular/material/toolbar';
import { MatExpansionModule       } from '@angular/material/expansion';
import { MatDatepickerModule      } from '@angular/material/datepicker';

//Componentes
import { ConfirmComponent } from './components/confirm/confirm.component';
import { MenuComponent } from './components/menu/menu.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
	providers: [
        SpinnerService,
    ],
	declarations: [
        MenuComponent,
        ConfirmComponent,
        SpinnerComponent,
    ],
	imports: [
        ApiService,
        CommonModule,
        ConfirmService,
        FormsModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatExpansionModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatTabsModule,
        MatTableModule,
        MatToolbarModule,
        MatSelectModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        RouterModule,
        SnackBarService,
    ],
    exports: [
        ApiService,
        ConfirmService,
        CommonModule,
        DeviceService,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDividerModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        MatPaginatorModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatTabsModule,
        MatTableModule,
        ReactiveFormsModule,
        SnackBarService,
        SpinnerService, 
        MatNativeDateModule,
        MenuComponent,
        ConfirmComponent,
        SpinnerComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
    ]
})
export class SharedModule { }
