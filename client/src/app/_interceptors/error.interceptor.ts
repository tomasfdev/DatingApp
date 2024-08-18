import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

//interceptor intercepts the http requests either on the way out or on the way back
//when the request is on its way back from the API it will intercept it and it will check if there is any errors with the http requests
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error) => {
      if (error) {
        switch (error.status) {
          case 400:
            //400 validation error bad request
            //the 400 validation error contains an errors array
            if (error.error.errors) {
              const modalStateErrors = [];
              for (const key in error.error.errors) {
                //inside errors[] there are keys such as Username, Password
                if (error.error.errors[key]) {
                  modalStateErrors.push(error.error.errors[key]);
                }
              }
              throw modalStateErrors.flat();
            } else {
              //normal bad request
              toastr.error(error.error, error.status);
            }
            break;
          case 401:
            toastr.error('Unauthorised', error.status);
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            const navigationExtras: NavigationExtras = {
              state: { error: error.error },
            };
            router.navigateByUrl('/server-error', navigationExtras);
            break;
          default:
            toastr.error('Something unexpected went wrong');
            break;
        }
      }
      throw error;
    })
  );
};
