import { Module } from "@nestjs/common";
import { Fido2PasskeyClient } from "./passkey/fido2-passkey.client";
import { TYPES } from "src/common/types";
import { LocalUserRepository } from "./repository/local-user.repository";

@Module({
  providers: [
    {
      provide: TYPES.PasskeyClientType,
      useClass: Fido2PasskeyClient,
    },
    {
      provide: TYPES.LocalUserRepository,
      useClass: LocalUserRepository,
    },
  ],
  exports: [
    {
      provide: TYPES.PasskeyClientType,
      useClass: Fido2PasskeyClient,
    },
    {
      provide: TYPES.LocalUserRepository,
      useClass: LocalUserRepository,
    },
  ],

})
export class ClientModule {}
