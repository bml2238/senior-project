import {Component, Input, OnInit} from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../domain/user';
import { LangUtils } from 'src/app/util/lang-utils';
import {Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UserService} from "../user.service";
import {ScreenSizeService} from "../../util/screen-size.service";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.less']
})
export class UserMenuComponent implements OnInit {

  @Input() showAIButton$!: Observable<boolean>;
  user: User = User.makeEmpty();
  profileURL: string | null = null;
  displayName$: Observable<boolean>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly screenSizeSvc: ScreenSizeService,
    ) {
    this.displayName$ = screenSizeSvc.screenSize$.pipe(map(it => it > 830));
    this.authService.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
      if (LangUtils.exists(user)) {
        this.user = user!;
      }
    });
    this.userService.getProfilePicture()
      .subscribe((url) => {
        this.profileURL =url;
      });
  }


  ngOnInit(): void {

  }

  logout() {
    this.authService.signOut();
  }

  openSettings() {
    this.router.navigate(['/settings'])
      .then(success => {
        if (!success) {
          console.error('Navigation to settings failed')
        }
      });
  }
}
