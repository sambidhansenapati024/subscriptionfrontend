import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { AuthGuard } from './auth.guard';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';



const routes: Routes = [
  {path:"log-in",component:LogInComponent},
   {path:"list-subsc",component:ListComponent,canActivate:[AuthGuard]},
   {path:"update-subsc/:id/:userName/:modeOfPayment",component:UpdateComponent,canActivate:[AuthGuard]},
   {path:"create-subsc",component:CreateComponent,canActivate:[AuthGuard]},
  {path:"",redirectTo:"log-in",pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
