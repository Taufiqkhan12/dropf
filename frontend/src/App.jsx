import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import SharePage from "./pages/SharePage";
import Header from "./components/Header";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:roomId" element={<SharePage />} />
        </Routes>
      </main>
    </>
  );
}
