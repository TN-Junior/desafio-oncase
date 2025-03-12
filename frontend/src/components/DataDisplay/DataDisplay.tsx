import { useState, useEffect } from "react";
import Header from "../header/Header"; // Verifique se o caminho está correto
import DataSection from "../DataSection/DataSection";
import DataTable from "../DataTable/DataTable";
import ParticipationChart from "../ParticipationChart/ParticipationChart";
import { fetchParticipants } from "../../services/api";
import { Participant } from "../../types/participant";

const DataDisplay = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  const refreshParticipants = async () => {
    try {
      const updatedParticipants = await fetchParticipants();
      setParticipants(updatedParticipants); // Certifica que não duplica os dados
    } catch (error) {
      console.error("Erro ao buscar participantes:", error);
    }
  };

  useEffect(() => {
    refreshParticipants();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Certifica que o Header aparece apenas uma vez */}
      <Header refreshParticipants={refreshParticipants} />
      <DataSection />
      <div className="flex justify-center space-x-4 w-full">
        <DataTable refreshParticipants={refreshParticipants} />
        <ParticipationChart participants={participants} />
      </div>
    </div>
  );
};

export default DataDisplay;
