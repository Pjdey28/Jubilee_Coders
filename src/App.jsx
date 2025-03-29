import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Faq from "./components/faq";
import Footer from "./components/footer";
import HeroPage from "./components/hero-page";
import Navbar from "./components/navbar";
import SignUp from "./components/sign-up";
import Zone from "./components/zone";
import Movies from "./pages/movies";

function App() {
  return (
    <div className="app">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }} 
      />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroPage />
              <Zone />
              <SignUp />
              <Faq />
            </>
          }
        />
        <Route path="/movies" element={<Movies />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
