// features/helpCenter/data/faqs.ts

export type FaqAction = {
  label: string;
  onClick?: () => void;
  href?: string;
};

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  category: string;       
  images?: string[];
  actions?: FaqAction[];
};

export const faqs: FaqItem[] = 
  // ---------------- Getting Started ----------------
 
[
  {
    "id": 1,
    "question": "How do I log in to the portal?",
    "answer": "→ Go to the login page → Enter email/username → Enter password → Click Login → Access your dashboard",
    "category": "Getting Started",
    "images": ["img_1.png"]
  },
  {
    "id": 2,
    "question": "I didn’t receive the verification email. What should I do?",
    "answer": "→ Check spam/junk folder → Verify email is correct → Click “Resend Verification” → Contact support if still not received.",
    "category": "Getting Started",
    "images": ["img_1.png"]
  },
  {
    "id": 3,
    "question": "My account is locked. What should I do?",
    "answer": "→ Wait 15–30 mins → Try again → If still locked, raise a query with your email and issue → Follow support instructions.",
    "category": "Getting Started",
  },
 
  {
    "id": 6,
    "question": "What should I do if the login page isn’t loading or shows error?",
    "answer": "→ Refresh the page → Try another browser → Clear cache/cookies → If issue remains, raise a query for help.",
    "category": "Getting Started",
  },
  {
    "id": 7,
    "question": "Is registration mandatory before login?",
    "answer": "→ Yes → You must sign up first → Verify email → Then log in using your credentials.",
    "category": "Getting Started",
    "images": ["id_7/login.png"]
  },

  {
    "id": 8,
    "question": "Can I log in from multiple devices?",
    "answer": "→ Yes → You can log in on multiple devices → But logging out from one device won't log you out from others unless you do it manually.",
    "category": "Getting Started",
  },

  {
    "id": 9,
    "question": "Why is the login button not working?",
    "answer": "→ Check if all fields are filled → Ensure JavaScript is enabled → Try a different browser → Disable browser extensions temporarily.",
    "category": "Getting Started",
  },
  {
    "id": 10,
    "question": "How do I know if my account was created successfully?",
    "answer": "→ You’ll receive a confirmation email → Click the verification link → Then log in using your credentials.",
    "category": "Getting Started",
    
  },
  {
    "id": 11,
    "question": "What should I do after logging in?",
    "answer": "→ Access your dashboard → Explore tabs like Profile, Timetable, LMS → Complete any pending verification like KYC.",
    "category": "Getting Started",
    "images": ["id_11/laptop.png"]
  },
  {
    "id": 12,
    "question": "How do I update my profile information?",
    "answer": "→ Go to the Profile section → Click on 'Edit Profile' → Make changes and save → Ensure email and mobile are valid.",
    "category": "Getting Started",
    "images": ["id_12/digital id.png"]
  },
  {
  "id": 13,
  "question": "What should I do after logging in?",
  "answer": "→ You will be prompted to verify your personal email and phone number → Enter your email and click 'Send OTP' → Verify the OTP sent to your email → Ensure your mobile number is registered correctly → Once verified, click 'Submit' to proceed to the dashboard.",
  "category": "Getting Started",
  "images": ["id_13/verify.png"]
},
{
  "id": 14,
  "question": "What should I do after logging in for the first time?",
  "answer": "→ After verifying with your mobile number, you have to create a Digital Card.",
  "category": "Getting Started",
  "images": ["id_14/digital card.png"]
},
{
  "id": 15,
  "question": "How should I update incorrect information in my profile?",
  "answer": "→ Click on the 'Request Data Correction' button → After that, go to the 'Query' section → Raise a query with the details you want to correct → Submit your request and wait for approval.",
  "category": "Getting Started",
  "images": ["id_15/digital card.png","id_15/query.png"]
},

  {
    "id": 16,
    "question": "How do I view my timetable?",
    "answer": "→ Click on the 'Timetable' tab from the sidebar or dashboard → Select your course or semester → Timetable will be displayed in a calendar/table format.",
    "category": "Getting Started",
    "images": ["id_16/laptop.png","id_16/timetable.png"]
  },
 
  
  {
    "id": 17,
    "question": "What is the LMS used for?",
    "answer": "→ LMS (Learning Management System) is used to access course materials, attend online lectures, submit assignments, and track academic progress.",
    "category": "Getting Started",
    
  },
  {
    "id": 18,
    "question": "What browsers are supported?",
    "answer": "→ Recommended browsers are Chrome, Firefox, Microsoft Edge, and Safari (latest versions) → Ensure cookies and JavaScript are enabled.",
    "category": "Getting Started",
    
  },


  
  {
    "id": 19,
    "question": "How do I complete KYC verification?",
    "answer": "→ Go to the KYC section → Upload required ID documents → Fill personal details accurately → Submit and wait for verification.",
    "category": "Getting Started",
    
  },

  {
    "id": 20,
    "question": "Can I update my KYC details?",
    "answer": "-> After submitting the details for the digital card, you have to verify the details and submit it.",
    "category": "Getting Started",
    
  },
 
  
  {
    "id": 21,
    "question": "How do I apply for AEC,VAC,SEC courses?",
    "answer": "→ Go to the 'Dashboard' tab → Select AEC/SEC/VAC section → Choose your course and click apply → Confirm your selection.",
    "category": "Getting Started",
    "images": ["id_21/course.png"]
  },
  
  {
    "id": 22,
    "question": "Can I apply for more than one type of course?",
    "answer": "→ Yes, you can apply for AEC, VAC, and SEC courses separately as long as they don’t clash in schedule.",
    "category": "Getting Started",
    
  },
  
  {
    "id": 23,
    "question": "Can I cancel a course application?",
    "answer": "→ Yes, before deadline → Go to 'My Applications' → Select course and click on 'Cancel Application'.",
    "category": "Getting Started",
    
  },
  {
    "id": 24,
    "question": "What is the deadline for course applications?",
    "answer": "→ Deadlines vary by course → Refer to course listings or university notices for exact dates.",
    "category": "Getting Started",
    
  },
  {
    "id": 25,
    "question": "How are students selected for courses?",
    "answer": "→ Based on eligibility, availability of seats, prerequisites, and in some cases, academic performance.",
    "category": "Getting Started",
    
  },
  {
    "id": 26,
    "question": "What if my selected course is full?",
    "answer": "→ You will be placed on a waiting list or need to select an alternative → Check seat availability regularly.",
    "category": "Getting Started",
    
  },
  {
    "id": 27,
    "question": "Can I switch courses later?",
    "answer": "→ Course switching is allowed during a specific period → Contact admin or visit Course Management page.",
    "category": "Getting Started",
    
  },
  {
    "id": 28,
    "question": "How to check eligibility for a course?",
    "answer": "→ Open course details → Scroll to 'Eligibility Criteria' → Compare it with your academic qualifications.",
    "category": "Getting Started",
    
  },
  {
    "id": 29,
    "question": "Who approves my course enrollment?",
    "answer": "→ Final approval is done by the academic coordinator or course instructor based on your application.",
    "category": "Getting Started",
    
  },
 



  {
    "id": 30,
    "question": "How to mark attendance in an online class?",
    "answer": "→ Attendance is automatically marked during live sessions → Make sure to log in with your official ID and stay till end.",
    "category": "Getting Started",
    
  },



  {
  "id": 31,
  "question": "How can I view upcoming events on the calendar?",
  "answer": "→ Go to the 'Calendar' section in your dashboard to see all scheduled events. You can switch between day, week, and month views as per your preference.",
  "category": "Getting Started",
  "images": ["id_31/calender.png"]
},
{
  "id": 32,
  "question": "How do I join a community group on the portal?",
  "answer": "→ Go to the 'Community' section, browse the available groups, and click 'Join' on the ones you're interested in. Some groups may require approval from the group admin.",
  "category": "Getting Started",
  "images": ["id_32/community.png"]
},

{
  "id": 33,
  "question": "Will I get notified if someone replies to my post or tags me?",
  "answer": "→ Yes, you’ll be notified in the bell icon on the top-right corner of the dashboard when someone replies to your post, mentions you, or interacts with your content in the community.",
  "category": "Getting Started",
  "images": ["id_33/bell .png"]
},

{
  "id": 34,
  "question": "How can I submit a new query on the portal?",
  "answer": "→ Go to the 'Queries' section in the left menu → Click on the 'New Query' button at the top right → Fill in the required details like Title, Description, and Recipient → Submit the query and track its status under 'My Queries'.",
  "category": "Query",
  "images": ["id_34/query.png"]
}



]