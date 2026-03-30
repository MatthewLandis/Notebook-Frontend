import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

interface INote {
  text: string;
  author?: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);

  // Overall state
  public reading = true;

  // Read state
  public note?: INote;
  public readLoading = true;
  public readError = false;

  // Write state
  public text = '';
  public author = '';
  public writeLoading = false;
  public writeErrorMessage = '';
  public writeSuccess = false;

  public ngOnInit(): void {
    this.getStory();
  }

  public getStory(): void {
    this.readLoading = true;
    (this.http.get<INote>(`${environment.apiUrl}/note`)).subscribe({
      next: (result: INote) => {
        this.note = result;
        this.readLoading = false;
      },
      error: () => {
        this.readError = true;
        this.readLoading = false;
      },
    });
  }

  public writeStory(): void {
    this.writeErrorMessage = '';

    if (this.text.length === 0) {
      this.writeErrorMessage = 'Your story is empty';
      return;
    }

    if (this.text.length > 10000) {
      this.writeErrorMessage = 'Your story cannot exceed 1000 characters';
      return;
    }

    this.writeLoading = true;

    (this.http.post(`${environment.apiUrl}/note`, { text: this.text, author: this.author })).subscribe({
      next: () => {
        this.writeSuccess = true;
        this.writeLoading = false;
      },
      error: () => {
        this.writeErrorMessage = 'An error occured while publishing your story';
        this.writeLoading = false;
      },
    });
  }
}
