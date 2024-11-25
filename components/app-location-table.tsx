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

  // Update state when initialLocations prop changes
  useEffect(() => {
    setLocations(initialLocations);
  }, [initialLocations]);

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

      const mappedData: Location[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        address: item.address,
        contacts: item.contacts || [], // Default to an empty array if undefined
      }));

      setLocations(mappedData);

    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-4 pt-5">
        <h2 className="text-lg font-bold text-center md:text-left">
          Total: {locations.length}
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center md:justify-end md:gap-6">
          <Button onClick={fetchLocations} size="icon" variant="outline">
            <RefreshCcw />
          </Button>
          <DrawerDialogNewLocation onLocationAdded={fetchLocations} />
        </div>
      </div>
      <ScrollArea className="w-full rounded-md border">
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
                  {location.contacts?.email || "No contact"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {/* Action buttons */}
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