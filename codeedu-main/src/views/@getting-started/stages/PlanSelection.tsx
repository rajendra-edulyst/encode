// import { useState } from 'react';
// import { Compass, Hammer, Map } from 'lucide-react';
// import { PlanType } from '../CreativeStages';

// interface PlanSelectionProps {
//     selectedPlan: PlanType | null;
//     onSelect: (plan: PlanType) => void;
//     onContinue: () => void;
//     onSkip: () => void;
//     onBack: () => void;
// }

// const plans = [
//     {
//         id: 'explorer' as PlanType,
//         title: 'Explorer',
//         subtitle: 'Discovering',
//         description: 'Discovering endless possibilities & journey through creative exploration to build measurable capability, visible portfolio, and professionalmindability.',
//         icon: Compass,
//         color: 'from-cyan-400 to-blue-500',
//         iconBg: 'bg-cyan-500',
//         badge: { text: 'Best Value', color: 'bg-cyan-500' },
//         price: '₹9999',
//         features: {
//             mentorSessions: 2,
//             reviewSessions: 2,
//             digitalResourceBank: 8,
//             liveClasses: 4,
//             portfolioProjects: true,
//         },
//         addOns: {
//             masterClassesMentors: 8,
//             jobApplicationSupport: true,
//         }
//     },
//     {
//         id: 'builder' as PlanType,
//         title: 'Builder',
//         subtitle: 'Refining',
//         description: 'An intensive & customised. More creative practice journey to build measurable capability, visible portfolio, and professionalmindability.',
//         icon: Hammer,
//         color: 'from-pink-500 to-fuchsia-600',
//         iconBg: 'bg-pink-500',
//         badge: { text: 'Most Popular', color: 'bg-pink-500' },
//         price: '₹9999',
//         features: {
//             mentorSessions: 4,
//             reviewSessions: 4,
//             digitalResourceBank: 16,
//             liveClasses: 4,
//             portfolioProjects: true,
//         },
//         addOns: {
//             masterClassesMentors: 8,
//             jobApplicationSupport: true,
//         }
//     },
//     {
//         id: 'navigator' as PlanType,
//         title: 'Navigator',
//         subtitle: 'Expanding',
//         description: 'An intensive & customised. More creative practice journey to build measurable capability, visible portfolio, and professionalmindability.',
//         icon: Map,
//         color: 'from-lime-400 to-green-500',
//         iconBg: 'bg-lime-500',
//         badge: { text: 'Recommended', color: 'bg-lime-500' },
//         price: '₹9999',
//         features: {
//             mentorSessions: 6,
//             reviewSessions: 6,
//             digitalResourceBank: 24,
//             liveClasses: 6,
//             portfolioProjects: true,
//         },
//         addOns: {
//             masterClassesMentors: 12,
//             jobApplicationSupport: true,
//         }
//     },
// ];

// const PlanSelection = ({ selectedPlan, onSelect, onContinue, onSkip, onBack }: PlanSelectionProps) => {
//     return (
//         <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
//             {/* Header */}
//             <div className="flex-1 flex flex-col items-center px-4">
//                 <div className="text-center mb-12 max-w-4xl">
//                     <h1 className="text-4xl md:text-5xl font-jacques font-bold mb-4">
//                         Choose How You Want to <span className="text-codeblue font-creative">Grow</span>
//                     </h1>
//                     <p className="text-xl md:text-2xl text-gray-300 font-light">
//                         Pick what feels right. You can always upgrade later.
//                     </p>
//                 </div>
//                 {/* Fellowship Banner */}
//                 <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 mb-8 flex items-center justify-between max-w-4xl mx-auto">
//                     <div className="flex items-center gap-4">
//                         <div className="text-left">
//                             <div className="flex items-center gap-2 mb-2">
//                                 <span className="text-2xl font-bold text-white">en</span>
//                                 <div className="bg-gradient-to-r from-lime-400 to-green-500 px-3 py-1 rounded-full">
//                                     <span className="text-black font-bold text-sm">FELLOWSHIP</span>
//                                 </div>
//                             </div>
//                             <p className="text-gray-400 text-sm max-w-2xl">
//                                 enCODE Fellowship is a curated, More creative practice journey to build measurable capability, visible portfolio, and professionalmindability.
//                             </p>
//                         </div>
//                     </div>
//                     <div className="flex-shrink-0">
//                         <button className="bg-[#FDE047] hover:bg-[#FDE047]/90 text-black px-6 py-2 rounded-lg font-semibold">
//                             Start your Journey
//                         </button>
//                     </div>
//                 </div>

//                 {/* Character Illustration */}
//                 <div className="flex justify-end mb-4">
//                     <div className="text-6xl">🎨</div>
//                 </div>
//             </div>

//             {/* Access Platform Through Fellowship */}
//             <div className="mb-8">
//                 <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 max-w-4xl mx-auto">
//                     <p className="text-white text-center text-sm">
//                         <span className="font-semibold">Access the Platform Through a Fellowship</span>
//                     </p>
//                 </div>
//             </div>

//             {/* Choose the plan of your choice */}
//             <div className="text-center mb-8">
//                 <h2 className="text-2xl font-bold text-white mb-8">Choose the plan of your choice</h2>
//             </div>

//             {/* Plans Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//                 {plans.map((plan) => {
//                     const Icon = plan.icon;
//                     const isSelected = selectedPlan === plan.id;

//                     return (
//                         <div
//                             key={plan.id}
//                             className={`relative transition-all duration-300 ${isSelected ? 'scale-105' : ''
//                                 }`}
//                         >

//                             <button
//                                 onClick={() => onSelect(plan.id)}
//                                 className={`w-full text-left relative bg-[#2a2a2a] rounded-2xl overflow-hidden ${isSelected ? 'shadow-xl ring-2 ring-cyan-500' : ''
//                                     }`}
//                             >
//                                 {/* Header Section with Icon, Title, Badge and Price */}
//                                 <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-4 relative">
//                                     {/* Badge */}
//                                     {plan.badge && (
//                                         <div className="absolute top-2 right-2">
//                                             <div className={`${plan.badge.color} text-white px-3 py-1 rounded-md text-xs font-semibold`}>
//                                                 {plan.badge.text}
//                                             </div>
//                                         </div>
//                                     )}

//                                     {/* Icon and Title */}
//                                     <div className="flex items-center gap-3 mb-3">
//                                         <div className={`${plan.iconBg} rounded-lg p-2`}>
//                                             <Icon className="w-6 h-6 text-white" strokeWidth={2} />
//                                         </div>
//                                         <div>
//                                             <h3 className="text-lg font-bold text-white">{plan.title}</h3>
//                                             <p className="text-gray-400 text-xs">{plan.subtitle}</p>
//                                         </div>
//                                     </div>

//                                     {/* Price */}
//                                     <div className="mt-2">
//                                         <span className="text-2xl font-bold text-white">{plan.price}</span>
//                                         <span className="text-gray-400 text-xs ml-1">/ fellowship</span>
//                                     </div>
//                                 </div>

//                                 {/* Features Grid */}
//                                 <div className="p-4 grid grid-cols-2 gap-3">
//                                     {/* Feature Box 1 */}
//                                     <div className="bg-[#3a3a3a] rounded-lg p-3">
//                                         <div className="text-3xl font-bold text-white mb-1">
//                                             {plan.features.mentorSessions}
//                                         </div>
//                                         <div className="text-xs text-gray-400 leading-tight">
//                                             High Quality Intro to Complete
//                                         </div>
//                                     </div>

//                                     {/* Feature Box 2 */}
//                                     <div className="bg-[#3a3a3a] rounded-lg p-3">
//                                         <div className="text-3xl font-bold text-white mb-1">
//                                             {plan.features.reviewSessions}
//                                         </div>
//                                         <div className="text-xs text-gray-400 leading-tight">
//                                             Review Sessions for Concepts
//                                         </div>
//                                     </div>

//                                     {/* Feature Box 3 */}
//                                     <div className="bg-[#3a3a3a] rounded-lg p-3">
//                                         <div className="text-3xl font-bold text-white mb-1">
//                                             {plan.features.digitalResourceBank}
//                                         </div>
//                                         <div className="text-xs text-gray-400 leading-tight">
//                                             All-round Resources for Mentorship etc
//                                         </div>
//                                     </div>

//                                     {/* Feature Box 4 */}
//                                     <div className="bg-[#3a3a3a] rounded-lg p-3">
//                                         <div className="text-3xl font-bold text-white mb-1">
//                                             {plan.features.liveClasses}
//                                         </div>
//                                         <div className="text-xs text-gray-400 leading-tight">
//                                             Plus: All-round Projects Practice Plan etc
//                                         </div>
//                                     </div>

//                                     {/* Feature Box 5 */}
//                                     <div className="bg-[#3a3a3a] rounded-lg p-3">
//                                         <div className="text-3xl font-bold text-white mb-1">
//                                             {plan.features.digitalResourceBank / 2}
//                                         </div>
//                                         <div className="text-xs text-gray-400 leading-tight">
//                                             Board Portfolio and Opinion Polls
//                                         </div>
//                                     </div>

//                                     {/* Add-On Box */}
//                                     <div className="bg-[#3a3a3a] rounded-lg p-3">
//                                         <div className="text-sm font-bold text-white mb-1">
//                                             Add-On
//                                         </div>
//                                         <div className="text-xs text-gray-400 leading-tight">
//                                             {plan.addOns.masterClassesMentors}+ Masterclass from Communities Ideas Builders
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Selected Indicator */}
//                                 {isSelected && (
//                                     <div className="absolute top-4 left-4">
//                                         <div className="bg-green-500 rounded-full p-1">
//                                             <svg
//                                                 className="w-5 h-5 text-white"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 stroke="currentColor"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth={3}
//                                                     d="M5 13l4 4L19 7"
//                                                 />
//                                             </svg>
//                                         </div>
//                                     </div>
//                                 )}
//                             </button>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end gap-4">
//                 <button
//                     onClick={onSkip}
//                     className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
//                 >
//                     Skip For Now
//                 </button>
//                 <button
//                     onClick={onContinue}
//                     disabled={!selectedPlan}
//                     className="bg-[#FDE047] hover:bg-[#FDE047]/90 text-black px-8 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                     Next
//                     <svg
//                         className="w-5 h-5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 5l7 7-7 7"
//                         />
//                     </svg>
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PlanSelection;