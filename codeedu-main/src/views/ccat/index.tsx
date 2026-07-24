import React from 'react'
import { useNavigate } from 'react-router-dom'

const Index = () => {

    const navigate = useNavigate();

    const onClick = () => {
        navigate('/create');
    }

    return (
        <div className="flex items-center justify-center">
            <img src='/ccat.png' alt="CCAT" className="cursor-pointer" onClick={onClick} />
        </div>
    )
}

export default Index