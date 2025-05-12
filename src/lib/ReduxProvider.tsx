// src/components/ReduxProvider.tsx
"use client"; 

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { Suspense } from "react";
import Loader from "@/app/loading";
import { Toaster } from "sonner";
import AuthWrapper from "./AuthWrapper";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <AuthWrapper>{children}</AuthWrapper>
        <Toaster richColors closeButton />
      </Suspense>
    </Provider>
  );
}
