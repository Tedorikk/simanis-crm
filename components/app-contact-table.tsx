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
    const { data: items, error } = await supabase
    .from('contacts')
    .select('*')
            

    if (error) {
        console.error('Error fetching contact', error);
    } else {
        console.log('Contact data:', items);
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
                    {items?.map((item) => (
                        <TableRow key={item.item}>
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