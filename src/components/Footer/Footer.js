/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";

// reactstrap components
import { Container, Row, Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Container fluid>
          <Nav>
            <NavItem>
              <NavLink href="https://www.vectoriantechnologies.com/">Vectorian Technologies</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://www.vectoriantechnologies.com/about-us">About Us</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://www.vectoriantechnologies.com/blog">Blog</NavLink>
            </NavItem>
          </Nav>
          <div className="copyright">
            © {new Date().getFullYear()} made{" "} by{" "}
            <a
              href="https://www.creative-tim.com/?ref=bdr-user-archive-footer"
              target="_blank"
            >
              Vectorians
            </a>{" "}
            for smarter power grids.
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
