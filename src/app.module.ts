import { Module } from '@nestjs/common';
import {RouterModule} from "@nestjs/core";
import { SignupModule } from "./signup/signup.module";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./auth/auth.module";
import {UsersModule} from "./users/users.module";
import {PhotoModule} from "./photo/photo.module";

@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: ".env"
      }),
      MikroOrmModule.forRoot({
          dbName: process.env.DB_NAME,
          port: Number(process.env.DB_PORT),
          password: process.env.DB_PASSWORD,
          type: "mysql",
          autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITY === "true",
          forceUtcTimezone: true
      }),
      SignupModule,
      AuthModule,
      UsersModule,
      PhotoModule,
      RouterModule.register([
        {
          path: "/api/signup",
          module: SignupModule
        },
        {
            path: "/api/auth",
            module: AuthModule
        },
        {
            path: "/api/users",
            module: UsersModule
        },
        {
            path: "/api/photo",
            module: PhotoModule
        }
      ])
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
