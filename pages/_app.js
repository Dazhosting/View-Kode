// pages/_app.js
import '../styles/globals.css'; // File CSS global kamu

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
