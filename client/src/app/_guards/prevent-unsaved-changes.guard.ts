import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

//get access to the MemberEditComponent using type<MemberEditComponent>, and using component as param
export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component) => {
  //access to the component property, editForm
  if (component.editForm?.dirty) {
    return confirm('Are you sure you want to continue? Any unsaved changes will be lost!');
  }
  return true;
};
