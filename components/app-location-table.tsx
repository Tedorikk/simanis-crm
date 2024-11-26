"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import DeleteLocationDialog from "./delete-location-dialog";
import DrawerDialogEditLocation from "./edit-location-dialog";
import DrawerDialogNewLocation from "./drawer-dialog-addnew-location";
import ShowLocationContact from "./show-location-contact";
import { ComboboxSortLocation } from "./app-combobox-sort-location";

interface Location {
  id: string;
  name: string;
  description: string;
  address: string;
  contact: { id: string; email: string } | null | undefined; // Allowing undefined
}

interface LocationTableProps {
  initialLocations: Location[];
}

export default function LocationTable({ initialLocations }: LocationTableProps) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);

  // Fetch location data
  const fetchLocation = async () => {
    try {
      const { data: locationData, error: locationError } = await supabase
        .from("tourist_location")
        .select("id, name, description, address");

      if (locationError) throw locationError;

      const { data: contactData, error: contactError } = await supabase
        .from("contacts")
        .select("id, email");

      if (contactError) throw contactError;

      const mappedData: Location[] = (locationData || []).map((location) => ({
        id: location.id,
        name: location.name,
        description: location.description,
        address: location.address,
        contact: contactData
          ? contactData.find((contact) => contact.id === location.id) || null  // Ensure null if no contact found
          : null,
      }));

      setLocations(mappedData);

    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // Sort locations based on the selected sorting type
  const handleSortChange = (sortType: string) => {
    let sortedLocations;
    switch (sortType) {
      case "sort-by-newest":
        sortedLocations = [...locations].sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
        break;
      case "sort-by-oldest":
        sortedLocations = [...locations].sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime());
        break;
      case "sort-by-name-ascending":
        sortedLocations = [...locations].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "sort-by-name-descending":
        sortedLocations = [...locations].sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        sortedLocations = locations;
    }
    setLocations(sortedLocations);
  };


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
          <ComboboxSortLocation onSortChange={handleSortChange} />
          <DrawerDialogNewLocation onLocationAdded={fetchLocation} />
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
                  {location.contact ? (
                    <ShowLocationContact contactId={location.contact.id} />
                  ) : (
                    <span>No Contact</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <DrawerDialogEditLocation locationId={location.id} onLocationUpdate={fetchLocation} />
                    <DeleteLocationDialog locationId={location.id} onLocationDeleted={fetchLocation} />
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
