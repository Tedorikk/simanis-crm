'use client';

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"

import { useToast } from "@/hooks/use-toast"

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://yvoxbgkggvacwpdgryof.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3hiZ2tnZ3ZhY3dwZGdyeW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NjgzNTQsImV4cCI6MjA0NzA0NDM1NH0.Lz7EkVYMUTfaCfmxAlXQMTIJy_jkATMe0exoQ8vUnew';
const supabase = createClient(supabaseUrl, supabaseKey)

export function DrawerDialogNewContact() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const sharedContent = (
    <>
      <DialogHeader>
        <DialogTitle>Tambah Kontak</DialogTitle>
        <DialogDescription>
          Masukkan informasi kontak
        </DialogDescription>
      </DialogHeader>
      <ProfileForm />
    </>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Tambah Kontak +</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {sharedContent}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
      <Button>Tambah Kontak +</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          {sharedContent}
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Batalkan</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// Placeholder for ProfileForm component
function ProfileForm() {
  const { toast } = useToast();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [type, setType] = React.useState('');

  const contactTypeMapping: { [key: string]: number } = {
    pelanggan: 1,
    internal: 2,
    eksternal: 3,
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("Form submitted");
    console.log("Form data before mapping:", { name, email, phone, type });
  
    // Map the selected type to its corresponding ID
    const typeId = contactTypeMapping[type];
    if (!typeId) {
      console.error("Invalid contact type selected:", type);
      toast({
        title: "Gagal Menyimpan Kontak",
        description: "Jenis kontak tidak valid.",
      });
      return;
    }
  
    console.log("Form data after mapping:", { name, email, phone, type: typeId });
  
    try {
      const { data, error } = await supabase
        .from('contact')
        .insert([
          {
            name,
            email,
            phone,
            type: typeId, // Use the ID instead of the string
          },
        ])
        .select();
  
      console.log("Supabase response:", data);
  
      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }
  
      toast({
        title: "Kontak Disimpan",
        description: "Kontak berhasil ditambahkan.",
      });
  
      // Clear the form fields
      setName('');
      setEmail('');
      setPhone('');
      setType('');
      console.log("Form cleared");
    } catch (error: unknown) {
      console.error("Catch block error:", error);
  
      if (error instanceof Error) {
        toast({
          title: "Gagal Menyimpan Kontak",
          description: error.message || "Terjadi kesalahan.",
        });
      } else {
        toast({
          title: "Gagal Menyimpan Kontak",
          description: "Terjadi kesalahan yang tidak diketahui.",
        });
      }
    }
  };
  
  

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSave}>
      <Input 
        type="text" 
        placeholder="Nama" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <Input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <Input 
        type="text" 
        placeholder="Telepon" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)} 
      />
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Jenis" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pelanggan">Pelanggan</SelectItem>
          <SelectItem value="internal">Internal</SelectItem>
          <SelectItem value="eksternal">Eksternal</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Simpan</Button>
    </form>
  );
}
