"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import DrawerDialogAddNewPackage from "./drawer-dialog-addnew-package";
import EditPackageDialog from "./edit-package-dialog";
import DeletePackageDialog from "./delete-package-dialog";
import { AppComboboxSortPackage } from "./app-combobox-sort-package";

// Tipe data asli dari tabel `tour_package`
interface TourPackage {
  id: number;
  name: string;
  description: string;
  duration: number;
  date: string;
  price: number;
  capacity: number;
  guide_contact: number;
  status: string;
}

// Tipe data yang telah diperkaya (ditambah `guide_name` dan `guide_phone`)
interface EnrichedPackage extends TourPackage {
  guide_name: string;
  guide_phone: string;
}

// Props untuk PackageTable
interface PackageTableProps {
  initialPackage: EnrichedPackage[];
}

export default function PackageTable({ initialPackage }: PackageTableProps) {
  const [packages, setPackages] = useState<EnrichedPackage[]>(initialPackage);
  const [sortedPackages, setSortedPackages] = useState<EnrichedPackage[]>([]); // State to hold sorted packages

  // Fungsi untuk mengambil data dari Supabase
  const fetchPackages = async () => {
    try {
      // Ambil data paket wisata
      const { data: packages, error: packageError } = await supabase.from("tour_package").select("*");
      if (packageError) throw packageError;

      // Ambil data kontak untuk guide
      const { data: contacts, error: contactError } = await supabase.from("contacts").select("id, name, phone");
      if (contactError) throw contactError;

      // Gabungkan data paket wisata dengan informasi guide
      const enrichedPackages: EnrichedPackage[] = (packages || []).map((pkg) => {
        const guide = contacts?.find((c) => c.id === pkg.guide_contact);
        return {
          ...pkg,
          guide_name: guide?.name || "Unknown",
          guide_phone: guide?.phone || "Unknown",
        };
      });

      setPackages(enrichedPackages);
      setSortedPackages(enrichedPackages); // Set sorted packages initially
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  // Ambil data saat komponen pertama kali di-render
  useEffect(() => {
    if (initialPackage.length === 0) {
      fetchPackages();
    }
  }, [initialPackage.length]);

  const handleSortChange = (sortType: string) => {
    let sortedData: EnrichedPackage[];

    switch (sortType) {
      case "sort-by-newest":
        sortedData = [...packages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "sort-by-oldest":
        sortedData = [...packages].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "sort-by-name-ascending":
        sortedData = [...packages].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "sort-by-name-descending":
        sortedData = [...packages].sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        sortedData = [...packages];
        break;
    }

    setSortedPackages(sortedData); // Update the sorted packages state
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-4 pt-5">
        <h2 className="text-lg font-bold text-center md:text-left">Total: {sortedPackages.length}</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center md:justify-end md:gap-6">
          <Button onClick={fetchPackages} size="icon" variant={"outline"}>
            <RefreshCcw />
          </Button>
          <AppComboboxSortPackage onSortChange={handleSortChange} />
          <DrawerDialogAddNewPackage onPackageAdded={fetchPackages} />
          </div>
      </div>
      <ScrollArea className="w-80 md:w-full sm:w-80 whitespace-nowrap rounded-md border max-h-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Nama Paket</TableCell>
              <TableCell>Deskripsi</TableCell>
              <TableCell>Durasi</TableCell>
              <TableCell>Tanggal</TableCell>
              <TableCell>Harga</TableCell>
              <TableCell>Kapasitas</TableCell>
              <TableCell>Guide</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPackages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>{pkg.name}</TableCell>
                <TableCell>{pkg.description}</TableCell>
                <TableCell>{pkg.duration} jam</TableCell>
                <TableCell>{pkg.date}</TableCell>
                <TableCell>Rp {pkg.price.toLocaleString()}</TableCell>
                <TableCell>{pkg.capacity} orang</TableCell>
                <TableCell>
                  {pkg.guide_name} ({pkg.guide_phone})
                </TableCell>
                <TableCell>{pkg.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <EditPackageDialog packageId={pkg.id} onPackageUpdated={fetchPackages}/>
                    <DeletePackageDialog packageId={pkg.id} onPackageDeleted={fetchPackages}/> 
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
