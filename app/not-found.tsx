export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1>404 - Page Not Found</h1>
      <p>The requested page could not be found.</p>
    </div>
  );
}