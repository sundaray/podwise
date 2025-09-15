import { Layer, ManagedRuntime } from "effect";

import { DatabaseService } from "@/lib/services/database-service";
import { EmailService } from "@/lib/services/email-service";

const EmailServiceLayer = EmailService.Default;
const DatabaseServiceLayer = DatabaseService.Default;

const AppLayer = Layer.mergeAll(EmailServiceLayer, DatabaseServiceLayer);

export const serverRuntime = ManagedRuntime.make(AppLayer);
