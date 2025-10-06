import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { QueryProvider } from './providers/QueryProvider.tsx'
import HomePage from './pages/HomePage.tsx'
import TestNodePage from './pages/TestNodePage.tsx'
import TestEdge from './pages/TestEdge.tsx'
import TestGraphPage from './pages/test_graph.tsx'
import TestApiPage from './pages/TestApiPage.tsx'
import TestInfoPanel from './pages/TestInfoPanel.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test_node" element={<TestNodePage />} />
          <Route path="/test_edge" element={<TestEdge />} />
          <Route path="/test_graph" element={<TestGraphPage />} />
          <Route path="/test_api" element={<TestApiPage />} />
          <Route path="/test-info-panel" element={<TestInfoPanel />} />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  </StrictMode>,
)
