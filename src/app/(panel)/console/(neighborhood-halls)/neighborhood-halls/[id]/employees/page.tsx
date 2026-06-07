import NeighborhoodHallEmployeesPage from "@/features/neighborhood-hall/pages/neighborhood-hall-employees-page";

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <NeighborhoodHallEmployeesPage
      neighborhoodHallId={Number(params.id)}
      kind="employees"
    />
  );
}
