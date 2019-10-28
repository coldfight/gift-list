import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs-page";
import { SchedulePage } from "../schedule/schedule";

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
            loadChildren: () =>
              import("../gift-new/gift-new.module").then(
                m => m.GiftNewPageModule
              )
          }
        ]
      },
      {
        path: "persons",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../person-list/person-list.module").then(
                m => m.PersonListPageModule
              )
          }
        ]
      },
      {
        path: "schedule",
        children: [
          {
            path: "",
            component: SchedulePage
          },
          {
            path: "session/:sessionId",
            loadChildren: () =>
              import("../session-detail/session-detail.module").then(
                m => m.SessionDetailModule
              )
          }
        ]
      },
      {
        path: "speakers",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../speaker-list/speaker-list.module").then(
                m => m.SpeakerListModule
              )
          },
          {
            path: "session/:sessionId",
            loadChildren: () =>
              import("../session-detail/session-detail.module").then(
                m => m.SessionDetailModule
              )
          },
          {
            path: "speaker-details/:speakerId",
            loadChildren: () =>
              import("../speaker-detail/speaker-detail.module").then(
                m => m.SpeakerDetailModule
              )
          }
        ]
      },
      {
        path: "",
        redirectTo: "/app/tabs/schedule",
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
