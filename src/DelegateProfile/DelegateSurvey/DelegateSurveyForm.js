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
    <div className='mt-5'>DelegateSurveyForm
        <p><strong>Delegate ID:</strong> {delegateId}</p>
      <DelegateNavbar/>
    </div>
  )
}

export default DelegateSurveyForm