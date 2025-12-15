
"use client";
import Script from "next/script";
import { useEffect } from "react";
// import TawkChat from "./TwakChat"

const ClientScripts = () => {
    useEffect(() => {
        if (typeof window !== "undefined") {
            import("jquery").then(($) => {
                window.$ = window.jQuery = $;
                import("bootstrap");
            });
        }
    }, []);

    return (
        <>
            {/* ✅ jQuery - only load once */}
            <Script rel="preload" src="/assets/js/jquery-3.6.3.min.js" strategy="lazyOnload" />

            {/* ✅ Bootstrap & others */}
            <Script rel="preload" src="/assets/vendor/bootstrap/bootstrap.bundle.min.js" strategy="afterInteractive" />

            {/* <Script rel="preload" src="/assets/js/slick.js" strategy="lazyOnload" /> */}
            <Script rel="preload" src="/assets/vendor/slick/slick.min.js" strategy="lazyOnload" />
            
            
            {/* ✅ Vendor Scripts */}
            <Script rel="preload" src="/assets/vendor/simplebar/simplebar.js" strategy="" />
            <Script rel="preload" src="/assets/vendor/apexcharts/apexcharts.min.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/vendor/apexcharts/column/dayjs.min.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/vendor/apexcharts/column/quarterOfYear.min.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/vendor/apexcharts/timelinechart/moment.min.js" strategy="lazyOnload" />
            
            <Script rel="preload" src="/assets/vendor/animated_icon/iconify-icon.min.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/js/animated_icon.js" strategy="afterInteractive" />
            <Script rel="preload" src="/assets/vendor/phosphor/phosphor.js" strategy="lazyOnload" />
            
            <Script rel="preload" src="/assets/vendor/nouislider/nouislider.min.js" strategy="afterInteractive" />
            <Script rel="preload" src="/assets/vendor/nouislider/wNumb.min.js" strategy="lazyOnload" />

            {/* ✅ Filepond */}
            <Script rel="preload" src="/assets/vendor/filepond/file-encode.min.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/vendor/filepond/validate-size.min.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/vendor/filepond/validate-type.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/vendor/filepond/exif-orientation.min.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/vendor/filepond/image-preview.min.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/vendor/filepond/filepond.min.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/js/formvalidation.js" strategy="lazyOnload" />

            {/* ✅ SweetAlert */}
            <Script rel="preload" src="/assets/vendor/sweetalert/sweetalert.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/js/sweet_alert.js" strategy="lazyOnload" />

            {/* ❌ REMOVE this jQuery version */}
            {/* <Script rel="preload" src="/assets/vendor/datatable/jquery-3.5.1.js" strategy="lazyOnload" /> */}

            {/* ✅ DataTables */}
            <Script rel="preload" src="/assets/vendor/listJs/list-jquery.min.js" strategy="afterInteractive" />
            <Script rel="preload" src="/assets/vendor/listJs/list.min.js" strategy="afterInteractive" />
            <Script rel="preload" src="/assets/js/list_js.js" strategy="afterInteractive" />
            <Script rel="preload" src="/assets/vendor/datatable/jquery.dataTables.min.js" strategy="afterInteractive" />
            <Script rel="preload" src="/assets/js/data_table.js" strategy="afterInteractive" />

            <Script rel="preload" src="/assets/vendor/prism/prism.min.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/js/flag_icons.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/js/touchspin.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/js/range_slider.js" strategy="lazyOnload" />
            

            {/* ✅ Project Scripts */}
            
            <Script rel="preload" src="/assets/js/chat.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/js/area_charts.js" strategy="lazyOnload" />
            
            <Script rel="preload" src="/assets/js/project_dashboard.js" strategy="lazyOnload" />
            <Script rel="preload" src="/assets/js/script.js" strategy="lazyOnload" />
            
            <Script rel="preload" src="/assets/js/customizer.js" strategy="lazyOnload" />

            {/* <TawkChat/> */}

        </>
    );
};

export default ClientScripts;
