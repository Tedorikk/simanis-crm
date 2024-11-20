"use client";

import React, { useState } from "react";
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
  const isDesktop = useMediaQuery("(min-width: 768px)");

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const {error } = await supabase.from("contacts").insert([formData]);

      if (error) throw error;

      toast({
        title: "Contact added successfully",
        description: "The new contact has been added to the database.",
      });

      // Reset form after successful submission
      setFormData({ name: "", email: "", phone: "", type: "" });

      // Call the function to fetch contacts again
      onContactAdded();

      // Close the drawer or dialog
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
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

function ProfileForm({
  formData,
  handleInputChange,
  handleSelectChange,
  onSubmit,
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
        Add Contact
      </Button>
    </form>
  );
}
