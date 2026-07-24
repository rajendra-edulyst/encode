import { Course } from "@/@types/learner/Courses"

export const coursesData: Course[] = [
    {
        id: 1,
        title: 'Introduction to Cybersecurity Fundamentals',
        description: `"Introduction to Cybersecurity Fundamentals" is a concise yet comprehensive course designed to provide participants with a solid understanding of the essential principles and practices in the field of cybersecurity. In just 90 minutes, learners will embark on a journey into the world of cybersecurity, learning to think like a hacker and developing strategies to protect data and networks. Through engaging lessons and demonstrations, this course will empower participants with the knowledge needed to defend against common cyber threats and instill best practices for safeguarding data and privacy. This course is ideally suited for individuals at the beginning of their cybersecurity journey or anyone seeking to bolster their foundational knowledge of cybersecurity concepts and strategies.Whether you aspire to become a cybersecurity professional or simply wish to enhance your digital security awareness, this course is designed to meet your needs.It is accessible to a broad audience, from tech enthusiasts looking to understand cybersecurity fundamentals to professionals in various fields who want to protect their personal and organizational data. To enroll in this course, participants should have a basic familiarity with computers and their use as part of a network.While no prior cybersecurity knowledge is required, a general understanding of computing concepts will be beneficial.Participants should also come with a willingness to learn and an eagerness to explore the critical world of cybersecurity.This course serves as an excellent starting point for those interested in building a career in cybersecurity or those who want to bolster their cybersecurity knowledge to better protect themselves and their organizations from the ever- evolving landscape of cyber threats.`,
        image: 'https://picsum.photos/500/603',
        price: 49.99,
        rating: 4.5,
        level: 'Beginner',
        liked: '90%',
        what_you_will_learn: [
            'Understand the foundations of cybersecurity and the components of a standard cybersecurity model',
            'Build best practices and mitigation methods to protect from common forms of attacks',
            'Explain how attackers perform popular attacks like phishing, social engineering, and ransomware',
            'Implement methods to protect data and maintain privacy while online',
            'Understand the incident response process steps and how they are used when responding to an incident',
            'Explore popular tools and frameworks used in cybersecurity applications'
        ],
        skills_you_will_gain: [
            'Cybersecurity Fundamentals',
            'Data Protection',
            'Incident Response',
            'Network Security',
            'Risk Management',
            'Security Awareness'
        ],
        instructors: [
            {
                id: 1,
                name: 'Prakash Solanki',
                image: 'https://ui-avatars.com/api/?name=Prakash+Solanki',
                bio: 'Prakash Solanki is a cybersecurity expert with over 10 years of experience in the field. He has trained thousands of professionals in cybersecurity best practices and has helped organizations secure their data and networks against cyber threats. Prakash is passionate about sharing his knowledge and empowering others to protect themselves in the digital world.',
                ratings: 4.9,
            },
            {
                id: 2,
                name: 'Priyal Jain',
                image: 'https://ui-avatars.com/api/?name=Priyal+Jain',
                bio: 'Priyal Jain is a cybersecurity analyst with a background in computer science. She has worked on various cybersecurity projects and has experience in threat detection and incident response. Priyal is dedicated to educating others on cybersecurity fundamentals and helping them develop the skills to defend against cyber threats.',
                ratings: 4.8,
            },
            {
                id: 3,
                name: 'Divya Malviya',
                image: 'https://ui-avatars.com/api/?name=Divya+Malviya',
                bio: 'Divya Malviya is a cybersecurity consultant with expertise in network security and risk management. She has worked with organizations to assess their security posture and implement effective cybersecurity measures. Divya is committed to raising awareness about cybersecurity and equipping individuals with the knowledge to protect themselves online.',
                ratings: 4.7,
            }
        ],
        provider: {
            id: 1,
            name: 'Coursera Instructor Network',
            logo: 'https://picsum.photos/200/302',
        },
        testimonials: [
            {
                id: 1,
                name: 'John Doe',
                image: 'https://ui-avatars.com/api/?name=John+Doe',
                testimonial: 'This course was a great introduction to cybersecurity fundamentals. The instructor explained complex concepts in a simple and engaging way. I feel more confident in my ability to protect my data and privacy online.',
                date: '2021-09-01'
            },
            {
                id: 2,
                name: 'Jane Smith',
                image: 'https://ui-avatars.com/api/?name=Jane+Smith',
                testimonial: 'I thoroughly enjoyed this course on cybersecurity. The content was well-structured and easy to follow. The hands-on exercises helped me apply the concepts in real-world scenarios. I would recommend this course to anyone interested in cybersecurity.',
                date: '2021-09-02'
            },
            {
                id: 3,
                name: 'Alice Johnson',
                image: 'https://ui-avatars.com/api/?name=Alice+Johnson',
                testimonial: 'As a beginner in cybersecurity, I found this course to be incredibly informative. The instructor was knowledgeable and provided practical insights into cybersecurity best practices. I feel more prepared to navigate the digital landscape securely.',
                date: '2021-09-03'
            },
            {
                id: 4,
                name: 'Mark Wilson',
                image: 'https://ui-avatars.com/api/?name=Mark+Wilson',
                testimonial: 'This course exceeded my expectations. The content was relevant and up-to-date, and the instructor was engaging and knowledgeable. I learned valuable skills that I can apply in my personal and professional life. I highly recommend this course to anyone interested in cybersecurity',
                date: '2021-09-04'
            },
            {
                id: 5,
                name: 'Sarah Brown',
                image: 'https://ui-avatars.com/api/?name=Sarah+Brown',
                testimonial: 'I am impressed by the quality of this course on cybersecurity fundamentals. The instructor provided clear explanations and practical examples that made the content easy to understand. I feel more confident in my ability to protect myself and my organization from cyber threats.',
                date: '2021-09-05'
            },
            {
                id: 6,
                name: 'Michael Jones',
                image: 'https://ui-avatars.com/api/?name=Michael+Jones',
                testimonial: 'This course was a game-changer for me. The instructor covered a wide range of cybersecurity topics and provided valuable insights into best practices. I feel more equipped to handle cybersecurity challenges and protect my data effectively. I highly recommend this course to anyone looking to enhance their cybersecurity knowledge.',
                date: '2021-09-06'
            },
            {
                id: 7,
                name: 'Emily Davis',
                image: 'https://ui-avatars.com/api/?name=Emily+Davis',
                testimonial: 'I thoroughly enjoyed this course on cybersecurity fundamentals. The content was well-structured and engaging, and the hands-on exercises helped me apply the concepts effectively. The instructor was knowledgeable and provided valuable insights into cybersecurity best practices. I feel more confident in my ability to protect my data and privacy online. I highly recommend this course to anyone interested in cybersecurity.',
                date: '2021-09-07'
            },
            {
                id: 8,
                name: 'David Wilson',
                image: 'https://ui-avatars.com/api/?name=David+Wilson',
                testimonial: 'I am impressed by the quality of this course on cybersecurity fundamentals. The instructor covered a wide range of cybersecurity topics and provided practical insights into best practices. The content was relevant and up-to-date, and the hands-on exercises helped me apply the concepts effectively. I feel more prepared to navigate the digital landscape securely. I highly recommend this course to anyone looking to enhance their cybersecurity knowledge.',
                date: '2021-09-08'
            },
            {
                id: 9,
                name: 'Jessica Lee',
                image: 'https://ui-avatars.com/api/?name=Jessica+Lee',
                testimonial: 'This course was a great introduction to cybersecurity fundamentals. The instructor explained complex concepts in a simple and engaging way, making the content easy to understand. I learned valuable skills that I can apply in my personal and professional life. I feel more confident in my ability to protect myself and my organization from cyber threats.',
                date: '2021-09-09'
            },
            {
                id: 10,
                name: 'Kevin Brown',
                image: 'https://ui-avatars.com/api/?name=Kevin+Brown',
                testimonial: 'As a beginner in cybersecurity, I found this course to be incredibly informative. The instructor provided clear explanations and practical examples that helped me grasp the concepts effectively. The content was well-structured and engaging, and the hands-on exercises were valuable in reinforcing the learning. I feel more equipped to handle cybersecurity challenges and protect my data effectively.',
                date: '2021-09-10',
            }
        ],
        reviews: [
            {
                id: 1,
                name: 'John Doe',
                image: 'https://ui-avatars.com/api/?name=John+Doe',
                review: 'This course was a great introduction to cybersecurity fundamentals. The instructor explained complex concepts in a simple and engaging way. I feel more confident in my ability to protect my data and privacy online.',
                rating: 4.5,
                date: '2021-09-01'
            },
            {
                id: 2,
                name: 'Jane Smith',
                image: 'https://ui-avatars.com/api/?name=Jane+Smith',
                review: 'I thoroughly enjoyed this course on cybersecurity. The content was well-structured and easy to follow. The hands-on exercises helped me apply the concepts in real-world scenarios. I would recommend this course to anyone interested in cybersecurity.',
                rating: 4.7,
                date: '2021-09-02'
            },
            {
                id: 3,
                name: 'Alice Johnson',
                image: 'https://ui-avatars.com/api/?name=Alice+Johnson',
                review: 'As a beginner in cybersecurity, I found this course to be incredibly informative. The instructor was knowledgeable and provided practical insights into cybersecurity best practices. I feel more prepared to navigate the digital landscape securely.',
                rating: 4.8,
                date: '2021-09-03'
            },
            {
                id: 4,
                name: 'Mark Wilson',
                image: 'https://ui-avatars.com/api/?name=Mark+Wilson',
                review: 'This course exceeded my expectations. The content was relevant and up-to-date, and the instructor was engaging and knowledgeable. I learned valuable skills that I can apply in my personal and professional life. I highly recommend this course to anyone interested in cybersecurity',
                rating: 4.9,
                date: '2021-09-04'
            },
            {
                id: 5,
                name: 'Sarah Brown',
                image: 'https://ui-avatars.com/api/?name=Sarah+Brown',
                review: 'I am impressed by the quality of this course on cybersecurity fundamentals. The instructor provided clear explanations and practical examples that made the content easy to understand. I feel more confident in my ability to protect myself and my organization from cyber threats.',
                rating: 4.7,
                date: '2021-09-05'
            },
        ],
        modules: [
            {
                id: 1,
                title: 'Introduction to Cybersecurity Fundamentals',
                description: 'This course focuses on building a foundation for the principles of Cyber Security and protections of data within computers, devices and networks. You will look at the concept of “thinking like a hacker” to learn techniques to defend from the types of attacks that are commonly conducted. Once your foundation has been set you will look at the best practices recommendations when it comes to protecting your data and privacy.',
                duration: '120 minutes',
                whats_included: [
                    {
                        'title': '21 videos',
                        'type': 'video',
                    },
                    {
                        'title': '6 readings',
                        'type': 'reading',
                    },
                    {
                        'title': '1 assignment',
                        'type': 'assignment',
                    }
                ],
                content: [
                    {
                        id: 1,
                        title: '21 videos',
                        description: '21 videos • Total 56 minutes',
                        type: 'video',
                        content: [
                            {
                                title: "Meet Your Instructor",
                                duration: "3 minutes",
                                video_transcript: `Welcome to this foundations of cybersecurity course. I'm excited to have you here as we discuss the importance of understanding components of cybersecurity. Cybersecurity is a critical component to our daily lives as more and more things we do are located on some form of a network. Across this network, we continue to share a large amount of data. The challenge is we are not in control of much of our own personal data that's been stored or placed somewhere on the Internet. Furthermore, even if we've not placed the data there, it can get there by other sources, from the driver's license in your wallet to the data that has been stored when you connected your phone to your car. There are countless records of you and your private information contained within the depths of the Internet. Throughout this course, we will explore the processes you can follow to help protect, not only your data, but also your interaction and storage of this data in different locations. Hello. My name is Prakash Solanki. I have more than 30 years of experience in cybersecurity. I have trained thousands of people in topics from the foundations up through advanced techniques of reverse engineering of malware. This course is designed to introduce you to the topics for pursuing a career in cybersecurity or as a refresher for your existing cybersecurity skills. You'll look at the concept of thinking like a hacker to learn techniques to defend from the types of attacks they're commonly conducted. Once your foundation has been set, you'll look at the best practices recommendations when it comes to protecting your data and privacy. Now let's briefly touch our learning objectives and outcomes. By the end of this course, you'll be able to employ effective strategies to identify the foundations of cybersecurity and the components of a standard cybersecurity model. You will possess the skills to build best practices, mitigation methods to protect from the common forms of attacks. You will be equipped with the skills to explain how attackers perform a variety of popular attacks to include phishing, social engineering and ransomware. You will gain insights into methods to implement to protect their data and maintain their privacy while being online and connected to public networks. You will have an understanding of the incident response process steps and how they are used when responding to an incident. I hope this overview has sparked your curiosity and enthusiasm for the topics we will explore. Let's get started with our first lesson on fundamentals of cybersecurity.`,
                                video_url: 'https://d3c33hcgiwev3.cloudfront.net/WW_ehl-RS76EbwygYUlneg.processed/full/360p/index.webm?Expires=1739404800&Signature=WY3USzOZhCbUQLWDpYnGBaNaozy22IJVzL7gjI15sskcIDmxEXZRTwCs8CXsX~CVJwmlQpd0twNp5Gt36ojZuRQUvQbALvODs9W663aWq9V4e4bFLrXvuZT-3KCj8OK2ZB4MqOPL~3SpKTRpRVChFn8fxvmpEtyoQ2ru23Hv0w4_&Key-Pair-Id=APKAJLTNE6QMUY6HBC5A',
                            },
                            { title: "Getting Started: Defining Cybersecurity", duration: "1 minute" },
                            { title: "Reviewing The Security Model: Authentication", duration: "2 minutes" },
                            { title: "Your Data Online: Confidentiality, Integrity, & Availability", duration: "2 minutes" },
                            { title: "Key Concepts: Authorization & Non-Repudiation", duration: "2 minutes" },
                            { title: "Top 4: The Most Common Cyber Attacks", duration: "2 minutes" },
                            { title: "The Psychology Behind Cyber Attacks", duration: "3 minutes" },
                            { title: "Playing Defense Through Risk Mitigation", duration: "3 minutes" },
                            { title: "Going Beyond Traditional Passwords", duration: "1 minute" },
                            { title: "Three Key Elements For Authentication", duration: "0 minutes" },
                            { title: "Vulnerability Alert: Email Spoofing", duration: "1 minute" },
                            { title: "Top 6: Keys For Securing Your Emails At Work", duration: "6 minutes" },
                            { title: "Identifying Different Types Of Data", duration: "1 minute" },
                            { title: "Protecting Data Through Encryption", duration: "1 minute" },
                            { title: "Protecting Data Through Deletion (Part 1)", duration: "4 minutes" },
                            { title: "Protecting Data Through Deletion (Part 2)", duration: "3 minutes" },
                            { title: "The Framework Of IR", duration: "1 minute" },
                            { title: "The Early Steps Of The IR Process", duration: "4 minutes" },
                            { title: "The Final Steps of the IR Process", duration: "3 minutes" },
                            { title: "Conclusion & Takeaways", duration: "2 minutes" },
                            { title: "Documentation and Reporting", duration: "3 minutes" }
                        ]
                    },
                    {
                        id: 2,
                        title: '6 readings',
                        description: '6 readings • Total 60 minutes',
                        type: 'reading',
                        content: [
                            { title: "Welcome to the Course: Lesson Overview", duration: "10 minutes" },
                            { title: "Additional Resources", duration: "10 minutes" },
                            { title: "Additional Resources", duration: "10 minutes" },
                            { title: "Additional Resources", duration: "10 minutes" },
                            { title: "Additional Resources", duration: "10 minutes" },
                            { title: "Additional Resources", duration: "10 minutes" }
                        ]
                    },
                    {
                        id: 3,
                        title: '1 assignment',
                        description: '1 assignment • Total 60 minutes',
                        type: 'assignment',
                        content: [
                            { title: "Final Assessment", duration: "60 minutes" }
                        ]
                    }
                ],
            }
        ]
    },
    {
        id: 2,
        title: 'Data Science for Beginners',
        description: `"Data Science for Beginners" is a comprehensive course designed to introduce participants to the exciting world of data science. In just 120 minutes, learners will explore the fundamental concepts, tools, and techniques used in data science. Through hands-on exercises and real-world examples, this course will empower participants with the skills needed to analyze data, build predictive models, and derive actionable insights. This course is ideally suited for individuals at the beginning of their data science journey or anyone seeking to bolster their foundational knowledge of data science concepts and techniques. Whether you aspire to become a data scientist or simply wish to enhance your data analysis skills, this course is designed to meet your needs. It is accessible to a broad audience, from tech enthusiasts looking to understand data science fundamentals to professionals in various fields who want to leverage data for decision-making. To enroll in this course, participants should have a basic familiarity with programming concepts and a willingness to learn. While no prior data science knowledge is required, a general understanding of mathematics and statistics will be beneficial. Participants should also come with a willingness to learn and an eagerness to explore the critical world of data science. This course serves as an excellent starting point for those interested in building a career in data science or those who want to bolster their data science knowledge to better analyze and interpret data in their organizations.`,
        image: 'https://picsum.photos/500/602',
        price: 59.99,
        rating: 4.7,
        level: 'Beginner',
        liked: '92%',
        what_you_will_learn: [
            'Understand the foundations of data science and the components of a standard data science workflow',
            'Build predictive models and derive actionable insights from data',
            'Explain how data is collected, cleaned, and analyzed',
            'Implement methods to visualize data and communicate findings effectively',
            'Understand the data science process steps and how they are used when analyzing data',
            'Explore popular tools and frameworks used in data science applications'
        ],
        skills_you_will_gain: [
            'Data Science Fundamentals',
            'Data Wrangling',
            'Data Visualization',
            'Predictive Modeling',
            'Machine Learning',
            'Data Analysis'
        ],
        instructors: [
            {
                id: 1,
                name: 'Sarah Johnson',
                image: 'https://ui-avatars.com/api/?name=Sarah+Johnson',
                bio: 'Sarah Johnson is a data science expert with over 10 years of experience in the field. She has trained thousands of professionals in data science best practices and has helped organizations derive actionable insights from data. Sarah is passionate about sharing her knowledge and empowering others to make informed decisions based on data.',
                ratings: 4.9,
            },
            {
                id: 2,
                name: 'John Doe',
                image: 'https://ui-avatars.com/api/?name=John+Doe',
                bio: 'John Doe is a data scientist with a background in computer science. He has worked on various data science projects and has experience in predictive modeling and data visualization. John is dedicated to educating others on data science fundamentals and helping them develop the skills to analyze data effectively.',
                ratings: 4.8,
            },
            {
                id: 3,
                name: 'Jane Smith',
                image: 'https://ui-avatars.com/api/?name=Jane+Smith',
                bio: 'Jane Smith is a data analyst with expertise in data wrangling and machine learning. She has worked with organizations to clean and analyze data for insights and decision-making. Jane is committed to raising awareness about data science and equipping individuals with the skills to interpret data effectively.',
                ratings: 4.7,
            }
        ],
        provider: {
            id: 2,
            name: 'DataCamp',
            logo: 'https://picsum.photos/200/304',
        },
        testimonials: [
            {
                id: 1,
                name: 'John Doe',
                image: 'https://ui-avatars.com/api/?name=John+Doe',
                testimonial: 'This course was a great introduction to data science for beginners. The instructor explained complex concepts in a simple and engaging way. I feel more confident in my ability to analyze and interpret data effectively.',
                date: '2021-09-01'
            },
            {
                id: 2,
                name: 'Jane Smith',
                image: 'https://ui-avatars.com/api/?name=Jane+Smith',
                testimonial: 'I thoroughly enjoyed this course on data science. The content was well-structured and easy to follow. The hands-on exercises helped me apply the concepts in real-world scenarios. I would recommend this course to anyone interested in data science.',
                date: '2021-09-02'
            },
            {
                id: 3,
                name: 'Alice Johnson',
                image: 'https://ui-avatars.com/api/?name=Alice+Johnson',
                testimonial: 'As a beginner in data science, I found this course to be incredibly informative. The instructor was knowledgeable and provided practical insights into data science best practices. I feel more prepared to analyze and interpret data effectively.',
                date: '2021-09-03'
            },
            {
                id: 4,
                name: 'Mark Wilson',
                image: 'https://ui-avatars.com/api/?name=Mark+Wilson',
                testimonial: 'This course exceeded my expectations. The content was relevant and up-to-date, and the instructor was engaging and knowledgeable. I learned valuable skills that I can apply in my personal and professional life. I highly recommend this course to anyone interested in data science.',
                date: '2021-09-04'
            },
            {
                id: 5,
                name: 'Sarah Brown',
                image: 'https://ui-avatars.com/api/?name=Sarah+Brown',
                testimonial: 'I am impressed by the quality of this course on data science for beginners. The instructor provided clear explanations and practical examples that made the content easy to understand. I feel more confident in my ability to analyze and interpret data effectively.',
                date: '2021-09-05'
            },
            {
                id: 6,
                name: 'Michael Jones',
                image: 'https://ui-avatars.com/api/?name=Michael+Jones',
                testimonial: 'This course was a game-changer for me. The instructor covered a wide range of data science topics and provided valuable insights into best practices. I feel more equipped to analyze and interpret data effectively. I highly recommend this course to anyone looking to enhance their data science knowledge.',
                date: '2021-09-06'
            },
            {
                id: 7,
                name: 'Emily Davis',
                image: 'https://ui-avatars.com/api/?name=Emily+Davis',
                testimonial: 'I thoroughly enjoyed this course on data science for beginners. The content was well-structured and engaging, and the hands-on exercises helped me apply the concepts effectively. The instructor was knowledgeable and provided valuable insights into data science best practices. I feel more confident in my ability to analyze and interpret data effectively. I highly recommend this course to anyone interested in data science.',
                date: '2021-09-07'
            },
            {
                id: 8,
                name: 'David Wilson',
                image: 'https://ui-avatars.com/api/?name=David+Wilson',
                testimonial: 'I am impressed by the quality of this course on data science for beginners. The instructor covered a wide range of data science topics and provided practical insights into best practices. The content was relevant and up-to-date, and the hands-on exercises helped me apply the concepts effectively. I feel more prepared to analyze and interpret data effectively. I highly recommend this course to anyone looking to enhance their data science knowledge.',
                date: '2021-09-08'
            },
            {
                id: 9,
                name: 'Jessica Lee',
                image: 'https://ui-avatars.com/api/?name=Jessica+Lee',
                testimonial: 'This course was a great introduction to data science for beginners. The instructor explained complex concepts in a simple and engaging way, making the content easy to understand. I learned valuable skills that I can apply in my personal and professional life. I feel more confident in my ability to analyze and interpret data effectively.',
                date: '2021-09-09'
            },
            {
                id: 10,
                name: 'Kevin Brown',
                image: 'https://ui-avatars.com/api/?name=Kevin+Brown',
                testimonial: 'As a beginner in data science, I found this course to be incredibly informative. The instructor provided clear explanations and practical examples that helped me grasp the concepts effectively. The content was well-structured and engaging, and the hands-on exercises were valuable in reinforcing the learning. I feel more equipped to analyze and interpret data effectively.',
                date: '2021-09-10',
            }
        ],
        reviews: [
            {
                id: 1,
                name: 'John Doe',
                image: 'https://ui-avatars.com/api/?name=John+Doe',
                review: 'This course was a great introduction to data science for beginners. The instructor explained complex concepts in a simple and engaging way. I feel more confident in my ability to analyze and interpret data effectively.',
                rating: 4.5,
                date: '2021-09-01'
            },
            {
                id: 2,
                name: 'Jane Smith',
                image: 'https://ui-avatars.com/api/?name=Jane+Smith',
                review: 'I thoroughly enjoyed this course on data science. The content was well-structured and easy to follow. The hands-on exercises helped me apply the concepts in real-world scenarios. I would recommend this course to anyone interested in data science.',
                rating: 4.7,
                date: '2021-09-02'
            },
            {
                id: 3,
                name: 'Alice Johnson',
                image: 'https://ui-avatars.com/api/?name=Alice+Johnson',
                review: 'As a beginner in data science, I found this course to be incredibly informative. The instructor was knowledgeable and provided practical insights into data science best practices. I feel more prepared to analyze and interpret data effectively.',
                rating: 4.8,
                date: '2021-09-03'
            },
            {
                id: 4,
                name: 'Mark Wilson',
                image: 'https://ui-avatars.com/api/?name=Mark+Wilson',
                review: 'This course exceeded my expectations. The content was relevant and up-to-date, and the instructor was engaging and knowledgeable. I learned valuable skills that I can apply in my personal and professional life. I highly recommend this course to anyone interested in data science.',
                rating: 4.9,
                date: '2021-09-04'
            },
            {
                id: 5,
                name: 'Sarah Brown',
                image: 'https://ui-avatars.com/api/?name=Sarah+Brown',
                review: 'I am impressed by the quality of this course on data science for beginners. The instructor provided clear explanations and practical examples that made the content easy to understand. I feel more confident in my ability to analyze and interpret data effectively.',
                rating: 4.7,
                date: '2021-09-05'
            },
        ],
        modules: [
            {
                id: 1,
                title: 'Introduction to Data Science',
                description: 'This course focuses on building a foundation for the principles of data science and the tools used to analyze and interpret data. You will look at the concept of data wrangling, data visualization, and predictive modeling. Once your foundation has been set, you will look at the best practices recommendations when it comes to analyzing and interpreting data.',
                duration: '120 minutes',
                whats_included: [
                    {
                        'title': '18 videos',
                        'type': 'video',
                    },
                    {
                        'title': '5 readings',
                        'type': 'reading',
                    },
                    {
                        'title': '1 assignment',
                        'type': 'assignment',
                    }
                ],
                content: [
                    {
                        id: 1,
                        title: '18 videos',
                        description: '18 videos • Total 50 minutes',
                        type: 'video',
                        content: [
                            {
                                title: "Meet Your Instructor",
                                duration: "3 minutes",
                                video_transcript: `Welcome to this foundations of data science course. I'm excited to have you here as we discuss the importance of understanding components of data science. Data science is a critical component to our daily lives as more and more decisions are driven by data. Across various industries, we continue to collect and analyze a large amount of data. The challenge is to derive meaningful insights from this data to make informed decisions. Throughout this course, we will explore the processes you can follow to analyze, visualize, and interpret data. Hello. My name is Sarah Johnson. I have more than 10 years of experience in data science. I have trained thousands of people in topics from the foundations up through advanced techniques of machine learning. This course is designed to introduce you to the topics for pursuing a career in data science or as a refresher for your existing data science skills. You'll look at the concept of data wrangling, data visualization, and predictive modeling. Once your foundation has been set, you'll look at the best practices recommendations when it comes to analyzing and interpreting data. Now let's briefly touch our learning objectives and outcomes. By the end of this course, you'll be able to employ effective strategies to identify the foundations of data science and the components of a standard data science workflow. You will possess the skills to build predictive models and derive actionable insights from data. You will be equipped with the skills to explain how data is collected, cleaned, and analyzed. You will gain insights into methods to implement to visualize data and communicate findings effectively. You will have an understanding of the data science process steps and how they are used when analyzing data. I hope this overview has sparked your curiosity and enthusiasm for the topics we will explore. Let's get started with our first lesson on fundamentals of data science.`,
                                video_url: 'https://d3c33hcgiwev3.cloudfront.net/WW_ehl-RS76EbwygYUlneg.processed/full/360p/index.webm?Expires=1739404800&Signature=WY3USzOZhCbUQLWDpYnGBaNaozy22IJVzL7gjI15sskcIDmxEXZRTwCs8CXsX~CVJwmlQpd0twNp5Gt36ojZuRQUvQbALvODs9W663aWq9V4e4bFLrXvuZT-3KCj8OK2ZB4MqOPL~3SpKTRpRVChFn8fxvmpEtyoQ2ru23Hv0w4_&Key-Pair-Id=APKAJLTNE6QMUY6HBC5A',
                            },
                            { title: "Getting Started: Defining Data Science", duration: "1 minute" },
                            { title: "Reviewing The Data Science Workflow", duration: "2 minutes" },
                            { title: "Your Data: Data Collection and Cleaning", duration: "2 minutes" },
                            { title: "Key Concepts: Data Wrangling and Visualization", duration: "2 minutes" },
                            { title: "Top 4: The Most Common Data Science Techniques", duration: "2 minutes" },
                            { title: "The Psychology Behind Data Analysis", duration: "3 minutes" },
                            { title: "Playing Defense Through Data Validation", duration: "3 minutes" },
                            { title: "Going Beyond Traditional Data Analysis", duration: "1 minute" },
                            { title: "Three Key Elements For Predictive Modeling", duration: "0 minutes" },
                            { title: "Vulnerability Alert: Data Bias", duration: "1 minute" },
                            { title: "Top 6: Keys For Securing Your Data At Work", duration: "6 minutes" },
                            { title: "Identifying Different Types Of Data", duration: "1 minute" },
                            { title: "Protecting Data Through Encryption", duration: "1 minute" },
                            { title: "Protecting Data Through Deletion (Part 1)", duration: "4 minutes" },
                            { title: "Protecting Data Through Deletion (Part 2)", duration: "3 minutes" },
                            { title: "The Framework Of Data Science", duration: "1 minute" },
                            { title: "The Early Steps Of The Data Science Process", duration: "4 minutes" },
                            { title: "The Final Steps of the Data Science Process", duration: "3 minutes" },
                            { title: "Conclusion & Takeaways", duration: "2 minutes" },
                            { title: "Documentation and Reporting", duration: "3 minutes" }
                        ]
                    },
                    {
                        id: 2,
                        title: '5 readings',
                        description: '5 readings • Total 50 minutes',
                        type: 'reading',
                        content: [
                            { title: "Welcome to the Course: Lesson Overview", duration: "10 minutes" },
                            { title: "Additional Resources", duration: "10 minutes" },
                            { title: "Additional Resources", duration: "10 minutes" },
                            { title: "Additional Resources", duration: "10 minutes" },
                            { title: "Additional Resources", duration: "10 minutes" }
                        ]
                    },
                    {
                        id: 3,
                        title: '1 assignment',
                        description: '1 assignment • Total 60 minutes',
                        type: 'assignment',
                        content: [
                            { title: "Final Assessment", duration: "60 minutes" }
                        ]
                    }
                ],
            }
        ]
    },
    {
        id: 3,
        title: 'Introduction to Machine Learning',
        description: `"Introduction to Machine Learning" is an engaging course designed to introduce learners to the foundational concepts and techniques used in machine learning. In just 150 minutes, participants will learn the key algorithms, tools, and methods used to build machine learning models. This course covers a broad range of machine learning topics, from supervised learning to unsupervised learning, and will provide participants with hands-on experience in implementing algorithms to solve real-world problems. Whether you want to begin a career in machine learning or simply enhance your skills, this course is ideal for individuals starting their journey into machine learning or those looking to expand their knowledge.`,
        image: 'https://picsum.photos/500/600',
        price: 69.99,
        rating: 4.8,
        level: 'Beginner',
        liked: '85%',
        what_you_will_learn: [
            'Understand the foundations of machine learning and the key algorithms used in the field',
            'Build machine learning models and evaluate their performance',
            'Explain the difference between supervised and unsupervised learning',
            'Implement machine learning algorithms to solve real-world problems',
            'Understand the role of data in machine learning and how to preprocess data for modeling',
            'Explore popular tools and frameworks used in machine learning applications'
        ],
        skills_you_will_gain: [
            'Machine Learning Fundamentals',
            'Supervised Learning',
            'Unsupervised Learning',
            'Data Preprocessing',
            'Model Evaluation',
            'Predictive Modeling'
        ],
        instructors: [
            {
                id: 1,
                name: 'Alex Smith',
                image: 'https://ui-avatars.com/api/?name=Alex+Smith',
                bio: 'Alex Smith is a machine learning expert with over 10 years of experience in the field. He has trained thousands of professionals in machine learning algorithms and has helped organizations build predictive models for various applications. Alex is passionate about sharing his knowledge and empowering others to leverage machine learning for data-driven decision-making.',
                ratings: 4.9,
            },
            {
                id: 2,
                name: 'Emily Brown',
                image: 'https://ui-avatars.com/api/?name=Emily+Brown',
                bio: 'Emily Brown is a machine learning engineer with a background in computer science. She has worked on various machine learning projects and has experience in natural language processing and computer vision. Emily is dedicated to educating others on machine learning fundamentals and helping them develop the skills to build intelligent systems.',
                ratings: 4.8,
            },
            {
                id: 3,
                name: 'Jack Wilson',
                image: 'https://ui-avatars.com/api/?name=Jack+Wilson',
                bio: 'Jack Wilson is a data scientist with expertise in machine learning and deep learning. He has worked with organizations to develop machine learning models for predictive analytics and recommendation systems. Jack is committed to raising awareness about machine learning and equipping individuals with the skills to build intelligent applications.',
                ratings: 4.7,
            }
        ],
        provider: {
            id: 3,
            name: 'Udacity',
            logo: 'https://picsum.photos/200/301',
        },
        testimonials: [
            {
                id: 1,
                name: 'John Doe',
                image: 'https://ui-avatars.com/api/?name=John+Doe',
                testimonial: 'This course was a great introduction to machine learning. The instructor explained complex concepts in a simple and engaging way. I feel more confident in my ability to build machine learning models and analyze data effectively.',
                date: '2021-09-01'
            },
            {
                id: 2,
                name: 'Jane Smith',
                image: 'https://ui-avatars.com/api/?name=Jane+Smith',
                testimonial: 'I thoroughly enjoyed this course on machine learning. The content was well-structured and easy to follow. The hands-on exercises helped me apply the concepts in real-world scenarios. I would recommend this course to anyone interested in machine learning.',
                date: '2021-09-02'
            },
            {
                id: 3,
                name: 'Alice Johnson',
                image: 'https://ui-avatars.com/api/?name=Alice+Johnson',
                testimonial: 'As a beginner in machine learning, I found this course to be incredibly informative. The instructor was knowledgeable and provided practical insights into machine learning best practices. I feel more prepared to build machine learning models and analyze data effectively.',
                date: '2021-09-03'
            },
            {
                id: 4,
                name: 'Mark Wilson',
                image: 'https://ui-avatars.com/api/?name=Mark+Wilson',
                testimonial: 'This course exceeded my expectations. The content was relevant and up-to-date, and the instructor was engaging and knowledgeable. I learned valuable skills that I can apply in my personal and professional life. I highly recommend this course to anyone interested in machine learning.',
                date: '2021-09-04'
            },
            {
                id: 5,
                name: 'Sarah Brown',
                image: 'https://ui-avatars.com/api/?name=Sarah+Brown',
                testimonial: 'I am impressed by the quality of this course on machine learning fundamentals. The instructor provided clear explanations and practical examples that made the content easy to understand. I feel more confident in my ability to build machine learning models and analyze data effectively.',
                date: '2021-09-05'
            },
            {
                id: 6,
                name: 'Michael Jones',
                image: 'https://ui-avatars.com/api/?name=Michael+Jones',
                testimonial: 'This course was a game-changer for me. The instructor covered a wide range of machine learning topics and provided valuable insights into best practices. I feel more equipped to build machine learning models and analyze data effectively. I highly recommend this course to anyone looking to enhance their machine learning knowledge.',
                date: '2021-09-06'
            },
            {
                id: 7,
                name: 'Emily Davis',
                image: 'https://ui-avatars.com/api/?name=Emily+Davis',
                testimonial: 'I thoroughly enjoyed this course on machine learning fundamentals. The content was well-structured and engaging, and the hands-on exercises helped me apply the concepts effectively. The instructor was knowledgeable and provided valuable insights into machine learning best practices. I feel more confident in my ability to build machine learning models and analyze data effectively. I highly recommend this course to anyone interested in machine learning.',
                date: '2021-09-07'
            },
            {
                id: 8,
                name: 'David Wilson',
                image: 'https://ui-avatars.com/api/?name=David+Wilson',
                testimonial: 'I am impressed by the quality of this course on machine learning fundamentals. The instructor covered a wide range of machine learning topics and provided practical insights into best practices. The content was relevant and up-to-date, and the hands-on exercises helped me apply the concepts effectively. I feel more prepared to build machine learning models and analyze data effectively. I highly recommend this course to anyone looking to enhance their machine learning knowledge.',
                date: '2021-09-08'
            },
            {
                id: 9,
                name: 'Jessica Lee',
                image: 'https://ui-avatars.com/api/?name=Jessica+Lee',
                testimonial: 'This course was a great introduction to machine learning. The instructor explained complex concepts in a simple and engaging way, making the content easy to understand. I learned valuable skills that I can apply in my personal and professional life. I feel more confident in my ability to build machine learning models and analyze data effectively.',
                date: '2021-09-09'
            },
        ],
        reviews: [
            {
                id: 1,
                name: 'John Doe',
                image: 'https://ui-avatars.com/api/?name=John+Doe',
                review: 'This course was a great introduction to machine learning. The instructor explained complex concepts in a simple and engaging way. I feel more confident in my ability to build machine learning models and analyze data effectively.',
                rating: 4.5,
                date: '2021-09-01'
            },
            {
                id: 2,
                name: 'Jane Smith',
                image: 'https://ui-avatars.com/api/?name=Jane+Smith',
                review: 'I thoroughly enjoyed this course on machine learning. The content was well-structured and easy to follow. The hands-on exercises helped me apply the concepts in real-world scenarios. I would recommend this course to anyone interested in machine learning.',
                rating: 4.7,
                date: '2021-09-02'
            },
            {
                id: 3,
                name: 'Alice Johnson',
                image: 'https://ui-avatars.com/api/?name=Alice+Johnson',
                review: 'As a beginner in machine learning, I found this course to be incredibly informative. The instructor was knowledgeable and provided practical insights into machine learning best practices. I feel more prepared to build machine learning models and analyze data effectively.',
                rating: 4.8,
                date: '2021-09-03'
            },
            {
                id: 4,
                name: 'Mark Wilson',
                image: 'https://ui-avatars.com/api/?name=Mark+Wilson',
                review: 'This course exceeded my expectations. The content was relevant and up-to-date, and the instructor was engaging and knowledgeable. I learned valuable skills that I can apply in my personal and professional life. I highly recommend this course to anyone interested in machine learning.',
                rating: 4.9,
                date: '2021-09-04'
            },
            {
                id: 5,
                name: 'Sarah Brown',
                image: 'https://ui-avatars.com/api/?name=Sarah+Brown',
                review: 'I am impressed by the quality of this course on machine learning fundamentals. The instructor provided clear explanations and practical examples that made the content easy to understand. I feel more confident in my ability to build machine learning models and analyze data effectively.',
                rating: 4.7,
                date: '2021-09-05'
            }
        ],
        modules: [
            {
                id: 1,
                title: 'Fundamentals of Machine Learning',
                description: 'This module introduces the foundational concepts of machine learning, including supervised and unsupervised learning. You will explore the basic algorithms and learn the essential steps in building machine learning models.',
                duration: '60 minutes',
                whats_included: [
                    { 'title': '15 videos', 'type': 'video' },
                    { 'title': '3 readings', 'type': 'reading' },
                    { 'title': '1 assignment', 'type': 'assignment' }
                ],
                content: [
                    {
                        id: 1,
                        title: '15 videos',
                        description: '15 videos • Total 40 minutes',
                        type: 'video',
                        content: [
                            {
                                title: 'Introduction to Machine Learning',
                                duration: '4 minutes',
                                video_url: 'https://example.com/video/1',
                                video_transcript: 'In this video, we introduce machine learning and its core concepts, explaining its importance in today\'s world.'
                            },
                            {
                                title: 'Types of Machine Learning',
                                duration: '5 minutes',
                                video_url: 'https://example.com/video/2',
                                video_transcript: 'This video discusses the major types of machine learning: supervised, unsupervised, and reinforcement learning.'
                            },
                            {
                                title: 'Supervised vs Unsupervised Learning',
                                duration: '5 minutes',
                                video_url: 'https://example.com/video/3',
                                video_transcript: 'We compare supervised and unsupervised learning, focusing on their key differences and use cases.'
                            },
                            {
                                title: 'The Role of Data in Machine Learning',
                                duration: '4 minutes',
                                video_url: 'https://example.com/video/4',
                                video_transcript: 'This video explains the importance of data and how it drives machine learning algorithms.'
                            },
                            {
                                title: 'Key Applications of Machine Learning',
                                duration: '3 minutes',
                                video_url: 'https://example.com/video/5',
                                video_transcript: 'We highlight real-world applications of machine learning across different industries.'
                            },
                            {
                                title: 'Building a Basic Model',
                                duration: '5 minutes',
                                video_url: 'https://example.com/video/6',
                                video_transcript: 'In this video, we guide you through the steps of building a basic machine learning model.'
                            },
                            {
                                title: 'Overview of Tools and Frameworks',
                                duration: '4 minutes',
                                video_url: 'https://example.com/video/7',
                                video_transcript: 'This video provides an overview of the popular tools and frameworks used in machine learning.'
                            }
                        ]
                    },
                    {
                        id: 2,
                        title: '3 readings',
                        description: '3 readings • Total 30 minutes',
                        type: 'reading',
                        content: [
                            { title: "Overview of Algorithms in Machine Learning", duration: "10 minutes" },
                            { title: "Introduction to Data Preprocessing", duration: "10 minutes" },
                            { title: "Cross-Validation and Model Optimization", duration: "10 minutes" }
                        ]
                    },
                    {
                        id: 3,
                        title: '1 assignment',
                        description: '1 assignment • Total 20 minutes',
                        type: 'assignment',
                        content: [
                            { title: "Supervised Learning Exercise", duration: "20 minutes" }
                        ]
                    }
                ],
            },
            {
                id: 2,
                title: 'Advanced Machine Learning Techniques',
                description: 'In this module, we explore more advanced techniques in machine learning, including ensemble methods, neural networks, and deep learning. This module provides deeper insights into how to tackle more complex machine learning problems.',
                duration: '90 minutes',
                whats_included: [
                    { 'title': '12 videos', 'type': 'video' },
                    { 'title': '4 readings', 'type': 'reading' },
                    { 'title': '2 assignments', 'type': 'assignment' }
                ],
                content: [
                    {
                        id: 1,
                        title: '12 videos',
                        description: '12 videos • Total 60 minutes',
                        type: 'video',
                        content: [
                            { title: "Introduction to Advanced Techniques", duration: "5 minutes" },
                            { title: "Ensemble Learning: Random Forests and Boosting", duration: "6 minutes" },
                            { title: "Decision Trees in Depth", duration: "5 minutes" },
                            { title: "Boosting Algorithms Overview", duration: "5 minutes" },
                            { title: "Introduction to Neural Networks", duration: "5 minutes" },
                            { title: "Training a Neural Network", duration: "6 minutes" },
                            { title: "Backpropagation Algorithm", duration: "6 minutes" },
                            { title: "Convolutional Neural Networks (CNN)", duration: "7 minutes" },
                            { title: "Recurrent Neural Networks (RNN)", duration: "6 minutes" },
                            { title: "Overfitting in Neural Networks", duration: "5 minutes" },
                            { title: "Introduction to Deep Learning", duration: "5 minutes" },
                            { title: "Deploying Machine Learning Models", duration: "5 minutes" }
                        ]
                    },
                    {
                        id: 2,
                        title: '4 readings',
                        description: '4 readings • Total 40 minutes',
                        type: 'reading',
                        content: [
                            { title: "Ensemble Learning and Model Tuning", duration: "10 minutes" },
                            { title: "Neural Network Architectures", duration: "10 minutes" },
                            { title: "Understanding RNNs and CNNs", duration: "10 minutes" },
                            { title: "Deploying ML Models in Production", duration: "10 minutes" }
                        ]
                    },
                    {
                        id: 3,
                        title: '2 assignments',
                        description: '2 assignments • Total 40 minutes',
                        type: 'assignment',
                        content: [
                            { title: "Building a Random Forest Model", duration: "20 minutes" },
                            { title: "Implementing a Neural Network", duration: "20 minutes" }
                        ]
                    }
                ],
            }
        ]
    }
]