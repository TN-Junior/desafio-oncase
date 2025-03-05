import { useState, useEffect } from "react";
import DataSection from "../DataSection/DataSection";
import DataTable from "../DataTable/DataTable";
import ParticipationChart from "../ParticipationChart/ParticipationChart";
import { fetchParticipants } from "../../services/api";
import { Participant } from "../../types/participant";

const DataDisplay = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  
  const refreshParticipants = async () => {
    const updatedParticipants = await fetchParticipants();
    setParticipants(updatedParticipants);
  };

  useEffect(() => {
    refreshParticipants();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6">
      <DataSection />
      <div className="flex justify-center space-x-4 w-full">
        <DataTable refreshParticipants={refreshParticipants} />
        <ParticipationChart participants={participants} />
      </div>
    </div>
  );
};

export default DataDisplay;
