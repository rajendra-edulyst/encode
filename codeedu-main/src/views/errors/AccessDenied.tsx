import { Container } from '@/components/shared'
import { Button } from '@/components/ui'
import React from 'react'
import { Link } from 'react-router-dom'

function AccessDenied() {
    return (
        <Container className='h-[60vh] flex justify-center items-center'>
            <div className='text-center'>
                <h1 className='text-9xl font-bold text-primary'>403</h1>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>Access Denied</h2>
                <p className='text-gray-500'>You don't have permission to access this resource.</p>
                <Link to='/' className='text-primary'>
                    <Button className='mt-4 bg-primary text-white'>Go Home</Button>
                </Link>
            </div>
        </Container>
    )
}

export default AccessDenied