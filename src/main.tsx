import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { esES } from '@mui/x-date-pickers/locales';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="es"
      localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <App />
    </LocalizationProvider>
  </StrictMode>,
)
