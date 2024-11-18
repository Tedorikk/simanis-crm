import { ComboboxSortContact } from "@/components/app-combobox-sort-contact"
import { DrawerDialogNewContact } from "@/components/drawer-dialog-addnew-contact"
import ContactTable from "@/components/app-contact-table"

export default function Page() {
    return (
        <div className="w-full h-full overflow-hidden p-4 sm:p-6 md:p-10">
            <section id="ContactHeader" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 md:gap-10 bg-white p-4 rounded-lg shadow">
                <h1 className="text-xl font-bold">
                    Total: 10
                </h1>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <ComboboxSortContact />
                    <DrawerDialogNewContact />
                </div>
            </section>
            <section id="ContactTable">
                <ContactTable />
            </section>
        </div>
    )
}