import { BrowserRouter as Router } from 'react-router-dom'
import Routing from './Routes/Routing';

function App() {
  return (
    <div className="container">
      <Router>
        <Routing />
      </Router>
    </div>
  )
}

export default App
