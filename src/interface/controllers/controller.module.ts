import { Module } from "@nestjs/common";
import { AuthenticationController } from "../controllers/authentication.controller";
import { ApplicationModule } from "src/service/application/application.module";
import { UserController } from "./user.controller";

@Module({
  controllers: [AuthenticationController, UserController],
  imports: [ApplicationModule],
})
export class ControllerModule {}
