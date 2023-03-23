import React, { useState, useEffect } from 'react';
import { Col, Table } from 'react-bootstrap';
import '../styles/MainContent.css'
import Confirmation from '../modal/Confirmation'
import { globalAPI } from '../global/APIURL';

const DataBtn = ({ id, email, isTestAcc, handleSave, handleEdit, getAllUsers }) => {
  const [showBtn, setShowBtn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [delpermit, setDelPermit] = useState(false);
  
  useEffect(()=>{
    if(delpermit){
      handleDeletion()
      setDelPermit(false)
    }
  },[delpermit])

  const handleDeletion=async ()=>{
    const item = await fetch(`${globalAPI}deleteuser?uid=${id}`,{
      method:'DELETE'
    })
    const data = await item.json()
    if(item.status===200){
      alert(data.message)
      getAllUsers()
    }
    else{
      alert(data?.message)
    }
  }

  return (
    <>
      {showBtn ? (
        <td className='edit-btn' onClick={() => {
          handleSave(setShowBtn);
        }}>Save</td>) : (
        <td className='edit-btn' onClick={() => {
          handleEdit(id, email, isTestAcc, setShowBtn);
        }}>Edit</td>)
      }
      <td className='del-btn' onClick={()=>setShowModal(true)} >Delete</td>
      <Confirmation showModal={showModal} setShowModal={setShowModal}
       setDelPermit={setDelPermit}
      />
    </>
  )
}

function MainContent() {
  const [userId, setuserId] = useState('');
  const [userEmail, setuserEmail] = useState('');
  const [textAccount, settextAccount] = useState('');
  const [usersList, setUsersList] = useState([]);

  const getAllUsers= async ()=>{
    const item = await fetch(`${globalAPI}getAll`)
    const data = await item.json()
    if(item.status===200){
      setUsersList(data)
    }
    else{
      alert(data?.message)
    }
  }

  const handleSearch = async () => {
      if(userEmail!==''){
        const item = await fetch(`${globalAPI}getuserbyemail?email=${userEmail}`)
        const data = await item.json()
        if(item.status===200){
          console.log(data)
          setUsersList(data)
        }
        else{
          alert(data?.message)
        }
      }
      else if(textAccount!==''){
        const item = await fetch(`${globalAPI}getuserbytestacc?isTestAcc=${textAccount}`)
        const data = await item.json()
        if(item.status===200){
          console.log(data)
          setUsersList(data)
        }
        else{
          alert(data?.message)
        }
      }
   // setShowModal(true)
  };

  const handleEdit = (id,name,isTestAcc, setShowBtn)=>{
    setShowBtn(true)
    setuserId(id)
    setuserEmail(name)
    settextAccount(isTestAcc)
  }

  const handleSave = async (setShowBtn)=>{
      const response = await fetch(`${globalAPI}updateuser?email=${userEmail}&isTestAcc=${textAccount}`)
      const resJson = await response.json()
      if (resJson?.modifiedCount===1) {
        setShowBtn(false)
        setuserEmail('')
        setuserId('')
        getAllUsers()
      } else {
        alert('Wrong Email or no change occurs')
        setShowBtn(false)
        setuserEmail('')
        setuserId('')
        handleSearch()
      }
  }

  return (
    <>
    <Col sm={9} md={10} lg={10} xl={10.5}  className="main-content">
      <p className='main-title'>Search Users</p>
      <div className="text-fields">
        <div>
          <p className='search-title'>User ID</p>
          <input type="text" value={userId} onChange={(e) => setuserId(e.target.value)} />
        </div>
        <div>
          <p className='search-title'>User Email</p>
          <input type="text" value={userEmail} onChange={(e) => setuserEmail(e.target.value)} />
        </div>
        <div>
          <p className='search-title'>Test Account</p>
          <input type="text" value={textAccount} onChange={(e) => settextAccount(e.target.value)} />
        </div>
      </div>
      <div className='btn'>
        <button id='search-btn' onClick={handleSearch}>Search</button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Email</th>
            <th>Test Account?</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {
          usersList.map(function(item, i){
              return (
                <tr key={item.id}>
                  <td>{item._id}</td>
                  <td>{item.email}</td>
                  <td>{item.isTestAcc}</td>
                  <DataBtn id={item._id} email={item.email} isTestAcc={item.isTestAcc} 
                           handleSave={handleSave} handleEdit={handleEdit} getAllUsers={getAllUsers}
                  />
                </tr>
                )
            })
          }
        </tbody>
      </Table>
    </Col>
    </>
  );
}

export default MainContent;
