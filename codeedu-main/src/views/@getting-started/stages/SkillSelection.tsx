import { SkillType } from '../CreativeStages';
import neurology from '@assets/images/neurology.png';
import pallete from '@assets/images/palette.png';
import extension from '@assets/images/extension.png';
import flowchart from '@assets/images/flowchart.png';
import area_chart from '@assets/images/area_chart.png';
import { ChevronRight } from 'lucide-react';
import ApiService from '@/services/ApiService';
import { useEffect, useState } from 'react';

interface SkillSelectionProps {
    selectedSkills: SkillType[];
    onSelect: (skills: SkillType[]) => void;
    onContinue: () => void;
    onSkip: () => void;
    onBack: () => void;
}
const skillsColor = ['#6F4DBD', '#E66B1F', '#26DDDD', '#E132D2', '#7CD017'];
const skillsIcon = [neurology, pallete, extension, flowchart, area_chart];


const SkillSelection = ({ selectedSkills, onSelect, onContinue, onSkip, onBack }: SkillSelectionProps) => {
    const [skills, setSkills] = useState<any[]>([]);
    const [mappedSkills, setMappedSkills] = useState<any[]>([]);
    const getSkillsMapped = async () => {
        const api = "skills-list";
        const param = new URLSearchParams();
        param.append("creative", "1")
        const result = await ApiService.fetchDataWithAxios<any>({
            url: api,
            method: 'GET',
            params: param
        });

        setSkills(result?.data || []);
    }

    const getSkillsMappedList = async () => {
        const api = "skills-mapping-list";
        const param = new URLSearchParams();
        param.append("creative", "1")
        const result = await ApiService.fetchDataWithAxios<any>({
            url: api,
            method: 'GET',
            params: param
        });

        setMappedSkills(result?.data || []);
    }

    useEffect(() => {
        getSkillsMapped();
        getSkillsMappedList();
    }, [])

    const handleMappingSkills = async () => {
        const api = "add-skill-mapping";
        const payload = {
            skill_id: selectedSkills.join(','),
        };
        ApiService.fetchDataWithAxios<any>({
            url: api,
            method: 'POST',
            data: payload
        });
        onContinue();
    }

    const toggleSkill = (skillId: number) => {
        if (selectedSkills.includes(skillId)) {
            onSelect(selectedSkills.filter(s => s !== skillId));
        } else {
            onSelect([...selectedSkills, skillId]);
        }
    };

    useEffect(() => {
        const alreadySelectedSkills = mappedSkills?.map(ms => ms.skill_id) || [];

        if (alreadySelectedSkills.length > 0 && selectedSkills.length === 0) {
            const filteredSkills = alreadySelectedSkills.filter(id => id !== null);
            onSelect(filteredSkills);
        }
    }, [onSelect, selectedSkills.length, mappedSkills]);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6 md:mb-8 px-4 md:px-0">
                <h1 className="text-[28px] md:text-[36px] font-bold text-white leading-tight">Which Skills Feel Like Second <span className='font-creative text-creativeblue dark:text-[#00A8E9] font-[400]'>Nature</span></h1>
                <p className="text-white text-sm md:text-base mt-2 opacity-80 font-normal flex flex-wrap gap-1 md:gap-2 items-center justify-center leading-normal">
                    Select Your Power Stack of Skills (
                    <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center leading-none">P</span>
                    Primary &
                    <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center leading-none">S</span>
                    Secondary
                    )
                </p>
            </div>

            {/* Skills Grid */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-[648px] mx-auto px-4 md:px-0">
                {skills.slice(0, 5).map((skill: any, i: number) => {
                    const isSelected = selectedSkills.includes(skill.id);
                    const index = selectedSkills.indexOf(skill.id);
                    const isDisabled =
                        selectedSkills.length >= 2 && !isSelected;
                    const color = skillsColor[i % skillsColor.length];

                    return (
                        <button
                            key={skill.id}
                            onClick={() => !isDisabled && toggleSkill(skill.id)}
                            disabled={isDisabled}
                            className={`relative w-full max-w-[200px] h-[190px] duration-300 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {/* Main Card */}
                            <div
                                className={`relative rounded-3xl pr-1.5 overflow-hidden min-h-[190px] flex items-end`}>
                                {/* Background */}
                                {/* Top Left SVG/Icon Block */}
                                <div
                                    className="absolute top-0 left-0 z-10 scale-[0.8] origin-top-left"
                                >
                                    <svg width="91" height="99" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M72.075 0h-53.15A18.762 18.762 0 008.73 2.991 19.014 19.014 0 000 19.013V99a19.01 19.01 0 018.33-15.755 18.763 18.763 0 0110.595-3.258h53.15c3.757 0 7.258-1.1 10.204-2.998A19.022 19.022 0 0091 60.974V19.013A19.02 19.02 0 0082.85 3.38 18.766 18.766 0 0072.075 0z" fill={color} /></svg>

                                    <img
                                        src={skill.icon}
                                        alt={skill.name}
                                        className="absolute top-5 left-5 w-10 h-10 object-contain z-20"
                                    />
                                </div>
                                {/* Badge */}
                                {isSelected && (
                                    <div className="absolute top-1 right-0 z-20">
                                        <span
                                            className="text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold"
                                            style={{ backgroundColor: color }}
                                        >
                                            {index === 0
                                                ? 'P'
                                                : index === 1
                                                    ? 'S'
                                                    : index + 1}
                                        </span>
                                    </div>
                                )}
                                <div
                                    className={`bg-[#1D1D1D] rounded-[20px] h-full min-h-[170px] flex items-center justify-center relative overflow-hidden w-full border-[3px] ${isSelected ? '' : 'border-[#1D1D1D]'
                                        }`}
                                    style={{
                                        borderColor: isSelected ? color : '#1D1D1D',
                                    }}
                                >
                                    {/* Title */}
                                    <h3 className="text-[18px] md:text-[20px] mt-8 leading-[1.3] font-bold text-white text-center relative z-10 px-4">
                                        {skill.name}
                                    </h3>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>


            <div className="flex justify-end gap-3 absolute right-52  px-4 md:px-0 w-full">
                <button
                    onClick={onSkip}
                    className="bg-gray-500 hover:bg-gray-600 text-white text-[12px] md:text-[13px] font-semibold rounded-[10px] flex flex-col items-center justify-center w-[75px] h-[75px] md:w-[85px] md:h-[85px] shadow-lg transition-all leading-snug"
                >
                    <span>Skip</span>
                    <span>for</span>
                    <span>Now</span>
                </button>
                <button
                    onClick={handleMappingSkills}
                    disabled={selectedSkills.length === 0}
                    className="bg-[#FFEC00] hover:bg-[#FFEC00]/90 text-black text-[12px] md:text-[14px] font-bold rounded-[10px] flex flex-col items-center justify-center w-[75px] h-[75px] md:w-[85px] md:h-[85px] shadow-lg transition-all leading-snug disabled:bg-[#FFEC00]/60 disabled:cursor-not-allowed"
                >
                    {selectedSkills.length > 0 ? (
                        <span>Next</span>
                    ) : (
                        <>
                            <span>Select</span>
                            <span>Skills</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SkillSelection;