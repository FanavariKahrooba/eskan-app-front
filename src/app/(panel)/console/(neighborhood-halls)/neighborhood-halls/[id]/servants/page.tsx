import NeighborhoodHallServantsPage from "@/features/neighborhood-hall/pages/neighborhood-hall-servants-page";

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <NeighborhoodHallServantsPage neighborhoodHallId={Number(params.id)} />
  );
}
