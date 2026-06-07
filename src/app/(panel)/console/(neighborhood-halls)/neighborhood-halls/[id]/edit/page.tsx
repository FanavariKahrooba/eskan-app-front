import NeighborhoodHallFormPage from "@/features/neighborhood-hall/pages/neighborhood-hall-form-page";

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return <NeighborhoodHallFormPage mode="edit" id={Number(params.id)} />;
}
