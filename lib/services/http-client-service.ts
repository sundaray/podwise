import {Config, Effect} from "effect"
import {FetchHttpClient, HttpApiClient} from "@effect/platform"
import { PodwiseApi } from "@/lib/api";


class HttpClientService extends Effect.Service<HttpClientService>()("HttpClientService", {
    effect: Effect.gen(function*() {
        const baseUrl = yield* Config.string("NEXT_PUBLIC_APP_URL")

        return yield* HttpApiClient.make(PodwiseApi, {
            baseUrl
        })
    }),
    dependencies: [FetchHttpClient.layer]
}){}    