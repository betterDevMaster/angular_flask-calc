import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'  
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) { 
  }
  success(message){
    this.toastr.success(message, 'Success', {
      closeButton: true,
      progressBar: true,
      timeOut: 5000,
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-center'
    });
  }
  error(message){
    Swal.fire('Error', message, 'error');
  }
  
  info(message){
    this.toastr.info(message, 'Info', {
      closeButton: true,
      disableTimeOut: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-center-center'
    })
  }
  warning(message){
    Swal.fire('Warning', message, 'warning');
  }  
}

