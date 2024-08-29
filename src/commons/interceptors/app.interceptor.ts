import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class AppInterceptor implements NestInterceptor {
  constructor() {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
        return next.handle().pipe(
            tap({
              next :() => {},
              error : (error: any) =>{
                console.log(error)
              }
          })
        );
    }
}