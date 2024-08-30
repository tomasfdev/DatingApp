import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { of, tap } from 'rxjs';

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
}
