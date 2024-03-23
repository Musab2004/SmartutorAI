import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center text-lg-start bg-body-tertiary text-muted" style={{backgroundColor:'#e1efff'}} >
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom" style={{ color: '#1f5692' }}>
        <div className="me-5 d-none d-lg-block">
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a href="" className="me-4 text-reset">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="" className="me-4 text-reset">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="" className="me-4 text-reset">
            <i className="fab fa-google"></i>
          </a>
          <a href="" className="me-4 text-reset">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="" className="me-4 text-reset">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="" className="me-4 text-reset">
            <i className="fab fa-github"></i>
          </a>
        </div>
      </section>

      <section className="" style={{ color: '#1f5692' }}>
        <div className="container text-center text-md-start mt-5">
          <div className="row mt-3">
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <i className="fas fa-gem me-3"></i>SmartTutor AI
              </h6>
              <p>
              Welcome to SmartTutor AI, your personalized learning companion designed to make education engaging, effective, and tailored just for you
              </p>
            </div>

            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                Products
              </h6>
              <p>
                <a href="#!" className="text-reset">Studyplans</a>
              </p>
              <p>
                <a href="#!" className="text-reset">Quizes</a>
              </p>
              <p>
                <a href="#!" className="text-reset">Summary</a>
              </p>
              <p>
                <a href="#!" className="text-reset">24/7 support</a>
              </p>
            </div>

            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                Useful links
              </h6>
              <p>
                <a href="#!" className="text-reset">Pricing</a>
              </p>
              <p>
                <a href="#!" className="text-reset">Settings</a>
              </p>
              <p>
                <a href="#!" className="text-reset">Orders</a>
              </p>
              <p>
                <a href="#!" className="text-reset">Help</a>
              </p>
            </div>

            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p><i className="fas fa-home me-3"></i> Lahore, LHR 10012, PK</p>
              <p>
                <i className="fas fa-envelope me-3"></i>
                smarttutorai@mail.com
              </p>
              <p><i className="fas fa-phone me-3"></i> + 92 334 567 88</p>
              <p><i className="fas fa-print me-3"></i> + 92 234 567 89</p>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)',color: '#1f5692'  }}>
        © 2024 Copyright:
        <a className="text-reset fw-bold" href="#">smarttutorai.com</a>
      </div>
    </footer>
  );
};

export default Footer;
