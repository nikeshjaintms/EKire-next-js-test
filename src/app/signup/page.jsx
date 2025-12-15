"use client";

import React, { Suspense } from "react";
import SignUp  from "./signup"; // Move actual logic to SignUpForm.jsx
// or if you want to keep everything in one file, you don't need this line

function SignUpWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUp />
    </Suspense>
  );
}

export default SignUpWrapper;