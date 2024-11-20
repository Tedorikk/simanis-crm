"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { toast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

interface DrawerDialogEditContactProps {
  contactId: string; // ID of the contact to edit
  onContactUpdated: () => void; // Callback to refresh the contact list
}

export default function DrawerDialogEditContact({ 
  contactId, 
  onContactUpdated 
}: DrawerDialogEditContactProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
  });
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Fetch existing contact details when the dialog is opened
  useEffect(() => {
    if (open) {
      console.log("Fetching contact with ID:", typeof contactId, contactId); // Debug
      const fetchContact = async () => {
        try {
          const parsedContactId = typeof contactId === "string" ? parseInt(contactId, 10) : contactId;
  
          const { data, error } = await supabase
            .from("contacts")
            .select("*")
            .eq("id", parsedContactId)
            .single();
  
          if (error) {
            console.error("Supabase Error:", error); // Log the error
            throw error;
          }
  
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            type: data.type || "",
          });
        } catch (error) {
          toast({ title: "Error", description: "Failed to fetch contact details.", variant: "destructive" });
          console.error("Error fetching contact details:", error); // Debug
        }
      };
  
      fetchContact();
    }
  }, [open, contactId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("contacts")
        .update(formData)
        .eq("id", contactId);

      if (error) throw error;

      toast({ title: "Success", description: "Contact updated successfully." });
      onContactUpdated();
      setOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update contact.", variant: "destructive" });
      console.error("Error updating contact:", error);
    }
  };

  const Component = isDesktop ? Dialog : Drawer;
  const Content = isDesktop ? DialogContent : DrawerContent;
  const Header = isDesktop ? DialogHeader : DrawerHeader;
  const Title = isDesktop ? DialogTitle : DrawerTitle;
  const Description = isDesktop ? DialogDescription : DrawerDescription;
  const Trigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <Component open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <Button><Pencil /></Button>
      </Trigger>
      <Content>
        <Header>
          <Title>Edit Contact</Title>
          <Description>Update the contact details below.</Description>
        </Header>
        <form onSubmit={handleSubmit} className="px-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.type}
                name="type"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Pelanggan</SelectItem>
                  <SelectItem value="2">Internal</SelectItem>
                  <SelectItem value="3">External</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Update Contact
          </Button>
        </form>
        {!isDesktop && (
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </Content>
    </Component>
  );
}
