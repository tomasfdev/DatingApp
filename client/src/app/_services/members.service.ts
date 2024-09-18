import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { of, tap } from 'rxjs';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http = inject(HttpClient);
  members = signal<Member[]>([]);
  apiUrl = environment.apiUrl;

  getMembers() {
    return this.http.get<Member[]>(this.apiUrl + 'users').subscribe({
      next: (members) => this.members.set(members), //fills members signal with members from API
    });
  }

  getMember(username: string) {
    const member = this.members().find((x) => x.username === username); //find a username inside the members[] signal
    if (member !== undefined) return of(member); //return member as an observable so that other components can .subscribe({})

    return this.http.get<Member>(this.apiUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.apiUrl + 'users', member).pipe(
      tap(() => {
        //update members[] signal
        this.members.update((members) =>
          //loop over each member, find the one that matches member.username and replace that member with the new updated member(received as a param) and otherwise just return the existing member in the []. loop over .map()
          members.map((m) => (m.username === member.username ? member : m))
        );
      })
    );
  }

  setMainPhoto(photo: Photo) {
    return this.http
      .put(this.apiUrl + 'users/set-main-photo/' + photo.id, {})
      .pipe(
        tap(() => {
          //update members[] signal
          this.members.update((members) =>
            //loop over members using map() to check if the member(m) includes/have the photo/NewMainPhoto in his photos[]/photos gallery, and if it has, updates/set the new main photo
            members.map((m) => {
              if (m.photos.includes(photo)) {
                m.photoUrl = photo.url;
              }
              return m;
            })
          );
        })
      );
  }

  deletePhoto(photo: Photo) {
    return this.http
      .delete(this.apiUrl + 'users/delete-photo/' + photo.id)
      .pipe(
        tap(() => {
          //update members[] signal
          this.members.update((members) =>
            members.map((m) => {
              if (m.photos.includes(photo)) {
                m.photos = m.photos.filter((p) => p.id !== photo.id); //filter() returns photos[] without photoId(deleted photo)
              }
              return m;
            })
          );
        })
      );
  }
}
