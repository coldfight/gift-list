import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs-page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "gifts",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../gift-list/gift-list.module").then(
                m => m.GiftListPageModule
              )
          },
          {
            path: "new",
            children: [
              {
                path: "",
                loadChildren: () =>
                  import("../gift-new/gift-new.module").then(
                    m => m.GiftNewPageModule
                  )
              },
              {
                path: "recipients/new",
                loadChildren: () =>
                  import("../recipient-new/recipient-new.module").then(
                    m => m.RecipientNewPageModule
                  )
              }
            ]
          },
          {
            path: "edit/:id",
            loadChildren: () =>
              import("../gift-edit/gift-edit.module").then(
                m => m.GiftEditPageModule
              )
          }
        ]
      },
      {
        path: "recipients",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../recipient-list/recipient-list.module").then(
                m => m.RecipientListPageModule
              )
          },
          {
            path: "new",
            loadChildren: () =>
              import("../recipient-new/recipient-new.module").then(
                m => m.RecipientNewPageModule
              )
          },
          {
            path: "edit/:id",
            loadChildren: () =>
              import("../recipient-edit/recipient-edit.module").then(
                m => m.RecipientEditPageModule
              )
          }
        ]
      },
      {
        path: "",
        redirectTo: "/app/tabs/gifts",
        pathMatch: "full"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
