"use client";
import React, { Fragment, useEffect, useState } from "react";
// import Head from "next/head";
// import Script from "next/script";
// import Typed from "typed.js";

const HomeLanding = () => {


    // auto load
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    // useEffect(() => {
    //     // Initialize typed
    //     const typed = new Typed("#highlight-typed", {
    //     strings: [
    //         '<span class="highlight-text">Work<span class="txt-shadow">Work</span></span>',
    //         '<span class="highlight-text">Goals<span class="txt-shadow">Goals</span></span>',
    //         '<span class="highlight-text">Projects<span class="txt-shadow">Projects</span></span>',
    //     ],
    //     typeSpeed: 100,
    //     backSpeed: 50,
    //     loop: true,
    //     });

    //     // Destroy on unmount to prevent memory leaks
    //     return () => {
    //     typed.destroy();
    //     };
    // }, []); 

    return (
        <Fragment>

            <div className="app-wrapper flex-column page-landing">

                <div className="landing-wrapper">

                    {/* Header start */}
                    <div className="navbar navbar-expand-lg sticky-top landing-nav_main px-3 position-fixed w-100">
                        <div className="container">
                            <a className="navbar-brand logo" href="/">
                                <img alt="#" src="/assets/images/ekire-logo-white.png" />
                            </a>
                            <button aria-controls="landing_nav" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler" data-bs-target="#landing_nav" data-bs-toggle="collapse" type="button">
                                <span className="navbar-toggler-icon" />
                            </button>
                            <div className="collapse navbar-collapse" id="landing_nav">
                                <ul className="navbar-nav m-auto">
                                    <li className="nav-item">
                                        <a className="nav-link" href="#about">About</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#deploy">Deploy </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#whyus">Why us</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#pricing">Pricing</a>
                                    </li>
                                </ul>
                                <a className="btn btn-primary ms-2 rounded" href="/login" >Console</a>
                            </div>
                        </div>
                    </div>
                    {/* Header end */}

                    {/* landing first section start */}
                    <section className="landing-section p-0">
                        <div className="container">
                            <div className="row align-items-center landing-content ">
                                <div className="col-lg-6 col-12">
                                    <div className="landing-heading">
                                        {/* <h1>
                                            Power Up Your <br />
                                            <span id="highlight-typed"></span> With axelit <br />
                                        </h1> */}
                                        <h1>A cloud platform built with the user in mind.</h1>
                                        {/* <img alt="shape" className="img-fluid landing-vector-shape" src="../assets/images/landing/vector-shaps.png" /> */}
                                        <p>Increase your productivity and set free of searching in complex systems; and focus on what truly matters.</p>
                                        <div className="mg-t-60">
                                            <a className="btn btn-primary btn-lg" href="/signup" role="button" target="_blank">Create an Account</a>
                                            <a className="btn btn-danger btn-lg ms-2" href="/login" role="button" target="_blank">Login</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                    <div className="landing-img">
                                        <img alt="shape" src="/assets/images/new/landing-img.png" />
                                    </div>
                                </div>
                            </div>
                            <section className="demos-section" id="Demo">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="tab-content mt-3">
                                            <div className="" >
                                                <div className="row justify-content-center">
                                                    <div className="col-sm-6 col-lg-3">
                                                        <div className="card demo-card">
                                                            <div className="card-body">
                                                                <div className="demo-box">
                                                                    <h6 className="m-0 ">1GB/S</h6>
                                                                    <p>Network uplink</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 col-lg-3">
                                                        <div className="card demo-card">
                                                            <div className="card-body">
                                                                <div className="demo-box">
                                                                    <h6 className="m-0 ">99.99%</h6>
                                                                    <p>Guaranteed Uptime</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 col-lg-3">
                                                        <div className="card demo-card">
                                                            <div className="card-body">
                                                                <div className="demo-box">
                                                                    <h6 className="m-0 ">1GB/S</h6>
                                                                    <p>Network uplink</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 col-lg-3">
                                                        <div className="card demo-card">
                                                            <div className="card-body">
                                                                <div className="demo-box">
                                                                    <h6 className="m-0 ">99.99%</h6>
                                                                    <p>Guaranteed Uptime</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    {/* landing first section end */}

                </div>

                <section className="features-section" id="Features">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-6 offset-xl-3">
                                <div className="landing-title text-md-center">
                                    <h1 className="title-landing">Scalable  <span class="highlight-title"> Platform</span></h1>
                                    <p className="text-secondary">We don’t focus only on simplicity. We also handle all stages of growth. Once you start your success journey, you can add more resources to your current infrastructure.</p>
                                </div>
                            </div>
                            <div className="mg-t-40 text-center">
                                <a className="btn btn-primary btn-lg" href="/signup" role="button" target="_blank">Get Started</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="features-section bg-white" id="about">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="landing-title">
                                    <span className="landing-span">More Savings</span>
                                    <h1 className="title-landing">Great pricing, great deals. Every hour, <span class="highlight-title"> every day.</span></h1>
                                    <p className="text-secondary">Experience cost-effective and efficient cloud infrastructure solutions with Ekire. Our cutting-edge services are designed to optimize resource utilization, ensuring you get the most out of your investment. From scalable computing power to streamlined data storage, Ekire empowers businesses to achieve peak performance while reducing operational costs. Join a community of smart businesses that trust Ekire for reliable and budget-friendly cloud solutions. Elevate your digital journey with us today!</p>
                                </div>
                                <div className="mg-t-40">
                                    <a className="btn btn-primary btn-lg" href="/signup" role="button" target="_blank">Discover</a>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="landing-img">
                                    <img alt="shape" src="/assets/images/new/saving.png"  />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container pt-5">
                        <div className="row align-items-center">
                            <div className="col-lg-6 order-lg-1 order-2">
                                <div className="landing-img">
                                    <img alt="shape" src="/assets/images/new/build.png"  />
                                </div>
                            </div>
                            <div className="col-lg-6 order-lg-2 order-1">
                                <div className="landing-title">
                                    <span className="landing-span">Security</span>
                                    <h1 className="title-landing">Build with <span class="highlight-title">trust</span></h1>
                                    <p className="text-secondary">With active sessions tracking, brute-force preventor, login tries tracker and much more other security features, you will never worry about unauthorized access to your services.</p>
                                </div>
                                <div className="mg-t-40">
                                    <a className="btn btn-primary btn-lg" href="/signup" role="button" target="_blank">Begin</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="faq-section" id="deploy">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-6 offset-xl-3 mb-5">
                                <div className="landing-title text-md-center">
                                    <h2><span className="highlight-title"> Deploy</span> in 3 steps </h2>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-start">
                            <div className="col-lg-4 col-sm-6 mb-3">
                                <div className="card-boxs">
                                    <div className="icon-boxs">
                                        <img src="/assets/images/new/check.png" alt="" />
                                    </div>
                                    <div className="box-content">
                                        <h4>Registration</h4>
                                        <p>Register an account and activate your email.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-6">
                                <div className="card-boxs">
                                    <div className="icon-boxs">
                                        <img src="/assets/images/new/top-up.png" alt="" />
                                    </div>
                                    <div className="box-content">
                                        <h4>Top-up</h4>
                                        <p>Top-up your balance using any of available payment methods.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-6">
                                <div className="card-boxs">
                                    <div className="icon-boxs">
                                        <img src="/assets/images/new/deployment.png" alt="" />
                                    </div>
                                    <div className="box-content">
                                        <h4>Deploy</h4>
                                        <p>Deploy your instance in no time.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mg-t-40 text-center">
                            <a className="btn btn-primary btn-lg" href="/signup" role="button" target="_blank">Start Now</a>
                        </div>
                    </div>
                </section>

                <section className="element-section" id="whyus">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-6 offset-xl-3 mb-5">
                                <div className="landing-title text-md-center">
                                    <h2><span className="highlight-title">Why </span> us?</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row gy-3">
                            <div className="col-sm-6 col-lg-4">
                                <div className="element-card">
                                    <div>
                                        <div className="element-icons icons-primary">
                                            <img src="/assets/images/new/why-1.png" width={64} alt="" />
                                        </div>
                                        <div className="element-content">
                                            <h4>Automated daily backups</h4>
                                            <p>Set your mind free with our automated daily backups. You’ll never worry about your data.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-4">
                                <div className="element-card">
                                    <div className>
                                        <div className="element-icons icons-secondary">
                                            <img src="/assets/images/new/why-2.png" width={55} alt="" />
                                        </div>
                                        <div className="element-content">
                                            <h4>Simple dashboard</h4>
                                            <p>Amazing & simple dashboard brought to you by our inhouse developers to give a complete experience.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-4">
                                <div className="element-card">
                                    <div>
                                        <div className="element-icons icons-dark">
                                            <img src="/assets/images/new/why-3.png" width={64} alt="" />
                                        </div>
                                        <div className="element-content">
                                            <h4>Instant deployment</h4>
                                            <p>Deploy your servers within seconds.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-4">
                                <div className="element-card">
                                    <div className>
                                        <div className="element-icons icons-secondary">
                                            <img src="/assets/images/new/why-4.png" width={64} alt="" />
                                        </div>
                                        <div className="element-content">
                                            <h4>Additional disks</h4>
                                            <p>The ability to attach up to 200GB of additional disks to your current server without affecting your data.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-4">
                                <div className="element-card">
                                    <div className>
                                        <div className="element-icons icons-dark">
                                            <img src="/assets/images/new/why-5.png" width={64} alt="" />
                                        </div>
                                        <div className="element-content">
                                            <h4>Scale on-demand</h4>
                                            <p>You can upgrade your server plan add more CPU & memory resources without need to purchase it again or affecting your data.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-4">
                                <div className="element-card">
                                    <div className>
                                        <div className="element-icons icons-primary">
                                            <img src="/assets/images/new/why-6.png" width={64} alt="" />
                                        </div>
                                        <div className="element-content">
                                            <h4>Large collection of OSs</h4>
                                            <p>We’ve wide variety collection of operating systems & application that can fit every type of usage.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container pt-5">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="landing-img">
                                    <img alt="shape" src="/assets/images/new/time.png" width={370} />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="landing-title">
                                    <h1 className="title-landing">Your time is  <span class="highlight-title">important!</span></h1>
                                    <p className="text-secondary">And we don’t want to waste it explaining <br />too much about ourselves. <br />We’ve left a lot for you to discover yourself.</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="mg-t-40 text-center">
                        <a className="btn btn-primary btn-lg" href="/signup" role="button" target="_blank">Start Now</a>
                    </div>
                </section>

                <section className="plans-section" id="pricing">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-6 offset-xl-3">
                                <div className="landing-title text-md-center">
                                    <h2>Get in Reasonable  <span className="highlight-title">Price</span></h2>
                                    <p>Include information on how users can navigate your platform, select a plan, and
                                        complete the
                                        transaction.</p>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-4 col-xl-4">
                                <div className="card pricing-cards active mb-0">
                                    <div className="card-body p-0">
                                        <div className="pricing-details">
                                            <div className="price-title">
                                                <h2>$ 4</h2>
                                                <p className="text-primary-dark">You’ll Get</p>

                                                <ul className="pricing-list-menu">
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />Intel processor</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />1 vCPU</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />1GB of memory</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />30GB of NVMe storage</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />1GBPS network uplink</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />Unmetered bandwith, free installations and much more</li>
                                                </ul>
                                                <div className="text-center price-btn">
                                                    <a className="btn btn-lg btn-primary rounded" href="https://themeforest.net/user/la-themes" target="_blank">Get Started</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-xl-4">
                                <div className="card pricing-cards active mb-0">
                                    <div className="card-body p-0">
                                        <div className="pricing-details">
                                            <div className="price-title">
                                                <h2>$ 10</h2>
                                                <p className="text-primary-dark">You’ll Get</p>

                                                <ul className="pricing-list-menu">
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />Intel processor</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />2 vCPU</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />4GB of memory</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />60GB of NVMe storage</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />1GBPS network uplink</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />Unmetered bandwith, free installations and much more</li>
                                                </ul>
                                                <div className="text-center price-btn">
                                                    <a className="btn btn-lg btn-primary rounded" href="https://themeforest.net/user/la-themes" target="_blank">Get Started</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-xl-4">
                                <div className="card pricing-cards active mb-0">
                                    <div className="card-body p-0">
                                        <div className="pricing-details">
                                            <div className="price-title">
                                                <h2>$ 30</h2>
                                                <p className="text-primary-dark">You’ll Get</p>

                                                <ul className="pricing-list-menu">
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />Intel processor</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />4 vCPU</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />8GB of memory</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />150GB of NVMe storage</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />1GBPS network uplink</li>
                                                    <li className="pricing-listitem text-primary-dark f-w-500"><i className="ph-bold  ph-check text-success me-2" />Unmetered bandwith, free installations and much more</li>
                                                </ul>
                                                <div className="text-center price-btn">
                                                    <a className="btn btn-lg btn-primary rounded" href="https://themeforest.net/user/la-themes" target="_blank">Get Started</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="features-section bg-white" id="Features">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="landing-title">
                                    <h1 className="title-landing">Amazing modern <span class="highlight-title">dashboard</span></h1>
                                    <p className="text-secondary">All-in-one console to control everything. Including billing, account management, servers management, backups management, and much more.</p>
                                </div>
                                <div className="mg-t-40">
                                    <a className="btn btn-primary btn-lg" href="/signup" role="button" target="_blank">Explore our modern dashboard </a>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="landing-img">
                                    <img alt="shape" src="/assets/images/new/dash.png"  />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <section className="element-section" id="Features">
                    <div className="container">
                        <div className="row align-items-center justify-content-center">
                            <div className="col-lg-12">
                                <div className="landing-title">
                                    <h1 className="title-landing text-center">Projects</h1>
                                    <p className="text-center">Ekire projects feature allows groups to work together collaboratively, it allows the owner of the project to add multiple servers and invite multiple users to the project. So, every member of the project can view and control each server in this project.</p>
                                </div>
                                <div className="mg-t-40 text-center">
                                    <a className="btn btn-primary btn-lg" href="/signup" role="button" >View More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                <section className="element-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-6 offset-xl-3 mb-5">
                                <div className="landing-title text-md-center">
                                    <h2 className="text-center"> Are You a<span className="highlight-title"> Developer?</span>  </h2>
                                    <p className="text-center  mt-5 mb-0">We’re committed to support the community and help future builders do better. We offer free monthly recurring resources for developers, in order to give them the chance for building a better tomorrow.</p>
                                </div>
                            </div>
                        </div>
                        <div className="mg-t-40 text-center">
                            <a className="btn btn-primary btn-lg" href="/signup" role="button" >Apply Now</a>
                        </div>
                    </div>
                </section>

                {/* <section className="element-section" id="Elements">
                    <div className="container pt-5">
                        <div className="row align-items-center justify-content-center">
                            
                            <div className="col-lg-6 ">
                                <div className="landing-title">
                                    <h1 className="title-landing">Your time is  <span class="highlight-title">important!</span></h1>
                                    <p className="text-secondary">And we don’t want to waste it explaining</p>
                                    <p className="text-secondary">too much about ourselves.</p>
                                    <p className="text-secondary">We’ve left a lot for you to discover yourself.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mg-t-40 text-center">
                        <a className="btn btn-primary btn-lg" href="/signup" role="button" target="_blank">Start Now</a>
                    </div>
                </section> */}

                <section className="landing-footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="footer-content text-center">
                                    <img alt="logo" src="/assets/images/ekire-icon-white.svg" width={50} />
                                    <h1>Sign Up Now</h1>
                                    <p className="txt-ellipsis-3">And start the most reliable experience ever.</p>
                                    <div className="footer-btn">
                                        <a className="btn btn-primary btn-lg" href="/signup" target="_blank">Sign Up Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

        </Fragment>
    );
};

export default HomeLanding;
