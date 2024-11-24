"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RefreshCcw } from "lucide-react";
import DrawerDialogNewLocation from "./drawer-dialog-addnew-location";

interface Contact {
    id: number;
    email: string;
  }
  
  interface Location {
    id: number;
    name: string;
    description: string;
    address: string;
    contacts: Contact[];
  }

interface LocationTableProps {
  initialLocations: Location[];
}

export default function LocationTable({ initialLocations }: LocationTableProps) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);

  // Fetch locations from Supabase
  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("tourist_location")
        .select(`
          id,
          name,
          description,
          address,
          contacts!tourist_location_contact_fkey(id, email)
        `);
  
      if (error) throw error;
  
      // Map the data to match our Location interface
      const mappedData: Location[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        address: item.address,
        contacts: item.contacts.map(contact => ({
          id: contact.id,
          email: contact.email
        }))
      }));
  
      setLocations(mappedData);
  
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  

  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // Handle adding a new location
  const handleLocationAdded = () => {
    fetchLocations(); // Re-fetch locations after adding a new one
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-4 pt-5">
        <h2 className="text-lg font-bold text-center md:text-left">
          Total: {locations.length}
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center md:justify-end md:gap-6">
          <Button onClick={fetchLocations} size="icon" variant={"outline"}>
            <RefreshCcw />
          </Button>
          {/* Add ComboboxSortLocation component here */}
          <DrawerDialogNewLocation onLocationAdded={handleLocationAdded} />
        </div>
      </div>
      <ScrollArea className="w-80 md:w-full sm:w-80 whitespace-nowrap rounded-md border max-h-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
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
                    {location.contacts ? `${location.contacts[0]?.email || "No contact"}` : "No contact"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {/* Add EditLocationDialog component here */}
                    {/* Add DeleteLocationDialog component here */}
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
