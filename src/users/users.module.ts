import { Module, MiddlewareConsumer } from '@nestjs/common';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/users/auth.service';
import { User } from 'src/users/user.entity';
// import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';
import { CurrentUserMiddleware } from 'src/users/middlewares/currrent-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    // { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
