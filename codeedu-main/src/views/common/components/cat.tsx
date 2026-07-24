import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Cat = () => {

    const openIxDF = () => {
        window.open('https://www.interaction-design.org/?ep=code-edu', '_blank');
    }

    return (
        <Card className="gap-0 py-4 cursor-pointer" onClick={openIxDF}>
            <CardHeader>
                <CardTitle className='text-xl text-white'><span className='text-primary'>IxDF</span> Membership</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="bg-[#323232] rounded-2xl">
                    <img src='/img/idf.png' alt='CCAT Banner' className='w-full rounded-xl shadow-sm border border-gray-200 glowConnectCard object-contain' />
                </div>
            </CardContent>
            <CardFooter className="text-white pt-2">
                Start learning with CODE x IxDF- enjoy 25% off on your yearly membership
            </CardFooter>
        </Card>
    );
};

export default Cat;