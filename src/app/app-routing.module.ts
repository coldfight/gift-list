import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/app/tabs/schedule",
    pathMatch: "full"
  },
  {
    path: "gifts",
    loadChildren: () =>
      import("./pages/gift-list/gift-list.module").then(
        m => m.GiftListPageModule
      )
  },
  {
    path: "recipients",
    loadChildren: () =>
      import("./pages/recipient-list/recipient-list.module").then(
        m => m.RecipientListPageModule
      )
  },
  {
    path: "account",
    loadChildren: () =>
      import("./pages/account/account.module").then(m => m.AccountModule)
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
      import("./pages/tabs-page/tabs-page.module").then(m => m.TabsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
