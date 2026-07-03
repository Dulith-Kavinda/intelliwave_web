import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { SiteContentProvider } from './lib/useSiteContent.jsx';
import './styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
    <SiteContentProvider>
      <App />
    </SiteContentProvider>
  </BrowserRouter>,
);