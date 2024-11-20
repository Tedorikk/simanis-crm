import { supabase } from "@/utils/supabase/supabase";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export default async function ContactTable() {
    const { data: contact, error } = await supabase
        .from('contact')
        .select('*')

    if (error) {
        console.error('Error fetching contact', error);
    } else {
        console.log('Contact data:', contact)
    }

    return <div>
        <Table>
            <TableCaption>
                List Kontak
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">id</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>email</TableHead>
                    <TableHead>Telepon</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                    {contact?.map((item) => (
                        <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        </TableRow>
                    ))}
            </TableBody>
            <TableFooter></TableFooter>
        </Table>
        </div>
}