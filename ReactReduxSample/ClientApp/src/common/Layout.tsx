import * as React from 'react';
import { Container } from 'react-bootstrap';
import NavMenu from '../menu/NavMenu';

export default (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <NavMenu/>
         <Container>
            {props.children}
        </Container>
    </React.Fragment>
);
