// Db + Drizzle
import { db } from "@/lib/db";

// Form
import CreatePlayerForm from "@/components/create-player-form";

export default async function Page() {
  const positions = await db.query.positions.findMany();
  const roles = await db.query.roles.findMany();
  const contractStatuses = await db.query.contractStatuses.findMany();
  const availabilityStatuses = await db.query.availabilityStatuses.findMany();
  const developmentStages = await db.query.developmentStages.findMany();

  return (
    <main>
      <CreatePlayerForm
        positions={positions}
        roles={roles}
        contractStatuses={contractStatuses}
        availabilityStatuses={availabilityStatuses}
        developmentStages={developmentStages}
      />
    </main>
  );
}
