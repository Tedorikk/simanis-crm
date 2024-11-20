"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import DrawerDialogNewContact from "@/components/drawer-dialog-addnew-contact";
import { ComboboxSortContact } from "@/components/app-combobox-sort-contact";
interface ContactTableProps {
  initialContacts: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    type: string;
  }>;
}

export default function ContactTable({ initialContacts }: ContactTableProps) {
  const [contacts, setContacts] = useState(initialContacts);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase.from("contacts").select("*");
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleContactAdded = () => {
    fetchContacts();  // Re-fetch contacts after adding a new one
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 pt-5">
        <h2 className="text-lg font-bold">Total: {contacts.length}</h2>
        
        <div className="flex justify-between items-center mb-4 gap-10">
            <Button onClick={fetchContacts} size="icon" variant={"outline"}>
            <RefreshCcw />
            </Button>
            <ComboboxSortContact />
            <DrawerDialogNewContact onContactAdded={handleContactAdded} />
            
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>{contact.id}</TableCell>
              <TableCell>{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </div>
  );
}