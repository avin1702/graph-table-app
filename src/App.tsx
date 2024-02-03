import { useState } from 'react'
import './App.css'
import DataTableDynamic from './components/DataTableDynamic'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <DataTableDynamic/>
    </>
  )
}

export default App
