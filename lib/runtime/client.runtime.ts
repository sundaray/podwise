
import { ManagedRuntime } from "effect";
import { HttpClientService } from "@/lib/services/http-client-service";

const AppLayer = HttpClientService.Default;

export const clientRuntime = ManagedRuntime.make(AppLayer);