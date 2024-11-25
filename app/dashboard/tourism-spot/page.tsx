import { supabase } from "@/utils/supabase/supabase";
import LocationTable from "@/components/app-location-table";

export const dynamic = "force-dynamic";

async function fetchLocations() {
  const { data, error } = await supabase
    .from("tourist_location")
    .select(`
      *,
      contacts!tourist_location_contact_fkey(
        id,
        email
      )
    `);

  if (error) {
    console.error("Error fetching tourist location:", error);
    return [];
  }
  return data || [];
}

export default async function Page() {
  const locations = await fetchLocations();

  return (
    <div className="w-full h-full overflow-hidden p-4 sm:p-6 md:p-10">
      <section id="LocationTable">
        <LocationTable initialLocations={locations} />
      </section>
    </div>
  );
}