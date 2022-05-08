import { createRoot } from 'react-dom/client';

import App from '../main/app'

const rootElement = document.getElementById('root') as Element | DocumentFragment;
const root = createRoot(rootElement);
root.render(<App />);