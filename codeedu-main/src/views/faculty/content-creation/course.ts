// Course types
export interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    modules: Module[];
    coverImage?: string;
  }
  
  export interface Module {
    id: string;
    title: string;
    description: string;
    coverImage?: string;
    contents: Content[];
  }
  
  export interface Content {
    id: string;
    type: ContentType;
    title: string;
    data: any;
  }
  
  export type ContentType = 
    | 'notes'
    | 'audio'
    | 'video'
    | 'assignment'
    | 'quiz'
    | 'liveClass'
    | 'scorm'
    | 'survey'
    | 'interactive'
    | 'text';
  
  export interface ContentTypeInfo {
    type: ContentType;
    label: string;
    icon: string;
  }
  