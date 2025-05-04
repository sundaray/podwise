"use client";

import { useRouter } from "nextjs-toploader/app";
import { RouterProvider } from "react-aria-components";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

type ClientProvidersProps = {
  children: React.ReactNode;
};

export function ClientProviders({ children }: ClientProvidersProps) {
  let router = useRouter();

  return <RouterProvider navigate={router.push}>{children}</RouterProvider>;
}
