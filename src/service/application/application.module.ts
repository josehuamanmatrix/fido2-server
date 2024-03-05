import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { ClientModule } from "../clients/clients.module";
import { UserService } from "./user.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  providers: [AuthenticationService, UserService],
  exports: [AuthenticationService, UserService],
  imports: [
    ClientModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: "60s",
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
  ],
})
export class ApplicationModule {}
