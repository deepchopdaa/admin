import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';

const Logout = () => {
    const navigate = useNavigate("/")
    useEffect(()=>{
        console.log("Logout render")
    })
    const logoutbutton = ()=>{
        localStorage.clear();
        navigate("/login")
    }
  return (
    <>
        <Button onClick={logoutbutton}>Logout</Button>
    </>
  )
}

export default Logout
