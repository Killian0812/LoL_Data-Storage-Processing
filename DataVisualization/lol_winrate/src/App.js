import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Winrate from './Winrate';
import AtlasSearch from './AtlasSearch';
import Chart from './Chart';

function App() {
  return (
    <main className="App">
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Layout />}>
            <Route index element={<Winrate />} />
            <Route path="atlas_search" element={<AtlasSearch />} />
            <Route path="chart" element={<Chart />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main >
  )
}

export default App;
