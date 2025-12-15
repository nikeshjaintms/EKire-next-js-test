"use client";
// import Script from "next/script";
import "../../public/assets/css/themify-icons.css";
import { useEffect } from "react";
import $ from 'jquery'; 



const Footer = () => {

    useEffect(() => {
        $(".loader-wrapper").fadeOut("slow", () => {
          $(".loader-wrapper").remove();
        });
      }, []);

    return (
        <>
            <div className="go-top">
                <span className="progress-value">
                    <i className="ti ti-chevron-up" />
                </span>
            </div>
            
            <footer>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-9 col-12">
                            <ul className="footer-text">
                                <li>
                                    <p className="mb-0">Copyright © 2025 Ekire LTD All rights reserved 💖 </p>
                                </li>
                                <li><a href="#"> V1.0.0 </a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>

            <div id="customizer"></div>
{/* Loader */}
    <div className="loader-wrapper">
        <div className="app-loader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
            
        </>
    );
};

export default Footer;
