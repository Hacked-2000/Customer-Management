import { BrowserRouter as Router } from 'react-router-dom';
import RenderRoute from './routes/RenderRoute.jsx';
import { CustomerProvider } from './context/CustomerContext.jsx';

function App() {
  return (
    <Router>
      <CustomerProvider>
        <RenderRoute />
      </CustomerProvider>
    </Router>
  );
}

export default App;
