import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/ShadcnButton'
// import cn from 'classnames'
import { addAccountDetailsService } from '@/services/learner/AddAccountDetailsService'
import countryCodes from '@/data/countryCode';

import { Country, getCities, getCounties, getCountryStates } from '@/services/learner/CountryService'
// import { Check, ChevronsUpDown } from 'lucide-react'
import { changeStatusofUserInterestArea } from '@/services/learner/InterestAreaServices'
import { useAuth } from '@/auth'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

interface State {
    id: number
    name: string
}

interface City {
    id: number
    name: string
}

interface CompleteProfileProps {
    open: boolean
    onClose: () => void
}

const CompleteProfile = ({ open, onClose }: CompleteProfileProps) => {
    const [countries, setCountries] = useState<Country[]>([])
    const [countryStates, setCountryStates] = useState<State[]>([])
    const [countryCities, setCountryCities] = useState<City[]>([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const { name, email } = user || {};

    const [data, setData] = useState({
        college: '',
        passing_year: '',
        phone_number: '',
        country_id: '',
        state_id: '',
        city: '',
        address: '',
        education: '',
        i_am: 'student',
        country_code: '+91',
        student_id: '',
    })

    const [errors, setErrors] = useState({
        college: '',
        passing_year: '',
        phone_number: '',
        country_id: '',
        state_id: '',
        city: '',
        education: '',
    })

    useEffect(() => {
        getCounties().then((countries) => {
            if (countries) {
                setCountries(countries);
            }
        }).catch(error => {
            console.error('Error fetching countries:', error)
        })
    }, [])

    const validateForm = () => {
        const newErrors = {
            college: '',
            passing_year: '',
            phone_number: '',
            country_id: '',
            state_id: '',
            city: '',
            education: '',
        }
        let isValid = true

        Object.keys(newErrors).forEach((key) => {
            if (!data[key as keyof typeof data]) {
                newErrors[key as keyof typeof newErrors] =
                    `${key.replace('_', ' ')} is required`
                isValid = false
            }
        })

        setErrors(newErrors)
        return isValid
    }

    const getStatesOfCountry = (id: string) => {
        setData({ ...data, country_id: id })
        getCountryStates(id).then((states) => {
            if (states) {
                setCountryStates(states)
            }
        }).catch(error => {
            console.error('Error fetching countries:', error)
        })
    }

    const getCitiesOfState = (state_id: string) => {
        getCities(state_id).then((cities) => {
            if (cities) {
                setCountryCities(cities)
            }
        }).catch(error => {
            console.error('Error fetching countries:', error)
        })
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setLoading(true)
        try {
            const formData = {
                state_id: data.state_id ? Number(data.state_id) : undefined,
                country_id: data.country_id ? Number(data.country_id) : undefined,
                city: countryCities.find((c) => c.name === data.city)?.id || 0,
                address: data.address,
                education: data.education,
                passing_year: data.passing_year,
                college: data.college,
                phone_number: data.country_code + data.phone_number,
                student_id: data.student_id,
                i_am: data.i_am,
            }


            await addAccountDetailsService(formData).then(() => {
                changeStatusofUserInterestArea()
                const sessionUserString = localStorage.getItem('sessionUser')

                if (sessionUserString) {
                    const sessionUser = JSON.parse(sessionUserString)
                    sessionUser.state.user.is_interest_save = 1
                    localStorage.setItem(
                        'sessionUser',
                        JSON.stringify(sessionUser),
                    )
                    console.log('Updated sessionUser:', sessionUser)
                }
                toast.success('Profile details added successfully!')
                onClose()
            })
        } catch (error) {
            console.error('Error submitting profile:', error)
        } finally {
            navigate('/create')
            setLoading(false)

        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[555px] w-full max-w-[95vw] p-0">
                <div className="max-h-[90vh] overflow-y-auto px-6 py-4">
                    <DialogHeader>
                        <DialogTitle className="capitalize mb-0 pb-0">Welcome, {name}</DialogTitle>
                        <DialogDescription className="text-xs !mt-0 pt-0">{email}</DialogDescription>
                        <DialogDescription>
                            Please complete your profile to continue.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col">
                            {/* Education */}
                            <div className="w-full">
                                <Label htmlFor="education">Highest Education <span className='text-red-500'>*</span></Label>
                                <select required id="education" name="education" value={data.education} className="mt-1 w-full p-3 border-2 bg-gray-100 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" onChange={(e) => setData({ ...data, education: e.target.value })}>
                                    <option value="">Select...</option>
                                    <option value="10th">10th</option>
                                    <option value="12th">12th</option>
                                    <option value="Diploma">Diploma</option>
                                    <option value="Under Graduate">Under Graduate</option>
                                    <option value="Graduate">Graduate</option>
                                    <option value="Post Graduate">Post Graduate</option>
                                    <option value="PhD">PhD</option>
                                    <option value="Post-Doc">Post Doc</option>
                                </select>
                                {errors.education && (
                                    <p className="text-red-500">
                                        {errors.education}
                                    </p>
                                )}
                            </div>
                            {/* College */}
                            <div className="w-full mt-3"></div>
                            <Label htmlFor="enrollno">Enrollment Number (Optional)</Label>
                            <Input
                                id="enrollno"
                                name="enrollno"
                                value={data.student_id}
                                placeholder="Enter your enrollment number"
                                className="mt-1"
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        student_id: e.target.value,
                                    })
                                }
                            />
                            {errors && errors?.student_id && (
                                <p className="text-red-500">{errors?.student_id}</p>
                            )}
                        </div>
                    </div>

                    <div className="w-full">
                        <Label htmlFor="college">University / Institute <span className='text-red-500'>*</span></Label>
                        <Input
                            required
                            id="college"
                            name="college"
                            value={data.college}
                            placeholder="Enter the details"
                            className="mt-1"
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    college: e.target.value,
                                })
                            }
                        />
                        {errors.college && (
                            <p className="text-red-500">{errors.college}</p>
                        )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 mt-4 gap-4'>
                        {/* Passing Year */}
                        <div className="w-full col-span-1">
                            <Label htmlFor="passing_year">Passing Year <span className='text-red-500'>*</span></Label>
                            <select
                                id="passing_year"
                                name="passing_year"
                                value={data.passing_year}
                                className="mt-1 w-full p-3 border-2 bg-gray-100 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        passing_year: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select...</option>
                                <option value="2025-07">July 2025</option>
                                <option value="2026-07">July 2026</option>
                                <option value="2027-07">July 2027</option>
                            </select>
                            {errors.passing_year && (
                                <p className="text-red-500">
                                    {errors.passing_year}
                                </p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div className="w-full col-span-2">
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <div className="flex">
                                <select
                                    className='bg-transparent border border-r-0 rounded-l-lg px-2 py-3 focus:outline-none'
                                    defaultValue={'+91'}
                                    onChange={(e) => setData({
                                        ...data,
                                        country_code: e.target.value
                                    })}>
                                    {countryCodes.map((country, index) => (
                                        <option key={index} value={country.dial_code}>{country.code} {country.dial_code}</option>
                                    ))}
                                </select>
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    value={data.phone_number}
                                    placeholder="Enter your phone number"
                                    className="mt-1 rounded-l-none"
                                    style={{ borderLeft: 0 }}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            phone_number: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            {errors.phone_number && (
                                <p className="text-red-500">
                                    {errors.phone_number}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* I am a*/}
                    <div className='mt-3'>
                        <Label htmlFor="i_am">I am a</Label>
                        <select id="i_am" name="i_am" value={data.i_am} className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" onChange={(e) => setData({ ...data, i_am: e.target.value })}>
                            <option value="">Select...</option>
                            <option value="student">Student</option>
                            <option value="corporate">Corporate</option>
                            <option value="professor">Professor</option>
                            <option value="faculty">Faculty</option>
                            <option value="corporate_trainer">Corporate Trainer</option>
                        </select>
                    </div>
                    {/* Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-2 gap-4">
                        <div>
                            <Label htmlFor="country">Country</Label>
                            <select
                                id="country"
                                name="country"
                                value={data.country_id || countries.find(c => c.name === 'India')?.id?.toString() || ''}
                                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                onChange={(e) => {
                                    getStatesOfCountry(e.target.value)
                                }}
                            >
                                <option value="">Select...</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                            {errors.country_id && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.country_id}
                                </p>
                            )}
                        </div>
                        {/* State */}
                        <div className="w-full">
                            <Label htmlFor="state">State</Label>
                            <select id="state" name="state" value={data.state_id} className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                onChange={(e) => {
                                    setData({ ...data, state_id: e.target.value });
                                    getCitiesOfState(e.target.value);
                                }}
                            >
                                <option value="">Select...</option>
                                {countryStates.map((state) => (
                                    <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                            </select>
                            {errors.state_id && (
                                <p className="text-red-500">
                                    {errors.state_id}
                                </p>
                            )}
                        </div>

                        {/* City */}
                        <div className="w-full">
                            <Label htmlFor="city">City</Label>
                            <select
                                id="city"
                                name="city"
                                value={data.city}
                                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                onChange={(e) => setData({ ...data, city: e.target.value })}
                            >
                                <option value="">Select...</option>
                                {countryCities.map((city) => (
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                                <option value="other">Other</option>
                            </select>
                            {data.city === 'other' && (
                                <div className="mt-2">
                                    <Input
                                        id="city"
                                        name="city"
                                        value={data.city || ''}
                                        placeholder="Enter your city name"
                                        className="w-full"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                city: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            )}
                            {errors.city && (
                                <p className="text-red-500">
                                    {errors.city}
                                </p>
                            )}
                        </div>
                    </div>
                    <Button
                        type="button"
                        disabled={loading}
                        className='text-white w-full mt-3'
                        onClick={handleSubmit}
                    >
                        {loading ? 'Saving...' : 'Save changes'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CompleteProfile