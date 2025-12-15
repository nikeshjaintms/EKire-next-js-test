'use client'

import Head from "next/head";
import { SessionProvider } from "next-auth/react";

import "../../public/assets/vendor/fontawesome/css/all.css";
import "../../public/assets/vendor/ionio-icon/css/iconoir.css";
import "../../public/assets/css/themify-icons.css";
import "../../public/assets/vendor/animation/animate.min.css";
import "../../public/assets/vendor/tabler-icons/tabler-icons.css";
import "../../public/assets/vendor/flag-icons-master/flag-icon.css";
import "../../public/assets/vendor/bootstrap/bootstrap.min.css";
import "../../public/assets/vendor/apexcharts/apexcharts.css";
import "../../public/assets/vendor/simplebar/simplebar.css";
import "../../public/assets/vendor/slick/slick.css";
import "../../public/assets/vendor/slick/slick-theme.css";
import "../../public/assets/vendor/filepond/filepond.css";
import "../../public/assets/vendor/filepond/image-preview.min.css";
import "../../public/assets/css/style.css";
import "../../public/assets/css/responsive.css";
import "../../public/assets/vendor/tabler-icons/tabler-icons.css";
import "../../public/assets/vendor/datatable/jquery.dataTables.min.css";
import "../../public/assets/vendor/flag-icons-master/flag-icon.css";
import "../../public/assets/vendor/prism/prism.min.css";
import "../../public/assets/vendor/nouislider/nouislider.min.css";




import "./globals.css";
import PageWrapper from "@/components/PageWrapper";
import ClientScripts from "../components/ClientScripts";
import Script from "next/script";
import TawkChat from "@/components/TawkChat";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
            </Head>
            <body >
            <SessionProvider>
                <PageWrapper>
                    {children}
                    <ClientScripts />
                    
                    <Script rel="preload" src="/assets/js/script.js" strategy="lazyOnload" />
                    <Script src="../assets/vendor/listJs/list-jquery.min.js"/>
                    <Script src="../assets/vendor/listJs/list.min.js"/>
                    <Script src="../assets/js/list_js.js" />
                    <TawkChat/>
                    
                </PageWrapper>
            </SessionProvider>
            </body>
        </html>
    );
}
