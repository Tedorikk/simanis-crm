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
import { Pencil } from "lucide-react";

interface DrawerDialogEditLocationProps {
  locationId: string; // ID of the location to edit
  onLocationUpdate: () => void; // Callback to refresh the location list
}

interface Contact {
  id: string;
  email: string;
}

export default function DrawerDialogEditLocation({
  locationId,
  onLocationUpdate,
}: DrawerDialogEditLocationProps) {
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
    if (open) {
      const fetchLocation = async () => {
        try {
          const { data, error } = await supabase
            .from("tourist_location")
            .select("*")
            .eq("id", locationId)
            .single();

          if (error) throw error;

          setFormData({
            name: data.name || "",
            description: data.description || "",
            address: data.address || "",
            contact_id: data.contact_id || "",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch location details.",
            variant: "destructive",
          });
          console.error("Error fetching location details:", error);
        }
      };

      fetchLocation();
    }
  }, [open, locationId]);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, contact_id: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.contact_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("tourist_location")
        .update(formData)
        .eq("id", locationId);

      if (error) throw error;

      toast({ title: "Success", description: "Location updated successfully." });
      onLocationUpdate();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update location.",
        variant: "destructive",
      });
      console.error("Error updating location:", error);
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
        <Button>
          <Pencil />
        </Button>
      </Trigger>
      <Content>
        <Header>
          <Title>Edit Location</Title>
          <Description>Update the location details below.</Description>
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
              <Select value={formData.contact_id} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue>
                    {contacts.find((c) => String(c.id) === formData.contact_id)?.email ||
                      "Select a Contact"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={String(contact.id)}>
                      {contact.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
