"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ShowLocationContactProps {
  contactId: string;
}

interface ContactData {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
}

export default function ShowLocationContact({ contactId }: ShowLocationContactProps) {
  const [contact, setContact] = useState<ContactData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const fetchContact = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", contactId)
        .single();

      if (error) throw error;
      setContact(data);
    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  }, [contactId]);

  useEffect(() => {
    if (isOpen) {
      fetchContact();
    }
  }, [isOpen, fetchContact]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div>
      <Button onClick={handleToggle}>View Contact</Button>
      {isSmallScreen ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Contact Details</DrawerTitle>
              <DrawerDescription>Full details of the selected contact</DrawerDescription>
            </DrawerHeader>
            {contact ? (
              <div>
                <p><strong>Name:</strong> {contact.name}</p>
                <p><strong>Email:</strong> {contact.email}</p>
                <p><strong>Phone:</strong> {contact.phone}</p>
                <p><strong>Type:</strong> {formatContactType(contact.type)}</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Details</DialogTitle>
            </DialogHeader>
            {contact ? (
              <div>
                <p><strong>Name:</strong> {contact.name}</p>
                <p><strong>Email:</strong> {contact.email}</p>
                <p><strong>Phone:</strong> {contact.phone}</p>
                <p><strong>Type:</strong> {formatContactType(contact.type)}</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function formatContactType(type: string): string {
  switch (type) {
    case "1":
      return "Pelanggan";
    case "2":
      return "Internal";
    case "3":
      return "External";
    default:
      return "Unknown Type";
  }
}