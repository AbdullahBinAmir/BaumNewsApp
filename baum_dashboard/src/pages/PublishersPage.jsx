import React, { useState } from 'react';
import { Col, Table } from 'react-bootstrap';
import { globalAPI } from '../global/APIURL';
import Confirmation from '../modal/Confirmation';
import '../styles/MainContent.css'


function PublishersPage() {
  const [pubsId, setpubsId] = useState('');
  const [pubsEmail, setpubsEmail] = useState('');
  const [interestCat, setinterestCat] = useState('');
  const [isNews, setIsNews] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [usersList, setUsersList] = useState([]);

  const handleSearch = async () => {
    const item = await fetch(`${globalAPI}getAllPublishers`)
    const data = await item.json()
    if(item.status===200){
      console.log(data)
      setUsersList(data)
    }
    else{
      alert(data?.message)
    }
  };



  return (
    <>
    <Col sm={9} md={10} lg={10} xl={10.5} className="main-content">
      <p className='main-title'>Search Publishers</p>
      <div className="text-fields">
        <div>
          <p className='search-title'>Publisher ID</p>
          <input type="text" value={pubsId} onChange={(e) => setpubsId(e.target.value)} />
        </div>
        <div>
          <p className='search-title'>Publisher Email</p>
          <input type="text" value={pubsEmail} onChange={(e) => setpubsEmail(e.target.value)} />
        </div>
        <div>
          <p className='search-title'>Interest Category</p>
          <input type="text" value={interestCat} onChange={(e) => setinterestCat(e.target.value)} />
        </div>
      </div>
      <div style={{marginLeft:'20px'}}>
        <p className='search-title'>IsNews</p>
        <input type="text" value={isNews} onChange={(e) => setIsNews(e.target.value)} />
      </div>
      <div className='btn'>
            <button id='add-btn'>Add</button>
            <button id='search-btn'  onClick={handleSearch} >Search</button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Publisher ID</th>
            <th>Publisher Email</th>
            <th>Interest Category</th>
            <th>Is News</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            usersList.map(function(item, i){
              return (
              <tr>
                <td>{item.id}</td>
                <td>{`${item.Publisher}@gmail.com`}</td>
                <td>{item.interest}</td>
                <td>{item.IsNews}</td>
                <td className='edit-btn'>Edit</td>
                <td className='del-btn'>Delete</td>
              </tr>
              )})
          }
        </tbody>
      </Table>
    </Col>
    <Confirmation showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}

export default PublishersPage;
