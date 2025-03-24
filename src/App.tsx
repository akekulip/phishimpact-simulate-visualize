
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "@/pages/Index";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import "@/App.css";
import "@/index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
