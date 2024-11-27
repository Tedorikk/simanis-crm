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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface DrawerDialogAddNewPackageProps {
  onPackageAdded: () => void; // Callback to refresh the package list
}

interface Contact {
    id: string; // or number, depending on your database
    email: string;
  }

export default function DrawerDialogAddNewPackage({
  onPackageAdded,
}: DrawerDialogAddNewPackageProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 0,
    date: "",
    price: 0,
    capacity: 0,
    guide_contact: "",
    status: "",
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Fetch guide contacts from the database
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, guide_contact: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("tour_package").insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tour package added successfully.",
      });
      onPackageAdded();
      setFormData({
        name: "",
        description: "",
        duration: 0,
        date: "",
        price: 0,
        capacity: 0,
        guide_contact: "",
        status: "",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tour package.",
        variant: "destructive",
      });
      console.error("Error adding tour package:", error);
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
        <Button>Add Tour Package</Button>
      </Trigger>
      <Content>
        <Header>
          <Title>Add New Tour Package</Title>
          <Description>Enter details for the new tour package.</Description>
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
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (hours)
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (IDR)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity
              </Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guide_contact" className="text-right">
                Guide Contact
              </Label>
              <Select
                value={formData.guide_contact} // Ensure you're using contact_id
                onValueChange={handleSelectChange} // Update formData.contact_id
                >
                <SelectTrigger className="w-[180px]">
                    <SelectValue>
                    {formData.guide_contact
                        ? contacts.find((contact) => String(contact.id) === formData.guide_contact)?.email
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Input
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Add Tour Package
          </Button>
        </form>
      </Content>
    </Component>
  );
}
