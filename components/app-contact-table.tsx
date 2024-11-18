import { createClient } from '@/utils/supabase/server';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function ContactTable() {
    const supabase = await createClient();
    const { data: contacts, error } = await supabase
        .from('contact')
        .select('*')
        .range(0, 9)

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <div>
            <Table>
                <TableCaption>List of Contacts</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Created At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contacts && contacts.map((contact) => (
                        <TableRow key={contact.id}>
                            <TableCell className="font-medium">{contact.name}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{contact.phone}</TableCell>
                            <TableCell>{contact.address}</TableCell>
                            <TableCell>{contact.type}</TableCell>
                            <TableCell>{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}