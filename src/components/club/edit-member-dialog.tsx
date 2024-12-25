"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EditMemberDialogProps {
  member: any;
  onClose: () => void;
}

export function EditMemberDialog({ member, onClose }: EditMemberDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-yellow-400">Edit Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-white">Name</Label>
              <Input 
                id="edit-name" 
                defaultValue={member.name}
                className="bg-slate-800 border-slate-700 text-white" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-white">Email</Label>
              <Input 
                id="edit-email" 
                type="email" 
                defaultValue={member.email}
                className="bg-slate-800 border-slate-700 text-white" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="text-white">Role</Label>
              <Input 
                id="edit-role" 
                defaultValue={member.crole}
                className="bg-slate-800 border-slate-700 text-white" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-team" className="text-white">Team</Label>
              <Input 
                id="edit-team" 
                defaultValue={member.team}
                className="bg-slate-800 border-slate-700 text-white" 
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-500">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}