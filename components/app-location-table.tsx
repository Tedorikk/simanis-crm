"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Define the types for your location and contact
interface Contact {
  id: string;
  email: string;
}

interface Location {
  id: string;
  name: string;
  description: string;
  address: string;
  contact: Contact | null; // contact is now a single object or null
}

interface LocationTableProps {
  initialLocations: Location[];
}

export default function LocationTable({ initialLocations }: LocationTableProps) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);

  const fetchLocation = async () => {
    try {
      const { data, error } = await supabase
        .from("tourist_location")
        .select('id, name, description, address, contacts!tourist_location_contact_fkey(id, email)') // Expecting contacts as a single object
    
      if (error) throw error;

      // Ensure contacts is a single object or null
      const mappedData: Location[] = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        address: item.address,
        contact: item.contacts ? { id: item.contacts.id, email: item.contacts.email } : null // contacts is now a single object or null
      }));

      setLocations(mappedData); // Set the locations with the correct structure
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-4 pt-5">
        <h2 className="text-lg font-bold text-center md:text-left">
          Total: {locations.length}
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center md:justify-end md:gap-6">
          <Button onClick={fetchLocation} size="icon" variant={"outline"}>
            <RefreshCcw />
          </Button>
        </div>
      </div>
      <ScrollArea className="w-80 md:w-full sm:w-80 whitespace-nowrap rounded-md border max-h-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Nama</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.description}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>
                  {location.contact ? location.contact.email : "No contact"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {/* Add other actions here */}
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
