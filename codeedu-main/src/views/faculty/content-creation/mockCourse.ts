import { Course } from "./course";

export const mockCourse: Course = {
  id: "1",
  title: "Visual Communication",
  description: "Visual communication is the practice of graphically representing information to create meaning and communicate effectively. It encompasses a wide range of forms and media, including images, typography, symbols, colors, and graphic design elements, all working together to convey messages and ideas.",
  category: "Design",
  coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop",
  modules: [
    {
      id: "m1",
      title: "Unit 1- Introduction to Visual Communication",
      description: "This module introduces the fundamental concepts of visual communication.",
      contents: [
        {
          id: "c1",
          type: "notes",
          title: "INTRODUCTION TO VISUAL COMMUNICATION",
          data: {
            points: [
              "Understand the basic definition & importance of visual communication",
              "Recognize the role of visual communication in modern society",
              "Identify different forms of visual communication"
            ],
            language: "English",
            pages: 1
          }
        },
        {
          id: "c2",
          type: "assignment",
          title: "Visual Analysis Exercise",
          data: {
            description: "Analyze a visual advertisement and identify key elements",
            dueDate: "2023-06-15"
          }
        }
      ]
    },
    {
      id: "m2",
      title: "Unit 2- Elements of Design",
      description: "Explore the fundamental elements that compose visual designs.",
      contents: []
    },
    {
      id: "m3",
      title: "Unit 3- Color Theory",
      description: "Learn how colors work together and affect visual communication.",
      contents: []
    }
  ]
};
