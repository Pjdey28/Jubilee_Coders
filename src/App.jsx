import Faq from "./components/faq";
import Footer from "./components/footer";
import HeroPage from "./components/hero-page";
import Navbar from "./components/navbar";
import SignUp from "./components/sign-up";
import Zone from "./components/zone";

function App() {
  return (
    <>
      <Navbar />
      <HeroPage />
      <Zone />
      <SignUp />
      <Faq />
      <Footer />
    </>
  );
}

export default App;
