import React from 'react'
import Sidebar from './Sidebar'
import { Container, Row } from "react-bootstrap";
import PublishersPage from './PublishersPage';

export default function PubsDashboard() {
  return (
    <Container fluid>
      <Row>
        <Sidebar/>
        <PublishersPage/>
      </Row>    
    </Container>
  )
}
