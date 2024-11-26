"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from 'lucide-react';

interface DeleteLocationDialogProps {
    locationId: string;
    onLocationDeleted: () => void;
  }

export default function DeleteLocationDialog({ locationId, onLocationDeleted }: DeleteLocationDialogProps) {
    const [open, setOpen] = useState(false);
    
    const handleDelete = async () => {
        try {
            const { error } = await supabase.from("tourist_location").delete().eq("id", locationId);

            if (error) throw error;

            toast({ title: "Success", description: "Contact deleted successfully." });
            onLocationDeleted();
            setOpen(false);
          } catch (error) {
            toast({ title: "Error", description: "Failed to delete Location.}", variant: "destructive" });
            console.log(error)
          }
        };
        
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive"><Trash2 /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this location?</p>
                    <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )

    
    }

