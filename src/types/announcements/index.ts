type Announcement ={
    _id: string;
    title: string;
    description: string;
    details?: string;
    from?: "Admin" | "HOD" | "FACULTY" | "EXAM-CELL";
    tags?: string[];
    startDate?: string;
    endDate?: string;
    isActive: boolean;
    createdAt: string;
    createdBy?: { name: string };
    attachements: {
      title: string;
      linkUrl?: string;
      uploadRef?: { url: string };
    }[];
  };