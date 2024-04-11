import {Select, SelectOptions}  from './Select'
import './App.css'
import { useState } from 'react'

function App() {
  const options = [
    {label:"First", value: 1},
    {label:"second", value: 2},
    {label:"third", value: 3},
    {label:"Fourth", value: 4}
  ]

  const[value1,setValue1]  = useState<SelectOptions[]>([options[0]]);
  const[value2,setValue2]  = useState<SelectOptions | undefined>(options[0]);

  return (
    <>
      <Select  multiple options={options} value={value1} onChange={o => setValue1(o)} />
      <br/>
      <Select options={options} value={value2} onChange={o => setValue2(o)} />
    </>
  )
}

export default App
