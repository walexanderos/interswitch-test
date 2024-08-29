import { BadRequestException, Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AppConfigModule } from '../app/app.module';
import { HttpConfigService } from './http.service';

@Module({
  imports: [
    HttpModule,
    AppConfigModule
  ],
  providers: [HttpConfigService],
  exports: [HttpConfigService]
})
export class HttpConfigModule {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  public onModuleInit(): any {
    const axios = this.httpService.axiosRef;

    axios.interceptors.response.use(
      (response) => {
        console.log(response);
        
        return response;
      },
      (error) => {
        console.log(error);
      }
    )
  }
}
