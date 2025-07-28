'use client'
import {useState, useEffect} from 'react'
import Button from '../components/ui/Button'

export default function JsonValidator() {
    const [userInput,setUserInput] = useState<string>("")
    const [output,setOutput] = useState<string>("")
    const [btnState,setBtnState] = useState<string>("opacity-50 cursor-not-allowed hover:ring-0 hover:bg-blue-600")
    const [isValid,setIsValid] = useState<Boolean>(false)
    useEffect(
            ()=>
            {
                if(userInput.length>0)
                {
                    setBtnState("");
                }
                else{
                    setBtnState("opacity-50 cursor-not-allowed hover:ring-0 hover:bg-blue-600")
                }
            },
            [userInput]
        )
    const validate = ()=>
    {
        try{
            JSON.parse(userInput)
            setIsValid(true)
            setOutput("Valid JSON")

        }
        catch(e){
            console.error(e)
            setIsValid(false)
            setOutput("Not valid JSON")
        }
    }
  return (
    <div className="bg-radial-[at_75%_50%] from-sky-300 via-blue-500 to-indigo-900 to-100% sm:bg-radial-[at_50%_75%] sm:from-sky-200 sm:via-blue-400 sm:to-indigo-900 sm:to-90%">
            <div className="flex flex-col h-screen w-screen justify-center items-center text-center">
                <div className="flex flex-col justify-center items-center backdrop-blur-md bg-white/20 border border-white/30 rounded-lg shadow-md p-6 max-w-sm ring-1 ring-sky tansition-all duration-300">
                    <div className='font-black px-4 py-2 text-blue-700 mb-5 text-2xl'>JSON Validator</div>
                    <textarea
                    className="bg-white rounded-xl text-black placeholder-slate-400 text-center font-bold p-2 focus:ring-2 focus:ring-blue-600 resize-none focus:outline-none" 
                    placeholder="Paste your JSON to validate..." 
                    onChange={(e)=>setUserInput(e.target.value)} 
                    autoFocus/>
                    <div className={`${isValid?"text-green-700":"text-red-500"} font-bold mt-5`}>
                        {output}
                    </div>
                    <Button className={`${btnState} mt-5`} onClick={validate}>validate</Button>
                </div>
            </div>
    </div>
  )
}
