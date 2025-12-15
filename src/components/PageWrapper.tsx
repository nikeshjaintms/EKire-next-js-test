"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import $ from "jquery";  

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState<string | null>(pathname);

  useEffect(() => {

    if (pathname && prevPath !== pathname) {
      window.location.reload();
      setPrevPath(pathname);
    }
    $(document).ready(function () {
      $(".loader-wrapper").fadeOut("fast", function () {
        $(this).remove(); // Remove loader after fade out
      });
    });

    // $(document).ready(function() {
    //   $(".loader-wrapper").fadeOut("slow", function () {
    //     $(this).remove();  
    //   });
    // });


    
  }, [pathname]);

  
  const noLayoutRoutes = [ "/","/login", "/signup", "/forgot_pwd"];

  const hideLayout = pathname ? noLayoutRoutes.includes(pathname) : false;

  if (hideLayout) {
    return <>{children}</>;
  }

  

  return (
    <div className="app-wrapper">
      {/* Loader Wrapper */}
      <div className="loader-wrapper">
        <div className="app-loader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <Navbar />
      <div className="app-content">
        <Header />
        {children}
      </div>
      <Footer />
      {/* <Script rel="preload" src="/assets/js/slick.js" strategy="lazyOnload" /> */}
      
    </div>
  );
}
