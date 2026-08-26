import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Aboutus from "./pages/Aboutus.jsx";
import Footer from "./components/Footer.jsx";
import CommercialProject from "./pages/project/commercialprojects/page.jsx";
import ProjectPage from "./pages/project/commercialprojects/[slug]/page.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<Aboutus />} />
        <Route
          path="/project/commercialprojects"
          element={<CommercialProject />}
        />
        <Route
          path="/project/commercialprojects/:slug"
          element={<ProjectPage />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
