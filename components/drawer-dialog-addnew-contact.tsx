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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define a type for the contact objects
interface Contact {
  id: string;
  name: string;
}

interface DrawerDialogNewContactProps {
  onContactAdded: () => void;
}

export default function DrawerDialogNewContact({
  onContactAdded,
}: DrawerDialogNewContactProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState(""); // Added state for selected contact
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase.from("contacts").select("id, name");
      if (error) {
        console.error("Error fetching contacts:", error);
      } else {
        console.log("Fetched contacts:", data); // Debugging fetched data
        setContacts(data as Contact[]); // Ensure type safety
      }
    };

    fetchContacts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      type: value,
    }));
  };

  const handleContactSelectChange = (contactId: string) => {
    setSelectedContact(contactId); // Update the selected contact
    console.log("Selected contact ID:", contactId);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("contacts").insert([formData]);

      if (error) throw error;

      toast({
        title: "Contact added successfully",
        description: "The new contact has been added to the database.",
      });

      setFormData({ name: "", email: "", phone: "", type: "" });
      setSelectedContact(""); // Reset selected contact

      onContactAdded(); // Refresh contact list
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding the contact. Please try again.",
        variant: "destructive",
      });
      console.error("Error inserting contact:", error);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Tambah Kontak</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Kontak</DialogTitle>
            <DialogDescription>
              Masukkan informasi kontak
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            onSubmit={handleSubmit}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            contacts={contacts}
            selectedContact={selectedContact}
            handleContactSelectChange={handleContactSelectChange}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Tambah Kontak</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Tambah Kontak</DrawerTitle>
          <DrawerDescription>Masukkan Informasi Kontak</DrawerDescription>
        </DrawerHeader>
        <ProfileForm
          onSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          contacts={contacts}
          selectedContact={selectedContact}
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

interface ProfileFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    type: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (value: string) => void;
  handleContactSelectChange: (contactId: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  contacts: Contact[];
  selectedContact: string; // Added selectedContact prop
  className?: string;
}

function ProfileForm({
  formData,
  handleInputChange,
  handleContactSelectChange,
  onSubmit,
  contacts,
  selectedContact,
  className,
}: ProfileFormProps) {
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
          <Label htmlFor="contact" className="text-right">
            Contact
          </Label>
          <Select
            onValueChange={handleContactSelectChange}
            value={selectedContact}
            name="contact"
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
        Add Contact
      </Button>
    </form>
  );
}