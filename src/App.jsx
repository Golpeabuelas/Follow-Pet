import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/home";
import About from "./screens/About";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
}
