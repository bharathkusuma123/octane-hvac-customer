import React,{useContext, useState, useEffect} from 'react';
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";

const DelegateSurveyForm = () => {
     const { user } = useContext(AuthContext);
      const [delegateId, setDelegateId] = useState('');
       useEffect(() => {
        if (user?.delegate_id) {
          setDelegateId(user.delegate_id);
        }
      }, [user]);
  return (
    <div  >
       <h2 style={{marginTop:'90px'}}>DelegateSurveyForm</h2>
    {/* <div style={{marginTop:'70px'}}>DelegateSurveyForm */}
        <p><strong>Delegate ID:</strong> {delegateId}</p>
      <DelegateNavbar/>
    {/* </div> */}
    </div>
  )
}

export default DelegateSurveyForm