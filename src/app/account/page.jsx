"use client";
import { Suspense } from "react";
import Account from "./Account"; // rename your current component file to Account.jsx if needed

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Account />
    </Suspense>
  );
}
