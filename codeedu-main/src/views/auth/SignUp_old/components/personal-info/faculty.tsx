import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from '@/components/ui/ShadcnInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import z from 'zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import orchidlogo from '@assets/images/orcidlogo.svg'
import linkedln from '@assets/images/linkedin.svg'
import facebook from '@assets/images/facebook.svg'
import youtube from '@assets/images/youtube.svg'
import figma from '@assets/images/figma.svg'
import behance from '@assets/images/behance.svg'
import countryCodes from '@/data/countryCode';




const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  alternateEmail: z.string().optional().transform((val) => val?.trim() || '') 
    .refine((val) => val === '' || /\S+@\S+\.\S+/.test(val), {
    message: 'Enter a valid alternate email address',
    }),
  qualification: z.string().min(1, 'Qualification is required'),
  hearAboutUs: z.string().min(1, 'Please select an option'),
  phdstatus: z.string().min(1, '').optional(),
  specialization: z.string().min(1, '').optional(),
  publication: z.string().min(1, '').optional(),
  orcidUrl: z.string().min(1, '').optional(),
  linkedln: z.string().min(1, '').optional(),
  facebook: z.string().min(1,'').optional(),
  youtube: z.string().min(1,'').optional(),
  figma: z.string().min(1,'').optional(),
  behance: z.string().min(1,'').optional(),
  country_code:z.string().optional(),
});


type FormData = z.infer<typeof formSchema>;

const FacultyProfile = () => {


  const navigate = useNavigate();

  const { control, handleSubmit,setValue,watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });


  const handleSubmitData = (data: FormData) => {
    console.log('Form Data:', data);
    // toast.success('Form submitted successfully!');
    sessionStorage.setItem('studentData', JSON.stringify(data));
    navigate('/details-info');
  };


  useEffect(() => {
    const accountEmail = sessionStorage.getItem('accountEmail');
    const verifiedEmail = sessionStorage.getItem('verified-email');
    const studentData = sessionStorage.getItem('studentData');

    if (!accountEmail) {
      toast.error('No account email found. Please start over.');
      navigate('/sign-up');
    }

    if (!verifiedEmail) {
      navigate('/account-verify');
    }

    if (studentData) {
      navigate('/details-info');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-[550px]  px-4 rounded-lg  bg-white">
      <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(handleSubmitData)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6  border-b-[1px] border-[#FFDCF0] pb-5">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <div>
                <Label className="font-semibold text-[#263A43]">Name<span className='text-red-500'>*</span></Label>
                <Input
                  type="text"
                  placeholder='Type your name'
                  className="text-[#263A43] mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                  autoComplete="name"
                  {...field}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
            )}
          />
          <Controller
                                  control={control}
                                  name="phone"
                                  render={({ field }) => (
                                      <div>
                                          <Label className="font-semibold text-[#263A43]">
                                              Phone Number<span className='text-red-500'>*</span>
                                          </Label>
                                          <div className="flex"> 
                                              <select
                                                  className="text-[#263A43] mt-1 rounded-l-none focus:outline-none focus:ring-0 focus-visible:ring-0 border"
                                                  value={watch("country_code") || "+91"}
                                                  onChange={(e) => setValue("country_code", e.target.value)}
                                              >
                                                  {countryCodes.map((country, index) => (
                                                      <option key={index} value={country.dial_code}>
                                                          {country.code} {country.dial_code}
                                                      </option>
                                                  ))}
                                              </select>
                                              <Input
                                                  type="text"
                                                  placeholder="Type your phone number"
                                                  className="text-[#263A43] mt-1 rounded-l-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                                                  autoComplete="tel"
                                                  {...field}
                                                  onChange={(e) => {
                                                      const digitsOnly = e.target.value.replace(/\D/g, ""); 
                                                      field.onChange(digitsOnly);
                                                  }}
                                              />
                                          </div>
          
                                          {/* Error message */}
                                          {errors.phone && (
                                              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                          )}
                                      </div>
                                  )}
                              />
          <Controller
            control={control}
            name="qualification"
            render={({ field }) => (
              <div>
                <Label htmlFor="qualification" className="block mb-2 font-semibold text-[#263A43]">
                  Highest Qualification<span className="text-red-500">*</span>
                </Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0 text-[#263A43]">
                    <SelectValue placeholder="Select your highest qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Bachelors Degree">Bachelors Degree</SelectItem>
                    <SelectItem value="Masters Degree">Masters Degree</SelectItem>
                    <SelectItem value="Ph.D.">Ph.D.</SelectItem>
                  </SelectContent>
                </Select>
                {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification.message}</p>}
              </div>
            )}
          />
          <Controller
            control={control}
            name="alternateEmail"
            render={({ field }) => (
              <div>
                <Label className="font-semibold text-[#263A43]">Alternative Email</Label>
                <Input
                  type="text"
                  placeholder='Type your alternative email'
                  className="text-[#263A43] mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                  autoComplete="email"
                  {...field}
                />
                {errors.alternateEmail && <p className="text-red-500 text-sm mt-1">{errors.alternateEmail.message}</p>}
              </div>
            )}
          />



        </div>
        <div className='border-b-[1px] border-[#FFDCF0] pb-5'>
          <p className="text-[#263A43] text-lg font-bold mt-2">PhD Details</p>
          <p className="text-[#263A43] text-sm">Tell us about your Phd Degree</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8  mt-4">

            <Controller
              name="phdstatus"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor="phdStatus" className="block mb-2 font-semibold text-[#263A43]">
                    PhD status
                  </Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pursuing">Pursuing</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.phdstatus && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phdstatus.message}
                    </p>
                  )}
                </div>
              )}
            />


            <Controller
              name="specialization"
              control={control}
              render={({ field }) => (
                <div>
                  <Label className="font-semibold text-[#263A43]">
                    PhD Specialization 
                  </Label>
                  <Input
                    type="text"
                    placeholder="Type your specialization"
                    className="mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                    {...field}
                  />
                  {errors.specialization && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.specialization.message}
                    </p>
                  )}
                </div>
              )}
            />

          </div>
          <Controller
            name="publication"
            control={control}
            render={({ field }) => (
              <div className="max-h-[100px]">
                <Label className="font-semibold text-[#263A43]">
                  Publications
                </Label>
                <Input
                  type="text"
                  placeholder="Type your publications"
                  className="mt-1 h-16 focus:outline-none focus:ring-0 focus-visible:ring-0"
                  {...field}
                />
                {errors.publication && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.publication.message}
                  </p>
                )}
              </div>
            )}
          />

        </div>
        <div className='border-b-[1px] border-[#FFDCF0] pb-5'>
          <p className="text-[#263A43] text-lg font-bold mt-2">Social links</p>
          <p className="text-[#263A43] text-sm">Tell us about your social links</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8  mt-4">
            <Controller
              name="orcidUrl"
              control={control}
              render={({ field }) => (
                <div>
                  <Label className="font-semibold text-[#263A43] flex items-center gap-2">
                    {/* <GiFlowerTwirl className="w-5 h-5" /> */}
                      <img src={orchidlogo} alt="Flower" className="w-5 h-5 object-contain" />


                  </Label>
                  <Input
                    type="text"
                    placeholder="Type your ORCID URL"
                    className="mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                    {...field}
                  />
                </div>
              )}
            />
            <Controller
              name="linkedln"
              control={control}
              render={({ field }) => (
                <div>
                  <Label className="font-semibold text-[#263A43]">
                  <img src={linkedln} alt="Flower" className="w-5 h-5 object-contain" />

                  </Label>
                  <Input
                    type="text"
                    placeholder='Type your Figma URL'
                    className=" mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                    {...field}
                  />
                </div>
              )}
            />
            <Controller
              name="facebook"
              control={control}
              render={({ field }) => (
                <div>
                  <Label className="font-semibold text-[#0866ff]">
                  <img src={facebook} alt="Flower" className="w-5 h-5 object-contain" />

                  </Label>
                  <Input
                    type="text"
                    placeholder='Type your Facebook URL'
                    className=" mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                    {...field}
                  />
                </div>
              )}



            />




            <Controller
              name="youtube"
              control={control}
              render={({ field }) => (
                <div>
                  <Label className="font-semibold text-[#263A43] flex items-center gap-2">
                  <img src={youtube} alt="Flower" className="w-5 h-5 object-contain" />

                  </Label>
                  <Input
                    type="text"
                    placeholder="Type your YouTube URL"
                    className="mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                    {...field}
                  />
                  {errors.youtube && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.youtube.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="figma"
              control={control}
              render={({ field }) => (
                <div>
                  <Label className="font-semibold text-[#263A43] flex items-center gap-2">
                  <img src={figma} alt="Flower" className="w-5 h-5 object-contain" />

                  </Label>
                  <Input
                    type="text"
                    placeholder="Type your Figma URL"
                    className="mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                    {...field}
                  />
                  {errors.figma && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.figma.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="behance"
              control={control}
              render={({ field }) => (
                <div>
                  <Label className="font-semibold text-[#263A43] flex items-center gap-2">
                  <img src={behance} alt="Flower" className="w-5 h-5 object-contain" />

                  </Label>
                  <Input
                    type="text"
                    placeholder="Type your Behance URL"
                    className="mt-1 focus:outline-none focus:ring-0 focus-visible:ring-0"
                    {...field}
                  />
                  {errors.behance && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.behance.message}
                    </p>
                  )}
                </div>
              )}
            />

          </div>

        </div>
        <div>
          <p className="text-[#263A43] text-lg font-bold mt-2">From where did you hear about us?</p>
          <p className="text-[#263A43] text-sm">Help us understand how you found us</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Controller
              control={control}
              name="hearAboutUs"
              render={({ field }) => (
                <div>
                  <Label htmlFor="hearAboutUs" className="block mb-2 font-semibold text-[#263A43]">
                    Please Select One<span className="text-red-500">*</span>
                  </Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Google Search">Google Search</SelectItem>
                      <SelectItem value="Friends/Colleague">Friends/Colleague</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Youtube">Youtube</SelectItem>
                      <SelectItem value="Events/Conference">Events/Conference</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.hearAboutUs && <p className="text-red-500 text-sm mt-1">{errors.hearAboutUs.message}</p>}
                </div>
              )}
            />
          </div>
        </div>
        <div className='mt-7 flex justify-center'>
          <Button
            type="submit"
            className="bg-[#d63384] hover:bg-[#b02a5b] text-white w-[400px]  rounded-lg px-8 py-2 font-semibold focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FacultyProfile