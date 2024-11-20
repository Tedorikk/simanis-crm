
import { supabase } from "@/utils/supabase/supabase";
import ContactTable from "@/components/app-contact-table";

export const dynamic = "force-dynamic";

async function fetchContacts() {
  const { data, error } = await supabase.from("contacts").select("*");
  if (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
  return data || [];
}

export default async function Page() {
  const contacts = await fetchContacts();

  return (
    <div className="w-full h-full overflow-hidden p-4 sm:p-6 md:p-10">
      <section id="ContactTable">
        <ContactTable initialContacts={contacts} />
      </section>
    </div>
  );
}