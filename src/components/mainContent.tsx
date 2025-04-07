// components/MainContent.tsx

const MainContent = () => {
    return (
        <main className="main-content" id="MainContent">
            <section className="page-container" id="PageContainer">
                <div id="shopify-section-16172676571651ab6f" className="shopify-section index-section section-slideshow">
                    <div className="distance">
                        <div data-section-id="16172676571651ab6f" data-section-type="slideshow-section" className="slideshow">
                            <div className="main-slider slick-initialized slick-slider" data-autoplay="true" data-speed="6000" data-arrows="true" data-dots="false">
                                <div className="arrow-prev slick-arrow" style={{ display: 'block' }}><i className="zmdi zmdi-long-arrow-left"></i></div>
                                <div className="slick-list draggable">
                                    <div className="slick-track" style={{ opacity: 1, width: '1932px' }}>
                                        <div className="item image slick-slide" data-slick-index="0" aria-hidden="true" tabIndex={0} style={{ width: '966px', position: 'relative', left: '0px', top: '0px', zIndex: 998, opacity: 0, transition: 'opacity 600ms cubic-bezier(0.87, 0.03, 0.41, 0.9)' }}>
                                            <figure>
                                                <a href="#" tabIndex={0}>
                                                    <div className="slide-image slide-media" style={{ backgroundImage: "url('//minion-vinovatheme.myshopify.com/cdn/shop/files/s-12-1_d646cfaf-4b5d-4d0d-b896-0a45f30040b1_2048x.jpg?v=1620378617')" }}></div>
                                                </a>
                                                <figcaption className="caption">
                                                    <div className="content-caption content-captiont-1 rtl-left">
                                                        <div className="content position-absolute content-1">
                                                            <div className="caption-animate caption-1" data-animate="fadeInDown animated" style={{ color: '#ffffff' }}>BACKPACK FOR CLIMBING</div>
                                                            <div className="caption-animate caption-2" data-animate="fadeInLeft animated" style={{ color: '#ffffff' }}>NEW ARRIVALS</div>
                                                            <a className="caption-animate cap_link hover_x" data-animate="fadeInUp animated" href="#" style={{ color: '#474747', background: '#ffffff' }} tabIndex={0}>
                                                                <span>Shop the collection</span><i className="zmdi zmdi-long-arrow-right" style={{ color: '#474747' }}></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </figcaption>
                                            </figure>
                                        </div>
                                        {/* Add more slides here */}
                                    </div>
                                </div>
                                <div className="arrow-next slick-arrow" style={{ display: 'block' }}><i className="zmdi zmdi-long-arrow-right"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default MainContent;