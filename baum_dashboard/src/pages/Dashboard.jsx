import React from 'react'
import MainContent from './MainContent'
import Sidebar from './Sidebar'
import { Container, Row } from "react-bootstrap";

export default function Dashboard() {
  return (
    <Container fluid>
      <Row>
        <Sidebar/>
        <MainContent/>
      </Row>    
    </Container>
  )
}
