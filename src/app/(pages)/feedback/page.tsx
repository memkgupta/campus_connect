"use client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";

type FeedbackFormValues = {
  name: string;
  email: string;
  message: string;
  rating: number;
  branch?: string;
  designation?: string;
};

const feedbackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(5, "Feedback must be at least 5 characters"),
  rating: z.number().min(1, "Rating is required"),
  branch: z.string().optional(),
  designation: z.string().optional(),
});

export default function FeedbackForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
  });

  const [rating, setRating] = useState<number>(0);

  const onSubmit = (data: FeedbackFormValues) => {
    console.log("Feedback submitted:", data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <Card className="w-full max-w-md p-6 bg-slate-900 text-yellow-400 border border-yellow-400 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold text-yellow-500 text-center mb-4">
            Feedback Form
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input {...register("name")} placeholder="Your Name" className="bg-slate-800 text-yellow-300 border-yellow-500" />
              {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <Input {...register("email")} placeholder="Your Email" className="bg-slate-800 text-yellow-300 border-yellow-500" />
              {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <Input {...register("branch")} placeholder="Your Branch (Optional)" className="bg-slate-800 text-yellow-300 border-yellow-500" />
            </div>
            <div>
              <Input {...register("designation")} placeholder="Your Designation (Optional)" className="bg-slate-800 text-yellow-300 border-yellow-500" />
            </div>
            <div>
              <Textarea {...register("message")} placeholder="Your Feedback" className="bg-slate-800 text-yellow-300 border-yellow-500" />
              {errors.message && <p className="text-red-400 text-sm">{errors.message.message}</p>}
            </div>
            <div className="flex space-x-2 items-center">
              {[1, 2, 3, 4, 5].map((num) => (
                <Star
                  key={num}
                  className={`w-6 h-6 cursor-pointer ${rating >= num ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`}
                  onClick={() => {
                    setRating(num);
                    setValue("rating", num);
                  }}
                />
              ))}
              {errors.rating && <p className="text-red-400 text-sm">{errors.rating.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-yellow-500 text-slate-950 hover:bg-yellow-600">
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
