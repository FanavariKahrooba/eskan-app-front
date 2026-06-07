"use client";

import NeighborhoodHallEmployeesPage from "./neighborhood-hall-employees-page";

type Props = {
  neighborhoodHallId: number;
};

export default function NeighborhoodHallServantsPage({
  neighborhoodHallId,
}: Props) {
  return (
    <NeighborhoodHallEmployeesPage
      neighborhoodHallId={neighborhoodHallId}
      kind="servants"
    />
  );
}
