import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./services/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/app/tabs/schedule",
    pathMatch: "full"
  },
  {
    path: "account",
    loadChildren: () =>
      import("./pages/account/account.module").then(m => m.AccountModule),
    canLoad: [AuthGuard]
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then(m => m.LoginModule)
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./pages/signup/signup.module").then(m => m.SignUpModule)
  },
  {
    path: "app",
    loadChildren: () =>
      import("./pages/tabs-page/tabs-page.module").then(m => m.TabsModule),
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
