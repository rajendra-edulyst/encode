// import React from 'react';
// import { Users, BarChart3, MessageSquare, Calendar } from 'lucide-react';

// const Cat = () => {
//     return (
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 glowConnectCard">
//             <div className="flex items-center mb-6">
//                 <h2 className="text-3xl font-bold text-blue-600">CCAT</h2>
//             </div>
//             <div className="space-y-4 text-lg text-gray-700 mb-6">
//                 <p className="leading-relaxed">
//                     Career Coaching and Adaptive Training for personalized growth
//                 </p>
//             </div>

//             <div className="space-y-4">
//                 <div className="flex items-center space-x-3">
//                     <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
//                         <span className="text-sm font-semibold text-blue-600">1</span>
//                     </div>
//                     <Users className="w-5 h-5 text-blue-600" />
//                     <span className="text-lg font-medium text-gray-800">Create a Community</span>
//                 </div>

//                 <div className="flex items-center space-x-3">
//                     <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
//                         <span className="text-sm font-semibold text-blue-600">2</span>
//                     </div>
//                     <BarChart3 className="w-5 h-5 text-blue-600" />
//                     <span className="text-lg font-medium text-gray-800">Create your poll</span>
//                 </div>

//                 <div className="flex items-center space-x-3">
//                     <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
//                         <span className="text-sm font-semibold text-blue-600">3</span>
//                     </div>
//                     <MessageSquare className="w-5 h-5 text-blue-600" />
//                     <span className="text-lg font-medium text-gray-800">Create a post</span>
//                 </div>

//                 <div className="flex items-center space-x-3">
//                     <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
//                         <span className="text-sm font-semibold text-blue-600">4</span>
//                     </div>
//                     <Calendar className="w-5 h-5 text-blue-600" />
//                     <span className="text-lg font-medium text-gray-800">Participate in events</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Cat;
// import React from 'react';
// import { TbWritingSign } from 'react-icons/tb';

const Cat = () => {
    return (
        // <div className="bg-yellow-100 rounded-xl p-4 mt-4 shadow-sm border border-yellow-200 glowConnectCard">
        //     <div className="flex items-center mb-3">
        //         <TbWritingSign className="w-6 h-6 text-yellow-600 mr-2" />
        //         <h2 className="text-xl font-bold text-yellow-800">CCAT</h2>
        //     </div>
        //     <div className="text-sm text-gray-700">
        //         <p>Career Coaching and Adaptive Training for personalized growth</p>
        //     </div>
        // </div>
        <div>
            <a href='https://www.interaction-design.org/?ep=code-edu' target='_blank' rel='noopener noreferrer'>
                <img src='/img/idf.jpeg' alt='CCAT Banner' className='w-full rounded-xl shadow-sm border border-gray-200 glowConnectCard object-contain' />
            </a>
        </div>
    );
};

export default Cat;