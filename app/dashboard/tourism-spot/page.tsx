import { supabase } from "@/utils/supabase/supabase";
import LocationTable from "@/components/app-location-table";

export const dynamic = "force-dynamic";

async function fetchLocations() {
    const { data, error } = await supabase.from("tourist_location").select("*");
    if (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
    return data || [];
  }

export default async function Page() {
    const locations = await fetchLocations();

    return (
        <div className="w-full h-full overflow-hidden p-4 sm:p-6 md:p-10">
        <section id="ContactTable">
          <LocationTable initialLocations={locations} />
        </section>
      </div>
    )
}