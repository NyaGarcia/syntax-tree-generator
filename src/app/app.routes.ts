import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { TreeComponent } from './tree/components/tree/tree.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { grammarGuard } from '../grammar/guards/grammar.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'tree', component: TreeComponent, canActivate: [grammarGuard] },
  { path: '**', redirectTo: '' },
];

export const appRouter = provideRouter(routes);
