'use client'
import {useEffect, useState} from 'react'
import Button from '../components/ui/Button';
import Head from 'next/head';

export default function Qr(){
    const [userInput,setUserInput] = useState<string>("");
    const [btnState,setBtnState] = useState<string>("opacity-50 cursor-not-allowed hover:ring-0 hover:bg-blue-600")
    const [qrImg,setQrImg] = useState<string>("")
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
    const handleSubmitBtn = () =>{
         fetch(`https://api.apgy.in/qr/?data=${userInput}&size=${300}`,{method:'GET'})
        .then((response)=>response.blob())
            .then((image_blob)=>URL.createObjectURL(image_blob))
                .then((url)=>{
                    setQrImg(url)
                })
    }
    return(
        <>
            <Head>
                <title>Free QR Code Generator Online | devtools.software</title>
                <meta
                    name="description"
                    content="Create QR codes for free instantly with our easy online QR generator at devtools.software. No registration—generate, customize, and download your QR code now!"
                />
                <meta property="og:title" content="Free QR Code Generator Online" />
                <meta property="og:description" content="Generate QR codes for free online—fast, simple and secure." />
                <meta property="og:url" content="https://devtools.software/qr" />
                <meta name="robots" content="index,follow" />
            </Head>

            <div className="bg-radial-[at_75%_50%] from-sky-300 via-blue-500 to-indigo-900 to-100% sm:bg-radial-[at_50%_75%] sm:from-sky-200 sm:via-blue-400 sm:to-indigo-900 sm:to-90%">
            <div className="flex flex-col h-screen w-screen justify-center items-center text-center">
                <div className="flex flex-col justify-center items-center backdrop-blur-md bg-white/20 border border-white/30 rounded-lg shadow-md p-6 max-w-sm ring-1 ring-sky tansition-all duration-300">
                    <div className='font-black px-4 py-2 text-blue-700 mb-5 text-2xl'>QR code generator</div>
                    <input 
                        className="bg-white rounded-xl text-black placeholder-slate-400 text-center font-bold p-2 focus:ring-2 focus:ring-blue-600 resize-none focus:outline-none" 
                        placeholder="Text to encode in QR" 
                        onChange={(e)=>setUserInput(e.target.value)}
                        autoFocus/>
                    <Button 
                        variant='primary' 
                        className={`mt-5 ${btnState}`} 
                        type="button"
                        onClick={handleSubmitBtn}>
                        Let the magic happen
                    </Button>
                    <div className='mt-5 h-300px w-300px'>
                        {qrImg!=="" &&
                        <div>
                            <img src={qrImg} alt="" />
                            <a href={qrImg} download={qrImg}>
                            <Button variant='primary' className='mt-5'>Download</Button>
                            </a>
                        </div>
                        }
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}