import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../_services/busy.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  busyService.busy(); //start busyService when the request is about to go out

  //when request is complete and it comes back, set delay(1sec) and finalize() to stop loading spinner
  return next(req).pipe(
    delay(1000),
    finalize(() => busyService.idle())
  );
};
