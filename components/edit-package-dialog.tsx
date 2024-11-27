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

interface EditPackageDialogProps {
  packageId: number; // ID of the package to edit
  onPackageUpdated: () => void; // Callback to refresh the package list
}

interface Contact {
  id: string;
  email: string;
}

export default function EditPackageDialog({
  packageId,
  onPackageUpdated,
}: EditPackageDialogProps) {
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

  // Fetch package data on open
  useEffect(() => {
    if (open) {
      const fetchPackage = async () => {
        try {
          const { data, error } = await supabase
            .from("tour_package")
            .select("*")
            .eq("id", packageId)
            .single();

          if (error) throw error;

          setFormData({
            name: data.name || "",
            description: data.description || "",
            duration: data.duration || 0,
            date: data.date || "",
            price: data.price || 0,
            capacity: data.capacity || 0,
            guide_contact: data.guide_contact || "",
            status: data.status || "",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch tour package details.",
            variant: "destructive",
          });
          console.error("Error fetching package details:", error);
        }
      };

      fetchPackage();
    }
  }, [open, packageId]);

  // Fetch contacts
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
      const { error } = await supabase
        .from("tour_package")
        .update(formData)
        .eq("id", packageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tour package updated successfully.",
      });
      onPackageUpdated();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tour package.",
        variant: "destructive",
      });
      console.error("Error updating tour package:", error);
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
        <Button>Edit Tour Package</Button>
      </Trigger>
      <Content>
        <Header>
          <Title>Edit Tour Package</Title>
          <Description>Update the tour package details below.</Description>
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
                Price
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
              <Select value={formData.guide_contact} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue>
                    {contacts.find((contact) => contact.id === formData.guide_contact)?.email || "Select a Guide"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
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
            Save Changes
          </Button>
        </form>
      </Content>
    </Component>
  );
}
