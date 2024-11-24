"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import DrawerDialogNewContact from "@/components/drawer-dialog-addnew-contact";
import { ComboboxSortContact } from "@/components/app-combobox-sort-contact";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import EditContactDialog from "@/components/edit-contact-dialog";
import DeleteContactDialog from "@/components/delete-contact-dialog";
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
  
      // Fetch contacts when the component mounts
    useEffect(() => {
        fetchContacts(); // Call fetchContacts when the component is mounted
    }, []); // Empty dependency array ensures it runs once on mount


    const handleSortChange = (sortType: string) => {
      const sortedContacts = [...contacts]; // Copy contacts array to avoid mutating state directly
      switch (sortType) {
        case "sort-by-newest":
          sortedContacts.sort((a, b) => (a.id < b.id ? 1 : -1));
          break;
        case "sort-by-oldest":
          sortedContacts.sort((a, b) => (a.id > b.id ? 1 : -1));
          break;
        case "sort-by-name-ascending":
          sortedContacts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "sort-by-name-descending":
          sortedContacts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          return;
      }
      setContacts(sortedContacts);
    };
  
    const handleContactAdded = () => {
      fetchContacts(); // Re-fetch contacts after adding a new one
    };
  
    return (
      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-4 pt-5">
            <h2 className="text-lg font-bold text-center md:text-left">
                Total: {contacts.length}
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center md:justify-end md:gap-6">
                <Button onClick={fetchContacts} size="icon" variant={"outline"}>
                <RefreshCcw />
                </Button>
                <ComboboxSortContact onSortChange={handleSortChange} />
                <DrawerDialogNewContact onContactAdded={handleContactAdded} />
            </div>
        </div>
        <ScrollArea className="w-80 md:w-full sm:w-80 whitespace-nowrap rounded-md border max-h-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Nama</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telepon</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>                {
                (() => {
                    console.log("Tipe data contact.type:", typeof contact.type);
                    console.log("Nilai contact.type:", contact.type);

                    return contact.type === 1
                        ? "Pelanggan"
                        : contact.type === 2
                        ? "Internal"
                        : contact.type === 3
                        ? "External"
                        : "Tipe tidak dikenali";
                })()
            }
     </TableCell>
                <TableCell>
                    <div className="flex gap-2">
                        <EditContactDialog contactId={contact.id} onContactUpdated={fetchContacts} />
                        <DeleteContactDialog contactId={contact.id} onContactDeleted={fetchContacts} />
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }
  