// app/forgot_pwd/page.jsx
"use client";

import React, { Suspense } from "react";
import ForgotPwd from "./ForgotPwd"; // adjust the import path if needed

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPwd />
    </Suspense>
  );
}
