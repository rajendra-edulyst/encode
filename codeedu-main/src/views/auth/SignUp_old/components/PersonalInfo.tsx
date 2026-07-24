// import { useAuth } from '@/auth';
// import { Label } from '@/components/ui/label';
// import { Button } from "@/components/ui/ShadcnButton";
// import { Input } from '@/components/ui/ShadcnInput';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { getCities, getCounties, getCountryStates } from '@/services/learner/CountryService';
// import {
//     Popover,
//     PopoverTrigger,
//     PopoverContent,
// } from "@/components/ui/popover"
// import {
//     Command,
//     CommandInput,
//     CommandList,
//     CommandEmpty,
//     CommandItem,
// } from "@/components/ui/command"
// import { useForm, Controller } from 'react-hook-form';
// import { cn } from "@/lib/utils"




// type FormData = {
//     name: string;
//     password: string;
//     country: string;
//     state: string;
//     city: string;
// };

// const PersonalInfo = () => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [name, setName] = useState('');
//     const [password, setPassword] = useState('');

//     const [error, setError] = useState('');
//     const { signUp } = useAuth()
//     const [open, setOpen] = useState(false);
//     const [stateOpen, setStateOpen] = useState(false);
//     const [cityOpen, setCityOpen] = useState(false);


//     const {
//         register,
//         control,
//         handleSubmit,
//         watch,
//         formState: { errors },
//     } = useForm<FormData>({
//         defaultValues: {
//             name: '',
//             password: '',
//             country: '',
//             state: '',
//             city: '',
//         },
//     });


//     const selectedCountry = watch('country');
//     const selectedState = watch('state');




//     const { data: countries, isLoading: isCountriesLoading } = useQuery({
//         queryKey: ['countries'],
//         queryFn: () => getCounties(),
//     });

//     const { data: states, isLoading: isStatesLoading } = useQuery({
//         queryKey: ['states', selectedCountry],
//         queryFn: () => getCountryStates(selectedCountry),
//         enabled: !!selectedCountry,
//     });

//     const { data: cities, isLoading: isCitiesLoading } = useQuery({
//         queryKey: ['cities', selectedState],
//         queryFn: () => getCities(selectedState),
//         enabled: !!selectedState,
//     });

//     const selectedCountryObj = countries?.find(c => c.id.toString() === selectedCountry?.toString());
//     const isIndia = selectedCountryObj?.name?.toLowerCase() === 'india';



//     useEffect(() => {
//         const storedEmail = localStorage.getItem('verified-email');
//         if (!storedEmail) {
//             navigate('/sign-up');
//         } else {
//             setEmail(storedEmail);
//         }
//     }, [navigate]);

//     const mutation = useMutation({
//         mutationFn: signUp,
//         onSuccess: () => {
//             // clean up email
//             toast.success('Verified', {
//                 description: 'Your account has been verified successfully.',
//                 duration: 3000,
//                 position: 'top-right',
//                 style: {
//                     background: '#f0f4f8',
//                     color: '#333',
//                 },
//             });
//             // set verified-email in localStorage
//             localStorage.setItem('verified-email', email);
//             // remove accountEmail from localStorage
//             localStorage.removeItem('accountEmail');
//             navigate('/details-info');
//         },
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         onError: (err: any) => {
//             setError(err?.response?.data?.message || 'OTP verification failed.');
//         }
//     });

//     const createAccount = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!email || !name) {
//             setError('All fields are required.');
//             return;
//         }

//         // if (password !== confirmPassword) {
//         //     setError('Passwords do not match.');
//         //     return;
//         // }

//         const result = {
//             name, password, email,
//             dob: '',
//             profilePic: "",
//             first_name: name,
//             last_name: "",
//             gender: "",
//             mobile_no: "",
//             alternate_mobile_no: "",
//             email_address: email,
//             date_of_birth: "",
//             db_code: "0",
//             username: email,
//             locale: "English",
//             created_timezone: "UTC+05:30",
//             wp_center_id: null,
//             wp_course_id: null
//         };

//         mutation.mutate(result);

//         localStorage.removeItem('verified-email');

//     }





//     return (
//         <div className="h-[550px] overflow-y-auto scroll-left px-4 rounded-lg  bg-white">
//             <div className='flex flex-col gap-6'>
//                 <div>
//                     <h1 className="text-3xl font-bold mb-1 text-cblue">Sign up as Student/Designer</h1>
//                 </div>
//                 <div>
//                     <p className="text-[#263A43] text-lg font-bold">Personal Infromation</p>
//                     <p className="text-[#263A43] text-sm">Tell us about yourself</p>
//                 </div>
//             </div>
//             <form className="flex flex-col gap-4 mt-4" onSubmit={createAccount}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6  border-b-[1px] border-[#FFDCF0] pb-5">
//                     <div>
//                         <Label className="font-semibold text-[#263A43]">Name<span className='text-red-500'>*</span></Label>
//                         <Input
//                             required
//                             value={name}
//                             type="text"
//                             placeholder='Type your name'
//                             className="text-[#263A43] mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
//                             autoComplete="name"
//                             onChange={(e) => setName(e.target.value)}
//                         />
//                     </div>
//                     <div>
//                         <Label className="font-semibold text-[#263A43]">Phone Number<span className='text-red-500'>*</span></Label>
//                         <Input
//                             required
//                             type="text"
//                             placeholder='Type your phone number'
//                             className="text-[#263A43] mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
//                         />
//                     </div>
//                     <div>
//                         <Label htmlFor="country" className="block mb-2 font-semibold text-[#263A43]">
//                             Highest Qualification<span className="text-red-500">*</span>
//                         </Label>
//                         <Select onValueChange={(value) => console.log("Selected:", value)}>
//                             <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0  text-[#263A43]">
//                                 <SelectValue placeholder="Select yout highest qualification" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="India">High School</SelectItem>
//                                 <SelectItem value="USA">Bachelor's Degree</SelectItem>
//                                 <SelectItem value="UK">Master's Degree</SelectItem>
//                                 <SelectItem value="Canada">Ph.D.</SelectItem>

//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <div>
//                         <Label className="font-semibold text-[#263A43]">Alternative Email</Label>
//                         <Input
//                             required
//                             type="text"
//                             placeholder='Type your alternative email'
//                             className="text-[#263A43] mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
//                         />
//                     </div>
//                 </div>
//                 <div>
//                     <p className="text-gray-600 text-lg font-bold mt-2">Institute/University Details</p>
//                     <p className="text-gray-600 text-sm">Tell us about your institute/university</p>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b-[1px] border-[#FFDCF0] pb-5 mt-4">

//                         <div>
//                             <Label className="font-semibold text-[#263A43]">Institute/University Name<span className='text-red-500'>*</span></Label>
//                             <Input
//                                 required
//                                 type="text"
//                                 placeholder='Type your institute/university'
//                                 className=" mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
//                             />
//                         </div>
//                         {/* <div>
//                             <Label htmlFor="country" className="block mb-2  font-semibold  text-[#263A43]">
//                                 Country<span className="text-red-500">*</span>
//                             </Label>
//                             <Select onValueChange={(value) => console.log("Selected:", value)}>
//                                 <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0 text-[#263A43]">
//                                     <SelectValue placeholder="Select country" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="India">India</SelectItem>
//                                     <SelectItem value="USA">United States</SelectItem>
//                                     <SelectItem value="UK">United Kingdom</SelectItem>
//                                     <SelectItem value="Canada">Canada</SelectItem>
//                                     <SelectItem value="Australia">Australia</SelectItem>
//                                     <SelectItem value="Germany">Germany</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div> */}
//                         <div>
//                             <Label htmlFor="country" className="block mb-2 font-semibold text-[#263A43]">
//                                 Country<span className='text-red-500'>*</span>
//                             </Label>
//                             <Controller
//                                 control={control}
//                                 name="country"
//                                 render={({ field }) => {
//                                     const selected = countries?.find(c => c.id.toString() === field.value?.toString());

//                                     return (
//                                         <Popover open={open} onOpenChange={setOpen}>
//                                             <PopoverTrigger asChild>
//                                                 <Button
//                                                     variant="outline"
//                                                     role="combobox"
//                                                     disabled={isCountriesLoading}
//                                                     aria-expanded={open}
//                                                     className="w-full justify-between focus-visible:ring-0"
//                                                 >
//                                                     {selected?.name || "Select country..."}
//                                                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                                                 </Button>
//                                             </PopoverTrigger>
//                                             <PopoverContent className="w-full p-0">
//                                                 <Command>
//                                                     <CommandInput placeholder="Search country..." className="h-9" />
//                                                     <CommandList>
//                                                         <CommandEmpty>No country found.</CommandEmpty>
//                                                         {countries
//                                                             ?.sort((a, b) => a.name.localeCompare(b.name))
//                                                             .map((country) => (
//                                                                 <CommandItem
//                                                                     key={country.id}
//                                                                     value={country.name}
//                                                                     onSelect={() => {
//                                                                         field.onChange(country.id.toString());
//                                                                         setOpen(false);
//                                                                     }}
//                                                                 >
//                                                                     {country.name}
//                                                                     <Check
//                                                                         className={cn(
//                                                                             "ml-auto h-4 w-4",
//                                                                             field.value == country.id.toString() ? "opacity-100" : "opacity-0"
//                                                                         )}
//                                                                     />
//                                                                 </CommandItem>
//                                                             ))}
//                                                     </CommandList>
//                                                 </Command>
//                                             </PopoverContent>
//                                         </Popover>
//                                     )
//                                 }}
//                             />
//                         </div>

//                         {/* <div>
//                             <Label htmlFor="country" className="block mb-2 font-semibold text-[#263A43]">
//                                 State<span className="text-red-500">*</span>
//                             </Label>
//                             <Select onValueChange={(value) => console.log("Selected:", value)}>
//                                 <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0 text-[#263A43]">
//                                     <SelectValue placeholder="Select State" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="India">India</SelectItem>
//                                     <SelectItem value="USA">United States</SelectItem>
//                                     <SelectItem value="UK">United Kingdom</SelectItem>
//                                     <SelectItem value="Canada">Canada</SelectItem>
//                                     <SelectItem value="Australia">Australia</SelectItem>
//                                     <SelectItem value="Germany">Germany</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div> */}
//                         <div>
//                             <Label htmlFor="state" className="block mb-2 font-semibold text-[#263A43]">
//                                 State<span className='text-red-500'>*</span>
//                             </Label>
//                             {!isIndia ? (
//                                 <Input
//                                     {...register("state")}
//                                     placeholder="Enter your state"
//                                     className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0"
//                                 />
//                             ) : (
//                                 <Controller
//                                     control={control}
//                                     name="state"
//                                     render={({ field }) => {
//                                         const selected = states?.find(s => s.id.toString() === field.value?.toString());

//                                         return (
//                                             <Popover open={stateOpen} onOpenChange={setStateOpen}>
//                                                 <PopoverTrigger asChild>
//                                                     <Button
//                                                         variant="outline"
//                                                         role="combobox"
//                                                         disabled={isStatesLoading || !selectedCountry || !states?.length}
//                                                         aria-expanded={stateOpen}
//                                                         className="w-full justify-between focus-visible:ring-0"
//                                                     >
//                                                         {selected?.name || "Select state..."}
//                                                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                                                     </Button>
//                                                 </PopoverTrigger>
//                                                 <PopoverContent className="w-full p-0">
//                                                     <Command>
//                                                         <CommandInput placeholder="Search state..." className="h-9" />
//                                                         <CommandList>
//                                                             <CommandEmpty>No state found.</CommandEmpty>
//                                                             {states
//                                                                 ?.sort((a, b) => a.name.localeCompare(b.name))
//                                                                 .map((state) => (
//                                                                     <CommandItem
//                                                                         key={state.id}
//                                                                         value={state.name}
//                                                                         onSelect={() => {
//                                                                             field.onChange(state.id.toString());
//                                                                             setStateOpen(false);
//                                                                         }}
//                                                                     >
//                                                                         {state.name}
//                                                                         <Check
//                                                                             className={cn(
//                                                                                 "ml-auto h-4 w-4",
//                                                                                 field.value === state.id.toString() ? "opacity-100" : "opacity-0"
//                                                                             )}
//                                                                         />
//                                                                     </CommandItem>
//                                                                 ))}
//                                                         </CommandList>
//                                                     </Command>
//                                                 </PopoverContent>
//                                             </Popover>
//                                         );
//                                     }}
//                                 />
//                             )}
//                         </div>
//                         {/* <div>
//                             <Label htmlFor="country" className="block mb-2 font-semibold text-[#263A43]">
//                                 City<span className="text-red-500">*</span>
//                             </Label>
//                             <Select onValueChange={(value) => console.log("Selected:", value)}>
//                                 <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0">
//                                     <SelectValue placeholder="Select City" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="India"></SelectItem>
//                                     <SelectItem value="USA">United States</SelectItem>
//                                     <SelectItem value="UK">United Kingdom</SelectItem>
//                                     <SelectItem value="Canada">Canada</SelectItem>
//                                     <SelectItem value="Australia">Australia</SelectItem>
//                                     <SelectItem value="Germany">Germany</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div> */}
//                         <div>
//                             <Label htmlFor="city" className="block mb-2 font-semibold text-[#263A43]">
//                                 City<span className='text-red-500'>*</span>
//                             </Label>
//                                {!isIndia ? (
//                                 <Input
//                                     {...register("city")}
//                                     placeholder="Enter your city"
//                                     className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0"
//                                 />
//                             ) : (
//                             <Controller
//                                 control={control}
//                                 name="city"
//                                 render={({ field }) => {
//                                     const selected = cities?.find(c => c.id.toString() === field.value?.toString());

//                                     return (
//                                         <Popover open={cityOpen} onOpenChange={setCityOpen}>
//                                             <PopoverTrigger asChild>
//                                                 <Button
//                                                     variant="outline"
//                                                     role="combobox"
//                                                     disabled={isCitiesLoading || !selectedState || !cities?.length}
//                                                     aria-expanded={cityOpen}
//                                                     className="w-full justify-between focus-visible:ring-0"
//                                                 >
//                                                     {selected?.name || "Select city..."}
//                                                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                                                 </Button>
//                                             </PopoverTrigger>
//                                             <PopoverContent className="w-full p-0">
//                                                 <Command>
//                                                     <CommandInput placeholder="Search city..." className="h-9" />
//                                                     <CommandList>
//                                                         <CommandEmpty>No city found.</CommandEmpty>
//                                                         {cities
//                                                             ?.sort((a, b) => a.name.localeCompare(b.name))
//                                                             .map((city) => (
//                                                                 <CommandItem
//                                                                     key={city.id}
//                                                                     value={city.name}
//                                                                     onSelect={() => {
//                                                                         field.onChange(city.id.toString());
//                                                                         setCityOpen(false);
//                                                                     }}
//                                                                 >
//                                                                     {city.name}
//                                                                     <Check
//                                                                         className={cn(
//                                                                             "ml-auto h-4 w-4",
//                                                                             field.value === city.id.toString() ? "opacity-100" : "opacity-0"
//                                                                         )}
//                                                                     />
//                                                                 </CommandItem>
//                                                             ))}
//                                                     </CommandList>
//                                                 </Command>
//                                             </PopoverContent>
//                                         </Popover>
//                                     );
//                                 }}
//                             />
//                             )}
//                         </div>
//                         <div>
//                             <Label className="font-semibold text-[#263A43]">Pin Code<span className='text-red-500'>*</span></Label>
//                             <Input
//                                 required
//                                 type="text"
//                                 placeholder='Write your institute/university pincode'
//                                 className=" mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div>
//                     <p className="text-[#263A43]text-lg font-bold mt-2">From where did you hear about us?</p>
//                     <p className="text-[#263A43] text-sm">Help us understand how you found us</p>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                         <div>
//                             <Label htmlFor="country" className="block mb-2 font-semibold text-[#263A43]">
//                                 Please Select One<span className="text-red-500">*</span>
//                             </Label>
//                             <Select onValueChange={(value) => console.log("Selected:", value)}>
//                                 <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0">
//                                     <SelectValue placeholder="Select" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="India">Google Search</SelectItem>
//                                     <SelectItem value="USA">Friends/Colleague</SelectItem>
//                                     <SelectItem value="UK">Social Media</SelectItem>
//                                     <SelectItem value="Canada">Youtube</SelectItem>
//                                     <SelectItem value="Australia">Events/Conference</SelectItem>
//                                     <SelectItem value="Germany">Other</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>


//                     </div>
//                 </div>
//                 <div className='mt-7 flex justify-center'>
//                     <Button
//                         disabled={mutation.isPending}
//                         type="submit"
//                         className="bg-[#d63384] hover:bg-[#b02a5b] text-white w-[400px]  rounded-lg px-8 py-2 font-semibold focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0"
//                     >
//                         {mutation.isPending && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
//                         Continue
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     )
// }

// export default PersonalInfo


{/* 
 const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { signUp } = useAuth()


    useEffect(() => {
        const storedEmail = localStorage.getItem('verified-email');
        if (!storedEmail) {
            navigate('/sign-up');
        } else {
            setEmail(storedEmail);
        }
    }, [navigate]);

    const mutation = useMutation({
        mutationFn: signUp,
        onSuccess: () => {
            // clean up email
            toast.success('Verified', {
                description: 'Your account has been verified successfully.',
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#f0f4f8',
                    color: '#333',
                },
            });
            // set verified-email in localStorage
            localStorage.setItem('verified-email', email);
            // remove accountEmail from localStorage
            localStorage.removeItem('accountEmail');
            navigate('/personal-info');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
            setError(err?.response?.data?.message || 'OTP verification failed.');
        }
    });

    const createAccount = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !name || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const result = {
            name, password, email,
            dob: '',
            profilePic: "",
            first_name: name,
            last_name: "",
            gender: "",
            mobile_no: "",
            alternate_mobile_no: "",
            email_address: email,
            date_of_birth: "",
            db_code: "0",
            username: email,
            locale: "English",
            created_timezone: "UTC+05:30",
            wp_center_id: null,
            wp_course_id: null
        };

        mutation.mutate(result);

        localStorage.removeItem('verified-email');

    }
        */}

{/* 
        <div>
           <h1 className="text-3xl font-bold mb-1 text-cblue">Sign up</h1> 
            <p className="text-gray-600">Enter personal information to complete your account setup</p>
            <div className="flex flex-col gap-4">
                <form className="flex flex-col gap-4" onSubmit={createAccount}>
                    <div className='mt-3'>
                        <Label className='font-bold'>Name</Label>
                        <Input
                            required
                            value={name}
                            type="name"
                            className="bg-gray-100 mt-1"
                            autoComplete={'name'}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label className='font-bold'>Password</Label>
                        <Input
                            required
                            value={password}
                            type="password"
                            className="bg-gray-100 mt-1"
                            autoComplete={'off'}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label className='font-bold'>Confirm Password</Label>
                        <Input
                            required
                            value={confirmPassword}
                            type="password"
                            className="bg-gray-100 mt-1"
                            autoComplete={'off'}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className='mt-2'>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                    <div className='mt-2'>
                        <Button
                            disabled={mutation.isPending}
                            type="submit"
                            className="bg-[#d63384] hover:bg-[#b02a5b] text-white w-full rounded-lg px-8 py-2 font-semibold focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0"
                        >
                            {mutation.isPending && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
        */}