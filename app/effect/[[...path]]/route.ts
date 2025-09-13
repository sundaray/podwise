import { HttpApiBuilder, HttpServer } from "@effect/platform";
import { Layer } from "effect";
import { mainLayer } from "@/app/effect/server";

const WebHandlerLayer = Layer.mergeAll(mainLayer, HttpServer.layerContext)

const { handler } = HttpApiBuilder.toWebHandler(WebHandlerLayer);

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
  handler as HEAD,
  handler as OPTIONS,
};