"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PlusCircle, GripVertical, Pencil, Trash2, Save, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { extractLecturesFromYtPlaylist, extractVideoDetails } from '@/utils/yt';
import { YTLecture } from "@/types";
import { useToast } from "@/components/ui/use-toast";
interface Video {
  id: string;
  title: string;
  url: string;
  description: string;
}

export function PlaylistManager({videos,setVideos}:{videos:YTLecture[],setVideos:React.Dispatch<React.SetStateAction<YTLecture[]>>;}) {
  const [newVideo, setNewVideo] = useState({ videoUrl: "", label: "", description: "",thumbnail:"" });
  const [editingVideo, setEditingVideo] = useState<YTLecture | null>(null);
const [loading,setLoading] = useState(false);
const {toast} = useToast();
const [playList,setPlayList] = useState<YTLecture[]>([]); 
 const [playListUrl,setPlayListUrl] = useState<string>('')
function validateYouTubePlaylistUrl(url:string) {
  // Regular expression to match YouTube playlist URL formats
  const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/|youtu\.be\/)(?:playlist\?list=)([A-Za-z0-9_-]+)$/;

  // Test the URL against the regular expression
  return regex.test(url);
}
  const addVideo = async() => {
    console.log(newVideo)
    if (!newVideo.videoUrl) return;
    
    const videoId = newVideo.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    
    if (!videoId) {
      alert("Please enter a valid YouTube URL");
      return;
    }

   try {
    const video = await extractVideoDetails(newVideo.videoUrl);
    console.log(video)
    if(!video){
      toast({
        title:"Some error occured",
        variant:"destructive"
      })
      return;
    }
     setVideos([...videos, video]);
    setNewVideo({ videoUrl: "", label: "", description: "",thumbnail:"" });
   } catch (error) {
    console.log(error);
    toast({
      title:"Invalid url",
      variant:"destructive"
    })
   }

   
  };

  const updateVideo = (video: YTLecture) => {
    setVideos(videos.map(v => v._id === video._id ? video : v));
    setEditingVideo(null);
  };

  const deleteVideo = (id: string) => {
    setVideos(videos.filter(v => v._id !== id));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(videos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setVideos(items);
  };
  const checkPlayList = async()=>{
    setLoading(true);
    if(validateYouTubePlaylistUrl(playListUrl)){
  try {
    const res = await extractLecturesFromYtPlaylist(playListUrl);
    setVideos(res);
  } catch (error:any) {
    
    toast({
      title:error.message
    })
  }
  finally{
    setLoading(false);
  }
    }
    else{
      setLoading(false);
    
      toast({title:"Invalid url",variant:"destructive"})
    }
  }
  return (
    <div className="space-y-6 mt-5 flex gap-3 w-full justify-center px-4">
     <div className="w-1/2">
     <Card className="p-6 bg-slate-950 border-yellow-400/20">
        <div className='flex gap-2 justify-center col-span-2'>
<Input type='url' placeholder='Link of yt playlist' className='min-w-[500px]' onChange={(e)=>{setPlayListUrl(e.target.value)}} />
<Button onClick={checkPlayList}>{loading?(<Loader2 className='animate-spin'/>):'Check'}</Button>
      </div>   
        <div className="space-y-4">
          <Input
            placeholder="YouTube URL"
            value={newVideo.videoUrl}
            onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
            className="bg-[#0A1929] border-yellow-400/20"
          />
          <Input
            placeholder="Title (optional)"
            value={newVideo.label}
            onChange={(e) => setNewVideo({ ...newVideo, label: e.target.value })}
            className="bg-[#0A1929] border-yellow-400/20"
          />
          <Input
            placeholder="Description (optional)"
            value={newVideo.description}
            onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
            className="bg-[#0A1929] border-yellow-400/20"
          />
          <Button 
            onClick={addVideo}
            className="bg-yellow-400 text-[#0A1929] hover:bg-yellow-500"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Video
          </Button>
        </div>
      </Card>

      
     </div>
     <div className="w-1/2">
     <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="playlist">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {videos.map((video, index) => (
                <Draggable key={video._id} draggableId={video._id as string} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="p-4 bg-[#1A2942] border-yellow-400/20"
                    >
                      <div className="flex items-center space-x-4">
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{video.label}</h3>
                          <p className="text-sm text-gray-400">{video.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-yellow-400/20 hover:bg-yellow-400/10"
                                onClick={() => setEditingVideo(video)}
                              >
                                <Pencil className="h-4 w-4 text-yellow-400" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#1A2942] border-yellow-400/20">
                              <DialogHeader>
                                <DialogTitle className="text-yellow-400">Edit Video</DialogTitle>
                              </DialogHeader>
                              {editingVideo && (
                                <div className="space-y-4">
                                  <Input
                                    placeholder="Title"
                                    value={editingVideo.label || ""}
                                    onChange={(e) => setEditingVideo({ ...editingVideo, label: e.target.value })}
                                    className="bg-[#0A1929] border-yellow-400/20"
                                  />
                                  <Input
                                    placeholder="Description"
                                    value={editingVideo.description||""}
                                    onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                                    className="bg-[#0A1929] border-yellow-400/20"
                                  />
                                  <Button
                                    onClick={() => updateVideo(editingVideo)}
                                    className="bg-yellow-400 text-[#0A1929] hover:bg-yellow-500"
                                  >
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-yellow-400/20 hover:bg-red-400/10"
                            onClick={() => deleteVideo(video._id as string)}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
     </div>
    </div>
  );
}