"use client"
import { toast } from '@/components/ui/use-toast';
import { BACKEND_URL } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BookOpen, Building2, Code2, GraduationCap, Pencil, Save, X } from 'lucide-react';
import React, { useState } from 'react'
import Cookies from 'js-cookie';
import Loader from '@/components/loader';
import { headers } from 'next/headers';
interface Subject{
   _id:string,
    code:string,
    year:string,
    label:string,
    branch:string
}
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
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative animate-fade-in">
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
const SubjectPage = ({params}:{params:{id:string}}) => {
    const [subject, setSubject] = useState<Subject|null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedSubject, setEditedSubject] = useState<Subject|null>(subject);
    const [isUpdating,setIsUpdating] = useState(false);
    const handleEdit = () => {
        if(subject!=null){
            setIsEditing(true);
            setEditedSubject(subject);
        }
   
    };
  
    const handleSave = async() => {
        if(!isUpdating){
            setSubject(editedSubject);
    
            setIsUpdating(true);
            try {
              const req = await axios.put(`${BACKEND_URL}/admin/subjects/${params.id}`,
                  editedSubject,{
                      headers:{
                          "Authorization":`Bearer ${Cookies.get("access-token")}`
                      }
                  }
              );
              toast({
                title:"Subject updated successfully",
                variant:"default",
                color:"green"
              })
            } catch (error) {
              toast({
                  title:"Some error occured",
                  variant:"destructive"
              })
      
            }
            finally{
              setIsUpdating(false);
              setIsEditing(false);
            }
        }
   
    };
  
    const handleCancel = () => {
        if(!isUpdating){
            setIsEditing(false);
            setEditedSubject(subject!);
        }

    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setEditedSubject((prev:any) => ({
        ...prev,
        [name]: value
      }));
    };
    const fetchSubject = async()=>{
        try {
            const req = await axios.get(`${BACKEND_URL}/admin/subjects/${params.id}`,{headers:{
                "Authorization":`Bearer ${Cookies.get('access-token')}`
            }});
            setSubject(req.data.subject);
            return req.data.subject
        } catch (error) {
            toast({
                title:"Some error occured",
                variant:"destructive"
            })
            return Promise.reject("Some error occured")
        }
    }
  const {data,isLoading} = useQuery({
    queryKey:['subject-by-id',params.id],
    queryFn:fetchSubject
  })
    return (
    <>
    {
        !isLoading && subject ? (
            <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-2xl mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-8 h-8 text-blue-400" />
                      <h1 className="text-2xl font-bold">Subject Details</h1>
                    </div>
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                  </div>
      
                  <div className="grid gap-6">
                    <div className="bg-gray-700/30 rounded-lg p-5 flex items-start gap-4 transition-all hover:bg-gray-700/40">
                      <Code2 className="w-5 h-5 text-blue-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-400">Subject Code</p>
                        <p className="text-lg mt-1">{subject.code}</p>
                      </div>
                    </div>
      
                    <div className="bg-gray-700/30 rounded-lg p-5 flex items-start gap-4 transition-all hover:bg-gray-700/40">
                      <BookOpen className="w-5 h-5 text-green-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-400">Subject Name</p>
                        <p className="text-lg mt-1">{subject.label}</p>
                      </div>
                    </div>
      
                    <div className="bg-gray-700/30 rounded-lg p-5 flex items-start gap-4 transition-all hover:bg-gray-700/40">
                      <Building2 className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-400">Branch</p>
                        <p className="text-lg mt-1">{subject.branch}</p>
                      </div>
                    </div>
      
                    <div className="bg-gray-700/30 rounded-lg p-5 flex items-start gap-4 transition-all hover:bg-gray-700/40">
                      <GraduationCap className="w-5 h-5 text-yellow-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-400">Year</p>
                        <p className="text-lg mt-1">{subject.year}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      
            <Modal isOpen={isEditing} onClose={handleCancel}>
          {editedSubject&&    <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Pencil className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold">Edit Subject</h2>
                </div>
      
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Subject Code</label>
                    <div className="relative">
                      <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="code"
                        value={editedSubject.code}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
      
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Subject Name</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="label"
                        value={editedSubject.label}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
      
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Branch</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="branch"
                        value={editedSubject.branch}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
      
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Year</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        name="year"
                        value={editedSubject.year}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                      >
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                  </div>
                </div>
      
                <div className="flex gap-3 justify-end mt-8">
                  <button
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>}
            </Modal>
          </div>
        ):
        (<div className='flex w-full h-screen justify-center'>
            <Loader/>
        </div>)
    }
    </>
    );
  }


export default SubjectPage