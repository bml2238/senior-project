import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Submission, SubmissionJSON } from 'src/domain/Submission';
import { Endpoints, constructBackendRequest } from '../util/http-helper';
import { Observable, catchError, map, of } from 'rxjs';

/**
 * Service to interact with artifacts
 */
@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(
    private readonly http: HttpClient
  ) { }

  /**
   * Submits a submission and returnes the submitted submission
   */
  submit(submission: Submission): Observable<Submission> {
    return this.http.post<SubmissionJSON>(constructBackendRequest(Endpoints.SUBMISSION), submission)
      .pipe(map((s) => new Submission(s)));
  }

  delete(submissionId: number): Observable<string> {
    return this.http.delete<string>(constructBackendRequest(`${Endpoints.SUBMISSION}/${submissionId}`));
  }

  /**
   * Retrieves the latest submission for a task
   */
  getLatestSubmission(taskId: number, userId: string = ''): Observable<Submission> {
    const endpoint = userId === '' ? constructBackendRequest(`${Endpoints.SUBMISSION}/${taskId}`) : 
      constructBackendRequest(`${Endpoints.SUBMISSION}/${taskId}`, {key: 'user', value: userId})
    return this.http.get<SubmissionJSON>(endpoint)
      .pipe(
        map((s) => new Submission(s)),
        catchError(() => of(Submission.makeEmpty())),
      );
  }

  /**
   * Retrieves all submissions for a given user
   */
  getStudentSubmissions(studentID: string): Observable<Submission[]> {
    return this.http.get<SubmissionJSON[]>(constructBackendRequest(`${Endpoints.ALL_SUBMISSIONS}`))
      .pipe(map((data: SubmissionJSON[]) => {
        return data.map((s: SubmissionJSON) => {
          return new Submission(s);
        });
      }));
  }

  /**
   * Faculty specific endpoint that retrieves all submissions for a given user
   */
  getStudentSubmissionsFaculty(studentID: string): Observable<Submission[]> {
    return this.http.get<SubmissionJSON[]>(constructBackendRequest(`${Endpoints.FACULTY_SUBMISSIONS}/${studentID}`))
      .pipe(map((data: SubmissionJSON[]) => {
        return data.map((s: SubmissionJSON) => {
          return new Submission(s);
        });
      }));
  }
}
