import NeighborhoodHallDetailPage from "@/features/neighborhood-hall/pages/neighborhood-hall-detail-page";

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return <NeighborhoodHallDetailPage id={Number(params.id)} />;
}
