import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Blog from './Blog';
import KTU from './posts/ktu';
import Modal from 'react-modal';
Modal.setAppElement('#root');

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/ktu" element={<KTU />} />
      </Routes>
    </Router>
  );
}

export default App;