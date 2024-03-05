import { Component, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/security/auth.service';
import { Role, User } from 'src/app/security/domain/user';
import { EditRoleConfirmationDialogComponent } from './edit-role-confirmation-dialog/edit-role-confirmation-dialog.component';

@Component({
  selector: 'app-edit-role-menu',
  templateUrl: './edit-role-menu.component.html',
  styleUrls: ['./edit-role-menu.component.less']
})
export class EditRoleMenuComponent {

  @Input() user!: User;

  user$: Observable<User | null>;

  emitter: EventEmitter<User> = new EventEmitter();

  readonly STUDENT = Role.Student;
  readonly ADMIN = Role.Admin;
  readonly FACULTY = Role.Faculty;

  constructor(
    private readonly authService: AuthService,
    private readonly dialog: MatDialog
  ) {
    this.user$ = authService.user$;
  }

  onSelection(role: Role) {
    this.dialog.open(EditRoleConfirmationDialogComponent, {data: {
      user: this.user,
      role: role,
    }});
  }

  canBeChanged(): Observable<boolean> {
    return this.authService.user$.pipe(
      map((curr) => {
        if (this.user.role === Role.Admin) {
          return curr?.hasSuperAdminPrivileges() ?? false;
        }

        if (this.user.email === curr?.email) return false;

        return curr?.hasAdminPrivileges() ?? false;
      })
    );
  }
}
