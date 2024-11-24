"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Contact {
  id: string;
  name: string;
}

interface DrawerDialogNewLocationProps {
  onLocationAdded: () => void;
}

export default function DrawerDialogNewLocation({
  onLocationAdded,
}: DrawerDialogNewLocationProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    contact: "",
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase.from("contacts").select("id, name");
      if (error) {
        console.error("Error fetching contacts:", error);
      } else {
        setContacts(data as Contact[]);
      }
    };

    fetchContacts();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContactSelectChange = (contactId: string) => {
    setFormData((prevData) => ({
      ...prevData,
      contact: contactId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("tourist_location").insert([formData]);

      if (error) throw error;

      toast({
        title: "Location added successfully",
        description: "The new location has been added to the database.",
      });

      // Reset form after successful submission
      setFormData({ name: "", description: "", address: "", contact: "" });

      // Call the function to fetch locations again
      onLocationAdded();

      // Close the drawer or dialog
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding the location. Please try again.",
        variant: "destructive",
      });
      console.error("Error inserting location:", error);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Tambah Lokasi</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Lokasi</DialogTitle>
            <DialogDescription>
              Masukkan informasi lokasi wisata
            </DialogDescription>
          </DialogHeader>
          <LocationForm
            onSubmit={handleSubmit}
            formData={formData}
            handleInputChange={handleInputChange}
            contacts={contacts}
            handleContactSelectChange={handleContactSelectChange}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Tambah Lokasi</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Tambah Lokasi</DrawerTitle>
          <DrawerDescription>Masukkan Informasi Lokasi Wisata</DrawerDescription>
        </DrawerHeader>
        <LocationForm
          onSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          contacts={contacts}
          handleContactSelectChange={handleContactSelectChange}
          className="px-4"
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Batalkan</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface LocationFormProps {
  formData: {
    name: string;
    description: string;
    address: string;
    contact: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleContactSelectChange: (contactId: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  contacts: Contact[];
  className?: string;
}

function LocationForm({
  formData,
  handleInputChange,
  handleContactSelectChange,
  onSubmit,
  contacts,
  className,
}: LocationFormProps) {
  return (
    <form onSubmit={onSubmit} className={className}>
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
          <Label htmlFor="contact" className="text-right">
            Contact
          </Label>
          <Select
            onValueChange={handleContactSelectChange}
            name="contact"
            value={formData.contact}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Contact" />
            </SelectTrigger>
            <SelectContent>
              {contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.name}
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
  );
}