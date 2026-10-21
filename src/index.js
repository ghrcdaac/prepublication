import React from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, } from "react-router-dom"
import { Provider } from 'react-redux'
import TopBar from './components/universal/TopBar';
import { CssBaseline } from '@mui/material';
import App from './App'
import store from './app/store'
import { Footer } from './components/universal/Footer';
import PageNotFound from './pages/PageNotFound';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const baseUrl = process.env.REACT_APP_BASE_URL || '/';

const root = createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
        <HelmetProvider>
            <Helmet>
                {baseUrl && <base href={baseUrl} />}
            </Helmet>
            <Provider store={store}>
                <div className="app">
                    <header>
                        <CssBaseline />
                        <TopBar />
                    </header>
                    <main>
                        <BrowserRouter>
                            <Routes>
                                <Route path='*' element={<App />} />
                                <Route path='/prepub/404' element={<PageNotFound />} />
                            </Routes>
                        </BrowserRouter>
                    </main>
                    <footer>
                        <Footer />
                    </footer>
                </div>
            </Provider>
        </HelmetProvider>
    </React.StrictMode>,
)
