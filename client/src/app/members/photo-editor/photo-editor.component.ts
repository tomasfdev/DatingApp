import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../_models/member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../_services/account.service';
import { environment } from '../../../environments/environment';
import { Photo } from '../../_models/photo';
import { MembersService } from '../../_services/members.service';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, NgClass, FileUploadModule, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css',
})
export class PhotoEditorComponent implements OnInit {
  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  member = input.required<Member>(); //input prop, receive the prop from member-edit.component
  memberChange = output<Member>(); //output prop, send the prop to member-edit.component
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(event: any) {
    this.hasBaseDropZoneOver = event;
  }

  setMainPhoto(newMainPhoto: Photo) {
    this.memberService.setMainPhoto(newMainPhoto).subscribe({
      next: () => {
        const user = this.accountService.currentUser();
        //update accountService.currentUser()
        if (user) {
          user.photoUrl = newMainPhoto.url; //update the PhotoUrl prop of the main photo
          this.accountService.setCurrentUser(user); //update PhotoUrl prop(of the main photo)of the currentUser()signal to show the new updated main photo in the nav bar
        }
        //update member using the output prop
        const updatedMember = { ...this.member() }; //copy of input prop/signal member()
        updatedMember.photoUrl = newMainPhoto.url; //update photoUrl to the main photo photoUrl
        updatedMember.photos.forEach((p) => {
          if (p.isMain) p.isMain = false; //set false the old main photo
          if (p.id === newMainPhoto.id) p.isMain = true; //set the new main photo
        });
        this.memberChange.emit(updatedMember); //emit/send the updatedMember through memberChange with the new main photo
      },
    });
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo).subscribe({
      next: () => {
        const updatedMember = { ...this.member() };
        //filter() returns photos[] without photoId(deleted photo)
        updatedMember.photos = updatedMember.photos.filter(
          (p) => p.id !== photo.id
        );
        this.memberChange.emit(updatedMember);
      },
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.apiUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo = JSON.parse(response);
      const updatedMember = { ...this.member() }; //fills updatedMember with member()
      updatedMember.photos.push(photo); //add new photo
      this.memberChange.emit(updatedMember); //emit/send the event(updatedMember) to the member-edit.component
    };
  }
}
