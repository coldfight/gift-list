import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/app/tabs/schedule",
    pathMatch: "full"
  },
  {
    path: "account",
    loadChildren: () =>
      import("./pages/account/account.module").then(m => m.AccountModule)
  },
  {
    path: "support",
    loadChildren: () =>
      import("./pages/support/support.module").then(m => m.SupportModule)
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
  },
  {
    path: "gift-list",
    loadChildren: () =>
      import("./pages/gift-list/gift-list.module").then(
        m => m.GiftListPageModule
      )
  },
  {
    path: "gift-details",
    loadChildren: () =>
      import("./pages/gift-details/gift-details.module").then(
        m => m.GiftDetailsPageModule
      )
  },
  {
    path: "gift-edit",
    loadChildren: () =>
      import("./pages/gift-edit/gift-edit.module").then(
        m => m.GiftEditPageModule
      )
  },
  {
    path: "person-list",
    loadChildren: () =>
      import("./pages/person-list/person-list.module").then(
        m => m.PersonListPageModule
      )
  },
  {
    path: "person-details",
    loadChildren: () =>
      import("./pages/person-details/person-details.module").then(
        m => m.PersonDetailsPageModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
