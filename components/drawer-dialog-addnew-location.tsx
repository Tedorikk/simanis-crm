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
  DrawerContent,
  DrawerDescription,
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

interface DrawerDialogNewLocationProps {
  onLocationAdded: () => void; // Callback to refresh the location list
}

interface Contact {
    id: string; // or number, depending on your database
    email: string;
  }

export default function DrawerDialogNewLocation({
  onLocationAdded,
}: DrawerDialogNewLocationProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    contact_id: "", 
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data, error } = await supabase.from("contacts").select("id, email");
  
        if (error) throw error;
  
        setContacts(data as Contact[]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch contact options.",
          variant: "destructive",
        });
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      contact_id: value, // Updated to match the correct key
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const { error } = await supabase
        .from("tourist_location")
        .insert([formData]);
      
      if (error) throw error;

      toast({ title: "Success", description: "Location added successfully." });
      onLocationAdded();
      setFormData({ name: "", description: "", address: "", contact_id: "" });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add location.",
        variant: "destructive",
      });
      console.error("Error adding location:", error);
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
        <Button>Add Location</Button>
      </Trigger>
      <Content>
        <Header>
          <Title>Add New Location</Title>
          <Description>Enter details for the new tourist location.</Description>
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
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactId" className="text-right">
                Contact
              </Label>
              <Select
                value={formData.contact_id} // Ensure you're using contact_id
                onValueChange={handleSelectChange} // Update formData.contact_id
                >
                <SelectTrigger className="w-[180px]">
                    <SelectValue>
                    {formData.contact_id
                        ? contacts.find((contact) => String(contact.id) === formData.contact_id)?.email
                        : "Select a Contact"}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={String(contact.id)}> {/* Ensure value is a string */}
                        {contact.email}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Add Location
          </Button>
        </form>
      </Content>
    </Component>
  );
}
