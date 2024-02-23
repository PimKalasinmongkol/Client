import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";
import Adduser from "./pages/adduser";
import Main from "./pages/main";
import Adduser_ from "./pages/adduser_";
import Addroom_ from "./pages/addroom";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="main" element={<Main />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="adduser" element={<Adduser />} />
          <Route path="logout" element={<NoPage />} />
          <Route path="adduser_" element={<Adduser_ />} />
          <Route path="addroom_" element={<Addroom_ />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);