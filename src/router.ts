import { IncomingMessage, ServerResponse } from 'http';
import Url from './url.js';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface IRoute {
  method: HttpMethod,
  url: string,
  processor: Function,
}

export interface IProcessResult<T> {
  data: T,
  responseCode: number,
}

export class Router {
  private routes: IRoute[];

  constructor() {
    this.routes = [];
  }

  public process = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
      const url: Url = new Url(req.url);
      const { processor } = this.getRoute(req.method as HttpMethod, url);
      const { data, responseCode } = await processor.call(null, req, res, url);

      res.writeHead(responseCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`Resourse ${req.url} is not found\n${(err as Error).stack}`);
    }
  }

  private getRoute(method: HttpMethod, url: Url): IRoute {
    const route = this.routes.find((r: IRoute) => r.method === method && url.compare(r.url));
    if (route === undefined) {
      throw new Error(`Route ${JSON.stringify(url)} no found`);
    }
    return route;
  }

  public onError(req: IncomingMessage, res: ServerResponse, err: Error) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end(`Resourse ${req.url} is not found\n${err.stack}`);
  }

  public onSuccess<T>(res: ServerResponse, data: T): void {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  private addRoute(route: IRoute) {
    this.routes.push(route);
  }

  public get(url: string, processor: Function): void {
    this.addRoute({ method: HttpMethod.GET, url, processor });
  }
  
  public post(url: string, processor: Function): void {
    this.addRoute({ method: HttpMethod.POST, url, processor });
  }

  // put() {

  // }

  // delete() {

  // }
}