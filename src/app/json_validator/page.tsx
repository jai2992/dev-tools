'use client'
import {useState} from 'react'

export default function JsonValidator() {
    const [userInput,setUserInput] = useState<string>("")
    const [output,setOutput] = useState<string>("")
    const validate = ()=>
    {
        try{
            JSON.parse(userInput)
            setOutput("Validation Sucess")

        }
        catch(e){
            console.error(e)
            setOutput("Failure")
        }
    }
    JSON.parse('{}')
  return (
    <div>
        <input type="text" onChange={(e)=>setUserInput(e.target.value)} />
        {output}
        <button onClick={validate}>validate</button>
    </div>
  )
}
