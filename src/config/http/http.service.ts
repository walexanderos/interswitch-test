import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map, Observable, pipe } from 'rxjs';
import { AppConfigService } from '../app/app.service';

@Injectable()
export class HttpConfigService {
  constructor(
    private readonly httpService: HttpService,
    private readonly appConfigService: AppConfigService,
  ) {}

  public async post(urlPath: string, data: any, headers: any = {}): Promise<any> {
    let resp = await this.httpService
    .post(
      `${urlPath}`,
      JSON.stringify(data),
      this.getResquestConfig(headers)
    )
    .pipe(
      map((body: any) => {
        return body?.data;
      }),
    );

    return await lastValueFrom(resp);
  }

  public async put(urlPath: string, data: any, headers: any = {}): Promise<any> {
    let resp = await this.httpService
      .put(
        `${urlPath}`,
        JSON.stringify(data),
        this.getResquestConfig(headers)
      )
      .pipe(
        map((body: any) => {
          return body?.data;
        }),
      );

      return await lastValueFrom(resp);
  }

  public async get(urlPath: string, headers: any = {}): Promise<any> {
    let resp = await this.httpService
      .get(
        `${urlPath}`,
        this.getResquestConfig(headers)
        )
      .pipe(
        map((body: any) => body?.data),
      );


    return await lastValueFrom(resp);
  }

  public async dynamic(config: any): Promise<any> {
    let resp = await this.httpService.request(config).pipe(
      map((body: any) => {
        return body?.data;
      }),
    );

    return await lastValueFrom(resp);
  }

  public getResquestConfig(header: any = {}): AxiosRequestConfig<any> {
      return {
        headers: {
            ...header
          }
    }
  }
}
