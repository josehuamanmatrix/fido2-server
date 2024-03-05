import { Module } from "@nestjs/common";
import { ControllerModule } from "./interface/controllers/controller.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ControllerModule, AbortController],
})
export class AppModule {}
