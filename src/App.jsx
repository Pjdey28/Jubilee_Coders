import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Zone from "./components/zone";
import Footer from "./components/footer";
import Books from "./pages/Books";
import Stories from "./pages/Stories";
import Movies from "./pages/Movies";
import Memes from "./pages/Memes"; 
import ThemePark from "./pages/ThemePark";
import HeroPage from "./components/hero-page";
import { Toaster } from 'react-hot-toast';
import SignUp from "./components/sign-up";
import Faq from "./components/faq";
import ThemeParkDetails from "./pages/ThemeParkDetails";

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
        <Route path="/books" element={<Books />} />
        <Route path="/memes" element={<Memes />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/themepark" element={<ThemePark />} />
        <Route path="/themepark/:id" element={<ThemeParkDetails />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;