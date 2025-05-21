import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'



//redux >>
//ایمپورت Provider از react-redux
import { Provider } from 'react-redux'
//ایمپورت store از store.js
import store from './store/store.js'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
