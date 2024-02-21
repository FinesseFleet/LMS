"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
};


export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  

  const onSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    
    try {
      axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {videoUrl: videoUrl});
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video link
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )} 
        </Button>
      </div>
      
      {isEditing && (
        <div>
          <form className="space-y-4 mt-4" onSubmit={onSubmit}>
            <Input
                type="text"
                placeholder="Enter YouTube video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
            />
            <Button type="submit">Save</Button>
          </form>

              <div className="text-xs text-muted-foreground mt-4">
                Upload this chapter&apos;s youtube video link
              </div>
        </div>
      )}
    </div>
  )
}