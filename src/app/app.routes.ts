// DEPENDENCIES
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { LoginComponent } from './core/login/login.component';
//COMPONENTS
import { PlaylistCreatorComponent } from './pages/playlistcreator/playlistcreator.component';
import { TrackListComponent } from './pages/tracklist/tracklist.component';
import { DevicesComponent } from './pages/devices/devices.component';
import { UsersComponent } from './pages/users/users.component';
import { PermissionGuard } from './core/guards/core/guards/permission.guard';
import { LicensesComponent } from './pages/licenses/licenses.component';
export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: PlaylistCreatorComponent, canActivate: [PermissionGuard], data: { permission: 'p1' } },
            { path: 'tracklist', component: TrackListComponent, canActivate: [PermissionGuard], data: { permission: 'p2' } },
            { path: 'devices', component: DevicesComponent, canActivate: [PermissionGuard], data: { permission: 'p3' } },
            { path: 'users', component: UsersComponent, canActivate: [PermissionGuard], data: { permission: 'p4' } },
            { path: 'licenses', component: LicensesComponent, canActivate: [PermissionGuard], data: { permission: 'p1' } },
        ]
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
        ]
    },

    // ✅ Wildcard route: redirect unknown paths to login
    { path: '**', redirectTo: 'auth/login' }
];
