"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  videoUrl: string | null;
}

export const VideoPlayer = ({
  videoUrl,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Progress updated");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };  


    //axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {videoUrl: videoUrl});
    function videoUrlId(){      
      if (!videoUrl) return;
      let youtubeId ="";
      if(videoUrl.length> 11){
        const linkArray = videoUrl.toString().split('be/');
        youtubeId = linkArray[1];
      }else{
        youtubeId = videoUrl;
      }
      
      return youtubeId;
    }
    




    
    let p1 = `http://www.youtube-nocookie.com/embed/${videoUrlId()}`;    
    let p2 = "?rel=0";  

  return (
    <div className="relative aspect-video">
      
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
     
        <iframe onEnded={onEnd} width="940" height="520" src={p1 + p2} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;" allowFullScreen ></iframe>
      )}
    </div>
  );
};

