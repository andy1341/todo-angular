import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Project } from '../models/project';
import { Angular2TokenService } from 'angular2-token';

@Injectable()
export class ProjectService {
  private url = 'api/v1/projects';  // URL to web api

  constructor(private auth: Angular2TokenService) {
  }

  getProjects(): Promise<Array<Project>> {
    return this.auth.get(this.url).toPromise().then((response) => {
        return Project.collection(response.json());
      }).catch(this.handleError);
  }

  getProject(id: number): Promise<Project> {
    return this.auth.get(this.url + `/${id}`).toPromise().then((response) => {
      return new Project(response.json().data);
    }).catch(this.handleError);
  }

  save(project: Project): Promise<Project> {
    return project.id ? this.put(project) : this.post(project);
  }

  delete(project: Project): Promise<Response> {
    const url = `${this.url}/${project.id}`;

    return this.auth.delete(url).toPromise().catch(this.handleError);
  }

  // Add new Project
  private post(project: Project): Promise<Project> {
    return this.auth.post(this.url, {project: project})
      .toPromise()
      .then(res => new Project(res.json()))
      .catch(this.handleError);
  }

  // Update existing Project
  private put(project: Project): Promise<Project> {
    const url = `${this.url}/${project.id}`;

    return this.auth.put(url, {project: project}).toPromise().catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error.json().errors);
  }
}
