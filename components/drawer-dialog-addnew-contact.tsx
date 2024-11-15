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
  const { toast } = useToast()
  return (
    <form className="flex flex-col gap-5">
      <Input type="name" placeholder="Nama"/>
      <Input type="email" placeholder="Email" />
      <Input type="phone" placeholder="Telepon" />
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Jenis" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Pelanggan</SelectItem>
          <SelectItem value="dark">Internal</SelectItem>
          <SelectItem value="system">Tempat Wisata</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" onClick={() => {
        toast({
          title: "Kontak Disimpan",
          description: "Nama disimpan pada tanggal",
        })
      }}>Simpan</Button>
    </form>
  )
}