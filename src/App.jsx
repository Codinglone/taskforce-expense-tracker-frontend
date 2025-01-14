import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transactions from './pages/Transactions.jsx'
import Budget from './pages/Budget.jsx'
import Income from './pages/Income.jsx'
import Expense from './pages/Expense.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'
function App() {
  

  return (
    <div className='bg-gray-300'>
      <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='transactions' element={<Transactions />} />
          <Route path='budget' element={<Budget />} />
          <Route path='income' element={<Income />} />
          <Route path='expense' element={<Expense />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
    </div>
  )
}

export default App
