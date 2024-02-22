import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Submission, SubmissionJSON } from 'src/domain/Submission';
import { Endpoints, constructBackendRequest } from '../util/http-helper';
import { Observable, map } from 'rxjs';

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

  /**
   * Retrieves the latest submission for a task
   */
  getLatestSubmission(taskId: number): Observable<Submission> {
    return this.http.get<SubmissionJSON>(constructBackendRequest(`${Endpoints.SUBMISSION}/${taskId}`))
      .pipe(map((s) => new Submission(s)));
  }
}