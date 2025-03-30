import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Faq from "./components/faq";
import Footer from "./components/footer";
import HeroPage from "./components/hero-page";
import Navbar from "./components/navbar";
import SignUp from "./components/sign-up";
import Zone from "./components/zone";
import Movies from "./pages/movies";
import Memes from "./pages/memes";
import ThemePark from "./pages/ThemePark"; 
import ThemeParkDetails from "./pages/ThemeParkDetails";
import Stories from "./pages/stories"; 

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
        <Route path="/memes" element={<Memes />} />
        <Route path="/ThemePark" element={<ThemePark />} />
        <Route path="/ThemePark/:id" element={<ThemeParkDetails />}/>
        <Route path="/stories" element={<Stories />} /> 
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
