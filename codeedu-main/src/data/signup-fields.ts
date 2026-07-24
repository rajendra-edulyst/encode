type SignUpFieldOption = string;

type SignUpFieldType = 'radio' | 'checkbox' | 'input' | 'select' | 'textarea' | 'file';

interface SignUpField {
    type: SignUpFieldType;
    question: string;
    options?: SignUpFieldOption[];
    required: boolean;
    name: string;
}

const signUpIndustryFields: SignUpField[] = [
    {
        type: 'radio',
        name: 'userType',
        question: 'Select the category that best represents your organization',
        options: [
            "Professional Organization ( Govt. Council, Bodies, Chambers, Society etc)",
            "Academic Organization ( E- learning platform , Education Platform etc.)",
            "Production Industry ( Manufacturing based)",
            "Service Industry ( Design Studio, Fashion House etc)",
            "Product Distributor ( Vendor , Retailer - Design Based products)",
            "Craft Cluster / NGO ( Govt. recognized and  private )",
            "Non-Designer Based Industry"
        ],
        required: true
    },
    {
        type: 'input',
        question: 'Name of your organization',
        required: true,
        name: 'organization'
    },
    {
        type: 'input',
        question: 'Provide a brief description of your organization',
        required: true,
        name: 'description'
    },
    {
        type: 'input',
        question: 'List your areas of specialization.',
        required: true,
        name: 'specialization'
    },
    {
        type: 'input',
        question: 'Provide the links to your organization’s social media accounts :-',
        required: true,
        name: 'socialMediaLinks'
    },
    {
        type: 'input',
        question: 'Provide the location of your manufacturing unit ( If applicable)',
        required: false,
        name: 'manufacturingUnitLocation'
    },
    {
        type: 'input',
        question: 'Address of your head office or main office',
        required: true,
        name: 'headOfficeAddress'
    },
    {
        type: 'file',
        question: "Upload your organization's brochure",
        required: true,
        name: 'brochure'
    },
    {
        type: 'radio',
        question: 'How often do you require interns?',
        options: [
            "Every 3 Months",
            "Every 6 Months",
            "Every 12 Months",
        ],
        required: true,
        name: 'internshipFrequency'
    },
    {
        type: 'input',
        question: 'Provide the name and designation of the key person for communication (Name, Designation, Email, Phone number)',
        required: true,
        name: 'keyPersonContact'
    },
    {
        type: 'input',
        question: 'Name and contact details of Director & CEO of the company',
        required: true,
        name: 'directorContact'
    },
    {
        type: 'checkbox',
        question: 'What do you expect from this collaboration or partnership?',
        options: [
            "Innternship & Placemet (Access to Industry Ready Talent)",
            "Expert Talk / Panel Discussion",
            "Co - Teaching",
            "Consultancy Projects",
            "Inndustry Visit",
            "Faculty Development Program",
            "Curriculum Design"
        ],
        required: true,
        name: 'collaborationExpectations'
    },
    {
        type: 'radio',
        question: 'Duration of the internship program?',
        options: [
            "30 Days",
            "60 Days",
            "90 Days",
            "120 Days",
            "180 Days"
        ],
        required: true,
        name: 'internshipDuration'
    },
    {
        type: 'radio',
        question: 'Would you be willing to mentor students through workshops, seminars, or projects?',
        options: [
            "Yes",
            "No",
            "Maybe"
        ],
        required: true,
        name: 'mentorStudents'
    },
    {
        type: 'radio',
        question: 'Are you interested in offering student industry visit programs?',
        options: [
            "Yes",
            "No"
        ],
        required: true,
        name: 'industryVisitPrograms'
    },
    {
        type: 'radio',
        question: 'Would you allow students to test or develop prototypes for academic purposes in your facility?',
        options: [
            "Yes",
            "No"
        ],
        required: true,
        name: 'prototypeDevelopment'
    },
    {
        type: 'radio',
        question: 'Are you interested in participating in student placement drives?',
        options: [
            "Yes",
            "No"
        ],
        required: true,
        name: 'placementDrives'
    },
    {
        type: 'radio',
        question: 'Would your organization be willing to sponsor or support events such as workshops, seminars, panel discussions or exhibitions?',
        options: [
            "Yes",
            "No",
            "Maybe (Depends upon the event)"
        ],
        required: true,
        name: 'eventSponsorship'
    },
    {
        type: 'checkbox',
        question: 'According to you, what qualities do you feel design freshers are lacking?',
        options: [
            "Practical Industry Experience",
            "Strong Communication Skills",
            "Time Management",
            "Problem - Solving Skills",
            "Creative Thinking",
            "Understannding of Market Trennds",
            "Collaboration & Teamwork",
            "Technical SKills (eg. software proficiency)",
            "Presentation Skills"
        ],
        required: true,
        name: 'qualitiesLacking'
    }
];


const signUpCommunityFields: SignUpField[] = [
    {
        type: 'radio',
        name: 'isCodeGraduate',
        question: 'Are you a graduate of CODE?',
        options: ['Yes', 'No', 'Other'],
        required: true
    },
    {
        type: 'input',
        name: 'otherInstitution',
        question: "If you selected 'Other,' please provide the institution name.",
        required: true
    },
    {
        type: 'input',
        name: 'fullName',
        question: 'Your Name',
        required: true
    },
    {
        type: 'input',
        name: 'email',
        question: 'Email Address',
        required: true
    },
    {
        type: 'input',
        name: 'contactNumber',
        question: 'Contact Number',
        required: true
    },
    {
        type: 'input',
        name: 'graduationYear',
        question: 'Year of Graduation',
        required: true
    },
    {
        type: 'radio',
        name: 'degreeEarned',
        question: 'Degree Earned',
        options: ['B.DES', 'M.DES', 'B.ARCH', 'M.PLAN', 'B.Voc', 'Other'],
        required: true
    },
    {
        type: 'radio',
        name: 'employmentStatus',
        question: 'Are you employed?',
        options: ['Yes', 'No', 'Self Employed', 'Other'],
        required: true
    },
    {
        type: 'input',
        name: 'organizationName',
        question: 'Company/Organization Name',
        required: true
    },
    {
        type: 'checkbox',
        name: 'domainInterest',
        question: 'In which domain you are working/interested in?',
        options: [
            'Interior',
            'Product',
            'Fashion',
            'Apparel & Textile',
            'Graphic',
            'UX',
            'Other'
        ],
        required: true
    },
    {
        type: 'checkbox',
        name: 'supportRequired',
        question: 'What support you are looking from  CODE Community for  your professional development?',
        options: [
            'Internship & Placement Drives',
            'Immersion Programs - National & International',
            "CODE's flagship events - enCODE, DEBW, Stambh, Turpan",
            'Mentorship Opportunities',
            'Networking with Industry Experts',
            'Access to Industry Directories',
            'Student Licenses for Software/Tools',
            'Hands-on workshops',
            'Micro Credential courses',
            'National and International Design Updates',
            'Job Opportunities',
            'Sponsorship for Design Projects',
            'Intellectual Property Rights',
            'Research & Thesis Papers',
            'Case Studies',
            'Latest Design Trends and Updates',
            'Event Volunteering',
            'Other'
        ],
        required: true
    },
    {
        type: 'checkbox',
        name: 'preferredConnection',
        question: 'How would you prefer to stay connected with the CODE network?',
        options: [
            'Email Newsletters',
            'WhatsApp Group',
            'Social Media Platforms (LinkedIn, Facebook, etc)',
            'In-Person events',
            'Virtual events (Webinars, online meetups)'
        ],
        required: true
    }
];



export {signUpIndustryFields, signUpCommunityFields};