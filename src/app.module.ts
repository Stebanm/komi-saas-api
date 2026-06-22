import { Module } from '@nestjs/common';

import { AppConfigModule, DatabaseModule } from './shared/infrastructure';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
