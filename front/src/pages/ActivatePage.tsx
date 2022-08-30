import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";


export function ActivatePage(){
    const [codeRight, setCodeRight] = useState(false)
    const [searchParams] = useSearchParams();
    
    const checkCode = (searchParams:string) => {
        try {
            axios.post(
                `${process.env.REACT_APP_BASE_URL}activate/`, 
                {active_code: searchParams})
                .then(() => setCodeRight(true))
        } catch (e) {
            setCodeRight(false)
        }
        
    };

    useEffect(() => {
        if(searchParams.get('activation_code')){
            checkCode(searchParams.get('activation_code') || '')
        }
      });


    return (
        <>
         { codeRight && <div className="mt-[400px] text-center flex flex-col">
            <p className="mb-[40px]">Учетная запись активирована</p>
            <span 
                className="p-2 rounded-lg w-[200px] mx-auto cursor-pointer bg-green-400"
            >
                <Link to='/auth'>Войти</Link>
            </span>
        </div>}
        { !codeRight && <div className="mt-[400px] text-center flex flex-col">
            <p className="mb-[40px]">Неверный код активации</p>
        </div>}
        </>
    )
}