"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "../ui/use-toast";


export default function GreetingSection() {
  const { toast } = useToast();
  const [userData, setUserData] = useState({
    name: "Mayank",
    branch: "Computer Science",
    year: "3rd Year",
    college: "Delhi Technological University",
  });
  const [formData, setFormData] = useState({ ...userData });
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    setUserData({ ...formData });
    setIsOpen(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  return (
    <div className="relative">
      <div className="h-32 w-full rounded-t-2xl bg-gradient-to-r from-blue-600 to-purple-600 mb-16"></div>
      
      <Card className="mx-auto max-w-2xl -mt-16 bg-slate-900 border-slate-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <Avatar className="h-24 w-24 border-4 border-slate-900">
              <AvatarImage src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" alt={userData.name} />
              <AvatarFallback className="text-2xl bg-slate-800 text-slate-200">
                {userData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold tracking-tight mb-2">
                Hello, {userData.name}!
              </h1>
              <p className="text-slate-400">
                {userData.branch}, {userData.year}
              </p>
              <p className="text-slate-400">{userData.college}</p>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <Pencil className="h-4 w-4" /> Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-slate-900 text-slate-100">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Make changes to your profile information here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="college">College</Label>
                    <Input
                      id="college"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                    onClick={handleSave}
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}