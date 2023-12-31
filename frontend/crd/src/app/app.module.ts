import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { GoogleLoginProvider, GoogleSigninButtonModule, SocialLoginModule } from '@abacritt/angularx-social-login';
import { MatCardModule } from "@angular/material/card";
import { DashboardModule } from "./dashboard/dashboard.module";
import { PortfolioModule } from "./portfolio/portfolio.module";
import { ApiDocumentationsComponent } from './api-documentations/api-documentations.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ProfileModule } from "./profile/profile.module";
import { MilestonesPageModule } from "./milestones-page/milestones-page.module";
import { OswegoLogoModule } from "./oswego-logo/oswego-logo.module";
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [
    AppComponent,
    ApiDocumentationsComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: "ce4bbce1-ee95-4991-8367-c180902da560", // Application (client) ID from the app registration
          authority:
            "https://login.microsoftonline.com/24e2ab17-fa32-435d-833f-93888ce006dd", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
          redirectUri: environment.redirectURI, // This is your redirect URI
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: false, // Set to true for Internet Explorer 11
        },
      }),
      {
        interactionType: InteractionType.Redirect
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map(),
      }
    ),
    SocialLoginModule,
    GoogleSigninButtonModule,
    DashboardModule,
    PortfolioModule,
    ProfileModule,
    MilestonesPageModule,
    MatCardModule,
    MatTabsModule,
    RouterModule,
    BrowserAnimationsModule,
    OswegoLogoModule,
    CarouselModule
  ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: true, //keeps the user signed in
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("10084452653-c2867pfh6lvpgoq09aoe4i71ijeshej6.apps.googleusercontent.com") // your client id
        }
      ]
    }
  }],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
