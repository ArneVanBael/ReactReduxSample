import * as React from 'react';
import { Container, Navbar, NavbarBrand, Nav} from 'react-bootstrap';
import NavbarCollapse from 'react-bootstrap/NavbarCollapse';

const NavMenu = () => {
    return (
        <header>
            <Navbar bg="light" expand="lg">
                <Container>
                    <NavbarBrand href="/">REACT REDUX</NavbarBrand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <NavbarCollapse id="basic-navbar-nav">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/dosemanagement">Manage doses</Nav.Link>
                    </NavbarCollapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default NavMenu;
