import { useState, useEffect, useCallback } from "react";
import { fetchParticipants, updateParticipant, deleteParticipant } from "../../services/api";
import { Participant } from "../../types/participant";

const DataTable = ({ refreshParticipants }: { refreshParticipants: () => void }) => {
  const [data, setData] = useState<Participant[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const refreshData = useCallback(async () => {
    try {
      const updatedData = await fetchParticipants();
      setData(updatedData);
      if (shouldRefresh) {
        refreshParticipants();
        setShouldRefresh(false);
      }
    } catch (error) {
      console.error("Erro ao buscar participantes:", error);
    }
  }, [refreshParticipants, shouldRefresh]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleRowClick = (participant: Participant) => {
    setSelectedParticipant(participant);
    setErrorMessage(""); // Limpa mensagem de erro ao abrir a edição
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteParticipant(id);
      setShouldRefresh(true);
      setSelectedParticipant(null); // ✅ Fecha o modal após excluir
    } catch (error) {
      console.error("Erro ao deletar participante:", error);
    }
  };

  const handleEdit = async () => {
    if (!selectedParticipant) return;

    // Validação: First Name e Last Name não podem estar vazios
    if (!selectedParticipant.firstName.trim() || !selectedParticipant.lastName.trim()) {
      setErrorMessage("O nome e o sobrenome não podem ficar vazios.");
      return;
    }

    try {
      await updateParticipant(selectedParticipant);
      setShouldRefresh(true);
      setSelectedParticipant(null); // ✅ Fecha o modal após salvar
    } catch (error) {
      console.error("Erro ao atualizar participante:", error);
    }
  };

  return (
    <div className="w-1/3 min-w-[320px] mt-6 relative">
      <table className="border-collapse border border-gray-300 w-full text-center text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2"></th>
            <th className="border border-gray-300 px-4 py-2 text-left">First name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Last name</th>
            <th className="border border-gray-300 px-4 py-2">Participation</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="text-center cursor-pointer hover:bg-gray-200" onClick={() => handleRowClick(item)}>
              <td className="border border-gray-300 px-4 py-2">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2 text-left">{item.firstName}</td>
              <td className="border border-gray-300 px-4 py-2 text-left">{item.lastName}</td>
              <td className="border border-gray-300 px-4 py-2">{item.participation}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedParticipant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold">Editar Participante</h2>
            
            {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}

            <input
              type="text"
              value={selectedParticipant.firstName}
              onChange={(e) => setSelectedParticipant({ ...selectedParticipant, firstName: e.target.value })}
              className="border p-2 w-full"
            />
            <input
              type="text"
              value={selectedParticipant.lastName}
              onChange={(e) => setSelectedParticipant({ ...selectedParticipant, lastName: e.target.value })}
              className="border p-2 w-full mt-2"
            />
            <input
              type="number"
              value={selectedParticipant.participation}
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value > 100) value = 100;
                if (value < 0) value = 0;
                setSelectedParticipant({ ...selectedParticipant, participation: value });
              }}
              className="border p-2 w-full mt-2"
              min="0"
              max="100"
            />
            <div className="flex justify-between mt-4">
              <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded">
                Salvar
              </button>
              <button onClick={() => handleDelete(Number(selectedParticipant.id))} className="bg-red-500 text-white px-4 py-2 rounded">
                Deletar
              </button>
              <button onClick={() => setSelectedParticipant(null)} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
