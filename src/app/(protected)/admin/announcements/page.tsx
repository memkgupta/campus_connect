"use client"
import React, { useState } from 'react';
import { 
  Bell,
  Plus,
  Pencil,
  Save,
  X,
  Tag,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  User,
  FileText,
  Paperclip,
  Link as LinkIcon,
  File,
  Image as ImageIcon,
  Upload,
  Eye,
  Edit3
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
import AttachmentModal from '@/components/announcements/AttachementModal';

interface Attachment {
  _id?: string;
  type: "file" | "image" | "link";
  title: string;
  description?: string;
  linkUrl?: string;
  uploadRef?: string;
  uploadedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Announcement {
  _id?: string;
  title: string;
  description: string;
  details?: string;
  createdBy: string;
  attachments?: Attachment[];
  tags?: string[];
  from?: "Admin" | "HOD" | "FACULTY" | "EXAM-CELL";
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const FROM_OPTIONS = ["Admin", "HOD", "FACULTY", "EXAM-CELL"] as const;
const ATTACHMENT_TYPES = ["file", "image", "link"] as const;

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
      <div className="bg-slate-950 rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto relative animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
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
  const [totalResults, setTotalResults] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  // Attachment modal states
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<Attachment | null>(null);
  const [editingAttachmentIndex, setEditingAttachmentIndex] = useState<number>(-1);
  
  const itemsPerPage = 20;
  
  const [filters, setFilters] = useState({
    title: "",
    date: "",
    page: 1,
    show_inactive: false
  });

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'file': return <File size={16} className="text-blue-400" />;
      case 'image': return <ImageIcon size={16} className="text-green-400" />;
      case 'link': return <LinkIcon size={16} className="text-purple-400" />;
      default: return <Paperclip size={16} className="text-gray-400" />;
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditedAnnouncement({
      title: '',
      description: '',
      details: '',
      createdBy: '',
      attachments: [],
      tags: [],
      from: 'Admin',
      startDate: new Date(),
      endDate: new Date(),
      isActive: true
    });
  };

  const handleEdit = (announcement: Announcement) => {
    setIsEditing(true);
    setEditedAnnouncement(announcement);
    setTagInput(announcement.tags?.join(', ') || '');
  };

  const handleAddAttachment = () => {
    setEditingAttachment(null);
    setEditingAttachmentIndex(-1);
    setIsAttachmentModalOpen(true);
  };

  const handleEditAttachment = (attachment: Attachment, index: number) => {
    setEditingAttachment(attachment);
    setEditingAttachmentIndex(index);
    setIsAttachmentModalOpen(true);
  };

  const handleSaveAttachment = async (attachment: Attachment & { file?: File }) => {
    if (!editedAnnouncement) return;

    try {
      let processedAttachment = { ...attachment };
      
      // If it's a file/image upload, handle file upload first
      if ((attachment.type === 'file' || attachment.type === 'image') && attachment.file) {
        const formData = new FormData();
        formData.append('file', attachment.file);
        
        const uploadResponse = await axios.post(`${BACKEND_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${Cookies.get("access-token")}`
          }
        });
        
        processedAttachment.uploadRef = uploadResponse.data._id;
        delete processedAttachment.file;
      }

      const updatedAttachments = [...(editedAnnouncement.attachments || [])];
      
      if (editingAttachmentIndex >= 0) {
        // Edit existing attachment
        updatedAttachments[editingAttachmentIndex] = processedAttachment;
      } else {
        // Add new attachment
        updatedAttachments.push(processedAttachment);
      }

      setEditedAnnouncement(prev => ({
        ...prev!,
        attachments: updatedAttachments
      }));

      toast({
        title: `Attachment ${editingAttachmentIndex >= 0 ? 'updated' : 'added'} successfully`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Failed to process attachment",
        variant: "destructive"
      });
    }
  };

  const handleRemoveAttachment = (index: number) => {
    if (!editedAnnouncement) return;
    
    const updatedAttachments = editedAnnouncement.attachments?.filter((_, i) => i !== index) || [];
    setEditedAnnouncement(prev => ({
      ...prev!,
      attachments: updatedAttachments
    }));
    
    toast({
      title: "Attachment removed",
      variant: "default"
    });
  };

  const handleSave = async() => {
    if (!editedAnnouncement) return;
    setIsSaving(true);
    
    // Process tags
    const processedTags = tagInput
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);
    
    const announcementData = {
      ...editedAnnouncement,
      tags: processedTags
    };

    if (isCreating) {
      try {
        const req = await axios.post(`${BACKEND_URL}/announcements`, announcementData, {
          headers: {
            "Authorization": `Bearer ${Cookies.get("access-token")}`
          }
        });
        const _id = req.data._id;
        setAnnouncements(prev => [...prev, { ...announcementData, _id: _id}]);
        setIsCreating(false);
        toast({
          title: "Announcement created successfully",
          variant: "default"
        });
      } catch (error) {
        toast({
          title: "Something went wrong",
          variant: 'destructive'
        });
      }
    } else {
      try {
        const req = await axios.put(`${BACKEND_URL}/admin/announcements/${editedAnnouncement._id}`, announcementData, {
          headers: {
            "Authorization": `Bearer ${Cookies.get("access-token")}`
          }
        });
        
        toast({
          title: "Announcement updated successfully",
          variant: "default"
        });
        setAnnouncements(prev => 
          prev.map(a => a._id === editedAnnouncement._id ? announcementData : a)
        );
        setIsEditing(false);
      } catch (error) {
        toast({
          title: "Something went wrong",
          variant: 'destructive'
        });
      }
    }
    setIsSaving(false);
   
    setTagInput('');
  };

  const toggleActive = async (id: string) => {
    try {
      const announcement = announcements.find(a => a._id === id);
      if (!announcement) return;

      const updatedAnnouncement = { ...announcement, isActive: !announcement.isActive };
      
      await axios.put(`${BACKEND_URL}/admin/announcements/${id}`, updatedAnnouncement, {
        headers: {
          "Authorization": `Bearer ${Cookies.get("access-token")}`
        }
      });

      setAnnouncements(prev => 
        prev.map(a => a._id === id ? updatedAnnouncement : a)
      );
      
      toast({
        title: `Announcement ${updatedAnnouncement.isActive ? 'activated' : 'deactivated'}`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: 'destructive'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editedAnnouncement) return;
    
    const { name, value } = e.target;
    setEditedAnnouncement(prev => ({
      ...prev!,
      [name]: name === 'startDate' || name === 'endDate' ? new Date(value) : value
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditedAnnouncement(null);
    setTagInput('');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchAnnouncements = async() => {
    try {
      const req = await axios.get(`${BACKEND_URL}/announcements`, {
        headers: {
          "Authorization": `Bearer ${Cookies.get("access-token")}`
        },
        params: filters
      });
      setAnnouncements(req.data.announcements);
      setTotalResults(req.data.totalResults);
      return req.data.announcements;
    } catch (error) {
      toast({
        title: "Some error occurred",
        variant: "destructive"
      });
      return Promise.reject("Something went wrong");
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: fetchAnnouncements
  });

  const getFromBadgeColor = (from?: string) => {
    switch (from) {
      case 'Admin': return 'bg-blue-500/20 text-blue-400';
      case 'HOD': return 'bg-purple-500/20 text-purple-400';
      case 'FACULTY': return 'bg-green-500/20 text-green-400';
      case 'EXAM-CELL': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
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
                className={`bg-slate-900 rounded-lg p-6 shadow-lg border border-slate-800 ${
                  !announcement.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-yellow-400">{announcement.title}</h2>
                      {!announcement.isActive && (
                        <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span className={`px-2 py-1 rounded-full text-xs ${getFromBadgeColor(announcement.from)}`}>
                          {announcement.from}
                        </span>
                      </div>
                      {announcement.tags && announcement.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag size={14} />
                          <div className="flex gap-1">
                            {announcement.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-slate-800 text-gray-300 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {announcement.attachments && announcement.attachments.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Paperclip size={14} />
                          <span>{announcement.attachments.length} attachment(s)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <Pencil size={16} className="text-gray-400" />
                    </button>
                    <button
                      onClick={() => toggleActive(announcement._id!)}
                      className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <Trash2 size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 whitespace-pre-wrap">{announcement.description}</p>
                
                {announcement.details && (
                  <div className="mb-4 p-4 bg-slate-800 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={16} className="text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Details</span>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{announcement.details}</p>
                  </div>
                )}

                {announcement.attachments && announcement.attachments.length > 0 && (
                  <div className="mb-4 p-4 bg-slate-800 rounded-md">
                    <div className="flex items-center gap-2 mb-3">
                      <Paperclip size={16} className="text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Attachments</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {announcement.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-700 rounded-md">
                          {getAttachmentIcon(attachment.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-200 truncate">{attachment.title}</p>
                            {attachment.description && (
                              <p className="text-xs text-gray-400 truncate">{attachment.description}</p>
                            )}
                          </div>
                          {attachment.type === 'link' && attachment.linkUrl && (
                            <a
                              href={attachment.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-slate-600 rounded transition-colors"
                            >
                              <Eye size={14} className="text-gray-400" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  {announcement.startDate && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={16} />
                      <span>Starts: {new Date(announcement.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {announcement.endDate && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={16} />
                      <span>Ends: {new Date(announcement.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalResults > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalResults / itemsPerPage)}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                <label className="block text-sm font-medium mb-1 text-gray-300">From</label>
                <select
                  name="from"
                  value={editedAnnouncement?.from || 'Admin'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                >
                  {FROM_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                  placeholder="exams, important, library"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editedAnnouncement?.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {editedAnnouncement?.startDate ? format(editedAnnouncement.startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editedAnnouncement?.startDate}
                        onSelect={(d) => setEditedAnnouncement((prev: any) => ({...prev, startDate: d}))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editedAnnouncement?.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {editedAnnouncement?.endDate ? format(editedAnnouncement.endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editedAnnouncement?.endDate}
                        onSelect={(d) => setEditedAnnouncement((prev: any) => ({...prev, endDate: d}))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editedAnnouncement?.isActive || false}
                  onChange={(e) => setEditedAnnouncement(prev => ({...prev!, isActive: e.target.checked}))}
                  className="w-4 h-4 text-yellow-400 bg-slate-900 border-slate-800 rounded focus:ring-yellow-400"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">Active</label>
              </div>
            </div>

            <div className="space-y-4">
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
                <label className="block text-sm font-medium mb-1 text-gray-300">Details (Optional)</label>
                <textarea
                  name="details"
                  value={editedAnnouncement?.details || ''}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none resize-none"
                  placeholder="Enter detailed information"
                />
                <Button onClick={()=>setShowAttachmentModal(true)}> Add Attachement</Button>
                <AttachmentModal onSubmit={(data)=>{console.log(data)}} open={showAttachmentModal} onClose={()=>setShowAttachmentModal(false)}/>
              </div>
            </div>
          </div>
                        
          <div className="flex gap-3 justify-end mt-8">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              disabled={isSaving}
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-md transition-colors font-semibold disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : (isCreating ? 'Create' : 'Save Changes')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}