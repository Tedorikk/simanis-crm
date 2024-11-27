import { supabase } from "@/utils/supabase/supabase";
import PackageTable from "@/components/app-package-table";

export const dynamic = "force-dynamic";

async function fetchPackage() {
  const { data, error } = await supabase.from("tour_package").select("*");
  if (error) {
    console.error("Error fetching package", error);
    return [];
  }
  return data || [];
}

export default async function Page() {
  const tour_package = await fetchPackage();

  return (
    <div className="w-full h-full overflow-hidden p-4 sm:p-6 md:p-10">
      <section id="TourPackageTable">
        <PackageTable initialPackage={tour_package} />
      </section>
    </div>
  );
}
