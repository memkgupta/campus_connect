"use client"
import React, { useState } from 'react';
import { 
  Bell,
  Plus,
  Pencil,
  Save,
  X,
  Link as LinkIcon,

  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CalendarIcon
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_URL } from '@/constants';
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
 interface Announcement {
    _id?: string;
    title: string;
    description: string;
    actionLink?: string;
    endDate: Date;
    isRemoved: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }

const initialAnnouncements: Announcement[] = [
  {
    _id: '1',
    title: 'Important Notice for Final Exams',
    description: 'All students must bring their ID cards for the final examinations.',
    actionLink: 'https://example.com/exam-guidelines',
    endDate: new Date('2024-05-01'),
    isRemoved: false,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
  },
  {
    _id: '2',
    title: 'Library Hours Extended',
    description: 'The library will remain open until midnight during the exam period.',
    endDate: new Date('2024-05-15'),
    isRemoved: false,
    createdAt: new Date('2024-03-16'),
    updatedAt: new Date('2024-03-16')
  },
  {
    _id: '3',
    title: 'Workshop on Machine Learning',
    description: 'Join us for an interactive workshop on ML basics.',
    actionLink: 'https://example.com/ml-workshop',
    endDate: new Date('2024-04-20'),
    isRemoved: false,
    createdAt: new Date('2024-03-17'),
    updatedAt: new Date('2024-03-17')
  }
];

function Modal({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-950 rounded-lg p-6 w-full max-w-2xl relative animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-slate-900 text-gray-400 hover:text-yellow-400 disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors
              ${currentPage === page 
                ? 'bg-yellow-400 text-slate-950 font-semibold' 
                : 'bg-slate-900 text-gray-400 hover:text-yellow-400'
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-slate-900 text-gray-400 hover:text-yellow-400 disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnnouncement, setEditedAnnouncement] = useState<Announcement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults,setTotalResults] = useState(0);
  const [isSaving,setIsSaving] = useState(false);
  const itemsPerPage = 20;
    const [filters,setFilters] = useState
    ({
        title:"",
        date:"",
        page:1,
        show_removed:false
    })

  
  

  const handleCreate = () => {
    setIsCreating(true);
    setEditedAnnouncement({
      title: '',
      description: '',
      actionLink: '',
      endDate: new Date(),
      isRemoved: false
    });
  };

  const handleEdit = (announcement: Announcement) => {
    setIsEditing(true);
    setEditedAnnouncement(announcement);
  };

  const handleSave = async() => {
    if (!editedAnnouncement) return;
    setIsSaving(true)
    if (isCreating) {
       try {
        const req = await axios.post(`${BACKEND_URL}/admin/announcements`,editedAnnouncement,{
            headers:{
                "Authorization":`Bearer ${Cookies.get("access-token")}`
            }
        })
        const _id = req.data._id
        setAnnouncements(prev => [...prev, { ...editedAnnouncement, _id: _id}]);
      setIsCreating(false);
       toast({
        title:"Announcement created successfully",
        variant:"default"
       });
     
       } catch (error) {
        toast({
            title:"Something went wrong",
            variant:'destructive'
        })
       }
      
    } 
    else {
        try {
            const req = await axios.put(`${BACKEND_URL}/admin/announcements/${editedAnnouncement._id}`,editedAnnouncement,{
                headers:{
                    "Authorization":`Bearer ${Cookies.get("access-token")}`
                }
            })
          
       
           toast({
            title:"Announcement updated successfully",
            variant:"default"
           });
           setAnnouncements(prev => 
            prev.map(a => a._id === editedAnnouncement._id ? editedAnnouncement : a)
          );
          setIsEditing(false);
           } catch (error) {
            toast({
                title:"Something went wrong",
                variant:'destructive'
            })
   
    }
    setIsSaving(false);
    setEditedAnnouncement(null);
  };
  }
  const toggleRemove = (id: string) => {
    setAnnouncements(prev => 
      prev.map(a => a._id === id ? { ...a, isRemoved: !a.isRemoved } : a)
    );
    
    // Adjust current page if necessary after removal
    const newActiveCount = announcements.length - 1;
    const newTotalPages = Math.ceil(newActiveCount / itemsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedAnnouncement) return;
    
    const { name, value } = e.target;
    setEditedAnnouncement(prev => ({
      ...prev!,
      [name]: name === 'endDate' ? new Date(value) : value
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditedAnnouncement(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const fetchAnnouncements = async()=>{
    try {
        const req = await axios.get(`${BACKEND_URL}/admin/announcements`,{headers:{
"Authorization":`Bearer ${Cookies.get("access-token")}`
        },params:filters});
        setAnnouncements(req.data.announcements);
        setTotalResults(req.data.totalResults);
        return req.data.announcements
    } catch (error) {
        toast({
            title:"Some error occured",
            variant:"destructive"
        })
        return Promise.reject("Something went wrong")
    }
  }
const {data,isLoading} = useQuery({
    queryKey:["announcements"],
    queryFn:fetchAnnouncements
})
  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-yellow-400" />
              <h1 className="text-2xl font-bold">Announcements</h1>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-md transition-colors font-semibold"
            >
              <Plus size={20} />
              New Announcement
            </button>
          </div>

          <div className="space-y-4">
            {announcements.map(announcement => (
              <div 
                key={announcement._id} 
                className="bg-slate-900 rounded-lg p-6 shadow-lg border border-slate-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-yellow-400">{announcement.title}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <Pencil size={16} className="text-gray-400" />
                    </button>
                    <button
                      onClick={() => toggleRemove(announcement._id!)}
                      className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <Trash2 size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 whitespace-pre-wrap">{announcement.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={16} />
                    <span>Ends on {new Date(announcement.endDate).toLocaleDateString()}</span>
                  </div>
                  {announcement.actionLink && (
                    <a
                      href={announcement.actionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
                    >
                      <ExternalLink size={16} />
                      <span>View Details</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalResults > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalResults/20)}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <Modal isOpen={isEditing || isCreating} onClose={handleCancel}>
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">
              {isCreating ? 'Create Announcement' : 'Edit Announcement'}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Title</label>
              <input
                type="text"
                name="title"
                value={editedAnnouncement?.title || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                placeholder="Enter announcement title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
              <textarea
                name="description"
                value={editedAnnouncement?.description || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none resize-none"
                placeholder="Enter announcement description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Action Link (Optional)</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  name="actionLink"
                  value={editedAnnouncement?.actionLink || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">End Date</label>
              <div className="relative">
              <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !editedAnnouncement?.endDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {editedAnnouncement?.endDate? format(editedAnnouncement?.endDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={editedAnnouncement?.endDate}
          onSelect={(d)=>setEditedAnnouncement((prev:any)=>({...prev,endDate:d}))}
          initialFocus
        />
      </PopoverContent>
    </Popover>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-8">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
            <button
            disabled={isSaving}
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-md transition-colors font-semibold"
            >
              <Save size={16} />
              {isCreating ? 'Create' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}